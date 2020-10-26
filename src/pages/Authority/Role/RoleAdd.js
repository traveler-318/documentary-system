import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, InputNumber, TreeSelect, Select } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import func from '../../../utils/Func';
import { ROLE_INIT, ROLE_SUBMIT, ROLE_DETAIL, ROLE_CLEAR_DETAIL } from '../../../actions/role';
import { PAYMENTMETHOD } from '../../Logistics/Additional/data';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@connect(({ role, loading }) => ({
  role,
  submitting: loading.effects['role/submit'],
}))
@Form.create()
class RoleAdd extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      roleAlias:[
        // {
        //   'name':"分公司管理员",
        //   'code':"branchadmin"
        // },
        {
          'name':"销售角色",
          'code':"salesrole"
        },
        {
          'name':"仓库角色",
          'code':"warehouseroles"
        },
        {
          'name':"售后角色",
          'code':"afterteam"
        },
      ]
    };
  }


  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    if (func.notEmpty(id)) {
      dispatch(ROLE_DETAIL(id));
    } else {
      dispatch(ROLE_CLEAR_DETAIL());
    }
    dispatch(ROLE_INIT());
  }

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      console.log(values)
      if (!err) {
        // dispatch(ROLE_SUBMIT(values));
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      role: {
        detail,
        init: { tree },
      },
      submitting,
    } = this.props;

    const {roleAlias}=this.state;

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
      <Panel title="新增" back="/authority/role" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="角色名称">
                  {getFieldDecorator('roleName', {
                    rules: [
                      {
                        required: true,
                        message: '请输入角色名称',
                      },
                    ],
                  })(<Input placeholder="请输入角色名称" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="角色别名">
                  {getFieldDecorator('roleAlias', {
                    rules: [
                      {
                        required: true,
                        message: '请选择角色别名',
                      },
                    ],
                  })(<Select placeholder="请选择角色别名">
                    {roleAlias.map((item,index)=>{
                      return (<Option key={index} value={item.code}>{item.name}</Option>)
                    })}
                  </Select>)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="上级角色">
                  {getFieldDecorator('parentId', {
                    initialValue: detail.id,
                  })(
                    <TreeSelect
                      disabled={func.notEmpty(detail.id)}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={tree}
                      allowClear
                      showSearch
                      treeNodeFilterProp="title"
                      placeholder="请选择上级角色"
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} className={styles.inputItem} label="角色排序">
                  {getFieldDecorator('sort', {
                    rules: [
                      {
                        required: true,
                        message: '请输入角色排序',
                      },
                    ],
                    initialValue: detail.nextSort,
                  })(<InputNumber placeholder="请输入角色排序" />)}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card title="其他信息" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={20}>
                <FormItem {...formAllItemLayout} label="角色备注">
                  {getFieldDecorator('remark')(<TextArea rows={4} placeholder="请输入角色备注" />)}
                </FormItem>
              </Col>
            </Row>
          </Card>
        </Form>
      </Panel>
    );
  }
}

export default RoleAdd;
