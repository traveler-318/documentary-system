import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, Switch, Select, TimePicker, message, InputNumber, Radio } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

const format = 'HH:mm';
import Panel from '../../../components/Panel';
import { getCookie } from '../../../utils/support';
import {
  updateStatus,
  createData
} from '../../../services/newServices/timedTasks';
const FormItem = Form.Item;
const { TextArea } = Input;

let notificationTypes = [
  {name:"定时逾期提醒",key:"定时逾期提醒"}
]

@connect(({ user, loading }) => ({
  user,
  submitting: loading.effects['user/submit'],
}))
@Form.create()
class OrdersAdd extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      startInterval:1,
      timeInterval:1,
      repeatNumber:1,
      initialTimeValue:moment(`20:${Math.ceil(Math.random()*60)}`,format)
    };
  }


  componentWillMount() {
  }


  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        values.deptId = getCookie("dept_id");
        values.tenantId = getCookie("tenantId");
        values.status = '0';

        values.noticeHours = moment(values.noticeHours).format(format)

        console.log(values,"提交数据");

        createData(values).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            this.props.handleCancelAdd("getList");
          }else{
            message.error(res.msg);
          }
        })
      }
    });
  };

  numberChange = (key,value) => {
    this.setState({
      [value]:key
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      handleCancelAdd,
      handleAddVisible
    } = this.props;

    const {
      salesmanList,
      loading,
      startInterval,
      timeInterval,
      repeatNumber,
      initialTimeValue
    } = this.state;

    const formAllItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };


    return (
      <Modal
        title="新增"
        visible={handleAddVisible}
        width={500}
        onCancel={handleCancelAdd}
        footer={[
          <Button key="back" onClick={handleCancelAdd}>
            取消
          </Button>,
          <Button type="primary" loading={loading} onClick={this.handleSubmit}>
            确定
          </Button>,
        ]}
      >
        <Form style={{ marginTop: 8 }}>
          <FormItem {...formAllItemLayout} label="通知类型">
            {getFieldDecorator('notificationTypes', {
                initialValue: "定时逾期提醒",
              })(
                <Select 
                  style={{ width: 180 }}
                  placeholder={"请选择通知类型"}
                >
                  {notificationTypes.map(item=>{
                    return (<Option value={item.name}>{item.name}</Option>)
                  })}
                </Select>
            )}
          </FormItem>
          <FormItem {...formAllItemLayout} label="启动间隔时间">
            {getFieldDecorator('startInterval', {
                initialValue: 1,
              })( 
              <InputNumber min={1} onChange={(value)=>this.numberChange(value,"startInterval")} />
            )}
            &nbsp;&nbsp;签收后第{startInterval}天开始执行
          </FormItem>
          <FormItem {...formAllItemLayout} label="时间间隔">
            {getFieldDecorator('timeInterval', {
                initialValue: 1,
              })(
              <InputNumber min={1} onChange={(value)=>this.numberChange(value,"timeInterval")}/>
            )}
            &nbsp;&nbsp;每隔{timeInterval}天执行一次
          </FormItem>
          <FormItem {...formAllItemLayout} label="重复次数">
            {getFieldDecorator('repeatNumber', {
                initialValue: 1,
              })(
              <InputNumber min={1} onChange={(value)=>this.numberChange(value,"repeatNumber")}/>
            )}
            &nbsp;&nbsp;最多执行{repeatNumber}次
          </FormItem>
          <FormItem {...formAllItemLayout} label="提醒时间">
            {getFieldDecorator('noticeHours', {
                initialValue: initialTimeValue,
              })(
              <TimePicker format={format} />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default OrdersAdd;
