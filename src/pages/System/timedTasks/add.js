import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, Switch, Select, TimePicker, message, InputNumber, Radio } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

const format = 'HH:mm';
import Panel from '../../../components/Panel';

import {
  updateStatus,
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
      salesmanList:[],
      loading:false,
      cityparam:{},
      productList:[],
      selectedOptions:[],
      payamount:null
    };
  }


  componentWillMount() {
  }


  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { cityparam, selectedOptions, payamount } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values,"提交数据")
        values.deptId = getCookie("dept_id");
        values.tenantId = getCookie("tenantId");
        values = {...values,...cityparam};
        if(values.productType && values.productType != ""){
          console.log(values.productType[2])
          console.log(values.productType[2].split("-"))
          // values.payAmount = values.productType[2].split("-")[1];
          // values.payAmount = payamount;
          values.productName = values.productType[2];
          values.productType = `${values.productType[0]}/${values.productType[1]}`;
        }
        values.userAddress = `${selectedOptions}${values.userAddress}`;
        createData(values).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            router.push('/order/allOrders');
          }
        })
      }
    });
  };

  handleStatusChange = (checked) => {
    let key = checked ? 1 : 0;
    updateStatus(key).then(res=>{
      console.log(res)
    })
  }

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
                  <Switch onChange={this.handleStatusChange} />
                </FormItem>

                <FormItem {...formAllItemLayout} label="启动间隔时间">
                  {getFieldDecorator('startInterval',)(
                    <InputNumber min={1} />
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="时间间隔">
                  {getFieldDecorator('timeInterval',)(
                    <InputNumber min={1} />
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="重复次数">
                  {getFieldDecorator('repeatNumber',)(
                    <InputNumber min={1} />
                  )}
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
