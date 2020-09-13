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
import {updateData,getRegion} from '../../../services/newServices/order'

const FormItem = Form.Item;
const { TextArea } = Input;


@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class OrdersAdd extends PureComponent {

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
    };
  }


  componentWillMount() {
    const { globalParameters } = this.props;

    // 获取详情数据
    this.setState({
      detail:globalParameters.detailData
    })
  }

  componentWillReceiveProps(pre,nex){
    console.log(pre,nex)
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { cityparam, detail } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values = {...values,...cityparam};
        values.id = detail.id
        updateData(values).then(res=>{
          message.success(res.msg);
          router.push('/order/allOrders');
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
    this.setState({
      cityparam:{
        province:value[0],
        city:value[1],
        area:value[2],
      }
    })
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const {
      PRODUCTCLASSIFICATION,
      loading,
      detail
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

    console.log(this.props.globalParameters)

    const action = (
      <Button type="primary" onClick={this.handleSubmit} loading={loading}>
        提交
      </Button>
    );

    return (
      <Panel title="新增" back="/order/AllOrders" action={action}>
        <Form style={{ marginTop: 8 }}>

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
                    initialValue: detail.userName,
                  })(<Input placeholder="请输入客户姓名" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="手机号">
                  {getFieldDecorator('userPhone', {
                    rules: [
                      {
                        required: true,
                        message: '请输入手机号',
                      },
                      {
                        len: 11,
                        message: '请输入正确的手机号',
                      },
                    ],
                    initialValue: detail.userPhone,
                  })(<Input placeholder="请输入手机号" />)}
                </FormItem>
                
                <FormItem {...formAllItemLayout} label="所在地区">
                  {getFieldDecorator('region', {
                      initialValue: [detail.province, detail.city, detail.area],
                    })(
                    <Cascader
                      defaultValue={[detail.province, detail.city, detail.area]}
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
                    initialValue: detail.userAddress,
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
                    initialValue: detail.orderSource,
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
                    initialValue: detail.orderType,
                  })(
                    <Select placeholder={"请选择订单类型"}>
                      {ORDERTYPE.map(item=>{
                        return (<Option value={item.key}>{item.name}</Option>)
                      })}
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="产品分类">
                  {getFieldDecorator('productName', {
                      initialValue: detail.productName,
                    })(
                      <Input placeholder="请输入产品分类" />
                  //   <Select placeholder={"请选择产品分类"}>
                  //   {PRODUCTCLASSIFICATION.map(item=>{
                  //     return (<Option value={item.id}>{item.name}</Option>)
                  //   })}
                  // </Select>
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="产品型号">
                  {getFieldDecorator('productModel',{
                     initialValue: detail.productModel,
                  })(<Input placeholder="请输入产品型号" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="序列号SN">
                  {getFieldDecorator('deviceSerialNumber',{
                    initialValue: detail.deviceSerialNumber,
                  })(<Input placeholder="请输入序列号SN" />)}
                </FormItem>

                <FormTitle
                  title="销售信息"
                />

                <FormItem {...formAllItemLayout} label="归属销售">
                  {getFieldDecorator('salesman', {
                      initialValue: detail.salesman,
                    })(
                    <Select placeholder={"请选择归属销售"}>
                    {PRODUCTCLASSIFICATION.map(item=>{
                      return (<Option value={item.id}>{item.name}</Option>)
                    })}
                  </Select>
                  )}
                </FormItem>

                <FormItem {...formAllItemLayout} label="备注信息">
                  {getFieldDecorator('orderNote',{
                    initialValue: detail.orderNote,
                  })(
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
