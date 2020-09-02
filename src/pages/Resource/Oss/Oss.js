import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva/index';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Icon,
  Input,
  message,
  Modal,
  Row,
  Tag,
  Upload,
} from 'antd';
import Panel from '../../../components/Panel';
import { OSS_LIST, OSS_INIT } from '../../../actions/oss';
import { enable } from '../../../services/oss';
import { getToken } from '../../../utils/authority';
import Grid from '../../../components/Sword/Grid';
import styles from '@/layouts/Sword.less';

const FormItem = Form.Item;

@connect(({ oss, loading }) => ({
  oss,
  loading: loading.models.oss,
}))
@Form.create()
class Oss extends PureComponent {
  state = {
    code: '',
    debugVisible: false,
    debugLoading: false,
    backgroundUrl: '',
  };

  // ============ 初始化数据 ===============
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(OSS_INIT());
  }

  // ============ 查询 ===============
  handleSearch = params => {
    const { dispatch } = this.props;
    dispatch(OSS_LIST(params));
  };

  // ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={6} sm={24}>
          <FormItem label="资源地址">
            {getFieldDecorator('endpoint')(<Input placeholder="请输入资源地址" />)}
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
    if (btn.code === 'oss_enable') {
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
          this.handleClick(rows[0].ossCode);
        }}
      >
        调试
      </a>
    </Fragment>
  );

  handleDebug = () => {
    this.setState({
      debugVisible: false,
      debugLoading: false,
    });
  };

  handleDebugCancel = () => {
    this.setState({
      debugVisible: false,
      debugLoading: false,
    });
  };

  beforeUpload = file => {
    const isJpgOrPng =
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG/GIF file!');
    }
    const isLt3M = file.size / 1024 / 1024 < 3;
    if (!isLt3M) {
      message.error('Image must smaller than 3MB!');
    }
    return isJpgOrPng && isLt3M;
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ debugLoading: true });
      return;
    }
    if (info.file.status === 'done') {
      this.setState({ debugLoading: false, backgroundUrl: info.file.response.data.link });
    }
  };

  render() {
    const {
      form,
      loading,
      oss: { data },
    } = this.props;

    const { getFieldDecorator } = form;

    const { code, backgroundUrl, debugVisible, debugLoading } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const uploadProp = {
      action: `/api/blade-resource/oss/endpoint/put-file?code=${code}`,
      headers: {
        'Blade-Auth': getToken(),
      },
    };

    const uploadButton = (
      <div>
        <Icon type={debugLoading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传背景图</div>
      </div>
    );

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
        dataIndex: 'ossCode',
      },
      {
        title: '资源地址',
        dataIndex: 'endpoint',
      },
      {
        title: 'accessKey',
        dataIndex: 'accessKey',
      },
      {
        title: 'secretKey',
        dataIndex: 'secretKey',
      },
      {
        title: '空间名',
        dataIndex: 'bucketName',
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
          code="oss"
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
          title="对象存储调试"
          width={500}
          visible={debugVisible}
          onOk={this.handleDebug}
          confirmLoading={debugLoading}
          onCancel={this.handleDebugCancel}
        >
          <Form style={{ marginTop: 8 }}>
            <Card className={styles.card} bordered={false}>
              <FormItem {...formItemLayout} label="背景图片">
                {getFieldDecorator('backgroundUrl')(
                  <Upload
                    name="file"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleChange}
                    {...uploadProp}
                  >
                    {backgroundUrl ? (
                      <img src={backgroundUrl} alt="backgroundUrl" style={{ width: '100%' }} />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                )}
              </FormItem>
            </Card>
          </Form>
        </Modal>
      </Panel>
    );
  }
}

export default Oss;
