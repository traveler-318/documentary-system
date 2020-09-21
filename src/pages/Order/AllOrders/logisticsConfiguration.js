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
import {updateData,getRegion} from '../../../services/newServices/order'
import { 
  LOGISTICSCOMPANY,
  paymentCompany,
  productType,
  productID,
  amountOfMoney
} from './data.js';

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
      productList:[]
    };
  }


  componentWillMount() {
    const { globalParameters } = this.props;

    // 获取详情数据
    this.setState({
      detail:globalParameters.detailData
    })

    // 拼装对应产品
    this.assemblingData();
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

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { cityparam, detail } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values,"123")
        // values = {...values,...cityparam};
        // values.id = detail.id
        // updateData(values).then(res=>{
        //   message.success(res.msg);
        //   router.push('/order/allOrders');
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
    this.setState({
      cityparam:{
        province:value[0],
        city:value[1],
        area:value[2],
      }
    })
  };

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

    console.log(this.props.globalParameters)

    return (
      <Panel title="物流配置" back="/order/AllOrders">
        <div style={{background:"#fff",marginBottom:10,padding:"10px 10px 10px 20px"}}>
            <Button style={{marginRight:10}} type="primary" onClick={this.handleSubmit} loading={loading}>
              保存
            </Button>
            <Button style={{marginRight:10}} type="primary" onClick={this.handleSubmit} loading={loading}>
              保存并打印
            </Button>
            <Button style={{marginRight:10}} type="primary" onClick={this.handleSubmit} loading={loading}>
              保存并处理下一条
            </Button>
            <Button icon="reload" onClick={this.handleSubmit} loading={loading}>
              重置
            </Button>
          </div>

        <Form style={{ marginTop: 8 }}>
          <Card title="" className={styles.card} bordered={false}>
          
            <Row gutter={24}>
              <Col span={12}>
                <FormDetailsTitle
                  title="客户信息"
                />
                <FormItem {...formAllItemLayout} label="姓名">
                  <span>{detail.userName}</span>
                </FormItem>
                <FormItem {...formAllItemLayout} label="手机号">
                  <span>{detail.userPhone}</span>
                </FormItem>
                <FormItem {...formAllItemLayout} label="手机号2">
                  <span>{detail.userPhone}</span>
                </FormItem>
                <FormItem {...formAllItemLayout} label="收货地址">
                  <span>{detail.userAddress}</span>
                </FormItem>
                <FormItem {...formAllItemLayout} label="备注">
                  <span>{detail.orderNote}</span>
                </FormItem>
                <FormDetailsTitle
                  title="发货配置"
                />
                <FormItem {...formAllItemLayout} label="对应产品">
                  {getFieldDecorator('product', {
                    initialValue: detail.product,
                    rules: [
                      {
                        required: true,
                        message: '请输入对应产品',
                      },
                    ],
                  })(
                    // <Input placeholder="请输入对应产品" />
                    <Cascader 
                      options={productList}
                      fieldNames={{ label: 'name', value: 'key'}}
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
                  })(<Input placeholder="请输入设备序列号" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="物流公司">
                  {getFieldDecorator('logisticsCompany', {
                    initialValue: detail.logisticsCompany,
                    rules: [
                      {
                        required: true,
                        message: '请选择物流公司',
                      },
                    ],
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
                    rules: [
                      {
                        required: true,
                        message: '请输入物流单号',
                      },
                    ],
                  })(<Input placeholder="请输入物流单号" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <div style={{height:351}}></div>
                <div style={tipsStyle}>如您需要此订单进入自动化流程，请打开本开关</div>
                <FormItem {...formAllItemLayout} label="设备提醒">
                  {getFieldDecorator('product', {
                    initialValue: 1,
                  })(
                    <Radio.Group onChange={this.onChange}>
                      <Radio value={1}>开</Radio>
                      <Radio value={0}>关</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="发货提醒">
                  {getFieldDecorator('smsConfirmation', {
                    initialValue: 1,
                  })(
                    <Radio.Group onChange={this.onChange}>
                      <Radio value={1}>开</Radio>
                      <Radio value={0}>关</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                {/* <FormItem {...formAllItemLayout} label="签收提醒">
                  {getFieldDecorator('product', {
                    initialValue: detail.product,
                  })(
                    <Radio.Group onChange={this.onChange} value={1}>
                      <Radio value={1}>开</Radio>
                      <Radio value={0}>关</Radio>
                    </Radio.Group>
                  )}
                </FormItem> */}
                <FormItem {...formAllItemLayout} label="物流订阅">
                  {getFieldDecorator('shipmentRemind', {
                    initialValue:1,
                  })(
                    <Radio.Group onChange={this.onChange}>
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
