import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  Card,
  Row,
  Col,
  Button,
  TreeSelect,
  DatePicker,
  Select,
  Tooltip,
  Icon,
  Modal,
  message,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import func from '../../../utils/Func';
import styles from '../../../layouts/Sword.less';
import { USER_CHANGE_INIT, USER_DETAIL, USER_UPDATE } from '../../../actions/user';
import { tenantMode } from '../../../defaultSettings';

const FormItem = Form.Item;

@connect(({ user, loading }) => ({
  user,
  submitting: loading.effects['user/submit'],
}))
@Form.create()
class UserEdit extends PureComponent {
  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(USER_DETAIL(id)).then(() => {
      const {
        user: { detail },
      } = this.props;
      dispatch(USER_CHANGE_INIT({ tenantId: detail.tenantId }));
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const {
      dispatch,
      match: {
        params: { id },
      },
      form,
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        Modal.confirm({
          title: '提醒',
          content: "如果用户所属角色为销售人员，那么系统会自动扣减一个业务员余额，并自动新增一个业务员用户，确认是否新增人员！",
          okText: '确定',
          okType: 'primary',
          cancelText: '取消',
          keyboard:false,
          onOk:() => {
            const params = {
              id,
              ...values,
              roleId: func.join(values.roleId),
              organizationId: values.organizationId.toString(),
              deptId: func.join(values.deptId),
              postId: func.join(values.postId),
              birthday: func.format(values.birthday),
            };
            dispatch(USER_UPDATE(params));
          },
          onCancel() {},
        });
      }
    });
  };

  handleChange = value => {
    const { dispatch, form } = this.props;
    form.resetFields(['roleId', 'deptId', 'postId']);
    dispatch(USER_CHANGE_INIT({ tenantId: value }));
  };

  validatePhone = (rule, value, callback) => {
    if (!(/^[\d+]{6,13}$/.test(value))) {
      callback(new Error('请输入正确的手机号格式'));
    }else{
      callback();
    }
  } 

  validateName = (rule, value, callback) => {
    if ((/[\W]/g.test(value))) {
      callback(new Error('登录账号只能输入英文'));
    }else{
      callback();
    }
  }

  reactNode = () => {
    return(
      <div>
        <p>1、售后号码：必须正确填写，否则催客户激活的短信里面的号码会异常</p>
        <p>2、销售号码：需要正确填写，否则用户会联系不到销售</p>
        <p>3、其他成员也需要正确填写后面需要用到</p>
      </div>
    )
  }

  render() {
    const {
      form: { getFieldDecorator },
      user: {
        detail,
        init: { roleTree, organizationTree, deptTree, postList, tenantList },
      },
      submitting,
    } = this.props;

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
      <Panel title="修改" back="/system/user" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={20}>
                <FormItem {...formAllItemLayout} label="登录账号">
                  {getFieldDecorator('account', {
                    rules: [
                      { required: true, validator: this.validateName },
                    ],
                    initialValue: detail.account,
                  })(<Input disabled placeholder="请输入登录账号" />)}
                </FormItem>
              </Col>
            </Row>
            {tenantMode ? (
              <Row gutter={24}>
                <Col span={20}>
                  <FormItem {...formAllItemLayout} label="所属租户">
                    {getFieldDecorator('tenantId', {
                      rules: [
                        {
                          required: true,
                          message: '请选择所属租户',
                        },
                      ],
                      initialValue: detail.tenantId,
                    })(
                      <Select
                        showSearch
                        onChange={this.handleChange}
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        allowClear
                        placeholder="请选择所属租户"
                      >
                        {tenantList.map(d => (
                          <Select.Option key={d.tenantId} value={d.tenantId}>
                            {d.tenantName}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            ) : null}
          </Card>
          <Card title="详细信息" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="用户姓名">
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: '请输入用户姓名',
                      },
                    ],
                    initialValue: detail.name,
                  })(<Input placeholder="请输入用户姓名" />)}
                </FormItem>
              </Col>
              {/* <Col span={10}>
                <FormItem {...formItemLayout} label="用户姓名">
                  {getFieldDecorator('realName', {
                    rules: [
                      {
                        required: true,
                        message: '请输入用户姓名',
                      },
                    ],
                    initialValue: detail.realName,
                  })(<Input placeholder="请输入用户姓名" />)}
                </FormItem>
              </Col> */}
              <Col span={10}>
                <FormItem {...formItemLayout} label="手机号码">
                  {getFieldDecorator('phone', {
                    rules: [
                      { required: true, validator: this.validatePhone },
                    ],
                    initialValue: detail.phone,
                  })(<Input placeholder="请输入手机号码" />)}
                  <Tooltip 
                    overlayStyle={{
                      width:"380px",
                      maxWidth:"380px",
                      position:'absolute'
                    }}
                    title={this.reactNode}
                  ><Icon 
                    type='question-circle-o'
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '-20px'
                    }} 
                  /></Tooltip>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              
              <Col span={10}>
                <FormItem {...formItemLayout} label="电子邮箱">
                  {getFieldDecorator('email', {
                    initialValue: detail.email,
                  })(<Input placeholder="请输入电子邮箱" />)}
                </FormItem>
              </Col>
            </Row>
            {/* <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="用户性别">
                  {getFieldDecorator('sex', {
                    initialValue: detail.sex,
                  })(
                    <Select placeholder="请选择用户性别">
                      <Select.Option key={1} value={1}>
                        男
                      </Select.Option>
                      <Select.Option key={2} value={2}>
                        女
                      </Select.Option>
                      <Select.Option key={3} value={3}>
                        未知
                      </Select.Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="用户生日">
                  {getFieldDecorator('birthday', {
                    initialValue: func.moment(detail.birthday),
                  })(
                    <DatePicker
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD HH:mm:ss"
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                      placeholder="请选择用户生日"
                    />
                  )}
                </FormItem>
              </Col>
            </Row> */}
          </Card>
          <Card title="职责信息" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="用户编号">
                  {getFieldDecorator('code', {
                    initialValue: detail.code,
                  })(<Input placeholder="请输入用户编号" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="所属角色">
                  {getFieldDecorator('roleId', {
                    rules: [
                      {
                        required: true,
                        message: '请选择所属角色',
                      },
                    ],
                    initialValue: func.split(detail.roleId),
                  })(
                    <TreeSelect
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={roleTree}
                      allowClear
                      showSearch
                      treeNodeFilterProp="title"
                      multiple
                      placeholder="请选择所属角色"
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="所属组织">
                  {getFieldDecorator('organizationId', {
                    rules: [
                      {
                        required: true,
                        message: '请选择所属组织',
                      },
                    ],
                    initialValue: func.split(detail.organizationId),
                  })(
                    <TreeSelect
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={organizationTree}
                      allowClear
                      showSearch
                      treeNodeFilterProp="title"
                      placeholder="请选择所属组织"
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="所属公司">
                  {getFieldDecorator('deptId', {
                    rules: [
                      {
                        required: true,
                        message: '请选择所属公司',
                      },
                    ],
                    initialValue: func.split(detail.deptId),
                  })(
                    <TreeSelect
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={deptTree}
                      allowClear
                      showSearch
                      treeNodeFilterProp="title"
                      multiple
                      placeholder="请选择所属公司"
                      disabled
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="所属岗位">
                  {getFieldDecorator('postId', {
                    rules: [
                      {
                        required: true,
                        message: '请选择所属岗位',
                      },
                    ],
                    initialValue: func.split(detail.postId),
                  })(
                    <Select
                      mode="multiple"
                      showSearch
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      allowClear
                      placeholder="请选择所属岗位"
                    >
                      {postList.map(d => (
                        <Select.Option key={d.id} value={d.id}>
                          {d.postName}
                        </Select.Option>
                      ))}
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

export default UserEdit;
