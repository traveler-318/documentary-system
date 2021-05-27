import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, TreeSelect, Select, DatePicker, message, Cascader, Radio } from 'antd';
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
import { CITY } from '../../../utils/city';
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


@connect(({ user, loading }) => ({
  user,
  submitting: loading.effects['user/submit'],
}))
@Form.create()
class OrdersAdd extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      salesmanList:[],
      loading:false,
      cityparam:{},
      productList:[],
      selectedOptions:[],
      payamount:null
    };
  }


  componentWillMount() {
    this.getSalesmanList();
    // this.assemblingData();
    this.getTreeList();
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
    const { cityparam, selectedOptions, payamount } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values,"提交数据")
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
        }
        values.userAddress = `${selectedOptions}${values.userAddress}`;
        createData(values).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            router.push('/order/allOrders');
          }
        })
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
    } = this.props;

    const {
      salesmanList,
      loading,
      productList
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
      <Panel title="新增" back="/order/allOrders" action={action}>
        <Form style={{ marginTop: 8 }}>
          <div></div>
          <Card title="创建客户" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={12}>
                <FormTitle
                  title="基础信息"
                />
                <FormItem {...formAllItemLayout} label="客户姓名">
                  {getFieldDecorator('userName', {
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
                    rules: [
                      { required: true, validator: this.validatePhone },
                    ],
                  })(<Input placeholder="请输入手机号" />)}
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
                  {getFieldDecorator('region', {
                      // initialValue: {['zhejiang', 'hangzhou', 'xihu']},
                      rules: [
                        {
                          required: true,
                          message: '请选择所在地区',
                        },
                      ],
                    })(
                    <Cascader
                      // defaultValue={['zhejiang', 'hangzhou', 'xihu']}
                      options={CITY}
                      onChange={this.onChange}
                    />
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="收货地址">
                  {getFieldDecorator('userAddress', {
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
                      return (<Option value={item.key}>{item.name}</Option>)
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
                    })(
                      <Cascader
                        options={productList}
                        fieldNames={{ label: 'value',value: "id"}}
                        onChange={(value, selectedOptions)=>{
                          console.log(value, selectedOptions,"产品分类改变")
                          // this.setState({
                          //   payamount:selectedOptions[2].payamount
                          // })
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
      </Panel>
    );
  }
}

export default OrdersAdd;
