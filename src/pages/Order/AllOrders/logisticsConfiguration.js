import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, TreeSelect, Select, DatePicker, message, Cascader, Radio } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import Panel from '../../../components/Panel';
import FormDetailsTitle from '../../../components/FormDetailsTitle';
import styles from '../../../layouts/Sword.less';
import { USER_INIT, USER_CHANGE_INIT, USER_SUBMIT } from '../../../actions/user';
import func from '../../../utils/Func';
import { tenantMode } from '../../../defaultSettings';
import {GENDER,ORDERTYPE,ORDERSOURCE} from './data.js'
import { CITY } from '../../../utils/city';
import { getCookie } from '../../../utils/support';
import {updateData,getRegion,logisticsSubscription} from '../../../services/newServices/order'
import { 
  LOGISTICSCOMPANY,
  paymentCompany,
  productType,
  productID,
  amountOfMoney
} from './data.js';

import { 
  getList,
  // 打印模板
  getSurfacesingleList,
  // 寄件配置
  getDeliveryList,
  // 物品信息
  getGoodsList,
  // 附加信息
  getAdditionalList
} from '../../../services/newServices/logistics'

const FormItem = Form.Item;
const { TextArea } = Input;

const tipsStyle = {
  lineHeight: '16px',
  paddingLeft: '12px',
  marginBottom: '20px',
  color:'red'
}

@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class LogisticsConfiguration extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      PRODUCTCLASSIFICATION:[
        {
          name:"测试销售",
          id:"1"
        }
      ],
      detail:{},
      productList:[],
      senderItem:{},
      printTemplateItem:{},
      deliveryItem:{},
      goodsItem:{},
      additionalItem:{},
      currentIndex:0,
      listID:[1,2,3,4,5,6]
    };
  }


  componentWillMount() {
    const { globalParameters } = this.props;

    console.log(globalParameters.listParam)

    // this.setState({
    //   listID:globalParameters.listParam
    // })

    // 获取详情数据
    // this.setState({
    //   detail:
    // })

    this.getDetailsData(globalParameters.listParam[globalParameters.listParam.length]);

    // 拼装对应产品
    this.assemblingData();

    
  }

  getDetailsData = () => {

  }

  // 切换数据
  handleSwitch = (type) => {
    console.log("123123")
    let { currentIndex, listID } = this.state
    // if(currentIndex === 0 || currentIndex === listID.length){
    //   return false
    // }
    if(type === 0){
      this.setState({
        currentIndex:currentIndex - 1 
      },()=>{
        console.log(this.state.currentIndex)
      })
    }else{
      this.setState({
        currentIndex:currentIndex + 1
      },()=>{
        console.log(this.state.currentIndex)
      })
    }
  }

  // 获取打印的默认数据
  getDefaultData = (callBack) => {
    const promise1 = new Promise((resolve, reject) => {
      getList({current:1,size:10}).then(res=>{
        let _datas = res.data.records
        resolve(_datas,"senderItem")
      })
    })

    const promise2 = new Promise((resolve, reject) => {
      getSurfacesingleList({current:1,size:10}).then(res=>{
        let _datas = res.data.records
        resolve(_datas,"printTemplateItem")
      })
    })

    const promise3 = new Promise((resolve, reject) => {
      getDeliveryList({current:1,size:10}).then(res=>{
      let _datas = res.data.records
        resolve(_datas)
      })
    })

    const promise4 = new Promise((resolve, reject) => {
      getGoodsList({current:1,size:10}).then(res=>{
        let _datas = res.data.records
        resolve(_datas)
      })
    })

    const promise5 = new Promise((resolve, reject) => {
      getAdditionalList({current:1,size:10}).then(res=>{
        let _datas = res.data.records
        resolve(_datas)
      })
    })
    Promise.all([promise1, promise2, promise3, promise4, promise5]).then((values,type) => {
      console.log(values,type,"values");
      let _dataList = [],senderItem={},printTemplateItem={},deliveryItem={},goodsItem={},additionalItem={}
      values.map((item,index)=>{
        if(item.length === 0){
          if(index === 0){
            // 授权配置
            return message.error("请设置基础授权配置");
          }else if(index === 1){
            // 打印模板
            return message.error("请设置打印模板");
          }else if(index === 2){
            // 寄件配置
            return message.error("请设置寄件人信息");
          }else if(index === 3){
            // 物品
            return message.error("请设置物品信息");
          }else if(index === 4){
            // 附加信息
            return message.error("请设置附加信息");
          }

        }
        for(let i=0; i<item.length; i++){
          if(item[i].status === 1){
            if(index === 0){
              // _dataList.push(item[i])
              this.setState({
                senderItem:item[i]
              })
            }else if(index === 1){
              this.setState({
                printTemplateItem:item[i]
              })
            }else if(index === 2){
              this.setState({
                deliveryItem:item[i]
              })
            }else if(index === 3){
              this.setState({
                goodsItem:item[i]
              })
            }else if(index === 4){
              this.setState({
                additionalItem:item[i]
              })
            }
          }
        }
        callBack();
      })
    });
  }

  assemblingData = () => {
    // let TheThirdLevel = productID.map(item=>{
    //   return {
    //     ...item,
    //     key:`${item.key}_3`,
    //     children:amountOfMoney
    //   }
    // })
    let TheSecondLevel = productType.map(item=>{
      return {
        ...item,
        key:`${item.key}_2`,
        children:productID
      }
    })
    let TheFirstLevel = paymentCompany.map(item=>{
      return {
        ...item,
        key:`${item.key}_1`,
        children:TheSecondLevel
      }
    })
    this.setState({productList:TheFirstLevel})
    console.log(TheFirstLevel,"TheFirstLevel")
  }

  componentWillReceiveProps(pre,nex){
    console.log(pre,nex)
  }

  saveData = (values,callBack) => {
    console.log(values,"123")
    const { detail } = this.state;
    console.log(detail,"detail")
    values.id = detail.id;
    values.deptId = getCookie("dept_id");
    values.confirmTag = detail.confirmTag;
    values.outOrderNo = detail.outOrderNo;
    values.tenantId = detail.tenantId;
    values.userPhone = detail.userPhone;
    values.productName = values.productName.join("/");
    logisticsSubscription(values).then(res=>{
      if(res.code === 200){
        message.success(res.msg);
        if(callBack){
          callBack()
        }
      }else{
        message.error(res.msg);
      }
    })
  }; 

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { detail } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.saveData(values)
      }
    });
  };
  // 保存并打印
  handlePrinting = (e) => {
    const { form } = this.props;
    const { detail } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("先保存数据")
        // 先保存数据
        this.saveData(values,()=>{
          // 获取物流配置
          this.getDefaultData(()=>{
            // 获取物流配置成功
          });
        })
      }
    });
  }

  handleChange = value => {
  };

  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  }

  // onChange = (value, selectedOptions) => {
  //   this.setState({
  //     cityparam:{
  //       province:value[0],
  //       city:value[1],
  //       area:value[2],
  //     }
  //   })
  // };

  onProductChange = (value, selectedOptions) => {
    // 对应产品
    console.log(value, selectedOptions,"123");
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const {
      PRODUCTCLASSIFICATION,
      loading,
      detail,
      productList,
      currentIndex,
      listID
    } = this.state;

    console.log(listID,"listID")

    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const formAllItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };

    console.log(this.props.globalParameters)

    return (
      <Panel title="发货配置" back="/order/AllOrders">
        <div style={{background:"#fff",marginBottom:10,padding:"10px 10px 10px 20px"}}>
          <Button style={{marginRight:10}} type="primary" onClick={this.handleSubmit} loading={loading}>
            保存
          </Button>
          <Button style={{marginRight:10}} type="primary" onClick={this.handlePrinting} loading={loading}>
            保存并打印
          </Button>
          <Button style={{marginRight:10}} type="primary" onClick={this.handleSubmit} loading={loading}>
            保存并处理下一条
          </Button>
          <Button icon="reload" onClick={this.handleSubmit} loading={loading}>
            重置
          </Button>
          <Button 
            icon="right" 
            onClick={ currentIndex === listID.length ? "" : ()=>this.handleSwitch(1)} 
            style={{float:"right"}}
            disabled={ currentIndex === listID.length ? true : false }  
          >
          </Button>
          <Button 
            icon="left" 
            onClick={ currentIndex != 0 ? ()=>this.handleSwitch(0) : ""} 
            disabled={ currentIndex != 0 ? false : true } 
            style={{float:"right",marginRight:5}}
          >
          </Button>
        </div>
        <Form style={{ marginTop: 8 }}>
          <Card title="" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={24}>
                <FormDetailsTitle
                  title="客户信息"
                />
              </Col>
              <div style={{display: 'flow-root', clear: 'both'}}>
                <Col span={12}>
                  <FormItem {...formAllItemLayout} label="姓名" style>
                    <span>{detail.userName}</span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formAllItemLayout} label="手机号">
                    <span>{detail.userPhone}</span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formAllItemLayout} label="收货地址">
                    <span>{detail.userAddress}</span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formAllItemLayout} label="备注">
                    <span>{detail.orderNote}</span>
                  </FormItem>
                </Col>
              </div>
              <Col span={12}>
                <FormDetailsTitle
                  title="发货配置"
                />
                <FormItem {...formAllItemLayout} label="对应产品">
                  {getFieldDecorator('productName', {
                    initialValue: detail.productName ? detail.productName.split("/") : "",
                    rules: [
                      {
                        required: true,
                        message: '请选择对应产品',
                      },
                    ],
                  })(
                    // <Input placeholder="请输入对应产品" />
                    <Cascader 
                      options={productList}
                      fieldNames={{ label: 'name', value: 'name'}}
                      onChange={(value, selectedOptions)=>{
                        console.log("123")
                      }}
                    ></Cascader>
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="类型">
                  {getFieldDecorator('orderType', {
                    initialValue: detail.orderType,
                    rules: [
                      {
                        required: true,
                        message: '请选择类型',
                      },
                    ],
                  })(
                  <Select placeholder={"请选择类型"}>
                    {ORDERTYPE.map(item=>{
                      return (<Option value={item.name}>{item.name}</Option>)
                    })}
                  </Select>
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="序列号">
                  {getFieldDecorator('deviceSerialNumber', {
                    initialValue: detail.deviceSerialNumber,
                    rules: [
                      {
                        required: true,
                        message: '请输入设备序列号',
                      },
                    ],
                  })(
                    <Input 
                      placeholder="请输入设备序列号"
                      onPressEnter={this.handleSubmit}
                    />
                   )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="物流公司">
                  {getFieldDecorator('logisticsCompany', {
                    initialValue: detail.logisticsCompany,
                    // rules: [
                    //   {
                    //     required: true,
                    //     message: '请选择物流公司',
                    //   },
                    // ],
                  })(
                  <Select placeholder={"请选择物流公司"}>
                    {Object.keys(LOGISTICSCOMPANY).map(key=>{
                      return (<Option value={LOGISTICSCOMPANY[key]}>{LOGISTICSCOMPANY[key]}</Option>)
                    })}
                  </Select>
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="物流单号">
                  {getFieldDecorator('logisticsNumber', {
                    initialValue: detail.logisticsNumber,
                    // rules: [
                    //   {
                    //     required: true,
                    //     message: '请输入物流单号',
                    //   },
                    // ],
                  })(<Input placeholder="请输入物流单号" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                {/* <div style={{height:287}}></div> */}
                <div style={tipsStyle}>如您需要此订单进入自动化流程，请打开本开关</div>
                <FormItem {...formAllItemLayout} label="设备提醒">
                  {getFieldDecorator('product', {
                    initialValue: 1,
                  })(
                    <Radio.Group>
                      <Radio value={1}>开</Radio>
                      <Radio value={0}>关</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="发货提醒">
                  {getFieldDecorator('smsConfirmation', {
                    initialValue: 1,
                  })(
                    <Radio.Group>
                      <Radio value={1}>开</Radio>
                      <Radio value={0}>关</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                {/* <FormItem {...formAllItemLayout} label="签收提醒">
                  {getFieldDecorator('product', {
                    initialValue: detail.product,
                  })(
                    <Radio.Group value={1}>
                      <Radio value={1}>开</Radio>
                      <Radio value={0}>关</Radio>
                    </Radio.Group>
                  )}
                </FormItem> */}
                <FormItem {...formAllItemLayout} label="物流订阅">
                  {getFieldDecorator('shipmentRemind', {
                    initialValue:1,
                  })(
                    <Radio.Group>
                      <Radio value={1}>开</Radio>
                      <Radio value={0}>关</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="备注信息">
                  {getFieldDecorator('orderNote')(
                    <TextArea rows={4} />
                  )}
                </FormItem>
              </Col>
            </Row>
            
          </Card>
          
        </Form>
      </Panel>
    );
  }
}

export default LogisticsConfiguration;
