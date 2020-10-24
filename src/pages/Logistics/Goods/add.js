import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, Radio, Cascader, Select, DatePicker, message } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import { CITY } from '../../../utils/city';
import func from '../../../utils/Func';
import { getCookie } from '../../../utils/support';

import { getDeliverySave,getGoodsSave } from '../../../services/newServices/logistics';
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
        getGoodsSave(params).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            router.push('/logistics/goods');
          }else {
            message.error(res.msg);
          }
        })
      }
    });
  };

  onChange = (value, selectedOptions) => {
    let param ={
      province:value[0],
      city:value[1],
      area:value[2],
      name:`${selectedOptions[0].label}${selectedOptions[1].label}${selectedOptions[2].label}`
    }
  };

  countChange = (rule, value, callback) => {
    var reg=/^[1-9]\d*$/;
    if(value === "" || value === null){
      callback('请输入物品总数量');
    }else if(!reg.test(value)){
      callback(new Error('请输入正整数'));
    }else{
      return callback();
    }
  };

  weightChange = (rule, value, callback) => {
    let reg=/((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
    if(value === "" || value === undefined){
      callback('请输入物品总重量');
    }else if(!reg.test(value) || Number(value) <= 0){
      callback('请输入大于0的正整数或小数');
    }else{
      return callback();
    }
  };

  volumnChange = (rule, value, callback) => {
    let reg=/((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
    if(value === "" || value === undefined){
      callback('请输入物品总体积');
    }else if(!reg.test(value) || Number(value) <= 0){
      callback('请输入大于0的正整数或小数');
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
      <Panel title="新增" back="/logistics/goods" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" bordered={false}>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="物品信息：">
                  {getFieldDecorator('cargo',{
                    rules: [
                      {
                        required: true,
                        validator:"请输入物品信息"
                      },
                    ],
                  })(<Input placeholder="请输入物品信息" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="物品总数量：">
                  {getFieldDecorator('count',{
                    rules: [
                      {
                        required: true,
                        validator:this.countChange,
                      },
                    ],
                  })(<Input placeholder="请输入物品总数量(正整数)" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="物品总重量：">
                  {getFieldDecorator('weight', {
                    rules: [
                      {
                        required: true,
                        validator:this.weightChange,
                      },
                    ],
                  })(<Input placeholder="请输入物品总重量(重量单位kg)" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="物品总体积：">
                  {getFieldDecorator('volumn', {
                    rules: [
                      {
                        required: true,
                        validator:this.volumnChange,
                      },
                    ],
                  })(<Input placeholder="请输入物品总体积(体积单位CM*CM*CM)" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="备注内容:">
                  {getFieldDecorator('remark')(<TextArea rows={4} placeholder="备注内容" />)}
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
