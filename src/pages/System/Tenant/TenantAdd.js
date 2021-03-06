import React, { PureComponent } from 'react';
import { Form, Input, Card, Button, Upload, Icon, message } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import { TENANT_SUBMIT } from '../../../actions/tenant';
import { getToken } from '../../../utils/authority';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['tenant/submit'],
}))
@Form.create()
class TenantAdd extends PureComponent {
  state = {
    backgroundUrl: '',
    loading: false,
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { backgroundUrl } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          ...values,
          backgroundUrl,
        };
        dispatch(TENANT_SUBMIT(params));
      }
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
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      this.setState({ loading: false, backgroundUrl: info.file.response.data.link });
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      submitting,
    } = this.props;

    const { backgroundUrl, loading } = this.state;

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
      action: '/api/blade-resource/oss/endpoint/put-file',
      headers: {
        'Blade-Auth': getToken(),
      },
    };

    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">???????????????</div>
      </div>
    );

    const action = (
      <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
        ??????
      </Button>
    );

    return (
      <Panel title="??????" back="/system/tenant" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card className={styles.card} bordered={false}>
            <FormItem {...formItemLayout} label="????????????">
              {getFieldDecorator('tenantName', {
                rules: [
                  {
                    required: true,
                    message: '?????????????????????',
                  },
                ],
              })(<Input placeholder="?????????????????????" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="?????????">
              {getFieldDecorator('linkman', {
                rules: [
                  {
                    required: true,
                    message: '??????????????????',
                  },
                ],
              })(<Input placeholder="??????????????????" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="????????????">
              {getFieldDecorator('contactNumber', {
                rules: [
                  {
                    required: true,
                    message: '?????????????????????',
                  },
                ],
              })(<Input placeholder="?????????????????????" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="????????????">
              {getFieldDecorator('address')(
                <TextArea style={{ minHeight: 32 }} rows={2} placeholder="?????????????????????" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="????????????">
              {getFieldDecorator('domain')(<Input placeholder="?????????????????????" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="????????????">
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
      </Panel>
    );
  }
}

export default TenantAdd;
