import React, { PureComponent } from 'react';
import { Modal, Form, Input, Row, Col, Button, message } from 'antd';
import { connect } from 'dva';

import { smsSend } from '../../../services/authorized';
import { getPhone } from '../../../services/newServices/order'
import { getCookie } from '@/utils/support';

@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class SystemAuthorizedVerification extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isSendCode:false,
      phone:'',
      timer:60,
      loading:false
    };
  }

  componentWillMount() {
    this.getPhone();
  }

  //获取电话号码
  getPhone(){
    getPhone().then(res=>{
      this.setState({
        phone:res.data
      })
    })
  }
  //   获取验证码
  getCode = () => {
    let { phone } = this.state;
    const { sendType } = this.props;
    const params = {
      deptId: getCookie("dept_id"),
      tenantId: getCookie("tenantId"),
      sendType:sendType,//开关:1  查看:2
      userPhone:phone
    }
    smsSend(params).then(res=>{
      if(res.code === 200){
        message.success(res.msg);
        this.setTimer();
        this.setState({
          isSendCode:true,
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
    e.preventDefault();
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.handleVerification(values.code);
      }
    });
  };


  render() {
    const {
      form: { getFieldDecorator },
      isVerification,
      handleCancelVerification,
    } = this.props;

    const {
      loading,
      isSendCode,
      timer,
      phone
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
          visible={isVerification}
          maskClosable={false}
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
            <Form.Item>
              {getFieldDecorator('phone', {
                initialValue: phone,
              })(<Input disabled={true}/>)}
            </Form.Item>
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

export default SystemAuthorizedVerification;
