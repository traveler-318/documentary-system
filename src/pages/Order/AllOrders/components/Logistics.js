import React, { PureComponent } from 'react';
import { Modal, Checkbox, Form, Input, Card, Row, Col, Button, TreeSelect, Select, DatePicker, message, Cascader, Radio, Timeline } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import { tenantMode } from '../../../../defaultSettings';
import { getCookie } from '../../../../utils/support';
import { updateLogistics, logisticsRemind } from '../../../../services/newServices/order'
import { getLogisticsQuery } from '../data.js';

const FormItem = Form.Item;
const { TextArea } = Input;


@connect(({ globalParameters}) => ({
    globalParameters,
}))
@Form.create()
class Logistics extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      detail:{},
      logisticsList:[],
    };
  }


  componentWillMount() {
    const { globalParameters } = this.props;

    // 获取详情数据
    this.setState({
      detail:globalParameters.detailData
    })
  }

  // 签收提醒
  handlelogisticsRemind = (e) => {
    e.preventDefault();
    const { form, handleCancelLogistics } = this.props;
    const { detail } = this.state;
    
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({loading:true });
        values.deptId = getCookie("dept_id");
        values = {...values};
        values.outOrderNo = detail.outOrderNo
        values.id = detail.id
        values.smsConfirmation = true;
        values.userPhone = detail.userPhone;
        values.tenantId = detail.tenantId;
        logisticsRemind(values).then(res=>{
          this.setState({loading:false });
          if(res.code === 200){
            message.success(res.msg);
            handleCancelLogistics("getlist");
          }
        })
      }
    });
  }
  // 发货提醒 和 确定
  handleSubmit = (e,sms_confirmation) => {
    e.preventDefault();
    const { form, handleCancelLogistics } = this.props;
    const { detail } = this.state;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({loading:true });
        values.deptId = getCookie("dept_id");
        values = {...values};
        values.outOrderNo = detail.outOrderNo
        values.id = detail.id
        values.smsConfirmation = sms_confirmation;
        if(sms_confirmation){
          values.userPhone = detail.userPhone
        }
        updateLogistics(values).then(res=>{
          this.setState({loading:false });
          if(res.code === 200){
            message.success(res.msg);
            handleCancelLogistics("getlist");
          }
        })
      }
    });
  };

  handleChange = value => {
  };

  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  }

  render() {
    const {
      form: { getFieldDecorator },
      logisticsVisible,
      handleCancelLogistics,
    } = this.props;

    const {
      loading,
      detail,
      logisticsList
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
          title="物流"
          visible={logisticsVisible}
          width={560}
          onCancel={handleCancelLogistics}
          footer={[
            <Button key="back" onClick={handleCancelLogistics}>
              取消
            </Button>,
            <Button style={detail.confirmTag === 1 ? {} : {display:"none"}} type="primary" loading={loading} onClick={this.handleSubmit}>
                物流订阅
            </Button>,
            <Button type="primary" loading={loading} onClick={this.handleSubmit}>
                物流查询
            </Button>,

            <Button type="primary" loading={loading} onClick={this.handlelogisticsRemind}>
                签收提醒
            </Button>,
            <Button type="primary" loading={loading} onClick={(e)=>this.handleSubmit(e,true)}>
                发货提醒
            </Button>,
            <Button type="primary" loading={loading} onClick={(e)=>this.handleSubmit(e,false)}>
              确定
            </Button>,
          ]}
        >
            <Form style={{ marginTop: 8 }}>
                <FormItem {...formAllItemLayout} label="物流公司">
                  {getFieldDecorator('logisticsCompany', {
                    initialValue: detail.logisticsCompany,
                    rules: [
                      {
                        required: true,
                        message: '请选择物流公司',
                      },
                    ],
                  })(
                  <Select placeholder={"请选择物流公司"}>
                    {Object.keys(LOGISTICSCOMPANY).map(key=>{
                      return (<Option value={LOGISTICSCOMPANY[key]}>{LOGISTICSCOMPANY[key]}</Option>)
                    })}
                  </Select>
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="物流单号">
                  {getFieldDecorator('logisticsNumber', {
                    initialValue: detail.logisticsNumber,
                    rules: [
                      {
                        required: true,
                        message: '请输入物流单号',
                      },
                    ],
                  })(<Input placeholder="请输入物流单号" />)}
                </FormItem>
                {detail.confirmTag === 1 ? (
                    <FormItem {...formAllItemLayout} label="发货提醒">
                        <Checkbox></Checkbox> （此开关仅在物流订阅时生效）
                    </FormItem>
                ) :""}
                {detail.confirmTag === 1 ? (
                    <div style={{color:"red",paddingLeft:"20px"}}>如您需要此订单进入自动化流程，请点击物流订阅</div>
                ) :""}
                <div style={{marginLeft:10}}>
                  <Timeline>
                    <Timeline.Item>
                      <p>2020-09-15 12:10:10</p>
                      <p>Create a services site 2015-09-01</p>
                    </Timeline.Item>
                    <Timeline.Item>
                      <p>2020-09-15 12:10:10</p>
                      <p>Create a services site 2015-09-01</p>
                    </Timeline.Item>
                    <Timeline.Item>
                      <p>2020-09-15 12:10:10</p>
                      <p>Create a services site 2015-09-01</p>
                    </Timeline.Item>
                    <Timeline.Item>
                      <p>2020-09-15 12:10:10</p>
                      <p>Create a services site 2015-09-01</p>
                    </Timeline.Item>
                  </Timeline>
                </div>
            </Form>
        </Modal>
    );
  }
}

export default Logistics;
