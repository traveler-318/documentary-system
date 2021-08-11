import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, TreeSelect, Select, DatePicker, message, Cascader, Radio,InputNumber } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import Panel from '../../../components/Panel';
import FormTitle from '../../../components/FormTitle';
import styles from '../../../layouts/Sword.less';
import { USER_INIT, USER_CHANGE_INIT, USER_SUBMIT } from '../../../actions/user';
import func from '../../../utils/Func';
import { tenantMode } from '../../../defaultSettings';
import {GENDER,ORDERTYPE,ORDERSOURCE} from './data.js'
import { getCityData } from '@/utils/authority';
import { getCookie } from '../../../utils/support';
import { createData, getRegion, productTreelist } from '../../../services/newServices/order'
import { getList as getSalesmanLists } from '../../../services/newServices/sales';
import {
  LOGISTICSCOMPANY,
  paymentCompany,
  productType,
  productID,
  amountOfMoney
} from './data.js';

const FormItem = Form.Item;
const { TextArea } = Input;

let backUrl = "";

@connect(({ user, loading }) => ({
  user,
  submitting: loading.effects['user/submit'],
}))
@Form.create()
class OrdersAdd extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isTaskTypeBox:false,

      salesmanList:[],
      loading:false,
      cityparam:{},
      productList:[],
      selectedOptions:[],
      payamount:null,
      payPanyId:null,
      productTypeId:null,
      productId:null,
      cityData:[]

    };
  }


  componentWillMount() {
    this.getSalesmanList();
    // this.assemblingData();
    this.getTreeList();
    backUrl = "/order/safeguard";

    getCityData().then(res=>{
      this.setState({
        cityData:res
      })
    })
  }

  getTreeList = () => {
    productTreelist().then(res=>{
      console.log(res.data,"productTreelist")
      this.setState({productList:res.data})
    })
  }

  assemblingData = () => {
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
    console.log(TheFirstLevel,"TheFirstLevel")
    // this.setState({productList:TheFirstLevel})
  }

  // 获取业务员数据
  getSalesmanList = () => {
    getSalesmanLists({size:100,current:1}).then(res=>{
      this.setState({
        salesmanList:res.data.records
      })
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { cityparam, selectedOptions, payamount, payPanyId, productTypeId, productId, } = this.state;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values,"提交数据")
        return false;
        values.deptId = getCookie("dept_id");
        values.tenantId = getCookie("tenantId");
        values = {...values,...cityparam};
        if(values.productType && values.productType != ""){
          console.log(values.productType[2])
          console.log(values.productType[2].split("-"))
          // values.payAmount = values.productType[2].split("-")[1];
          // values.payAmount = payamount;
          values.productName = values.productType[2];
          values.productType = `${values.productType[0]}/${values.productType[1]}`;
          values.payPanyId = payPanyId;
          values.productTypeId = productTypeId;
          values.productId = productId;
        }
        values.userAddress = `${selectedOptions}${values.userAddress}`;
        // createData(values).then(res=>{
        //   if(res.code === 200){
        //     message.success(res.msg);
        //     router.push(backUrl);
        //   }
        // })
      }
    });
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

  valinsPayChange = (rule, value, callback) => {
    var reg=/((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
    if(!reg.test(value)){
      callback('请输入正确的金额格式');
    }else{
      return callback();
    }
  };

  valinsPayChange1 =(rule, value, callback) =>{
    const { form } = this.props;
    if(value==undefined || value=='' || value ==null){
      return callback();
    }else{
      this.valinsPayChange(rule, value, callback);
      form.validateFields(['productCoding'], { force: true });
    }
  };

  allProductChange = (rule, value, callback) => {
    const { form } = this.props;//getFieldsValue
    const orderType = form.getFieldValue('orderType')|| 0;
    const productType = form.getFieldValue('productType')|| 0;
    const payAmount = form.getFieldValue('payAmount') || 0;
    const all = orderType + productType +payAmount;
    var reg=/((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
    if(value!=undefined){
      if(!reg.test(value)){
        callback('请输入正确的金额格式');
      }else{
        if (value != all) {
          callback('总金额不对');
        }else{
          return callback();
        }
      }
    }
  };

  RadioChange = e => {
    this.setState({
      isTaskTypeBox: e.target.value == 1 ? true:false
    })
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const {
      isTaskTypeBox,
      salesmanList,
      loading,
      productList,
      cityData
    } = this.state;

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

    const action = (
      <Button type="primary" onClick={this.handleSubmit} loading={loading}>
        提交
      </Button>
    );

    return (
      <Panel title="新增" back={`${backUrl}?type=details`} action={action}>
        <Form style={{ marginTop: 8 }}>
          <div></div>
          <Card title="创建客户" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={12}>
                <FormTitle
                  title="基础信息"
                />
                <FormItem {...formAllItemLayout} label="支付公司">
                  {getFieldDecorator('userName', {
                    rules: [
                      {
                        required: true,
                        message: '请输入支付公司',
                      },
                    ],
                  })(<Input placeholder="请输入支付公司" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="产品类型">
                  {getFieldDecorator('userPhone', {
                    rules: [
                      { required: true, message: '请输入产品类型' },
                    ],
                  })(<Input placeholder="请输入产品类型" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="产品名称">
                  {getFieldDecorator('backPhone', {
                    rules: [
                      { required: true, message: '请输入产品名称' },
                    ],
                  })(<Input placeholder="请输入产品名称" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="页面标题">
                  {getFieldDecorator('wechatId', {
                    rules: [
                      { required: true, message: '请输入页面标题' },
                    ],
                  })(<Input placeholder="请输入页面标题" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="详情图">
                  {getFieldDecorator('region')(
                    <Cascader
                    fieldNames={{ label: 'text'}}
                    options={cityData}
                      onChange={this.onChange}
                    />
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="价格">
                  {getFieldDecorator('userAddress',{
                    rules: [
                      { required: true, validator: this.valinsPayChange },
                    ],
                  })(<Input placeholder="请输入价格" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormTitle
                  title="订单信息"
                />
                <FormItem {...formAllItemLayout} label="任务类型">
                  {getFieldDecorator('orderSource', {
                    rules: [
                      {
                        required: true,
                        message: '请选择任务类型',
                      },
                    ],
                  })(
                    <Radio.Group  onChange={this.RadioChange} >
                      <Radio value={1}>任务</Radio>
                      <Radio value={2}>无</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                {
                  isTaskTypeBox ? (
                    <>
                      <FormItem {...formAllItemLayout} label="阶段1">
                        {getFieldDecorator('orderType', {
                          rules: [
                            { required: true, message: '金额不能为空' },
                            { validator: this.valinsPayChange1 },
                          ],
                        })(<InputNumber placeholder="请输入金额" style={{width:'100%'}} formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />)}
                      </FormItem>
                      <FormItem {...formAllItemLayout} label="阶段2">
                        {getFieldDecorator('productType', {
                          rules: [
                            { required: true, message: '金额不能为空' },
                            { validator: this.valinsPayChange1 },
                          ],
                        })(<InputNumber placeholder="请输入金额" style={{width:'100%'}} formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />)}
                      </FormItem>
                      <FormItem {...formAllItemLayout} label="阶段3">
                        {getFieldDecorator('payAmount',{
                          rules: [
                            { validator: this.valinsPayChange1 },
                          ],
                        })(<InputNumber placeholder="请输入金额" style={{width:'100%'}} formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />)}
                      </FormItem>

                      <FormItem {...formAllItemLayout} label="达标金额">
                        {getFieldDecorator('productCoding',{
                          rules: [
                            { required: true,validator:this.allProductChange }
                          ],
                        })(<InputNumber placeholder="请输入金额" style={{width:'100%'}} formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />)}
                      </FormItem>
                    </>
                  ):''
                }
              </Col>
            </Row>

          </Card>

        </Form>
      </Panel>
    );
  }
}

export default OrdersAdd;
