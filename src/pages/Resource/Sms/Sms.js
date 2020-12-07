import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Col, Divider, Form, Input, message, Modal, Row, Tag } from 'antd';
import Panel from '../../../components/Panel';
import { SMS_INIT, SMS_LIST } from '../../../actions/sms';
import { enable, send } from '../../../services/sms';
import Grid from '../../../components/Sword/Grid';
import func from '../../../utils/Func';
import styles from '@/layouts/Sword.less';

const FormItem = Form.Item;

@connect(({ sms, loading }) => ({
  sms,
  loading: loading.models.sms,
}))
@Form.create()
class Sms extends PureComponent {
  state = {
    code: '',
    debugVisible: false,
    debugLoading: false,
  };

  // ============ 初始化数据 ===============
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(SMS_INIT());
  }

  // ============ 查询 ===============
  handleSearch = params => {
    const { dispatch } = this.props;
    dispatch(SMS_LIST(params));
  };

  // ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={6} sm={24}>
          <FormItem label="资源编号">
            {getFieldDecorator('smsCode')(<Input placeholder="请输入资源编号" />)}
          </FormItem>
        </Col>
        <Col md={6} sm={24}>
          <FormItem label="模板ID">
            {getFieldDecorator('templateId')(<Input placeholder="请输入模板ID" />)}
          </FormItem>
        </Col>
        <Col md={6} sm={24}>
          <FormItem label="accessKey">
            {getFieldDecorator('accessKey')(<Input placeholder="请输入accessKey" />)}
          </FormItem>
        </Col>
        <Col>
          <div style={{ float: 'right' }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={onReset}>
              重置
            </Button>
          </div>
        </Col>
      </Row>
    );
  };

  // ============ 处理按钮点击回调事件 ===============
  handleBtnCallBack = payload => {
    const { btn, keys, refresh } = payload;
    if (btn.code === 'sms_enable') {
      if (keys.length === 0) {
        message.warn('请先选择一条数据!');
        return;
      }
      if (keys.length > 1) {
        message.warn('只能选择一条数据!');
        return;
      }
      Modal.confirm({
        title: '配置启用确认',
        content: '是否将改配置启用?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          const response = await enable({ id: keys });
          if (response.success) {
            message.success(response.msg);
            refresh();
          } else {
            message.error(response.msg || '启用失败');
          }
        },
        onCancel() {},
      });
    }
  };

  handleClick = code => {
    this.setState({
      code,
      debugVisible: true,
    });
  };

  renderActionButton = (keys, rows) => (
    <Fragment>
      <Divider type="vertical" />
      <a
        title="调试"
        onClick={() => {
          this.handleClick(rows[0].smsCode);
        }}
      >
        调试
      </a>
    </Fragment>
  );

  handleDebug = () => {
    const { code } = this.state;
    const { form } = this.props;
    const phones = form.getFieldValue('phones');
    const params = form.getFieldValue('params');
    if (func.isEmpty(phones) || func.isEmpty(params)) {
      message.warn('请先将数据填写完整');
      return;
    }
    this.setState({ debugLoading: true });
    send({ code, phones, params }).then(resp => {
      if (resp.success) {
        message.success(resp.msg);
      } else {
        message.error(resp.msg || '发送失败');
      }
      this.handleDebugCancel();
      this.setState({ debugLoading: false });
    });
  };

  handleDebugCancel = () => {
    this.setState({
      debugVisible: false,
      debugLoading: false,
    });
  };

  render() {
    const {
      form,
      loading,
      sms: { data },
    } = this.props;

    const { getFieldDecorator } = form;

    const { code, debugVisible, debugLoading } = this.state;

    const formAllItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };

    const columns = [
      {
        title: '分类',
        dataIndex: 'categoryName',
        render: categoryName => (
          <span>
            <Tag color="blue" key={categoryName}>
              {categoryName}
            </Tag>
          </span>
        ),
      },
      {
        title: '资源编号',
        dataIndex: 'smsCode',
      },
      {
        title: '模板ID',
        dataIndex: 'templateId',
      },
      {
        title: 'accessKey',
        dataIndex: 'accessKey',
      },
      {
        title: '短信签名',
        dataIndex: 'signName',
      },
      {
        title: '是否启用',
        dataIndex: 'statusName',
        align: 'center',
        render: statusName => (
          <span>
            <Tag color="geekblue" key={statusName}>
              {statusName}
            </Tag>
          </span>
        ),
      },
    ];

    return (
      <Panel>
        <Grid
          code="sms"
          form={form}
          onSearch={this.handleSearch}
          renderSearchForm={this.renderSearchForm}
          renderActionButton={this.renderActionButton}
          actionColumnWidth={250}
          btnCallBack={this.handleBtnCallBack}
          loading={loading}
          data={data}
          columns={columns}
        />
        <Modal
          title="短信发送调试"
          maskClosable={false}
          width={500}
          visible={debugVisible}
          onOk={this.handleDebug}
          confirmLoading={debugLoading}
          onCancel={this.handleDebugCancel}
        >
          <Form style={{ marginTop: 8 }}>
            <Card className={styles.card} bordered={false}>
              <FormItem {...formAllItemLayout} label="资源编号">
                {getFieldDecorator('smsCode', {
                  initialValue: code,
                })(<Input disabled="true" placeholder="请输入资源编号" />)}
              </FormItem>
              <FormItem {...formAllItemLayout} label="发送手机">
                {getFieldDecorator('phones')(<Input placeholder="请输入 发送手机" />)}
              </FormItem>
              <FormItem {...formAllItemLayout} label="发送参数">
                {getFieldDecorator('params')(
                  <Input placeholder="例: {'code':2333,'title':'通知标题'}" />
                )}
              </FormItem>
            </Card>
          </Form>
        </Modal>
      </Panel>
    );
  }
}
export default Sms;
