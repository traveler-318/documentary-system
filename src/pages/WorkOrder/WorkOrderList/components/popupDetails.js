import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  Card,
  Row,
  Modal,
  Col,
  Button,
  Icon,
  Select,
  message,
  Tabs,
  Cascader,
  Radio,
  Timeline,
  Tooltip,
  Descriptions, Upload,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from './edit.less';
import { CITY } from '../../../../utils/city';
import localforage from 'localforage';
import {
  orderDetail,
  updateReminds,
  productTreelist,
  deleteLogisticsSuber,
  localPrinting,
  logisticsRepeatPrint,
} from '../../../../services/newServices/order';
import {getDetails,updateData} from '../../../../services/order/ordermaintenance'
import {ORDERSTATUS,ORDERSOURCE,LOGISTICSCOMPANY} from './data';
import FormDetailsTitle from '../../../../components/FormDetailsTitle';
import { getToken } from '@/utils/authority';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Dragger } = Upload;
const { TabPane } = Tabs;


@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class OrdersEdit extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      detail:{},
      edit:true,
      data:{
        order:'10',
        followUp:'2',
        service0rder:'6',
        product:"9",
        ownership:"3"
      },
      ids:'',
      selectedOptions:"",
      primary:'primary',
      primary1:'',
      productList:[],
      repeatLoading:false,
      payPanyId:null,
      productTypeId:null,
      productId:null,
      detailsId:null,
      describe:"",

      orderType:[]

    };
  }

  componentWillMount() {

    const { globalParameters } = this.props;
    console.log(globalParameters)
    // 获取详情数据
    this.setState({
      detailsId:globalParameters.detailData.id,
    },()=>{
      this.getTreeList();
      this.getEditDetails();
    });

  }

  UNSAFE_componentWillReceiveProps(nex){
    console.log(nex)
    console.log(ORDERSTATUS)
    const { detail } = this.props;
    let list = [];

    if(nex.detail.followRecords && JSON.parse(nex.detail.followRecords).list){
      list = JSON.parse(nex.detail.followRecords).list
    }

    this.setState({
      detail:nex.detail,
      followRecords:list
    })

    let _type = ORDERSTATUS.map(item=>{
      let _item = {...item}
      if(Number(item.key) <= Number(nex.detail.confirmTag)){
        _item.className = "clolor"
      }else{
        _item.className = ""
      }
      console.log(_item)
      return _item
    })

    this.setState({
      orderType:_type
    })

  }

  getTreeList = () => {
    productTreelist().then(res=>{
      console.log(res.data,"productTreelist")
      this.setState({productList:res.data})
    })
  }

  changeDetails = (id) => {
    // 获取详情数据
    this.setState({
      detailsId:id,
    },()=>{
      this.getEditDetails();
    });
  }

  getEditDetails = () => {
    const params={
      id:this.state.detailsId
    }
    getDetails(params).then(res=>{
      this.setState({
        detail:res.data,
        payPanyId:res.data.payPanyId || '0',
        productTypeId:res.data.productTypeId || '0',
        productId:res.data.productId || '0',
      })
      this.getList(res.data)
    })
  }

  getList = (detail) =>{
    console.log(detail)
    const params={
      userAddress:detail.userAddress,
      userPhone:detail.userPhone,
      userName:detail.userName,
      id:detail.id,
      size:100,
      current:1
    }
    orderDetail(params).then(res=>{
      console.log(res)
      const data = res.data.records;
      let list=[];
      for(let i=0; i<data.length; i++){
        if(data[i].id != detail.id){
          list.push(data[i])
        }
      }
      this.setState({
        orderDetail:list,
        orderListLength:list.length
      })
    })
  }

  // 提醒
  handleReminds = () => {
    const { detail } = this.state;
    console.log(detail)
    Modal.confirm({
      title: '提醒',
      content: "确定提示此订单吗？",
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      onOk() {
        updateReminds([{
          deptId:detail.deptId,
          id:detail.id,
          outOrderNo:detail.outOrderNo,
          payAmount:Number(detail.payAmount),
          userPhone:detail.userPhone,
          userName:detail.userName,
        }]).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
          }
        })
      },
      onCancel() {},
    });
  }

  handleChange = value => {
  };

  onChange = (value, selectedOptions) => {
    let text = ""
    for(let i=0; i<selectedOptions.length; i++){
      text += selectedOptions[i].label
    }
    this.setState({
      cityparam:{
        province:value[0],
        city:value[1],
        area:value[2],
      },
      selectedOptions:text
    })
  };

  getText = (key, type) => {
    let text = ""
    type.map(item=>{
      if(item.key === key){
        text = item.name
      }
    })
    return text
  }


  validatePhone = (rule, value, callback) => {
    if (!(/^1[3456789]\d{9}$/.test(value))) {
      callback(new Error('请输入正确的手机号格式'));
    }else{
      callback();
    }
  }

  onUpload = info => {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} 附件上传成功!`);
      this.cancelModal();
    } else if (status === 'error') {
      message.error(`${info.file.response.msg}`);
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const clientStatus = this.props.clientStatus;

    const {
      data,
      loading,
      orderDetail,
      detail,
      edit,
      orderListLength,
      describe,
      orderType,
      productList
    } = this.state;

    const formAllItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };
    const uploadProps = {
      name: 'file',
      headers: {
        'Blade-Auth': getToken(),
      },
      action: '/api/blade-resource/oss/endpoint/put-file-attach',
    };


    return (
        <Modal
        title="详情"
          visible={this.props.detailsVisible}
          width={1290}
          onCancel={this.props.handleCancelDetails}
          footer={null}
          bodyStyle={{paddingTop:0}}
          maskClosable={false}
          style={{
            top:40
          }}
        >
        <Form style={{ marginTop: 8 }}>
          <Card bordered={false} className={styles.editContent}>
            <Row gutter={24} style={{ margin: 0 }}>
              <Col span={8} style={{ padding: 0 }} className={styles.leftContent}>
                <div className={styles.editList} style={{ padding: '20px' }}>
                  <FormDetailsTitle title="客户信息" style={{ margin:'0'}} />
                  <Form span={24}>
                    <FormItem {...formAllItemLayout} label="客户姓名">
                      {getFieldDecorator('userName', {
                        rules: [
                          {
                            message: '请输入客户姓名',
                          },
                        ],
                        initialValue: detail.userName,
                      })(<Input disabled={true} placeholder="请输入客户姓名" />)}
                    </FormItem>
                    <FormItem {...formAllItemLayout} label="手机号">
                      {getFieldDecorator('userPhone', {
                        initialValue: detail.userPhone,
                      })(<Input disabled={true} placeholder="" />)}
                    </FormItem>
                    <FormItem {...formAllItemLayout} label="收货地址">
                      {getFieldDecorator('userAddress', {
                        rules: [
                          {
                            message: '请输入收货地址',
                          },
                        ],
                        initialValue: detail.userAddress,
                      })(<Input title={detail.userAddress} disabled={true} placeholder="请输入收货地址" />)}
                    </FormItem>
                    <FormItem {...formAllItemLayout} label="客户归属" style={{borderBottom:'1px solid #ccc' ,marginBottom:'20px'}}>
                      {getFieldDecorator('salesman', {
                        rules: [
                          {
                            message: '',
                          },
                        ],
                        initialValue: detail.salesman,
                      })(<Input disabled placeholder="" />)}
                    </FormItem>

                    <FormDetailsTitle title="订单信息"/>
                    <FormItem {...formAllItemLayout} label="订单号">
                      {getFieldDecorator('payAmount', {
                        initialValue: detail.payAmount,
                      })(<Input disabled placeholder="" />)}
                    </FormItem>
                    <FormItem {...formAllItemLayout} label="订单时间">
                      {getFieldDecorator('orderSource', {
                        initialValue: this.getText(parseInt(detail.orderSource),ORDERSOURCE),
                      })(<Input disabled placeholder="" />)}
                    </FormItem>
                    <FormItem {...formAllItemLayout} label="快递公司">
                      {getFieldDecorator('logisticsCompany', {
                        initialValue: detail.logisticsCompany,
                      })(
                        <Input disabled placeholder="" />
                      )}
                    </FormItem>
                    <FormItem {...formAllItemLayout} label="快递单号" className={styles.salesman}>
                      {getFieldDecorator('logisticsNumber', {
                        initialValue: detail.logisticsNumber,
                      })(<Input
                        disabled
                        placeholder="请输入物流单号" />)}
                    </FormItem>
                    <FormItem {...formAllItemLayout} label="产品类型">
                      {getFieldDecorator('productType', {
                        initialValue: detail.productType?[...detail.productType.split("/"),detail.productName]:null,
                      })(
                        <Cascader
                          disabled
                          options={productList}
                          fieldNames={{ label: 'value'}}
                          onChange={(value, selectedOptions)=>{
                            const { form } = this.props;

                            this.setState({
                              payPanyId:selectedOptions[0].id,
                              productTypeId:selectedOptions[1].id,
                              productId :selectedOptions[2].id,
                            })

                            form.setFieldsValue({
                              payAmount:selectedOptions[2].payamount
                            })
                          }}
                        />
                      )}
                    </FormItem>
                    <FormItem {...formAllItemLayout} label="SN" style={{borderBottom:'1px solid #ccc'}}>
                      {getFieldDecorator('productCoding', {
                        initialValue: detail.productCoding,
                      })(<Input disabled placeholder="" />)}
                    </FormItem>
                  </Form>
                </div>
              </Col>
              <Col span={16} style={{ padding: 0 }} className={styles.rightContent}>
                <div className={styles.main}>
                  <ul>
                    <li className={styles.color}>待处理</li>
                    <li>待回复</li>
                    <li>进行中</li>
                    <li>已完成</li>
                    <li>已评价</li>
                  </ul>
                  <p><label>快递：</label>顺丰</p>
                  <p><label>单号：</label>1234567
                    <Button key="primary" onClick={()=>this.handleDetails()} style={{border: "0",background: "none"}}>查看物流信息</Button>
                  </p>
                </div>
                <div className={styles.tabContent}>
                  <div className={styles.timelineContent}>

                  </div>
                  <div className={styles.tabText}>
                    <TextArea
                      rows={2}
                      value={describe}
                      onChange={this.TextAreaChange}
                      style={{height: '90px'}}
                      placeholder='请输入内容（Alt+Enter快速提交）'
                    />
                    <div>
                      <div style={{float:"left",cursor:"pointer",paddingTop:7}}>

                        <Dragger {...uploadProps} onChange={this.onUpload}>
                          <Icon
                            type="picture"
                            style={{margin:"0 10px 0 15px"}}
                          />
                        </Dragger>
                      </div>
                      <div
                        style={{float:"left",cursor:"pointer",paddingTop:7}}
                      >
                      </div>
                      <div style={{float:"right"}}>
                        <Button
                          onClick={this.handleEmpty}
                        >清空</Button>
                        <Button
                          type="primary"
                          onClick={this.handleSubmit}
                        >发送</Button>
                      </div>
                    </div>
                  </div>
                </div>

              </Col>
            </Row>
          </Card>
        </Form>
        </Modal>
    );
  }
}

export default OrdersEdit;
