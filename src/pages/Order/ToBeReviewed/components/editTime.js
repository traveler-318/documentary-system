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
class EditTime extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      editTime:""
    };
  }


  componentWillMount() {
    const { editReminderTimes } = this.props;
    console.log(editReminderTimes,"editReminderTimes")
    // 获取详情数据
    this.setState({
      editTime:editReminderTimes
    })
  }

  onChange = (value, dateString) => {
      this.setState({
        editTime:dateString
      })
  }
  
  onOk = (value) => {
    this.setState({
      editTime:moment(value).format('YYYY-MM-DD HH:mm:ss')
    })
  }

  handleSubmit = (e,sms_confirmation) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // 如果点击短信提醒，判断是否修改了设备品牌或者 设备序列号
        this.props.handleEditTimeBack(this.state.editTime)
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      handleEditTimeBack,
      editTimeVisible,
    } = this.props;

    const {
      loading,
      detail,
      editTime
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
    console.log(moment(editTime).valueOf(),"editTime")
    let time = moment(editTime).valueOf()
    return (
        <Modal
          title="提醒时间"
          visible={editTimeVisible}
          width={500}
          onCancel={()=>handleEditTimeBack("")}
          footer={[
            <Button key="back" onClick={()=>handleEditTimeBack("")}>
              取消
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={(e)=>this.handleSubmit(e,false)}>
              确定
            </Button>,
          ]}
        >
            <Form style={{ marginTop: 8 }}>
                <FormItem {...formAllItemLayout} label="提醒时间">
                  {getFieldDecorator('editTime', {
                    initialValue: moment(editTime),
                    rules: [
                      {
                        required: true,
                        message: '请选择提醒时间',
                      },
                    ],
                  })(
                    <DatePicker 
                      showTime 
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

export default EditTime;
