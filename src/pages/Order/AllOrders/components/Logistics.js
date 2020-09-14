import React, { PureComponent } from 'react';
import { Modal, Checkbox, Form, Input, Card, Row, Col, Button, TreeSelect, Select, DatePicker, message, Cascader, Radio } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import { tenantMode } from '../../../../defaultSettings';
import { getCookie } from '../../../../utils/support';
import {createData,getRegion} from '../../../../services/newServices/order'
import {LOGISTICSCOMPANY} from '../data.js';

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
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.deptId = getCookie("dept_id");
        values = {...values};
        // values.ouOrderNo = "12313243546546546"
        createData(values).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            
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
          title="物流"
          visible={logisticsVisible}
          width={560}
          onCancel={handleCancelLogistics}
          footer={[
            <Button key="back" onClick={handleCancelLogistics}>
              取消
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
                发货提醒
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
                签收提醒
            </Button>,
            <Button style={detail.confirmTag === 1 ? {} : {display:"none"}} key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
                物流订阅
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
                物流查询
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
              确定
            </Button>,
          ]}
        >
            <Form style={{ marginTop: 8 }}>
                <FormItem {...formAllItemLayout} label="物流公司">
                  {getFieldDecorator('logistics_company', {
                    rules: [
                      {
                        required: true,
                        message: '请选择物流公司',
                      },
                    ],
                  })(
                  <Select placeholder={"请选择物流公司"}>
                    {Object.keys(LOGISTICSCOMPANY).map(key=>{
                      return (<Option value={key}>{LOGISTICSCOMPANY[key]}</Option>)
                    })}
                  </Select>
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="物流单号">
                  {getFieldDecorator('logistics_number', {
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
                
            </Form>
        </Modal>
    );
  }
}

export default Logistics;
