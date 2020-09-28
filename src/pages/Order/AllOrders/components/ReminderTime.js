import React, { PureComponent } from 'react';
import { Modal, Checkbox, Form, Input, Card, Row, Col, Button, TreeSelect, Select, DatePicker, message, Cascader, Radio } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

@connect(({ globalParameters}) => ({
    globalParameters,
}))
@Form.create()
class ReminderTime extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
        reminderTime:""
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
        reminderTime:value
      })
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  }
  
  onOk = (value) => {
    this.setState({
        reminderTime:value
      })
    console.log('onOk: ', value);
  }

  handleSubmit = (e,sms_confirmation) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // 如果点击短信提醒，判断是否修改了设备品牌或者 设备序列号
        this.props.handleReminderTimeBack(this.state.reminderTime)
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      handleReminderTimeBack,
    } = this.props;

    const {
      loading,
      detail
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
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };
    // confirmTag
    return (
        <Modal
          title="设备序列号"
          visible={equipmeentVisible}
          width={560}
          onCancel={handleReminderTimeBack("")}
          footer={[
            <Button key="back" onClick={handleReminderTimeBack("")}>
              取消
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={(e)=>this.handleSubmit(e,false)}>
              确定
            </Button>,
          ]}
        >
            <Form style={{ marginTop: 8 }}>
                <FormItem {...formAllItemLayout} label="提醒时间">
                  {getFieldDecorator('reminderTime', {
                    initialValue: reminderTime,
                    rules: [
                      {
                        required: true,
                        message: '请选择提醒时间',
                      },
                    ],
                  })(
                    <DatePicker showTime placeholder="Select Time" onChange={onChange} onOk={onOk} />
                  )}
                </FormItem>
                
            </Form>
        </Modal>
    );
  }
}

export default ReminderTime;
