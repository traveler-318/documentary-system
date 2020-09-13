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
          message.success('提交成功');
          router.push('/logistics/goods');
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
    console.log(value, selectedOptions,param,"value")
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
                  {getFieldDecorator('cargo')(<Input placeholder="请输入物品信息" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="物品总数量：">
                  {getFieldDecorator('count')(<Input placeholder="请输入物品总数量(正整数)" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="物品总总量：">
                  {getFieldDecorator('weight', {
                    rules: [
                      {
                        required: true,
                        message: '请输入物品总重量(重量单位kg)',
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
                        message: '请输入物品总体积(体积单位CM*CM*CM)',
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
