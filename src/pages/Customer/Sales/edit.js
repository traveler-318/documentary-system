import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, Radio, Cascader, Select, DatePicker, message, Tooltip, Icon } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import { CITY } from '../../../utils/city';
import func from '../../../utils/Func';
import { getCookie } from '../../../utils/support';

import router from 'umi/router';
import { getSalesmangroup,getUpdate,getAfterlists } from '../../../services/newServices/sales';

const FormItem = Form.Item;
const { Option } = Select;
@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class SenderAdd extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:{

      },
      authorizationType:[
        // {value:"免押金",key:1},
        // {value:"预授权",key:2},
        {value:"伪授权",key:1},
        {value:"免费",key:2},
      ],
      groupingList:[],
      params:{
        size:100,
        current:1
      },
      afterlist:[]
    };
  }

  componentWillMount() {
    const { globalParameters } = this.props;
    console.log(globalParameters)
    // 获取详情数据
    this.setState({
      data:globalParameters.detailData
    })
    this.getDataList();

    this.getAfterlist();
  }

  getAfterlist = () => {
    getAfterlists().then(res=>{
      this.setState({
        afterlist:res.data
      })
    })
  }

  getDataList = () => {
    const {params} = this.state;
    getSalesmangroup(params).then(res=>{
      this.setState({
        groupingList:res.data.records
      })
    })
  }

  // ============ 提交 ===============

  handleSubmit = e => {
    e.preventDefault();
    const {  form } = this.props;
    const {  data } = this.state;

    form.validateFieldsAndScroll((err, values) => {
      values.deptId = getCookie("dept_id");
      values.id = data.id;
      if (!err) {
        const params = {
          ...values,
        };
        getUpdate(params).then(res=>{
          message.success('提交成功');
          router.push('/customer/sales');
        })
      }
    });
  };


  valinsUserChange = (rule, value, callback) => {
    var rep = /[\W]/g;
    var reg=/^\d{1,}$/;
    if(value === "" || value === null){
      return callback(new Error('登录账号不能为空'));
    }else if(reg.test(value)){
      return callback(new Error('登录账号请输入英文和数字'));
    }else if(rep.test(value)){
      return callback(new Error('登录账号只能输入英文和数字'));
    } else {
      return callback();
    }
  }

  validatePhone = (rule, value, callback) => {
    if (!(/^1[3456789]\d{9}$/.test(value))) {
      callback(new Error('请输入正确的手机号格式'));
    }else{
      callback();
    }
  }

  reactNode = () => {
    return(
      <div>
        <p>1、复制本登录账号</p>
        <p>2、粘贴到到，系统管理—新增用户—登录账号里面</p>
        <p>3、角色配置成销售角色注意：</p>
        <p>本登录账号必须要与用户管理里面的登录账号信息一致，否则会导致销售无法登录到自己后台</p>
      </div>
    )
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

    const {data,authorizationType,groupingList,afterlist}=this.state;

    console.log(groupingList)
    console.log(data)
    const action = (
      <Button type="primary" onClick={this.handleSubmit}>
        提交
      </Button>
    );

    return (
      <Panel title="编辑用户" back="/customer/sales" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="登录账号：">
                  {getFieldDecorator('userAccount', {
                    initialValue: data.userAccount,
                    rules: [
                      {
                        required: true,
                        validator:this.valinsUserChange
                      },
                    ],
                  })(<Input disabled placeholder="请输入登录账号" />)}
                  <Tooltip title={this.reactNode}
                    overlayStyle={{
                      width:"300px",
                      maxWidth:"300px"
                    }}
                  ><Icon
                    style={{
                      position: 'absolute',
                      right: '-24px',
                      top: '2px',
                      zIndex:1000
                    }}
                  type='question-circle-o' /></Tooltip>
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="姓名：">
                  {getFieldDecorator('userName', {
                    initialValue: data.userName,
                    rules: [
                      {
                        required: true,
                        message: '姓名不能为空',
                      },
                    ],
                  })(<Input placeholder="请输入姓名" />)}
                </FormItem>
              </Col>

            </Row>
            <Row gutter={24}>
            <Col span={10}>
                <FormItem {...formItemLayout} label="手机号：">
                  {getFieldDecorator('userPhone', {
                    initialValue: data.userPhone,
                    rules: [
                      { required: true, validator: this.validatePhone },
                    ],
                  })(<Input placeholder="请输入手机号" />)}
                </FormItem>
              </Col>

              <Col span={10}>
                <FormItem {...formItemLayout} label="分组：">
                  {getFieldDecorator('groupId', {
                    initialValue: data.groupId,
                    rules: [
                      {
                        required: true,
                        message: '请选择分组',
                      },
                    ],
                  })(
                    <Select placeholder="请选择分组">
                      {groupingList.map((item)=>{
                        return (<Option key={item.id} value={item.id}>{item.groupName}</Option>)
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
            <Col span={10}>
                <FormItem {...formItemLayout} label="授权类型：">
                  {getFieldDecorator('authorizationType', {
                    initialValue: data.authorizationType,
                    rules: [
                      {
                        required: true,
                        message: '请选择授权类型',
                      },
                    ],
                  })(
                    <Select placeholder="请选择授权类型">
                      {authorizationType.map((item)=>{
                        return (<Option key={item.key} value={item.key}>{item.value}</Option>)
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="专属售后：">
                  {getFieldDecorator('afterId', {
                    initialValue: data.afterId,
                    rules: [
                      {
                        required: true,
                        message: '请选择专属售后',
                      },
                    ],
                  })(
                    <Select placeholder="请选择专属售后">
                      {afterlist.map((item)=>{
                        return (<Option value={item.id}>{item.name}</Option>)
                      })}
                    </Select>
                  )}
                  <Tooltip title={'催激活短信里面的号码，就是专属售后的电话号码'}>
                    <Icon 
                      type='question-circle-o'
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '-20px'
                      }} 
                    />
                  </Tooltip>
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
