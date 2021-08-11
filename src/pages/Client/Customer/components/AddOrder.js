import React, { PureComponent } from 'react';
import { Form, Input, Card, Row,Modal, Col, Button, Icon , Select, message, Tabs, Cascader, Radio,Timeline,Tooltip} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from '../../../Order/components/edit.less';
import {
  productTreelist,
  updateReminds,
} from '../../../../services/newServices/order';
import {
  getDetail,
  updateData,
  clientOrder,
  clientOperationRecord,
  createOrder,
} from '../../../../services/order/customer';

import func from '@/utils/Func';
import FormTitle from '../../../../components/FormTitle';
import { getCityData } from '../../../../utils/authority';
import { ORDERSOURCE, ORDERTYPE } from '../../../Order/components/data';
import { salesmanList } from '../../../../services/newServices/sales';

const { TabPane } = Tabs;
const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class AddOrders extends PureComponent {

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
      primary:'primary',
      primary1:'',
      repeatLoading:false,
      payPanyId:null,
      productTypeId:null,
      productId:null,
      detailsId:null,
      orderListLength:0,
      orderVisible:false,
      productList:[],
      salesmanList:[],
      cityparam:[],
      selectedOptions:[],
      cityData: [],
    };
  }

  componentWillMount() {

    const { globalParameters } = this.props;
    const propData = globalParameters.detailData;

    getCityData().then(res=>{
      this.setState({
        cityData:res
      })
    })

    // 获取详情数据
    this.setState({
      detailsId:propData.detail.id,
    },()=>{
      this.getEditDetails();
    });

    this.getTreeList();
    this.getSalesmanList();

    // let _this = this;
    // setTimeout(()=>{
    //   _this.getEditDetails();
    // },4000)
  }

  changeDetails = (id) => {
    // 获取详情数据
    this.setState({
      detailsId:id,
    },()=>{
      this.getEditDetails();
    });
  }

  getTreeList = () => {
    productTreelist().then(res=>{
      console.log(res.data,"productTreelist")
      this.setState({productList:res.data})
    })
  }

  // 获取业务员数据
  getSalesmanList = () => {
    salesmanList({size:100,current:1}).then(res=>{
      this.setState({
        salesmanList:res.data
      })
    })
  }

  getEditDetails = () => {
    const params={
      id:this.state.detailsId
    }
    getDetail(params).then(res=>{
      this.setState({
        detail:res.data
      })
      this.getList(res.data)
    })
  }

  getList = (detail) =>{
    const params={
      clientPhone:detail.clientPhone,
      size:10,
      current:1,
      clientId: detail.id,
      associateOrderId: detail.associateOrderId,
    }
    clientOrder(params).then(res=>{
      const data = res.data;
      this.setState({
        orderDetail:data.records,
        orderPagination:{
          total:data.total,
          current:data.current,
          pageSize:data.size,
        },
        orderListLength:data.total
      })
    })

    //查询归属总条数
    clientOperationRecord({
      clientId:detail.id,
      deptId:detail.deptId,
      tenantId:detail.tenantId,
      type:0,
      size:1,
      current:1
    }).then(res=>{
      const data = res.data;
      this.setState({
        clientOperationRecordLength:data.total
      })
    })
  }

  addOrder = ()=>{

    const { form } = this.props;
    const {  cityparam,selectedOptions,payPanyId, productTypeId, productId, } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        values = {...values,...cityparam};
        if(values.backPhone === undefined){
          values.backPhone = null
        }
        if(values.orderNote === undefined){
          values.orderNote = null
        }
        if(values.productCoding === undefined){
          values.productCoding = null
        }
        if(values.productType && values.productType != ""){
          values.productName = values.productType[2];
          values.productType = `${values.productType[0]}/${values.productType[1]}`;
          values.payPanyId = payPanyId;
          values.productTypeId = productTypeId;
          values.productId = productId;
        }
        values.userAddress = `${selectedOptions}${values.userAddress}`;

        values.region = values.regions;

        delete values.regions

        console.log(values)

        createOrder(values).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            this.props.handleCancelOrder()
          }else {
            message.error(res.msg);
          }
        })

      }
    })

  }


  orderVisible = () =>{
    this.setState({
      orderVisible:true
    })
    // Modal.confirm({
    //   title: '提醒',
    //   content: "确定将要创建此客户的订单？",
    //   okText: '确定',
    //   okType: 'primary',
    //   cancelText: '取消',
    //   onOk() {
    //     // const params={
    //     //   clientPhone: detail.clientPhone,
    //     //   clientName: detail.clientName,
    //     //   clientAddress: detail.clientAddress,
    //     // }
    //     // createOrder(params).then(res=>{
    //     //   if(res.code === 200){
    //     //     message.success(res.msg);
    //     //   }else {
    //     //     message.error(res.msg);
    //     //   }
    //     // })
    //
    //   },
    //   onCancel() {},
    // });
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
    console.log(value)


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

  valinsPayChange = (rule, value, callback) => {
    var reg=/((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
    if(!reg.test(value)){
      callback('请输入正确的金额格式');
    }else{
      return callback();
    }
  };

  render() {

    const {
      form: { getFieldDecorator },
      orderVisible,
      handleCancelOrder
    } = this.props;

    const {
      data,
      loading,
      orderDetail,
      orderPagination,
      detail,
      productList,
      salesmanList,
      cityData
    } = this.state;

    const formAllItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };

    return (
      <>
        <Modal
          title="创建订单"
          visible={orderVisible}
          width={1290}
          onCancel={handleCancelOrder}
          bodyStyle={{paddingTop:0}}
          maskClosable={false}
          footer={[
            <Button key="back">
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={()=>{this.addOrder()}}>
              确定
            </Button>,
          ]}
          style={{
            top:40
          }}
        >
          <Form style={{ marginTop: 8 }}>
            <div></div>
            <Card className={styles.card} bordered={false}>
              <Row gutter={24}>
                <Col span={12}>
                  <FormTitle
                    title="基础信息"
                  />
                  <FormItem {...formAllItemLayout} label="客户姓名">
                    {getFieldDecorator('userName', {
                      initialValue: detail.clientName,
                      rules: [
                        {
                          required: true,
                          message: '请输入客户姓名',
                        },
                      ],
                    })(<Input placeholder="请输入客户姓名" />)}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="手机号">
                    {getFieldDecorator('userPhone', {
                      initialValue: detail.clientPhone,
                      rules: [
                        { required: true, validator: this.validatePhone },
                      ],
                    })(<Input disabled placeholder="请输入手机号" />)}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="备用手机号">
                    {getFieldDecorator('backPhone', {
                      rules: [
                        {
                          len: 11,
                          message: '请输入正确的手机号格式',
                        },
                      ],
                    })(<Input placeholder="请输入备用手机号" />)}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="微信号">
                    {getFieldDecorator('wechatId')(<Input placeholder="请输入微信号" />)}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="所在地区">
                    {getFieldDecorator('regions', {
                      // initialValue: {['zhejiang', 'hangzhou', 'xihu']},
                      initialValue: [detail.province, detail.city, detail.area],
                      rules: [
                        {
                          required: true,
                          message: '请选择所在地区',
                        },
                      ],
                    })(
                      <Cascader
                        fieldNames={{ label: 'text'}}
                        options={cityData}
                        onChange={this.onChange}
                      />
                    )}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="收货地址">
                    {getFieldDecorator('userAddress', {
                      initialValue: detail.clientAddress,
                      rules: [
                        {
                          required: true,
                          message: '请输入收货地址',
                        },
                      ],
                    })(<Input placeholder="请输入收货地址" />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormTitle
                    title="订单信息"
                  />
                  <FormItem {...formAllItemLayout} label="订单来源">
                    {getFieldDecorator('orderSource', {
                      rules: [
                        {
                          required: true,
                          message: '请选择订单来源',
                        },
                      ],
                    })(
                      <Select placeholder={"请选择订单来源"}>
                        {ORDERSOURCE.map(item=>{
                          if(item.key != null){
                            return (<Option value={item.key}>{item.name}</Option>)
                          }
                        })}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="订单类型">
                    {getFieldDecorator('orderType', {
                      rules: [
                        {
                          required: true,
                          message: '请选择订单类型',
                        },
                      ],
                    })(
                      <Select placeholder={"请选择订单类型"}>
                        {ORDERTYPE.map(item=>{
                          return (<Option value={item.key}>{item.name}</Option>)
                        })}
                      </Select>
                    )}
                  </FormItem>


                  <FormItem {...formAllItemLayout} label="产品分类">
                    {getFieldDecorator('productType', {
                      initialValue: null,
                      rules: [
                        {
                          required: true,
                          message: '请选择产品分类',
                        },
                      ],
                    })(
                      <Cascader
                        options={productList}
                        fieldNames={{ label: 'value',value: "id"}}
                        onChange={(value, selectedOptions)=>{
                          console.log(value, selectedOptions,"产品分类改变")
                          this.setState({
                            payPanyId:selectedOptions[0].id,
                            productTypeId:selectedOptions[1].id,
                            productId :selectedOptions[2].id,
                          })
                          const { form } = this.props;
                          console.log(form,"1")
                          console.log(form.getFieldsValue,"2");
                          const region = form.getFieldsValue();
                          console.log(region,"3");
                          // if(!region.payamount || region.payamount === "" || region.payamount === null){
                          form.setFieldsValue({
                            payAmount:selectedOptions[2].payamount
                          })
                          // }
                        }}
                      ></Cascader>
                    )}
                  </FormItem>

                  <FormItem {...formAllItemLayout} label="产品金额">
                    {getFieldDecorator('payAmount',{
                      rules: [
                        { required: true, validator: this.valinsPayChange },
                      ],
                    })(<Input placeholder="请输入产品金额" />)}
                  </FormItem>

                  {/* <FormItem {...formAllItemLayout} label="产品型号">
                  {getFieldDecorator('productName')(<Input placeholder="请输入产品型号" />)}
                </FormItem> */}
                  <FormItem {...formAllItemLayout} label="SN">
                    {getFieldDecorator('productCoding')(<Input placeholder="请输入SN" />)}
                  </FormItem>

                  <FormTitle
                    title="销售信息"
                  />

                  <FormItem {...formAllItemLayout} label="归属销售">
                    {getFieldDecorator('salesman', {
                      initialValue: null,
                      rules: [
                        {
                          required: true,
                          message: '请选择归属销售',
                        },
                      ],
                    })(
                      <Select placeholder={"请选择归属销售"}>
                        {salesmanList.map(item=>{
                          return (<Option value={item.userAccount}>{item.userName}</Option>)
                        })}
                      </Select>
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
        </Modal>
      </>

    );
  }
}

export default AddOrders;
