import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, Radio, Cascader, Select, DatePicker, message } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import { CITY } from '../../../utils/city';
import func from '../../../utils/Func';
import { getCookie } from '../../../utils/support';

import { getDeliverySave } from '../../../services/newServices/logistics';
import router from 'umi/router';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class SenderAdd extends PureComponent {

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
      values.addrCoding=JSON.stringify(values.addrCoding);
      values.deptId = getCookie("dept_id");
      if (!err) {
        const params = {
          ...values,
        };
        console.log(params)
        getDeliverySave(params).then(res=>{
          message.success('提交成功');
          router.push('/logistics/sender');
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
      <Panel title="新增" back="/logistics/sender" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="寄件人姓名：">
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: '寄件人姓名',
                      },
                    ],
                  })(<Input placeholder="寄件人姓名" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="寄件人手机号：">
                  {getFieldDecorator('mobile', {
                    rules: [
                      {
                        required: true,
                        message: '寄件人手机号',
                      },
                    ],
                  })(<Input placeholder="寄件人手机号" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="寄件人所在地区：">
                  {getFieldDecorator('addrCoding', {
                    rules: [
                      {
                        required: true,
                        message: '寄件人所在地区',
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
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="寄件人详细地址：">
                  {getFieldDecorator('printAddr', {
                    rules: [
                      {
                        required: true,
                        message: '寄件人详细地址',
                      },
                    ],
                  })(<Input placeholder="寄件人详细地址" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="寄件人公司名称:">
                  {getFieldDecorator('company')(<Input placeholder="寄件人公司名称" />)}
                </FormItem>
              </Col>
            </Row>

          </Card>
        </Form>
      </Panel>
    );
  }
}

export default SenderAdd;
