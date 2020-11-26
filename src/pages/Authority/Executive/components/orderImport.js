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
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import { ORDERTYPPE} from '../data.js';
import {
  salesmanList,
} from '../../../../services/newServices/order';
import { getList,getVCode,exportOrder,getPhone, importOrder } from '../../../../services/newServices/order'
import { getAccessToken, getToken } from '../../../../utils/authority';
import styles from '../edit.less';


const FormItem = Form.Item;
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
      createTime:''
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
    window.open(`/api/order/order/exportOrderTemplate?Blade-Auth=${getAccessToken()}`);
  };

  onSwitchChange = checked => {
    this.setState({
      isCovered: checked ? 1 : 0,
    });
  };

  handleOrderSave = () => {
    const {form} = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(this.state.fileList,"values");
        values.file = this.state.fileList[0];
        values.createTime=this.state.createTime
        console.log(values)
        importOrder(values).then(res=>{
          if(res.code === 200){
            message.success(res.msg)
            this.props.handleOrderImportCancel();
          }else{
            message.error(res.msg)
          }
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

    const {isCovered,salesmanList,fileList} = this.state;

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
          title="订单导入"
          width={550}
          visible={OrderImportVisible}
          confirmLoading={confirmLoading}
          onCancel={handleOrderImportCancel}
          footer={[
            <Button key="back" onClick={handleOrderImportCancel}>
              取消
            </Button>,
            <Button type="primary" onClick={this.handleOrderSave}>
              确认
            </Button>,
          ]}
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
            <Row gutter={24} style={{ margin: 0 }}>
              <Col span={12} style={{ padding: 0 }}>
                <Form.Item {...formItemLayout1} label="订单类型">
                  {getFieldDecorator('orderType', {
                    initialValue: null,
                  })(
                    <Select placeholder={"请选择订单类型"} style={{ width: 120 }}>
                      {ORDERTYPPE.map(item=>{
                        return (<Option value={item.key}>{item.name}</Option>)
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12} style={{ padding: 0 }}>
                <FormItem {...formItemLayout1} label="订单金额">
                  {getFieldDecorator('payAmount', {

                  })(<Input placeholder="请输入金额" />)}
                </FormItem>
              </Col>
            </Row>
            <Form.Item {...formItemLayout} label="销售">
              {getFieldDecorator('salesman', {
                rules: [
                  {
                    required: true,
                    message: '请选择销售',
                  },
                ],
              })(
                <Select placeholder={"请选择销售"} style={{ width: 120 }}>
                  {salesmanList.map((item,index)=>{
                    return (<Option key={index} value={item.userAccount}>{item.userName}</Option>)
                  })}
                </Select>
              )}
            </Form.Item>
            <FormItem {...formItemLayout} label="创建时间">
              {getFieldDecorator('createTime', {
                rules: [
                  {
                    required: true,
                    message: '请选择提醒时间',
                  },
                ],
              })(
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
          </Form>
        </Modal>
      </>
    );
  }
}

export default OrderImport;
