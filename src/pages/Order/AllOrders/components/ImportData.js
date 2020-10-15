import React, { PureComponent } from 'react';
import { Modal, Checkbox, Form, Input, Card, Row, Col, Button, TreeSelect, Select, DatePicker, message, Cascader, Radio } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import { tenantMode } from '../../../../defaultSettings';
import { getCookie } from '../../../../utils/support';
import { synSmsCertification, synbinding } from '../../../../services/newServices/order'


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
      isSendCode:false,
      timer:60,
      smsType:false
    };
  }

    componentWillMount() {
        
    }

    //   获取验证码
    getCode = () => {
        const { form } = this.props;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // values.deptId = getCookie("dept_id");
                // values = {...values};
                synSmsCertification(values).then(res=>{
                    if(res.code === 200){
                        message.success(res.msg);
                        this.setTimer();
                        this.setState({
                            isSendCode:true,
                            smsType:true,
                        })
                    }
                })
            }
        });
    }
    setTimer = () => {
        setTimeout(()=>{
            const { timer } = this.state;
            if(timer === 0){
                this.setState({
                    isSendCode:false
                })
            }else{
                timer = timer - 1;
                
                this.setState({
                    timer
                },()=>{
                    this.setTimer();
                })
            }
        },1000)
    }
    handleSubmit = (e) => {
        const { smsType } = this.state;
        if(!smsType){
            message.error("请先发送短信验证码");
        }
        e.preventDefault();
        const { form } = this.props;
        
        form.validateFieldsAndScroll((err, values) => {
        if (!err) {
        
            // this.setState({loading:true });
            
            // values.deptId = getCookie("dept_id");
            // values = {...values};

            synbinding(values).then(res=>{
                // this.setState({loading:false });
                if(res.code === 200){
                    message.success(res.msg);
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
      noDepositVisible,
      handleCancelNoDeposit,
    } = this.props;

    const {
      loading,
      isSendCode,
      timer
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
          title="免押宝导入数据"
          visible={noDepositVisible}
          width={560}
          onCancel={handleCancelNoDeposit}
          footer={[
            <Button key="back" onClick={handleCancelNoDeposit}>
              取消
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={(e)=>this.handleSubmit(e)}>
              确定
            </Button>,
          ]}
        >
            <Form style={{ marginTop: 8 }}>
                <FormItem {...formAllItemLayout} label="账号">
                  {getFieldDecorator('synAccount', {
                    rules: [
                      {
                        required: true,
                        message: '请输入免押宝账号',
                      },
                    ],
                  })(<Input placeholder="请输入免押宝账号" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="密码">
                  {getFieldDecorator('synPassword', {
                    rules: [
                      {
                        required: true,
                        message: '请输入免押宝密码',
                      },
                    ],
                  })(<Input placeholder="请输入免押宝密码" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="手机号">
                  {getFieldDecorator('phone', {
                    rules: [
                      {
                        required: true,
                        message: '请输入手机号',
                      },
                    ],
                  })(<Input placeholder="请输入手机号" />)}
                </FormItem>
                <FormItem {...formAllItemLayout} label="验证码">
                  {getFieldDecorator('code', {
                    rules: [
                      {
                        required: true,
                        message: '请输入验证码',
                      },
                    ],
                  })(<Input placeholder="请输入验证码" />)}
                </FormItem>
                <Form.Item label="验证码">
                    <Row gutter={8}>
                        <Col span={16}>
                            {getFieldDecorator('code', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入验证码',
                                    },
                                    {
                                        len: 6,
                                        message: '请输入6位验证码',
                                  },
                                ],
                            })(<Input placeholder="请输入验证码" />)}
                        </Col>
                        <Col span={8}>
                            <Button disabled={isSendCode} onClick={this.getCode()}>获取验证码{timer!=60?`${timer}s`:""}</Button>
                        </Col>
                    </Row>
                </Form.Item>
            </Form>
        </Modal>
    );
  }
}

export default Equipment;
