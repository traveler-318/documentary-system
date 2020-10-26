import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, InputNumber, TreeSelect, Select, Icon, message } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import func from '../../../utils/Func';
import $ from 'jquery'
// import $ from 'jquery'
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
      ],
      roleAliasValue:"",
      openType:false
    };
  }


  componentWillMount() {
    $("#root").click((e)=>{
      let _con = $(".selectDropdown")
      if(!_con.is(e.target) && _con.has(e.target).length === 0){ // Mark 1
        this.setState({
          openType:false
        })
      }
  }); 

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
        dispatch(ROLE_SUBMIT(values));
      }
    });
  };

  handleChange = (value) => {
    const { dispatch, form } = this.props;
    console.log(value,"value")
    form.setFieldsValue({ roleAlias:value})
    setTimeout(()=>{
      this.setState({
        openType:false
      })
    },200)
  }

  addItem = (e) => {
    e.stopPropagation()
    const { roleAlias, roleAliasValue } = this.state;
    var re = new RegExp("^[a-zA-Z]+$"); 
    if (!re.test(roleAliasValue)) {
      return message.error("请输入英文");
    }
    this.setState({
      roleAlias: [...roleAlias, {
        "name":roleAliasValue,
        "code":roleAliasValue,
      }],
      roleAliasValue:""
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

    const {roleAlias,roleAliasValue,openType}=this.state;

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
                <FormItem {...formItemLayout} label="角色别名"
                  
                >
                  {getFieldDecorator('roleAlias', {
                    rules: [
                      {
                        required: true,
                        message: '请选择角色别名',
                      },
                    ],
                  })(
                    <div
                    className={"selectDropdown"}
                    onClick={(e)=>{
                      e.stopPropagation();
                      this.setState({
                        openType:!this.state.openType
                      })
                    }}
                    >
                  <Select 
                    maxTagCount={1} 
                    placeholder="请选择角色别名"
                    open={openType}
                    // defaultValue={}
                    onChange={(value)=>{
                      this.handleChange(value)
                    }}
                    dropdownRender={menu => (
                    <div>
                      {menu}
                      <div
                        style={{ padding: '4px 8px', cursor: 'pointer' }}
                      >
                        <Input
                          ref={n => (this.Input = n)}
                          placeholder="请输入角色名称"
                          onClick={(e)=>{
                            e.stopPropagation()
                            this.Input.focus();
                          }}
                          value={roleAliasValue}
                          onChange={(e)=>{
                              this.setState({
                                roleAliasValue:e.target.value
                              })
                          }}
                          />
                        <div  onClick={this.addItem} style={{marginBottom:5,marginTop:5}}>
                          <Icon type="plus" />添加角色别名
                        </div>
                      </div>
                    </div>
                  )}
                   >
                    {roleAlias.map((item,index)=>{
                      return (<Option key={index} value={item.code}>{item.name}</Option>)
                    })}
                  </Select>
                    </div>
                  )}
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
