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
import {
  createData
}from '../../../services/order/customer';
import {
  CLIENTLEVEL,
  CLIENTTYPE,
} from './data.js';
import func from '@/utils/Func';

const FormItem = Form.Item;

const backUrl = "/customer/customer";

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

      loading:false,
      cityparam:{},
      selectedOptions:[]
    };
  }


  componentWillMount() {
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

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { cityparam, selectedOptions} = this.state;

    form.validateFieldsAndScroll((err, values) => {
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
      loading,clientStatus,clientLevels
    } = this.state;

    const formAllItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
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
            <FormTitle
              title="基础信息"
            />
            <Row gutter={24}>
              <Col span={12}>
                <FormItem {...formAllItemLayout} label="姓名">
                  {getFieldDecorator('clientName', {
                    rules: [
                      {
                        required: true,
                        message: '请输入姓名',
                      },
                    ],
                  })(<Input placeholder="请输入姓名" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="手机号">
                  {getFieldDecorator('clientPhone', {
                    rules: [
                      { required: true, validator: this.validatePhone },
                    ],
                  })(<Input placeholder="请输入手机号" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="下次跟进时间">
                  {getFieldDecorator('nextFollowTime', {
                    rules: [
                      { required: true, message: '请输入下次跟进时间' },
                    ],
                  })(<DatePicker
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD HH:mm:ss"
                  />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="省/市/区：">
                  {getFieldDecorator('addrCoding', {
                    rules: [
                      {
                        required: true,
                        message: '寄件人所在地区',
                      },
                    ],
                  })(
                    <Cascader
                      options={CITY}
                      onChange={this.onChange}
                    />
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="地址">
                  {getFieldDecorator('clientAddress', {
                    rules: [
                      { required: true, message: '请输入地址' },
                    ],
                  })(<Input placeholder="请输入地址" />)}
                </FormItem>

              </Col>
              <Col span={12}>
                <FormItem {...formAllItemLayout} label="客户级别">
                  {getFieldDecorator('clientLevel', {
                    rules: [
                      { required: true, message: '请选择级别' },
                    ],
                  })(
                    <Select>
                      {clientLevels.map(d => (
                        <Select.Option key={d.id} value={d.id}>
                          {d.labelName}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
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
                <FormItem {...formAllItemLayout} label="客户状态">
                  {getFieldDecorator('clientStatus',{
                    rules: [
                      { required: true, message: '请选择客户状态' },
                    ],
                  })(
                    <Select>
                      {clientStatus.map(d => (
                        <Select.Option key={d.id} value={d.id}>
                          {d.labelName}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>

                <FormItem {...formAllItemLayout} label="备注">
                  {getFieldDecorator('note')(<Input placeholder="请输入备注" />)}
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
