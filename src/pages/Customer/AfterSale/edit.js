import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, Radio, Cascader, Select, DatePicker, message } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import { CITY } from '../../../utils/city';
import func from '../../../utils/Func';
import { getCookie } from '../../../utils/support';

import { updateData, createData } from '../../../services/newServices/afterSale';
import { getList as getSalesmanLists } from '../../../services/newServices/sales';
import router from 'umi/router';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class AfterSaleAdd extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      salesmanList:[],
    };
  }

  componentWillMount() {
    this.getDataList()
  }

//   获取业务员列表
  getDataList = () => {
    getSalesmanLists({size:100,current:1}).then(res=>{
        this.setState({
          salesmanList:res.data.records
        })
    })
  }

  // ============ 提交 ===============

  handleSubmit = e => {
    e.preventDefault();
    const {  form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      values.deptId = getCookie("dept_id");
      if (!err) {
        const params = {
          ...values,
        };
        console.log(values,"values")
        createData(params).then(res=>{
            if(res.code === 200){
                message.success(res.msg);
                router.push('/AfterSale/sales');
            }
        })
      }
    });
  };

  validatePhone = (rule, value, callback) => {
    if (!(/^1[3456789]\d{9}$/.test(value))) {
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

    const {data,authorizationType,salesmanList}=this.state;

    const action = (
      <Button type="primary" onClick={this.handleSubmit}>
        提交
      </Button>
    );

    return (
      <Panel title="添加售后" back="/AfterSale/sales" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="售后姓名：">
                  {getFieldDecorator('userName', {
                    rules: [
                      {
                        required: true,
                        message: '请输入售后姓名',
                      },
                    ],
                  })(<Input placeholder="请输入售后姓名" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="手机号：">
                  {getFieldDecorator('userPhone', {
                    rules: [
                      { required: true, validator: this.validatePhone },
                    ],
                  })(<Input placeholder="请输入手机号" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="销售：">
                  {getFieldDecorator('salesman', {
                    rules: [
                      {
                        required: true,
                        message: '请选择销售',
                      },
                    ],
                  })(
                    <Select 
                        placeholder="请选择销售"
                        mode="multiple"
                        showSearch
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        allowClear
                    >
                      {salesmanList.map((item)=>{
                        return (<Option value={item.id}>{item.groupName}</Option>)
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

export default AfterSaleAdd;
