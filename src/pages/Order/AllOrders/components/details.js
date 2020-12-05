import React, { PureComponent } from 'react';
import { Modal, Checkbox, Form, Input, Card, Row, Col, Button, TreeSelect, Select, DatePicker, message, Cascader, Radio } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import { tenantMode } from '../../../../defaultSettings';
import { getCookie } from '../../../../utils/support';
import {equipment} from '../../../../services/newServices/order'
import {LOGISTICSCOMPANY} from '../data.js';

const FormItem = Form.Item;
const { TextArea } = Input;


@connect(({ globalParameters}) => ({
    globalParameters,
}))
@Form.create()
class Details extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      detail:{}
    };
  }


  componentWillMount() {
    const { globalParameters } = this.props;
    // 获取详情数据
    this.setState({
      detail:globalParameters.detailData
    })
  }

  handleSubmit = (e,sms_confirmation) => {
    e.preventDefault();
    const { form } = this.props;
    const { detail } = this.state;
    
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // 如果点击短信提醒，判断是否修改了设备品牌或者 设备序列号
        if(sms_confirmation && 
          (
            detail.productName != values.productName ||
            detail.deviceSerialNumber != values.deviceSerialNumber
          )
        ){
          return message.error('您修改了设备信息，请点击确认后重新操作');
        }
        this.setState({loading:true });
        
        values.deptId = getCookie("dept_id");
        values = {...values};
        values.outOrderNo = detail.outOrderNo
        values.id = detail.id
        values.smsConfirmation = sms_confirmation;
        values.tenantId = detail.tenantId;

        equipment(values).then(res=>{
          this.setState({loading:false });
          if(res.code === 200){
            message.success(res.msg);
            this.props.handleCancelEquipment("getlist");
          }
        })
      }
    });
  };

//   短信提醒
  handleReminder = () => {

  }

  handleChange = value => {
  };

  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  }

  render() {
    const {
      form: { getFieldDecorator },
      detailsVisible,
      handleCancelDetails,
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
          title="详情"
          visible={detailsVisible}
          maskClosable={false}
          width={560}
          onCancel={handleCancelDetails}
          footer={[
            <Button key="back" onClick={handleCancelDetails}>
              取消
            </Button>,
          ]}
        >
            <Form style={{ marginTop: 8 }}>
                <FormItem {...formAllItemLayout} label="设备品牌">
                  {getFieldDecorator('productName', {
                    initialValue: detail.productName,
                    rules: [
                      {
                        required: true,
                        message: '请输入设备品牌',
                      },
                    ],
                  })(<Input placeholder="请输入设备品牌" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="序列号">
                  {getFieldDecorator('deviceSerialNumber', {
                    initialValue: detail.deviceSerialNumber,
                    rules: [
                      {
                        required: true,
                        message: '请输入设备序列号',
                      },
                    ],
                  })(<TextArea placeholder="请输入设备序列号" />)}
                </FormItem>
            </Form>
        </Modal>
    );
  }
}

export default Details;
