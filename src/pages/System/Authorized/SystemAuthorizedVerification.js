import React, { PureComponent } from 'react';
import { Modal, Form, Input, Row, Col, Button, message,Icon } from 'antd';
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
      phone:'',
      verificationCode:'',
      smsType:true,
      retransmission:false,
      timer:0,
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
          smsType:false,
          retransmission: true,
          timer:60
        })
      }else{
        message.error(res.msg);
      }
    })
  }
  setTimer(){
    setTimeout(()=>{
      const {timer,retransmission}= this.state
      if(timer === 0){
        this.setState({
          retransmission: false,
        })
      }else{
        this.setState({
          timer: this.state.timer - 1,
        })
        this.setTimer();
      }
    },1000)
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {smsType,verificationCode,phone}=this.state;
    if(smsType){
      message.error('需要短信验证，请先获取短信验证码！');
      return false;
    }
    if(verificationCode.length < 6){
      message.error('验证码不能小于6位数');
      return false;
    }
    if(verificationCode.length > 6){
      message.error('验证码不能大于6位数');
      return false;
    }

    this.props.handleVerification({code:verificationCode,phone:phone});
  };

  codeChange =(e) =>{
    this.setState({
      verificationCode:e.target.value
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      isVerification,
      handleCancelVerification,
    } = this.props;

    const {
      loading,
      verificationCode,
      retransmission,
      timer,
      phone
    } = this.state;

    return (
      <>
        <Modal
          title="安全验证"
          visible={isVerification}
          maskClosable={false}
          width={360}
          onCancel={handleCancelVerification}
          footer={[
            <Button key="back" onClick={handleCancelVerification}>
              取消
            </Button>,
            <Button type="primary" loading={loading} onClick={(e)=>this.handleSubmit(e)}>
              确定
            </Button>,
          ]}
        >
          <Input style={{marginBottom:20}}
                 value={phone}
                 disabled
                 prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)'}} />}
          />
          <Input style={{width:'160px',marginRight:10}}
                 placeholder='验证码'
                 value={verificationCode}
                 onChange={(e)=>this.codeChange(e)}
                 prefix={<Icon type="safety-certificate" style={{ color: 'rgba(0,0,0,.25)' }} />}
          />
          <Button style={{float:'right'}} disabled={retransmission} onClick={()=>this.getCode()}>获取验证码
            {
              timer !== 0 ?
                (<span>({timer}s)</span>)
                :""
            }</Button>
        </Modal>
      </>
    );
  }
}

export default SystemAuthorizedVerification;
