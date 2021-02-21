import React, { PureComponent } from 'react';
import { Modal, Checkbox, Form, Input, Card, Row, Col, Button, TreeSelect, Select, DatePicker, message, Cascader, Radio } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

const FormItem = Form.Item;

@connect(({ globalParameters}) => ({
    globalParameters,
}))
@Form.create()
class ReminderTimes extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
        reminderTimes:""
    };
  }


  componentWillMount() {
    const { globalParameters } = this.props;
    // 获取详情数据
    this.setState({
      detail:globalParameters.detailData
    })
  }

  onChange = (value, dateString) => {
      this.setState({
        reminderTimes:dateString
      })
  }

  onOk = (value) => {
    this.setState({
      reminderTimes:moment(value).format('YYYY-MM-DD HH:mm')
    })
    console.log('onOk: ', moment(value).format('YYYY-MM-DD HH:mm'));
  }

  handleSubmit = (e,sms_confirmation) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // 如果点击短信提醒，判断是否修改了设备品牌或者 设备序列号
        this.props.handleReminderTimeBack(this.state.reminderTimes)
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      handleReminderTimeBack,
      reminderTimeVisible
    } = this.props;

    const {
      loading,
      detail,
      reminderTimes
    } = this.state;
    console.log(reminderTimes)

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
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };
    // 123213
    // confirmTag
    return (
        <Modal
          title="提醒时间"
          visible={reminderTimeVisible}
          maskClosable={false}
          width={500}
          onCancel={()=>handleReminderTimeBack("")}
          footer={[
            <Button key="back" onClick={()=>handleReminderTimeBack("")}>
              取消
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={(e)=>this.handleSubmit(e,false)}>
              确定
            </Button>,
          ]}
        >
            <Form style={{ marginTop: 8 }}>
                <FormItem {...formAllItemLayout} label="提醒时间">
                  {getFieldDecorator('reminderTimes', {
                    rules: [
                      {
                        required: true,
                        message: '请选择提醒时间',
                      },
                    ],
                  })(
                    <DatePicker
                      showTime={{ format: 'HH:mm' }}
                      format="YYYY-MM-DD HH:mm"
                      placeholder="请选择提醒时间"
                      onChange={this.onChange}
                      onOk={this.onOk}
                    />
                  )}
                </FormItem>
            </Form>
        </Modal>
    );
  }
}

export default ReminderTimes;
