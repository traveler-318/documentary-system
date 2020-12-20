import React, { PureComponent } from 'react';
import { Modal, Checkbox, Form, Input, Icon, Row, Col, Button, DatePicker, message, Switch, Upload } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import axios from 'axios'
import { exportSNCodeTemplate } from '../../../services/newServices/order';
import { getAccessToken, getToken } from '../../../utils/authority';
import { tenantMode, clientId, clientSecret } from '../../../defaultSettings';
import { exportData,currentTime } from './data.js';
const FormItem = Form.Item;
const { Dragger } = Upload;

@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class Export extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isCovered: 0,
      onReset: () => {},
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
      this.onClickReset();
      this.props.handleExcelCancel();
    } else if (status === 'error') {
      message.error(`${info.file.response.msg}`);
    }
  };

  onClickReset = () => {
    const { onReset } = this.state;
    this.setState({ deptId: 0 });
    onReset();
  };

  handleTemplate = () => {
    // console.log(`http://121.37.251.134:9010/order/order/exportSNCodeTemplate`)
    // window.open(`http://121.37.251.134:9010/order/order/exportSNCodeTemplate`);
    axios({
      method: "get",
      url:`/api/order/order/exportSNCodeTemplate`,
      // data:param,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "Authorization": `Basic ${Base64.encode(`${clientId}:${clientSecret}`)}`,
        "Blade-Auth": getToken(),
        "token": getToken(),
      },
      // 设置responseType对象格式为blob
      responseType: "blob"
    }).then(res => {
      console.log(res)
      if(!res.data.code){
        let data = res.data;
        let fileReader = new FileReader();
        fileReader.readAsText(data, 'utf-8');
        let _this = this
        fileReader.onload = function() {
          try {
            let jsonData = JSON.parse(this.result);  // 说明是普通对象数据，后台转换失败
            message.error(jsonData.data);
          }catch(err){
            _this.downLoadBlobFile(res)
          }
        };
      }else {
        message.error("导出失败");
      }
    })
  };

   // 下载方法
   downLoadBlobFile = (res) =>{
    var elink = document.createElement('a');
    elink.download = '订单数据SN码模板.xlsx';
    elink.style.display = 'none';
    var blob = new Blob([res.data]);
    elink.href = URL.createObjectURL(blob);
    document.body.appendChild(elink);
    elink.click();
    document.body.removeChild(elink);
  }

  onSwitchChange = checked => {
    this.setState({
      isCovered: checked ? 1 : 0,
    });
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
      action: `/api/order/order/importSNCode?isCovered=${isCovered}`,
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
          maskClosable={false}
          confirmLoading={confirmLoading}
          onCancel={handleExcelCancel}
          footer={null}
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
            {/* <FormItem {...formItemLayout} label="数据覆盖">
              <Switch checkedChildren="是" unCheckedChildren="否" onChange={this.onSwitchChange} />
            </FormItem> */}
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
