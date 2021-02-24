import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button,  Select, DatePicker, message, Cascader } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import Panel from '../../../components/Panel';
import FormTitle from '../../../components/FormTitle';
import styles from '../../../layouts/Sword.less';
import { CITY } from '../../../utils/city';
import { getCookie } from '../../../utils/support';
import { getLabelList } from '../../../services/user';
import SalesSelect from './components/salesSelect';
import {
  createData
}from '../../../services/order/customer';
import {
  CLIENTTYPE,
} from './data.js';
import func from '@/utils/Func';
import { getList as getSalesmanLists } from '../../../services/newServices/sales';

const FormItem = Form.Item;
const { TextArea } = Input;

let backUrl = "/client/customer";


@connect(({ user, loading }) => ({
  user,
  submitting: loading.effects['user/submit'],
}))
@Form.create()
class CustomerAdd extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isTaskTypeBox:false,
      clientLevels:[],//客户级别数组
      clientStatus:[],//客户等级数组
      salesmanList:[],
      loading:false,
      cityparam:{},
      selectedOptions:[]
    };
  }


  componentWillMount() {
    const type = this.props.match.params.type;
    switch (type) {
      case '1':backUrl = '/client/allcustomer';break;
      default:backUrl = '/client/mycustomer';break;
    }
    this.getSalesmanList()
    this.getLabels();
  }

  getLabels = () =>{
    //获取客户级别
    getLabelList({
      size:100,
      current:1,
      labelType:1
    }).then(res=>{
      this.setState({
        clientLevels:res.data.records
      })
    })

    //客户状态
    getLabelList({
      size:100,
      current:1,
      labelType:2
    }).then(res=>{
      this.setState({
        clientStatus:res.data.records
      })
    })
  }

  validatePhone = (rule, value, callback) => {
    if (!(/^1[3456789]\d{9}$/.test(value))) {
      callback(new Error('请输入正确的手机号格式'));
    }else{
      callback();
    }
  }

  // 获取业务员数据
  getSalesmanList = () => {
    getSalesmanLists({size:100,current:1}).then(res=>{
      this.setState({
        salesmanList:res.data.records
      })
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { cityparam, selectedOptions} = this.state;

    form.validateFieldsAndScroll((err, values) => {
      console.log(values)
      if (!err) {
        values.deptId = getCookie("dept_id");
        values.tenantId = getCookie("tenantId");
        values = {...values,...cityparam};
        values.clientAddress = `${selectedOptions}${values.clientAddress}`;
        values.nextFollowTime = func.format(values.nextFollowTime),
        console.log(values,"提交数据")
        createData(values).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            router.push(backUrl);
          }
        })
      }
    });
  };

  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  }

  onChange = (value, selectedOptions) => {

    let text = ""
    for(let i=0; i<selectedOptions.length; i++){
      text += selectedOptions[i].label
    }

    this.setState({
      cityparam:{
        province:value[0],
        city:value[1],
        area:value[2],
      },
      selectedOptions:text
    })
  };

  valinsPayChange = (rule, value, callback) => {
    var reg=/((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
    if(!reg.test(value)){
      callback('请输入正确的金额格式');
    }else{
      return callback();
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const {
      loading,clientStatus,clientLevels,salesmanList
    } = this.state;

    const formLeftItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };
    const formAllItemLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 19,
      },
    };

    const action = (
      <Button type="primary" onClick={this.handleSubmit} loading={loading}>
        提交
      </Button>
    );

    return (
      <Panel title="新增" back={`${backUrl}?type=details`} action={action}>
        <Form style={{ marginTop: 8 }}>
          <div></div>
          <Card title="创建客户" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={12}>
                <FormTitle
                  title="基础信息"
                />
                <FormItem {...formLeftItemLayout} label="姓名">
                  {getFieldDecorator('clientName', {
                    rules: [
                      {
                        required: true,
                        message: '请输入姓名',
                      },
                    ],
                  })(<Input placeholder="请输入姓名" />)}
                </FormItem>
                <FormItem {...formLeftItemLayout} label="手机号">
                  {getFieldDecorator('clientPhone', {
                    rules: [
                  { required: true, validator: this.validatePhone },
                    ],
                  })(<Input placeholder="请输入手机号" />)}
                </FormItem>
                <FormItem {...formLeftItemLayout} label="手机号2">
                  {getFieldDecorator('contactPhone')(<Input placeholder="请输入手机号2" />)}
                </FormItem>
                <FormItem {...formLeftItemLayout} label="微信号">
                  {getFieldDecorator('wechatId')(<Input placeholder="请输入微信号" />)}
                </FormItem>
                <FormItem {...formLeftItemLayout} label="所在地区：">
                  {getFieldDecorator('addrCoding')(
                    <Cascader
                      options={CITY}
                      onChange={this.onChange}
                    />
                  )}
                </FormItem>
                <FormItem {...formLeftItemLayout} label="详细地址">
                  {getFieldDecorator('clientAddress')(<Input placeholder="请输入详细地址" />)}
                </FormItem>

              </Col>
              <Col span={12}>
                <FormTitle
                  title="客户信息"
                />
                <FormItem {...formAllItemLayout} label="客户来源">
                  {getFieldDecorator('clientType',{
                    rules: [
                      { required: true, message: '请选择客户来源' },
                    ],
                  })(
                    <Select>
                      {CLIENTTYPE.map(d => (
                        <Select.Option key={d.key} value={d.key}>
                          {d.val}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="客户级别">
                  {getFieldDecorator('clientLevel')(
                    <Select>
                      {clientLevels.map(d => (
                        <Select.Option key={d.id} value={d.id}>
                          {d.labelName}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="客户状态">
                  {getFieldDecorator('clientStatus')(
                    <Select>
                      {clientStatus.map(d => (
                        <Select.Option key={d.id} value={d.id}>
                          {d.labelName}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="归属销售">
                  {getFieldDecorator('salesman',{
                    rules: [
                      { required: true, message: '请选择归属销售' },
                    ],
                  })(
                    <Select placeholder={"请选择销售"}>
                      {salesmanList.map(item=>{
                        return (<Select.Option value={item.userAccount}>{item.userName}</Select.Option>)
                      })}
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="下次跟进时间">
                  {getFieldDecorator('nextFollowTime')(<DatePicker
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD HH:mm:ss"
                  />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="备注">
                  {getFieldDecorator('note')(<TextArea rows={4} placeholder="请输入备注" />)}
                </FormItem>
              </Col>
            </Row>
          </Card>

        </Form>
      </Panel>
    );
  }
}

export default CustomerAdd;
