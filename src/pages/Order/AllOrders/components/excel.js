import React, { PureComponent } from 'react';
import { Modal, Checkbox, Form, Input, Icon, Row, Col, Button, DatePicker, message, Switch } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import { tenantMode } from '../../../../defaultSettings';
import { getCookie } from '../../../../utils/support';
import { getList,getVCode,exportOrder,getPhone } from '../../../../services/newServices/order'
import { exportData,currentTime } from '../data.js';
import { getAccessToken, getToken } from '../../../../utils/authority';
import { Base64 } from 'js-base64';
import { clientId, clientSecret } from '../../../../defaultSettings';
import { ORDERSOURCE } from '../data';
import styles from '../index.less';
import axios from 'axios'

const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;

@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class Export extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {

  }

  onUpload = info => {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} 数据导入成功!`);
      this.handleExcelCancel();
      this.onClickReset();
    } else if (status === 'error') {
      message.error(`${info.file.response.msg}`);
    }
  };

  handleTemplate = () => {
    window.open(`/api/blade-user/export-template?Blade-Auth=${getAccessToken()}`);
  };


  render() {
    const {
      form: { getFieldDecorator },
      excelVisible,
      confirmLoading,
      handleExcelCancel
    } = this.props;

    const {isCovered} = this.state;

    const uploadProps = {
      name: 'file',
      headers: {
        'Blade-Auth': getToken(),
      },
      action: `/api/blade-user/import-user?isCovered=${isCovered}`,
    };

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
      <>
        <Modal
          title="用户数据导入"
          width={500}
          visible={excelVisible}
          confirmLoading={confirmLoading}
          onCancel={handleExcelCancel}
          footer={[
            <Button key="back" onClick={handleExcelCancel}>
              取消
            </Button>,
            <Button type="primary" onClick={()=>this.dataExport()}>
              下一步
            </Button>,
          ]}
        >
          <Form style={{ marginTop: 8 }} hideRequiredMark>
            <FormItem {...formItemLayout} label="模板上传">
              <Dragger {...uploadProps} onChange={this.onUpload}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">将文件拖到此处，或点击上传</p>
                <p className="ant-upload-hint">请上传 .xls,.xlsx 格式的文件</p>
              </Dragger>
            </FormItem>
            <FormItem {...formItemLayout} label="数据覆盖">
              <Switch checkedChildren="是" unCheckedChildren="否" onChange={this.onSwitchChange} />
            </FormItem>
            <FormItem {...formItemLayout} label="模板下载">
              <Button type="primary" icon="download" size="small" onClick={this.handleTemplate}>
                点击下载
              </Button>
            </FormItem>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Export;
