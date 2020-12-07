import React, { PureComponent } from 'react';
import {
  Modal,
  Checkbox,
  Form,
  Input,
  Button,
  message,
  Radio,
  Table, Select, Tooltip, Icon,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { getCookie } from '../../../../utils/support';


const { Option } = Select;
const FormItem = Form.Item;
@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class SMSrecord extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:{
        
      },
    
    };
  }

  componentWillMount() {
    
  }


  render() {

    const {
      form: { getFieldDecorator },
      handleEditVisible,
      handleCancelEdit,
      details
    } = this.props;

    const {
      data,
    } = this.state;

    const formAllItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    console.log(details)

    return (
      <div>
        <Modal
          title="详情"
          maskClosable={false}
          visible={handleEditVisible}
          width={600}
          onCancel={handleCancelEdit}
          footer={[
            <Button key="back" onClick={handleCancelEdit}>
              取消
            </Button>,
          ]}
        >
          <div>
            <Form style={{ marginTop: 8 }}>
              <FormItem {...formAllItemLayout} label="反馈状态码">
                {getFieldDecorator('errCode', {
                  initialValue: details.errCode,
                })(<Input placeholder=""/>)}
              </FormItem>
              <FormItem {...formAllItemLayout} label="反馈发送结果">
                {getFieldDecorator('errMsg', {
                  initialValue: details.errMsg,
                })(<Input placeholder=""/>)}
              </FormItem>
              <FormItem {...formAllItemLayout} label="用户手机号">
                {getFieldDecorator('phoneNumber', {
                  initialValue: details.phoneNumber,
                })(<Input placeholder=""/>)}
              </FormItem>
              <FormItem {...formAllItemLayout} label="发送时间">
                {getFieldDecorator('sendTime', {
                  initialValue: details.sendTime,
                })(<Input placeholder=""/>)}
              </FormItem>
              <FormItem {...formAllItemLayout} label="发送类型">
                {getFieldDecorator('smsCategory', {
                  initialValue: details.smsCategory,
                })(<Input placeholder=""/>)}
              </FormItem>
              <FormItem {...formAllItemLayout} label="发送图片验证码">
                {getFieldDecorator('submitCode', {
                  initialValue: details.submitCode,
                })(<Input placeholder=""/>)}
              </FormItem>
              <FormItem {...formAllItemLayout} label="发送状态">
                {getFieldDecorator('success', {
                  initialValue: details.success,
                })(<Input placeholder=""/>)}
              </FormItem>
            </Form>
          </div>

        </Modal>
      </div>
    );
  }
}

export default SMSrecord;
