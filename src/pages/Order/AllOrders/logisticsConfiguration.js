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
import { LOGISTICSCOMPANY } from './data.js';

const FormItem = Form.Item;
const { TextArea } = Input;


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
                <FormTitle
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
                    <Input placeholder="请输入对应产品" />
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
                <FormTitle
                  title="销售信息"
                />
                <FormItem {...formAllItemLayout} label="设备提醒">
                  {getFieldDecorator('product', {
                    initialValue: detail.product,
                  })(
                    <Radio.Group onChange={this.onChange} value={1}>
                      <Radio value={1}>开</Radio>
                      <Radio value={0}>关</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="发货提醒">
                  {getFieldDecorator('product', {
                    initialValue: detail.product,
                  })(
                    <Radio.Group onChange={this.onChange} value={1}>
                      <Radio value={1}>开</Radio>
                      <Radio value={0}>关</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="签收提醒">
                  {getFieldDecorator('product', {
                    initialValue: detail.product,
                  })(
                    <Radio.Group onChange={this.onChange} value={1}>
                      <Radio value={1}>开</Radio>
                      <Radio value={0}>关</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="激活提醒">
                  {getFieldDecorator('product', {
                    initialValue: detail.product,
                  })(
                    <Radio.Group onChange={this.onChange} value={1}>
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
