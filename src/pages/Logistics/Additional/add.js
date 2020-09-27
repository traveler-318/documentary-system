import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, Radio, Cascader, Select, DatePicker, message } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import { CITY } from '../../../utils/city';
import func from '../../../utils/Func';
import { getCookie } from '../../../utils/support';
import { PAYMENTMETHOD,EXPRESSTYPE,SONSHEET,BACKSHEET } from './data.js';

import { getAdditionalSave } from '../../../services/newServices/logistics';
import router from 'umi/router';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@Form.create()
class GoodsAdd extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:{
        code: "",
        payType: 'SHIPPER',
        expType: '标准快递',
        valinsPay:0,
        collection:0,
        needChild:0,
        needBack:0
      },
    };
  }

  componentWillMount() {

  }

  // ============ 提交 ===============

  handleSubmit = e => {
    e.preventDefault();
    const {  form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      values.deptId = getCookie("dept_id");
      if (!err) {
        const params = {
          ...values,
        };
        console.log(params)
        getAdditionalSave(params).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            router.push('/logistics/additional');
          }
        })
      }
    });
  };

  onChange = (value) => {

  };

  valinsPayChange = (rule, value, callback) => {
    var reg=/((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
    if(value != "" && value != null){
      if(!reg.test(value)){
        callback('请输入正确的金额格式');
      }else{
        return callback();
      }
    }else{
      return callback();
    }
  };

  collectionChange = (rule, value, callback) => {
    var reg=/((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
    if(value != "" && value != null){
      if(!reg.test(value)){
        callback('请输入正确的金额格式');
      }else{
        return callback();
      }
    }else{
      return callback();
    }
  };


  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const {data}=this.state

    const action = (
      <Button type="primary" onClick={this.handleSubmit}>
        提交
      </Button>
    );

    return (
      <Panel title="新增" back="/logistics/authority" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" bordered={false}>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="系统标识：">
                  {getFieldDecorator('code')(<Input placeholder="请输入系统标识" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="支付方式：">
                  {getFieldDecorator('payType',{
                    initialValue: data.payType,
                  })(
                    <Select placeholder="" onChange={this.onChange()}>
                    {PAYMENTMETHOD.map((item,index)=>{
                      return (<Option key={index} value={item.key}>{item.value}</Option>)
                    })}
                  </Select>)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="快递类型：">
                  {getFieldDecorator('expType',{
                    initialValue: data.expType,
                  })(
                    <Select placeholder=""  onChange={this.onChange()}>
                      {EXPRESSTYPE.map((item,index)=>{
                        return (<Option key={index} value={item.key}>{item.value}</Option>)
                      })}
                    </Select>)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="保价额度：">
                  {getFieldDecorator('valinsPay', {
                    rules: [
                      {
                        required: true,
                        validator:this.valinsPayChange
                      },
                    ],
                    initialValue: data.valinsPay,
                  })(<Input placeholder="单位是元" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="代收货款额度:">
                  {getFieldDecorator('collection', {
                    rules: [
                      {
                        validator:this.collectionChange
                      },
                    ],
                    initialValue: data.collection,
                  })(<Input placeholder="单位是元" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="是否需要子单：">
                  {getFieldDecorator('needChild', {
                    initialValue: data.needChild,
                  })(
                    <Select placeholder="" disabled>
                      {SONSHEET.map((item,index) =>{
                        return (<Option key={index} value={item.key}>{item.value}</Option>)
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="是否需要回单：">
                  {getFieldDecorator('needBack', {
                    initialValue: data.needBack,
                  })(
                    <Select placeholder="" disabled>
                      {BACKSHEET.map((item,index) =>{
                        return (<Option key={index} value={item.key}>{item.value}</Option>)
                      })}
                    </Select>
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

export default GoodsAdd;
