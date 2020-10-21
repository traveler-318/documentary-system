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
class SecurityVerification extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isSendCode:false,
      timer:60,
      smsType:false,
      securityVerification:false,
    };
  }

    componentWillMount() {
        
    }

    //   获取验证码
    getCode = () => {
        synSmsCertification(this.props.param).then(res=>{
            if(res.code === 200){
                message.success(res.msg);
                this.setTimer();
                this.setState({
                    isSendCode:true,
                    smsType:true,
                })
            }else{
                message.error(res.msg);
            }
        })
    }
    setTimer = () => {
        setTimeout(()=>{
            let { timer } = this.state;
            if(timer === 0){
                this.setState({
                    isSendCode:false,
                    timer:60
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
      e.preventDefault();
      const { form } = this.props;
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
            if(!smsType){
                message.error("请发送验证码");
                return false;
            }
            let param = {...this.props.param,...values}
            synbinding(param).then(res=>{
                if(res.code === 200){
                    message.success(res.msg);
                    this.props.handleCancelVerification("success");
                }else{
                    message.error(res.msg);
                }
            })
        }
      });
    };


  render() {
    const {
      form: { getFieldDecorator },
      verificationVisible,
      handleCancelVerification,
    } = this.props;

    const {
      loading,
      isSendCode,
      timer,
      securityVerification
    } = this.state;

    const formAllItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };
    return (
        <>
          <Modal
            title="安全验证"
            visible={verificationVisible}
            width={430}
            onCancel={handleCancelVerification}
            footer={[
              <Button key="back" onClick={handleCancelVerification}>
                取消
              </Button>,
              <Button key="submit" type="primary" loading={loading} onClick={(e)=>this.handleSubmit(e)}>
                确定
              </Button>,
            ]}
          >
              <Form style={{ marginTop: 8 }}>
                  <Form.Item {...formAllItemLayout} label="验证码">
                      <Row gutter={8}>
                          <Col span={16}>
                              {getFieldDecorator('code', {
                                  rules: [
                                      {
                                          len: 6,
                                          required: true,
                                          message: '请输入6位验证码',
                                    },
                                  ],
                              })(<Input placeholder="请输入验证码" />)}
                          </Col>
                          <Col span={8}>
                              <Button disabled={isSendCode} onClick={this.getCode}>获取验证码{timer!=60?`${timer}s`:""}</Button>
                          </Col>
                      </Row>
                  </Form.Item>
              </Form>
          </Modal>
        </>
    );
  }
}

export default SecurityVerification;
