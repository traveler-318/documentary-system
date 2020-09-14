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
class Equipment extends PureComponent {

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

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { detail } = this.state;
    
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.deptId = getCookie("dept_id");
        values = {...values};
        values.outOrderNo = detail.outOrderNo
        values.id = detail.id
        values.sms_confirmation = false;

        equipment(values).then(res=>{
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
      equipmeentVisible,
      handleCancelEquipment,
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
          onCancel={handleCancelEquipment}
          footer={[
            <Button key="back" onClick={handleCancelEquipment}>
              取消
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.handleReminder}>
            短信提醒
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
              确定
            </Button>,
          ]}
        >
            <Form style={{ marginTop: 8 }}>
                <FormItem {...formAllItemLayout} label="设备品牌">
                  {getFieldDecorator('productModel', {
                    rules: [
                      {
                        required: true,
                        message: '请输入设备品牌',
                      },
                    ],
                  })(<Input placeholder="请输入设备品牌" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="设备序列号">
                  {getFieldDecorator('deviceSerialNumber', {
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

export default Equipment;
