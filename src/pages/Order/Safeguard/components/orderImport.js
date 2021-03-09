import React, { PureComponent } from 'react';
import { Modal, Checkbox, Form, Input, Icon, Select, Col, Button, DatePicker, message, Switch, Upload,Row, Spin } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import axios from 'axios'

import { tenantMode, clientId, clientSecret } from '../../../../defaultSettings';
import {
  salesmanList,
} from '../../../../services/newServices/order';
import { importTradingVolume } from '../../../../services/order/ordermaintenance'
import { getAccessToken, getToken } from '../../../../utils/authority';


const { Dragger } = Upload;

@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class OrderImport extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isCovered: 0,
      salesmanList:[],
      onReset: () => {},
      fileList:[],
      createTime:'',
      loading: false,
    };
  }

  componentWillMount() {
    this.getSalesman()
  }

  getSalesman = () => {
    salesmanList({size:100,current:1}).then(res=>{
      this.setState({
        salesmanList:res.data.records
      })
    })
  }


  onUpload = info => {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      console.log(info.fileList,"info")
      // this.setState({
      //   fileList:info.file
      // })
      message.success(`${info.file.name} 数据导入成功!`);
      this.onClickReset();
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
    const url = "https://oss.gendanbao.com.cn/%E5%AF%BC%E5%85%A5%E4%BA%A4%E6%98%93%E9%87%8F%E6%A8%A1%E6%9D%BF.xlsx";
    window.location.href = url;
    // window.open("http://gendanbao.ruanmao.cn/%E5%AF%BC%E5%85%A5%E4%BA%A4%E6%98%93%E9%87%8F%E6%A8%A1%E6%9D%BF.xlsx")
    // axios({
    //   method: "get",
    //   url:`/api/tracking/ordermaintenance/exportTradingExcel`,
    //   // data:param,
    //   headers: {
    //     "content-type": "application/json; charset=utf-8",
    //     "Authorization": `Basic ${Base64.encode(`${clientId}:${clientSecret}`)}`,
    //     "Blade-Auth": getToken(),
    //     "token": getToken(),
    //   },
    //   // 设置responseType对象格式为blob
    //   responseType: "blob"
    // }).then(res => {
    //   console.log(res)
    //   if(!res.data.code){
    //     let data = res.data;
    //     let fileReader = new FileReader();
    //     fileReader.readAsText(data, 'utf-8');
    //     let _this = this
    //     fileReader.onload = function() {
    //       try {
    //         let jsonData = JSON.parse(this.result);  // 说明是普通对象数据，后台转换失败
    //         message.error(jsonData.data);
    //       }catch(err){
    //         _this.downLoadBlobFile(res)
    //       }
    //     };
    //   }else {
    //     message.error("导出失败");
    //   }
    // })
  };
  // 下载方法
  downLoadBlobFile = (res) =>{
    var elink = document.createElement('a');
    elink.download = '导入交易量模板.xlsx';
    elink.style.display = 'none';
    var blob = new Blob([res.data]);
    elink.href = URL.createObjectURL(blob);
    document.body.appendChild(elink);
    elink.click();
    document.body.removeChild(elink);
  }

  handleOrderSave = () => {
    const {form} = this.props;
    // const params={}
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.file = this.state.fileList[0];

        if(values.file){
          importTradingVolume(values).then(res=>{
            this.setState({
              loading:false,
            })
            if(res.code === 200){
              message.success(res.msg)
              this.props.handleOrderImportCancel();
            }else{
              message.error(res.msg)
            }
          })
        }else {
          this.setState({
            loading:false,
          })
          message.error("请上传需要导入的订单模板")
        }
      }else{
        this.setState({
          loading:false,
        })
      }
    })
  }

  onChange = (value, dateString) => {
    this.setState({
      createTime:dateString
    })
  }

  onOk = (value) => {
    this.setState({
      createTime:moment(value).format('YYYY-MM-DD HH:mm:ss')
    })
  }


  render() {
    const {
      form: { getFieldDecorator },
      OrderImportVisible,
      confirmLoading,
      handleOrderImportCancel
    } = this.props;

    const {isCovered,salesmanList,fileList,loading} = this.state;

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

    const propss = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };

    return (
      <>
        <Modal
          title="交易量导入"
          width={550}
          visible={OrderImportVisible}
          confirmLoading={confirmLoading}
          onCancel={handleOrderImportCancel}
          maskClosable={false}
          loading={loading}
          onOk = {()=>{
            if(loading){
              return false;
            }
            this.setState({
              loading:true,
            })
            this.handleOrderSave();
          }}
        >
          <Spin
            tip="导入中请稍等..."
            style={{botton:"-77px",right:"-10px",zIndex:1000,top:0}}
            spinning={loading}
          >
          <Form style={{ marginTop: 8 }} hideRequiredMark>
            <Form.Item {...formItemLayout} label="模板上传">
              <Dragger
                {...propss}
                onChange={this.onUpload}
              >
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">将文件拖到此处，或点击上传</p>
                <p className="ant-upload-hint">请上传 .xls,.xlsx 格式的文件</p>
              </Dragger>
            </Form.Item>
            <Form.Item {...formItemLayout} label="模板下载">
              <Button type="primary" icon="download" size="small" onClick={this.handleTemplate}>
                点击下载
              </Button>
            </Form.Item>
            {/*<div style={{color:"red",paddingLeft:'33px'}}>*注意：以界面选择为准</div>*/}
          </Form>
          </Spin>
        </Modal>

      </>
    );
  }
}

export default OrderImport;
