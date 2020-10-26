import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, InputNumber, TreeSelect, message, Select, Icon } from 'antd';
import { connect } from 'dva';
import $ from 'jquery'
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import { ROLE_DETAIL, ROLE_INIT, ROLE_SUBMIT } from '../../../actions/role';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@connect(({ role, loading }) => ({
  role,
  submitting: loading.effects['role/submit'],
}))
@Form.create()
class RoleEdit extends PureComponent {
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

    // root.onclick = (e)=>{

    //   var _con = $(".selectDropdown");
     
      
    // }

    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    setTimeout(()=>{
      const {
        role: {
          detail,
        },
      } = this.props;
      const {roleAlias} = this.state;
      let type = false;
      for(let i=0; i<roleAlias.length; i++){
        if(roleAlias[i].code === detail.roleAlias){
          type = true
        }
      }

      if(!type){
        this.setState({
          roleAlias:[...roleAlias,{
            "name":detail.roleAlias,
            "code":detail.roleAlias,
          }]
        },()=>{
          console.log("roleAlias",this.state.roleAlias)
        })
      }
    },500)

    
    dispatch(ROLE_DETAIL(id));
    dispatch(ROLE_INIT());
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
    const parentId = form.getFieldValue('parentId');
    if (id === parentId.toString()) {
      message.warn('上级角色不能选择自身!');
      return;
    }
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          id,
          ...values,
        };
        dispatch(ROLE_SUBMIT(params));
      }
    });
  };

  onParentIdChange = (value, title) => {
    console.log(value);
    console.log(title);
  };

  handleChange = (value) => {
    setTimeout(()=>{
      console.log(this.state.openType,"handleChange关闭")
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

    console.log(openType,"openType")

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
      <Panel title="修改" back="/authority/role" action={action}>
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
                    initialValue: detail.roleName,
                  })(<Input placeholder="请输入角色名称" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="角色别名"
                className={"selectDropdown"}
                onClick={(e)=>{
                  console.log(this.state.openType,"展开")
                  e.stopPropagation();
                  this.setState({
                    openType:!this.state.openType
                  })
                }}
                >
                  {getFieldDecorator('roleAlias', {
                    initialValue: detail.roleAlias,
                    rules: [
                      {
                        required: true,
                        message: '请输入角色别名',
                      },
                    ],
                  })(
                  // <div
                  //   className={"selectDropdown"}
                  //   onClick={(e)=>{
                  //     console.log(this.state.openType,"展开")
                  //     e.stopPropagation();
                  //     this.setState({
                  //       openType:!this.state.openType
                  //     })
                  //   }}
                  //   >
                  <Select 
                    maxTagCount={1} 
                    placeholder="请选择角色别名"
                    open={openType}
                    onChange={()=>{
                      this.handleChange()
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
                    // </div>
                    )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="上级角色">
                  {getFieldDecorator('parentId', {
                    initialValue: detail.parentId,
                  })(
                    <TreeSelect
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={tree}
                      placeholder="请选择上级角色"
                      allowClear
                      showSearch
                      treeNodeFilterProp="title"
                      onChange={this.onParentIdChange}
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
                    initialValue: detail.sort,
                  })(<InputNumber placeholder="请输入角色排序" />)}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card title="其他信息" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={20}>
                <FormItem {...formAllItemLayout} label="角色备注">
                  {getFieldDecorator('remark', {
                    initialValue: detail.remark,
                  })(<TextArea rows={4} placeholder="请输入角色备注" />)}
                </FormItem>
              </Col>
            </Row>
          </Card>
        </Form>
      </Panel>
    );
  }
}

export default RoleEdit;
