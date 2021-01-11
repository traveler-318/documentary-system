import React, { PureComponent } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Tag, message,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import QRCode  from 'qrcode.react';

import { topUpState } from '../../../../services/newServices/recharge';

const FormItem = Form.Item;
const { TextArea } = Input;

let timer = null;
let type = null;

let currentTimes = 0;
let total = 10;

@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class Logistics extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:{},
      countDown:10,
      polling:3,

    };
  }

  componentWillMount() {
    const {bindingQRCode} = this.props;
    console.log(bindingQRCode)
    
    this.startCountdown();

  }

  startCountdown = () => {
    let {countDown} = this.state;

    timer = setTimeout(()=>{
      countDown = countDown-1;
      console.log(countDown,"countDown")
      if(countDown === 0){
        clearTimeout(timer);
        // 开始轮询调用支付状态接口
        this.getPaymentStatus();
      }else{
        this.setState({
          countDown
        });
        this.startCountdown();
      }
    },1000)

  }

  getPaymentStatus = () => {
    console.log(this.getQueryString1("uuid"))
    currentTimes ++;
    topUpState(this.getQueryString1("uuid")).then((res)=>{
      if(res.code === 400){
        message.info(res.msg);
        if(currentTimes < total){
          type = setTimeout(()=>{
            this.getPaymentStatus();
            clearTimeout(type);
          },3000)
        }else{
          this.props.handleCancelBindingQRCode();
        }
      }else if(res.code === 200){
        this.success();
        setTimeout(()=>{
          Modal.destroyAll();
          this.props.handleCancelBindingQRCode();
        },3000)
      }
      else if(res.code === 410){
        if(currentTimes < total){
          type = setTimeout(()=>{
            this.getPaymentStatus();
            clearTimeout(type);
          },3000)
        }else{
          this.props.handleCancelBindingQRCode();
        }
      }
    })
  }

  getQueryString1 = (name) => {
    let {bindingQRCode} = this.props;
    let url = bindingQRCode.split("?")[1];
      console.log(url,"url")
      if(url){
          var vars = url.split("&");
          for (var i=0;i<vars.length;i++) {
                  var pair = vars[i].split("=");
                  if(pair[0] == name){return pair[1];}
          }
          return null;
      }
      return null;
  }

  success = () => {
    Modal.success({
      content: '充值成功',
      okText: "确定",
      onOk:()=>{
        this.props.handleCancelBindingQRCode();
      }
    });
  }


  handleChange = value => {

  };

  render() {
    let {
      form: { getFieldDecorator },
      bindingQRCodeVisible,
      bindingQRCode,
      handleCancelBindingQRCode,
      money
    } = this.props;
    // const {countDownTimer,qrUrl} = this.state;

    bindingQRCode = `${bindingQRCode}&money=1`;
    console.log(bindingQRCode,"bindingQRCode")
    // confirmTag
    return (
      <div>
        <Modal
          title="支付宝支付"
          maskClosable={false}
          visible={bindingQRCodeVisible}
          width={360}
          onCancel={handleCancelBindingQRCode}
          footer={null}
        >
          <div>
            <QRCode
              value={bindingQRCode}
              size={320}
              fgColor="#000000"
            />
            <h3 style={{textAlign: "center",paddingTop:"20px",fontSize:"22px"}}>{money}元</h3>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Logistics;
