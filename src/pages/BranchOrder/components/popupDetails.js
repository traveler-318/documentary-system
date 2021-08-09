import React, { PureComponent } from 'react';
import { Form, Input, Card, Row,Modal, Col, Button, Icon , Select, message, Tabs, Cascader, Radio,Timeline,Tooltip} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import localforage from 'localforage';

import styles from './edit.less';
import { getCityData } from '../../../utils/authority';
import {
  orderDetail,
  updateReminds,
  productTreelist,
  deleteLogisticsSuber,
  localPrinting,
  logisticsRepeatPrint,
} from '../../../services/newServices/order';
import {
  orderdetail,
  printRequest,
  repeatPrint,
  getOriginalDataJson,
  updateData
} from '../../../services/branch';
import {ORDERSOURCE} from './data.js';
import FormDetailsTitle from '../../../components/FormDetailsTitle';
import Survey from './Survey'
import OrderListNew from '../../Order/components/OrderListNew';
import {
  LOGISTICSCOMPANY,
} from './data.js';
import bellShut from '../../../assets/bellShut.svg'

const FormItem = Form.Item;
const { TextArea } = Input;
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
      productType:'',
      productName:'',
      productId:null,
      detailsId:null,
      tenantId:null,
      cityData:[]
    };
  }

  componentWillMount() {

    getCityData().then(res=>{
      this.setState({
        cityData:res
      })
    })

    const { globalParameters } = this.props;
    // 获取详情数据
    this.setState({
      detailsId:globalParameters.detailData.id,
      tenantId:globalParameters.detailData.tenantId,
    },()=>{
      this.getTreeList();
      this.getEditDetails();
    });


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
      id:this.state.detailsId,
      tenantId:this.state.tenantId
    }
    orderdetail(params).then(res=>{
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

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { detail,selectedOptions, payPanyId,productName, productTypeId, productId,productType } = this.state;
    form.validateFieldsAndScroll((err, values) => {

      // ORDERSOURCE.map(item => {
      //   if(item.name === values.orderSource){
      //     values.orderSource = item.key
      //   }
      // })
      values.id = detail.id;
      values.userAddress=productType;
      if(values.productType && values.productType != ""){
        values.productName = !productName ? detail.productName : productName;
        values.productType = productType;
        values.payPanyId = payPanyId;
        values.productTypeId = productTypeId;
        values.productId = productId;
      }

      for(var i in values){
        if(values[i] === ''){
          values[i] = null
        }
      }
      const params = values;
      if (!err) {
        const _this=this;
        if(values.logisticsCompany != detail.logisticsCompany || values.logisticsNumber != detail.logisticsNumber){

          // if(detail.logisticsStatus){
            Modal.confirm({
              title: '提示',
              content: '当前订单物流已经订阅,此次变更会删掉订阅有关信息,确认是否清理物流从新保存',
              okText: '确定',
              okType: 'danger',
              cancelText: '取消',
              keyboard:false,
              async onOk() {
                const _data={
                  id:detail.id,
                  outOrderNo:detail.outOrderNo
                }
                deleteLogisticsSuber(_data).then(resp=>{
                  updateData(params).then(res=>{
                    if(res.code === 200){
                      message.success(res.msg);
                      _this.setState({
                        edit:true,
                        primary:"primary",
                        primary1:''
                      })
                      _this.getEditDetails()
                    }else {
                      message.error(res.msg);
                    }
                  })
                })
              },
              onCancel() {},
            });
          // }else {
          //   updateData(params).then(res=>{
          //     if(res.code === 200){
          //       message.success(res.msg);
          //       this.setState({
          //         edit:true,
          //         primary:"primary",
          //         primary1:''
          //       })
          //       this.getEditDetails()
          //     }else {
          //       message.error(res.msg);
          //     }
          //   })
          // }
        }else {
          updateData(params).then(res=>{
            if(res.code === 200){
              message.success(res.msg);
              this.setState({
                edit:true,
                primary:"primary",
                primary1:''
              })
              this.getEditDetails()
            }else {
              message.error(res.msg);
            }
          })
        }
      }
    });
  };

  voiceSubmit = (key) =>{
    const { detail } = this.state;
    const params={
      voiceStatus:key,
      id :detail.id
    }
    updateData(params).then(res=>{
      if(res.code === 200){
        message.success(res.msg);
        this.setState({
          edit:true,
          primary:"primary",
          primary1:''
        })
        this.getEditDetails()
      }else {
        message.error(res.msg);
      }
    })
  };

  handleChange = value => {
  };

  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  }

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

  RadioChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  clickEdit = () => {
    this.setState({
      edit:false,
      primary:'',
      primary1:'primary'
    })
  };

  // 复打
  repeat = () => {
    const {detail}=this.state;

    // 当前时间戳
    const timestamp = (new Date()).getTime();
    const timeInterval = 24 * 60 * 60 * 1000 * 2;
    const time = timestamp - (new Date(detail.taskCreateTime)).getTime();
    this.setState({
      repeatLoading:true
    });
    const  tips=[];
    if(!detail.taskId){
      tips.push(detail.userName)
      Modal.confirm({
        title: '提示',
        content: detail.userName+"客户没有首次打印记录,不能进行重复打印!",
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {},
        onCancel() {},
      });
    }else if( time > timeInterval){
      tips.push(detail.userName)
      Modal.confirm({
        title: '提示',
        content: detail.userName+"客户的订单 距离首次时间超过2天 禁止打印！",
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {},
        onCancel() {},
      });
    }
    if(tips.length > 0 ){
      return false;
    }

    if(detail.logisticsPrintType === "1" || detail.logisticsPrintType === "2"){
      // 本地打印
      getOriginalDataJson({
        id:detail.id,
        logisticsPrintType:detail.logisticsPrintType,
        orderTenantId:detail.tenantId
      }).then(res=>{
        this.setState({
          repeatLoading:false
        });
        if(res.code === 200){
          sessionStorage.setItem('printingType', 'Repeat');
          localforage.setItem('imgBase64', res.data).then((res)=>{
            console.log(res,"resresresres")
            window.open(`#/order/allOrders/img`);
          });
        }else{
          message.error(res.msg);
        }
      })
    }else{
      let param = [];
      param.push(detail.taskId)
      repeatPrint(param).then(res=>{
        this.setState({
          repeatLoading:false
        });
        if(res.code === 200){
          message.success(res.msg);
        }
      })
    }
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

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const {
      data,
      loading,
      orderDetail,
      detail,
      edit,
      orderListLength,
      primary,
      primary1,
      productList,
      cityData
    } = this.state;

    const formAllItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    //是否有修改权限
    const isUpdate = detail.confirmTag === '1' || detail.confirmTag === '2' || detail.confirmTag === '3' ? true : false;
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
                <div className={styles.titleBtn}>
                  {/*状态为  初审 终审 已发货时可修改*/}
                  {isUpdate ? (
                    <>
                      <Button type={primary} onClick={this.handleSubmit}>保存</Button>
                      <Button type={primary1} icon="edit" onClick={this.clickEdit}>编辑</Button>
                    </>
                  ):''}
                  {/*/!* <Button  icon="delete">删除</Button> *!/*/}
                  {/*<Button*/}
                    {/*icon="bell"*/}
                    {/*onClick={this.handleReminds}*/}
                    {/*disabled*/}
                  {/*>提醒</Button>*/}

                  <Button icon="copy" type={isUpdate?'':'primary'} onClick={this.repeat}>复打</Button>
                  {/* <Button  icon="folder">归档</Button> */}
                </div>
                <div className={styles.editList} style={{ padding: '20px' }}>
                  <FormDetailsTitle title="订单信息" style={{ margin:'0'}} />
                  <Form span={24}>
                    <FormItem {...formAllItemLayout} label="客户姓名">
                      <Input disabled={true} value={detail.userName}/>
                    </FormItem>
                    <FormItem {...formAllItemLayout} label="手机号">
                      <Input disabled={true} value={detail.userPhone} />
                    </FormItem>
                    <FormItem {...formAllItemLayout} label="备用手机号">
                      <Input disabled={true} value={detail.backPhone}/>
                    </FormItem>
                    <FormItem {...formAllItemLayout} label="所在地区">
                      {getFieldDecorator('region', {
                        initialValue: [detail.province, detail.city, detail.area],
                      })(
                        <Cascader
                          fieldNames={{ label: 'text'}}
                          options={cityData}
                          disabled={isUpdate ? edit : true}
                          onChange={this.onChange}
                        />
                      )}
                    </FormItem>
                    <FormItem {...formAllItemLayout} label="收货地址">
                      {getFieldDecorator('userAddress', {
                        rules: [
                          {
                            message: '请输入收货地址',
                          },
                        ],
                        initialValue: detail.userAddress,
                      })(<Input title={detail.userAddress} disabled={isUpdate ? edit : true} placeholder="请输入收货地址" />)}
                    </FormItem>
                    <FormItem {...formAllItemLayout} label="订单金额">
                      <Input disabled={true} value={detail.payAmount} />
                    </FormItem>
                    <FormItem {...formAllItemLayout} label="订单来源">
                      <Input disabled={true} value={this.getText(parseInt(detail.orderSource),ORDERSOURCE)} />
                    </FormItem>
                    <FormItem {...formAllItemLayout} label="订单归属">
                      <Input disabled={true} value={detail.salesman} />
                    </FormItem>
                    <FormItem {...formAllItemLayout} label="SN">
                      {getFieldDecorator('productCoding', {
                        initialValue: detail.productCoding,
                      })(<Input disabled={isUpdate ? edit : true} placeholder="" />)}
                    </FormItem>
                    <FormItem {...formAllItemLayout} label="产品类型">
                      {getFieldDecorator('productType', {
                        initialValue: detail.productType?[detail.payPanyId,detail.productTypeId,Number(detail.productId)]:null,
                      })(
                        <Cascader
                          disabled={isUpdate ? edit : true}
                          options={productList}
                          fieldNames={{ label: 'value',value:'id'}}
                          onChange={(value, selectedOptions)=>{
                            const { form } = this.props;

                            this.setState({
                              payPanyId:selectedOptions[0].id,
                              productTypeId:selectedOptions[1].id,
                              productId :selectedOptions[2].id,
                              productName:selectedOptions[2].value,
                              productType:selectedOptions[0].value +"/" +selectedOptions[1].value
                            })

                            form.setFieldsValue({
                              payAmount:selectedOptions[2].payamount
                            })
                            // }
                          }}
                        />
                      )}
                    </FormItem>

                    <FormItem {...formAllItemLayout} label="物流公司">
                      {getFieldDecorator('logisticsCompany', {
                        initialValue: detail.logisticsCompany,
                      })(
                        <Select
                          style={{height:45,float:"right"}}
                          disabled={isUpdate ? edit : true}
                          placeholder={"请选择物流公司"}>
                          {Object.keys(LOGISTICSCOMPANY).map(key=>{
                            return (<Option value={LOGISTICSCOMPANY[key]}>{LOGISTICSCOMPANY[key]}</Option>)
                          })}
                        </Select>
                      )}
                    </FormItem>
                    <FormItem {...formAllItemLayout} label="物流单号" className={styles.salesman}>
                      {getFieldDecorator('logisticsNumber', {
                        initialValue: detail.logisticsNumber,
                      })(<Input
                        disabled={isUpdate ? edit : true}
                        placeholder="请输入物流单号" />)}
                    </FormItem>

                    <FormDetailsTitle title="其他信息" />
                    <FormItem {...formAllItemLayout} label="微信号">
                      <Input disabled={true} value={detail.wechatId} />
                    </FormItem>
                    <FormItem {...formAllItemLayout} label="备注">
                      <TextArea rows={4} disabled={true} value={detail.orderNote} />
                    </FormItem>
                  </Form>
                </div>
              </Col>
              <Col span={16} style={{ padding: 0 }} className={styles.rightContent}>
                <div className={styles.titleBtn}>
                  {/*{detail.voiceStatus === "1" ? (*/}
                    {/*<Tooltip title="激活自动提醒开关">*/}
                      {/*<Button icon="bell" onClick={()=>this.voiceSubmit(0)} style={{ float:"right",border:'0',boxShadow:'none'}}></Button>*/}
                    {/*</Tooltip>*/}
                  {/*) :(*/}
                    {/*<Button style={{ float:"right",border:'0',boxShadow:'none'}} onClick={()=>this.voiceSubmit(1)}>*/}
                      {/*<Tooltip title="激活自动提醒开关">*/}
                        {/*<img src={bellShut} style={{float:"right"}} />*/}
                      {/*</Tooltip>*/}
                    {/*</Button>*/}
                  {/*)}*/}

                  {/* <Button icon="plus">工单</Button>
                  <Button  icon="plus">产品</Button>
                  <Button  icon="plus">地址</Button> */}
                </div>
                <div className={styles.tabContent} style={{marginRight:20,paddingTop:14}}>
                  <Tabs defaultActiveKey="1" onChange={this.callback}>
                    <TabPane tab="概况" key="1">
                      <Survey
                        detail={detail}
                        // getEditDetails={this.getEditDetails}
                      />
                    </TabPane>
                    <TabPane tab={`重复订单(${orderListLength})`} key="2">
                      <OrderListNew
                        detail={detail}
                        orderDetail={orderDetail}
                        // changeDetails={this.changeDetails}
                      />
                    </TabPane>
                  </Tabs>
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
