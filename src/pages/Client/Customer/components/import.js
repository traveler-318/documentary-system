import React, { PureComponent } from 'react';
import {
  Modal,
  Checkbox,
  Form,
  Input,
  Icon,
  Select,
  Col,
  Button,
  DatePicker,
  message,
  Switch,
  Upload,
  Row,
  Spin,
  Cascader,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import axios from 'axios'

import { tenantMode, clientId, clientSecret } from '../../../../defaultSettings';
import { ORDERTYPPE, exportData} from '../data.js';
import {
  salesmanList,
} from '../../../../services/newServices/order';
import { importClient } from '../../../../services/order/customer';
import { getAccessToken, getToken } from '../../../../utils/authority';
import { CITY } from '@/utils/city';


const FormItem = Form.Item;
const { Dragger } = Upload;

@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class Import extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isCovered: 0,
      salesmanList:[],
      onReset: () => {},
      fileList:[],
      createTime:'',
      loading: false,

      clientLevels:[],//客户级别数组
      clientStatus:[],//客户等级数组
    };
  }

  componentWillMount() {
    const { globalParameters } = this.props;
    const propData = globalParameters.detailData;
    // 获取详情数据
    this.setState({
      clientLevels:propData.clientLevels,
      clientStatus:propData.clientStatus
    },()=>{
    });
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
    // console.log(`http://121.37.251.134:9010/order/order/exportOrderTemplate`)
    // window.location.href = `http://121.37.251.134:9010/order/order/exportOrderTemplate`
    // window.open(`http://121.37.251.134:9010/order/order/exportOrderTemplate?Blade-Auth=${getAccessToken()}`);
    axios({
      method: "get",
      url:`/api/client_info/clientinfo/exportClientExcel`,
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
    elink.download = '客户导入数据模板.xlsx';
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

  handleOrderSave = () => {
    const {form} = this.props;
    const params={}
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.file = this.state.fileList[0];
        values.createTime=this.state.createTime;
        if(!values.salesman){
          values.salesman=null
        }
        if(!values.createTime){
          values.createTime=null
        }
        if(values.addrCoding){
          values.province = values.addrCoding[0];
          values.city = values.addrCoding[1]
          values.area = values.addrCoding[2];
        }
        for(let key in values){
          if(values[key] === "" || values[key] === null || values[key] === undefined){

          }else {
            params[key] = values[key]
          }
        }
        delete params.addrCoding;
        if(values.file){
          importClient(params).then(res=>{
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

    const {
      clientStatus,
      clientLevels
    } = this.state;

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
    const formItemLayout1 = {
      labelCol: {
        span: 10,
      },
      wrapperCol: {
        span: 11,
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
          title="导入"
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
            {/* <FormItem {...formItemLayout} label="数据覆盖">
              <Switch checkedChildren="是" unCheckedChildren="否" onChange={this.onSwitchChange} />
            </FormItem> */}
            <Form.Item {...formItemLayout} label="客户级别">
              {getFieldDecorator('clientLevel')(
                <Select>
                  {clientLevels.map(d => (
                    <Select.Option key={d.id} value={d.id}>
                      {d.labelName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="客户状态">
              {getFieldDecorator('clientStatus')(
                <Select>
                  {clientStatus.map(d => (
                    <Select.Option key={d.id} value={d.id}>
                      {d.labelName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="所在地区：">
              {getFieldDecorator('addrCoding')(
                <Cascader
                  options={CITY}
                />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="销售">
              {getFieldDecorator('salesman', {
              })(
                <Select placeholder={"请选择销售"} style={{ width: 120 }}>
                  {salesmanList.map((item,index)=>{
                    return (<Option key={index} value={item.userAccount}>{item.userName}</Option>)
                  })}
                </Select>
              )}
            </Form.Item>
            <FormItem {...formItemLayout} label="创建时间">
              {getFieldDecorator('createTime')(
                <DatePicker
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择提醒时间"
                  onChange={this.onChange}
                  onOk={this.onOk}
                />
              )}
            </FormItem>
            <Form.Item {...formItemLayout} label="模板下载">
              <Button type="primary" icon="download" size="small" onClick={this.handleTemplate}>
                点击下载
              </Button>
            </Form.Item>
            <div style={{color:"red",paddingLeft:'33px'}}>*注意：以界面选择为准</div>
          </Form>
          </Spin>
        </Modal>

      </>
    );
  }
}

export default Import;
