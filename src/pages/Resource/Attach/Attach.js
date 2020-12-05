import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Upload, Button, Col, Form, Icon, Input, Modal, Row, message, Tag } from 'antd';
import Panel from '../../../components/Panel';
import { ATTACH_LIST } from '../../../actions/attach';
import Grid from '../../../components/Sword/Grid';
import { getToken } from '@/utils/authority';

const FormItem = Form.Item;
const { Dragger } = Upload;

@connect(({ attach, loading }) => ({
  attach,
  loading: loading.models.attach,
}))
@Form.create()
class Attach extends PureComponent {
  state = {
    visible: false,
    onReset: () => {},
  };

  // ============ 查询 ===============
  handleSearch = params => {
    const { dispatch } = this.props;
    dispatch(ATTACH_LIST(params));
  };

  // ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    this.setState({
      onReset,
    });

    return (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={6} sm={24}>
          <FormItem label="附件域名">
            {getFieldDecorator('domain')(<Input placeholder="请输入 附件域名" />)}
          </FormItem>
        </Col>
        <Col md={6} sm={24}>
          <FormItem label="附件名称">
            {getFieldDecorator('name')(<Input placeholder="请输入 附件名称" />)}
          </FormItem>
        </Col>
        <Col md={6} sm={24}>
          <FormItem label="附件原名">
            {getFieldDecorator('originalName')(<Input placeholder="请输入 附件原名" />)}
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

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  cancelModal = () =>
    this.setState({
      visible: false,
    });

  onUpload = info => {
    const { onReset } = this.state;
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} 附件上传成功!`);
      this.cancelModal();
      onReset();
    } else if (status === 'error') {
      message.error(`${info.file.response.msg}`);
    }
  };

  // ============ 处理按钮点击回调事件 ===============
  handleBtnCallBack = payload => {
    const { btn, rows } = payload;
    if (btn.code === 'attach_upload') {
      this.showModal();
      return;
    }
    if (btn.code === 'attach_download') {
      window.open(`${rows[0].link}`);
    }
  };

  render() {
    const code = 'attach';

    const {
      form,
      loading,
      attach: { data },
    } = this.props;

    const { visible } = this.state;

    const uploadProps = {
      name: 'file',
      headers: {
        'Blade-Auth': getToken(),
      },
      action: '/api/blade-resource/oss/endpoint/put-file-attach',
    };

    const columns = [
      {
        title: '附件地址',
        dataIndex: 'link',
      },
      {
        title: '附件原名',
        dataIndex: 'originalName',
      },
      {
        title: '附件拓展名',
        dataIndex: 'extension',
      },
      {
        title: '附件大小',
        dataIndex: 'attachSize',
        render: (text, record) => (
          <span>
            <Tag color="blue" style={{ cursor: 'pointer' }} key={record.attachSize}>
              {text}KB
            </Tag>
          </span>
        ),
      },
    ];

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 16 },
      },
    };

    return (
      <Panel>
        <Grid
          code={code}
          form={form}
          onSearch={this.handleSearch}
          renderSearchForm={this.renderSearchForm}
          btnCallBack={this.handleBtnCallBack}
          loading={loading}
          data={data}
          columns={columns}
        />
        <Modal
          title="附件上传"
          width={500}
          maskClosable={false}
          visible={visible}
          onOk={this.cancelModal}
          onCancel={this.cancelModal}
          okText="确认"
          cancelText="取消"
        >
          <Form style={{ marginTop: 8 }} hideRequiredMark>
            <FormItem {...formItemLayout} label="附件上传">
              <Dragger {...uploadProps} onChange={this.onUpload}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">将文件拖到此处，或点击上传</p>
              </Dragger>
            </FormItem>
          </Form>
        </Modal>
      </Panel>
    );
  }
}
export default Attach;
