import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, Radio, Cascader, Select, DatePicker, message } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import { CITY } from '../../../utils/city';
import func from '../../../utils/Func';
import { getCookie } from '../../../utils/support';

import router from 'umi/router';
import { getSalesmangroup,getUpdate } from '../../../services/newServices/sales';

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
        {value:"免押金",key:1},
        {value:"预授权",key:2},
        {value:"伪授权",key:3},
        {value:"免费",key:4},
      ],
      groupingList:[],
      params:{
        size:10,
        current:1
      },
    };
  }

  componentWillMount() {
    const { globalParameters } = this.props;
    console.log(globalParameters)
    // 获取详情数据
    this.setState({
      data:globalParameters.detailData
    })
    this.getDataList()
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

    const {data,authorizationType,groupingList}=this.state;

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
              <Col span={10}>
                <FormItem {...formItemLayout} label="手机号：">
                  {getFieldDecorator('userPhone', {
                    initialValue: data.userPhone,
                    rules: [
                      {
                        required: true,
                        message: '手机号不能为空',
                      },
                      {
                        len: 11,
                        message: '请输入正确的手机号',
                      },
                    ],
                  })(<Input placeholder="请输入手机号" />)}
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
          </Card>
        </Form>
      </Panel>
    );
  }
}

export default SenderAdd;
