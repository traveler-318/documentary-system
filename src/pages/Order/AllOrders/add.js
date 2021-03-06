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
          message.warning('???????????????????????????');
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
        ??????
      </Button>
    );

    return (
      <Panel title="??????" back="/order/AllOrders" action={action}>
        <Form style={{ marginTop: 8 }}>

          <Card title="????????????" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={12}>
                <FormTitle
                  title="????????????"
                />
                <FormItem {...formAllItemLayout} label="????????????">
                  {getFieldDecorator('account', {
                    rules: [
                      {
                        required: true,
                        message: '?????????????????????',
                      },
                    ],
                  })(<Input placeholder="?????????????????????" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="?????????">
                  {getFieldDecorator('account', {
                    rules: [
                      {
                        required: true,
                        message: '??????????????????',
                      },
                    ],
                  })(<Input placeholder="??????????????????" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="?????????2">
                  {getFieldDecorator('account')(<Input placeholder="??????????????????2" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="????????????">
                  {getFieldDecorator('account')(
                    <Cascader
                      defaultValue={['zhejiang', 'hangzhou', 'xihu']}
                      options={options}
                      // onChange={onChange}
                    />
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="????????????">
                  {getFieldDecorator('account', {
                    rules: [
                      {
                        required: true,
                        message: '?????????????????????',
                      },
                    ],
                  })(<Input placeholder="?????????????????????" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="??????">
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
                <FormItem {...formAllItemLayout} label="??????">
                  {getFieldDecorator('account')(
                    <DatePicker
                    disabledDate={this.disabledDate}
                    showToday={false}
                    />
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="?????????">
                  {getFieldDecorator('account')(<Input placeholder="??????????????????2" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="??????">
                  {getFieldDecorator('account')(<Input placeholder="??????????????????2" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="QQ">
                  {getFieldDecorator('account')(<Input placeholder="??????????????????2" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormTitle
                  title="????????????"
                />
                <FormItem {...formAllItemLayout} label="????????????">
                  {getFieldDecorator('account', {
                    rules: [
                      {
                        required: true,
                        message: '?????????????????????',
                      },
                    ],
                  })(<Input placeholder="?????????????????????" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="????????????">
                  {getFieldDecorator('account')(
                    <Select defaultValue={null} placeholder={"?????????????????????"}>
                    {PRODUCTCLASSIFICATION.map(item=>{
                      return (<Option value={item.id}>{item.name}</Option>)
                    })}
                  </Select>
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="????????????">
                  {getFieldDecorator('account')(<Input placeholder="?????????????????????" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="?????????SN">
                  {getFieldDecorator('account')(<Input placeholder="??????????????????SN" />)}
                </FormItem>

                <FormTitle
                  title="????????????"
                />

                <FormItem {...formAllItemLayout} label="????????????">
                  {getFieldDecorator('account')(
                    <Select defaultValue={null} placeholder={"?????????????????????"}>
                    {PRODUCTCLASSIFICATION.map(item=>{
                      return (<Option value={item.id}>{item.name}</Option>)
                    })}
                  </Select>
                  )}
                </FormItem>

                <FormItem {...formAllItemLayout} label="????????????">
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
