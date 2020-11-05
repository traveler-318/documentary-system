import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, Switch, Select, TimePicker, message, InputNumber, Radio } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

const format = 'HH:mm';
import Panel from '../../../components/Panel';

import {
  updateStatus,
  createData
} from '../../../services/newServices/timedTasks';
const FormItem = Form.Item;
const { TextArea } = Input;


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
        values.status = values.status ? 1 : 0;
        console.log(values,"提交数据");

        createData(values).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            router.push('/system/timedTasks');
          }
        })
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const {
      salesmanList,
      loading,
      productList
    } = this.state;

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
      <Panel title="新增" back="/system/timedTasks" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card>
            <Row gutter={24}>
              <Col span={12}>
               
              <FormItem {...formAllItemLayout} label="定时任务">
                  {getFieldDecorator('status')(
                      <Switch />
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="启动间隔时间">
                  {getFieldDecorator('startInterval',)(
                    <InputNumber min={1} />
                  )}
                  &nbsp;&nbsp;签收后第{this.props.form.getFieldsValue("startInterval") || 0}天开始执行
                </FormItem>
                <FormItem {...formAllItemLayout} label="时间间隔">
                  {getFieldDecorator('timeInterval',)(
                    <InputNumber min={1} />
                  )}
                  每隔{this.props.form.getFieldsValue("timeInterval") || 0}天执行一次
                </FormItem>
                <FormItem {...formAllItemLayout} label="重复次数">
                  {getFieldDecorator('repeatNumber',)(
                    <InputNumber min={1} />
                  )}
                  &nbsp;&nbsp;最多执行{this.props.form.getFieldsValue("repeatNumber") || 0}次
                </FormItem>
                <FormItem {...formAllItemLayout} label="提醒时间">
                  {getFieldDecorator('noticeHours',)(
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
