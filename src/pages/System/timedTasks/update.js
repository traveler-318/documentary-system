import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, Switch, Select, TimePicker, message, InputNumber, Modal } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

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
      switchLoading:false
    };
  }


  componentWillMount() {
    const { globalParameters } = this.props;

    console.log(globalParameters.detailData,"data");

    this.setState({
      detail:globalParameters.detailData,
      startInterval:globalParameters.detailData.startInterval,
      timeInterval:globalParameters.detailData.timeInterval,
      repeatNumber:globalParameters.detailData.repeatNumber,
      // switchChecked:globalParameters.detailData.status === 1 ? true : false
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

        values.noticeHours = moment(values.noticeHours).format(format)

        console.log(values,"提交数据");

        updateData(values).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            router.push('/system/timedTasks');
          }else{
            message.error(res.msg);
          }
        })
      }
    });
  };

  handleStatusChange = (checked) => {
    const onOkSwitch = this.onOkSwitch
    confirm({
      title: '提示',
      content: '是否要修改该状态?',
      okText: "确定",
      cancelText: "取消",
      onOk() {
        onOkSwitch(checked);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  onOkSwitch = (checked) => {
    this.setState({
      switchLoading:true
    })
    let key = checked ? '1' : '0';
    let param = {};
    param['status'] = key;
    param.taskId = this.state.detail.taskId
    updateStatus(param,this.state.detail.id).then(res=>{
      if(res.code === 200){
        message.success(res.msg);
        this.setState({
          switchChecked:checked,
          switchLoading:false
        })
      }else{
        message.error(res.msg);
        this.setState({
          switchChecked:!checked,
          switchLoading:false
        })
      }
    })
  }

  numberChange = (key,value) => {
    this.setState({
      [value]:key
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const {
      loading,
      detail,
      startInterval,
      timeInterval,
      repeatNumber,
      switchChecked,
      switchLoading
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

    console.log(this.props.form.getFieldsValue(),"switchChecked")

    return (
      <Panel title="修改" back="/system/timedTasks" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card>
            <Row gutter={24}>
              <Col span={12}>
               
                <FormItem {...formAllItemLayout} label="定时任务">
                  {getFieldDecorator('status', {
                      initialValue: detail.status === '1' ? true : false,
                    })(
                      <Switch checked={switchChecked} loading={switchLoading} onChange={this.handleStatusChange} />
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="通知类型">
                  {getFieldDecorator('notificationTypes', {
                      initialValue: detail.notificationTypes,
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
              </Col>
            </Row>
          </Card>
        </Form>
      </Panel>
    );
  }
}

export default OrdersAdd;
