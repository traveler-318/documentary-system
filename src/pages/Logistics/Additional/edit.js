import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, DatePicker, message, Radio, Select } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import func from '../../../utils/Func';
import { PAYMENTMETHOD,EXPRESSTYPE,SONSHEET,BACKSHEET } from './data.js';
import { getAdditionalSubmit } from '../../../services/newServices/logistics';
import { getCookie } from '../../../utils/support';
import router from 'umi/router';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class GoodsEdit extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:[],
    };
  }

  componentWillMount() {
    const { globalParameters } = this.props;

    // 获取详情数据
    this.setState({
      data:globalParameters.detailData
    })
  }
// ============ 修改提交 ===============

  handleSubmit = e => {
    e.preventDefault();
    const {  form } = this.props;
    const {data} = this.state;
    form.validateFieldsAndScroll((err, values) => {
      values.deptId = getCookie("dept_id");
      if (!err) {
        const params = {
          ...values,
          id:data.id,
        };
        getAdditionalSubmit(params).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            router.push('/logistics/additional');
          }else {
            message.error(res.msg);
          }
        })
      }
    });
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
    const {data} = this.state;
    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const action = (
      <Button type="primary" onClick={this.handleSubmit}>
        提交
      </Button>
    );

    return (
      <Panel title="新增" back="/logistics/additional" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" bordered={false}>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="系统标识：">
                  {getFieldDecorator('code',{
                    initialValue: data.code,
                  })(<Input placeholder="请输入系统标识" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="支付方式：">
                  {getFieldDecorator('payType',{
                    initialValue: data.payType,
                  })(
                    <Select placeholder="" >
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
                    <Select placeholder="" >
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

export default GoodsEdit;
