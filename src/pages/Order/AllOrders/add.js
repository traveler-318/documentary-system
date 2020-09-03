import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, TreeSelect, Select, DatePicker, message, Cascader, Radio } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Panel from '../../../components/Panel';
import FormTitle from '../../../components/FormTitle';

import styles from '../../../layouts/Sword.less';
import { USER_INIT, USER_CHANGE_INIT, USER_SUBMIT } from '../../../actions/user';
import func from '../../../utils/Func';
import { tenantMode } from '../../../defaultSettings';
import {GENDER} from './data.js'

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
      options:[
        {
          value: 'zhejiang',
          label: 'Zhejiang',
          children: [
            {
              value: 'hangzhou',
              label: 'Hangzhou',
              children: [
                {
                  value: 'xihu',
                  label: 'West Lake',
                },
              ],
            },
          ],
        },
        {
          value: 'jiangsu',
          label: 'Jiangsu',
          children: [
            {
              value: 'nanjing',
              label: 'Nanjing',
              children: [
                {
                  value: 'zhonghuamen',
                  label: 'Zhong Hua Men',
                },
              ],
            },
          ],
        },
      ],
      PRODUCTCLASSIFICATION:[
        {
          name:"123",
          id:"1"
        }
      ]
    };
  }


  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(USER_INIT());
  }

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const password = form.getFieldValue('password');
        const password2 = form.getFieldValue('password2');
        if (password !== password2) {
          message.warning('两次密码输入不一致');
        } else {
          const params = {
            ...values,
            roleId: func.join(values.roleId),
            deptId: func.join(values.deptId),
            postId: func.join(values.postId),
            birthday: func.format(values.birthday),
          };
          dispatch(USER_SUBMIT(params));
        }
      }
    });
  };

  handleChange = value => {
    const { dispatch, form } = this.props;
    form.resetFields(['roleId', 'deptId', 'postId']);
    dispatch(USER_CHANGE_INIT({ tenantId: value }));
  };

  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  }

  render() {
    const {
      form: { getFieldDecorator },
      user: {
        init: { roleTree, deptTree, postList, tenantList },
      },
      submitting,
    } = this.props;

    const {
      options,
      PRODUCTCLASSIFICATION
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
      <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
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
                  {getFieldDecorator('account', {
                    rules: [
                      {
                        required: true,
                        message: '请输入客户姓名',
                      },
                    ],
                  })(<Input placeholder="请输入客户姓名" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="手机号">
                  {getFieldDecorator('account', {
                    rules: [
                      {
                        required: true,
                        message: '请输入手机号',
                      },
                    ],
                  })(<Input placeholder="请输入手机号" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="手机号2">
                  {getFieldDecorator('account')(<Input placeholder="请输入手机号2" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="所在地区">
                  {getFieldDecorator('account')(
                    <Cascader
                      defaultValue={['zhejiang', 'hangzhou', 'xihu']}
                      options={options}
                      // onChange={onChange}
                    />
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="收货地址">
                  {getFieldDecorator('account', {
                    rules: [
                      {
                        required: true,
                        message: '请输入收货地址',
                      },
                    ],
                  })(<Input placeholder="请输入收货地址" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="性别">
                  {getFieldDecorator('gender')(
                    <Radio.Group>
                      {GENDER.map(item=>{
                        return (
                          <Radio key={item.key} value={item.key}>{item.name}</Radio>
                        )
                      })}
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="生日">
                  {getFieldDecorator('account')(
                    <DatePicker
                    disabledDate={this.disabledDate}
                    showToday={false}
                    />
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="微信号">
                  {getFieldDecorator('account')(<Input placeholder="请输入手机号2" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="邮箱">
                  {getFieldDecorator('account')(<Input placeholder="请输入手机号2" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="QQ">
                  {getFieldDecorator('account')(<Input placeholder="请输入手机号2" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormTitle
                  title="订单信息"
                />
                <FormItem {...formAllItemLayout} label="订单来源">
                  {getFieldDecorator('account', {
                    rules: [
                      {
                        required: true,
                        message: '请输入订单来源',
                      },
                    ],
                  })(<Input placeholder="请输入订单来源" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="产品分类">
                  {getFieldDecorator('account')(
                    <Select defaultValue={null} placeholder={"请选择产品分类"}>
                    {PRODUCTCLASSIFICATION.map(item=>{
                      return (<Option value={item.id}>{item.name}</Option>)
                    })}
                  </Select>
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="产品型号">
                  {getFieldDecorator('account')(<Input placeholder="请输入产品型号" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="序列号SN">
                  {getFieldDecorator('account')(<Input placeholder="请输入序列号SN" />)}
                </FormItem>

                <FormTitle
                  title="销售信息"
                />

                <FormItem {...formAllItemLayout} label="归属销售">
                  {getFieldDecorator('account')(
                    <Select defaultValue={null} placeholder={"请选择归属销售"}>
                    {PRODUCTCLASSIFICATION.map(item=>{
                      return (<Option value={item.id}>{item.name}</Option>)
                    })}
                  </Select>
                  )}
                </FormItem>

                <FormItem {...formAllItemLayout} label="归属销售">
                  {getFieldDecorator('account')(
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
