import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, Radio, Cascader, Select, DatePicker, message } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import { getCityData } from '@/utils/authority';
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
      cityparam:{},
      cityData:[]
    };
  }

  componentWillMount() {
    getCityData().then(res=>{
      this.setState({
        cityData:res
      })
    })
  }

  // ============ 提交 ===============

  handleSubmit = e => {
    e.preventDefault();
    const {  form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      values.addrCoding=JSON.stringify(values.addrCoding);
      values.deptId = getCookie("dept_id");
      const { cityparam } = this.state;
      if (!err) {
        const params = {
          ...values,
          administrativeAreas:cityparam.name
        };
        getDeliverySave(params).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            router.push('/logistics/sender');
          }
        })
      }
    });
  };

  onChange = (value, selectedOptions) => {
    this.setState({
      cityparam:{
        province:value[0],
        city:value[1],
        area:value[2],
        name:`${selectedOptions[0].label}${selectedOptions[1].label}${selectedOptions[2].label}`
      }
    })
  };

  validatePhone = (rule, value, callback) => {
    if (!(/^[\d+]{9,12}$/.test(value))) {
      callback(new Error('请输入正确的手机号格式'));
    }else{
      callback();
    }
  }

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

    const {data, cityData}=this.state

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
                      { required: true, validator: this.validatePhone },
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
                      fieldNames={{ label: 'text'}}
                      options={cityData}
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
