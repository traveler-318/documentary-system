import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, Switch, Select, TimePicker, message, InputNumber, Modal } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { getCookie } from '../../../utils/support';

const format = 'HH:mm';
import Panel from '../../../components/Panel';

import {
  updateStatus,
  updateData
} from '../../../services/newServices/timedTasks';
const FormItem = Form.Item;
const { TextArea } = Input;

const { confirm } = Modal;

let notificationTypes = [
  {name:"定时逾期提醒",key:"定时逾期提醒"}
]

@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class OrdersAdd extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      detail:{},
    };
  }


  componentWillMount() {
    const { details } = this.props;

    this.setState({
      detail:details,
      startInterval:details.startInterval,
      timeInterval:details.timeInterval,
      repeatNumber:details.repeatNumber,
    })
  }


  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { detail } = this.state
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.deptId = detail.deptId;
        values.tenantId = detail.tenantId;
        values.id = detail.id;
        values.status = values.status ? '1' : '0';
        values.deptId = getCookie("dept_id");
        values.tenantId = getCookie("tenantId");
        values.taskId = detail.taskId;
        
        values.noticeHours = moment(values.noticeHours).format(format)

        console.log(values,"提交数据");

        updateData(values).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            this.props.handleCancelEdit("getList");
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
      handleEditVisible,
      handleCancelEdit
    } = this.props;

    const {
      loading,
      detail,
      startInterval,
      timeInterval,
      repeatNumber,
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
        visible={handleEditVisible}
        width={500}
        onCancel={handleCancelEdit}
        footer={[
          <Button key="back" onClick={handleCancelEdit}>
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
                  initialValue: detail.notificationTypes,
                })(
                  <Select 
                    style={{ width: 180 }}
                    placeholder={"请选择通知类型"}
                    disabled
                  >
                    {notificationTypes.map(item=>{
                      return (<Option value={item.name}>{item.name}</Option>)
                    })}
                  </Select>
              )}
            </FormItem>
            <FormItem {...formAllItemLayout} label="启动间隔时间">
              {getFieldDecorator('startInterval', {
                  initialValue: detail.startInterval,
                })(
                  <InputNumber min={1} onChange={(value)=>this.numberChange(value,"startInterval")} />
              )}
              &nbsp;&nbsp;签收后第{startInterval}天开始执行
            </FormItem>
            <FormItem {...formAllItemLayout} label="时间间隔">
              {getFieldDecorator('timeInterval', {
                  initialValue: detail.timeInterval,
                })(
                  <InputNumber min={1} onChange={(value)=>this.numberChange(value,"timeInterval")}/>
              )}
              &nbsp;&nbsp;每隔{timeInterval}天执行一次
            </FormItem>
            <FormItem {...formAllItemLayout} label="重复次数">
              {getFieldDecorator('repeatNumber', {
                  initialValue: detail.repeatNumber,
                })(
                  <InputNumber min={1} onChange={(value)=>this.numberChange(value,"repeatNumber")}/>
              )}
              &nbsp;&nbsp;最多执行{repeatNumber}次
            </FormItem>
            <FormItem {...formAllItemLayout} label="提醒时间">
              {getFieldDecorator('noticeHours', {
                  initialValue: moment(detail.noticeHours,format),
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
