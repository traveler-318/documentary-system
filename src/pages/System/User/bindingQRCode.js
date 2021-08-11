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

import { tenantMode } from '../../../defaultSettings';
import { getCookie } from '../../../utils/support';

import QRCode  from 'qrcode.react';


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
      data:{}
    };
  }

  componentWillMount() {

  }

  handleChange = value => {

  };

  render() {
    const {
      form: { getFieldDecorator },
      bindingQRCodeVisible,
      bindingQRCode,
      countDownTimer,
      handleCancelBindingQRCode,
    } = this.props;

    const formItemLayout = {
      labelCol: {
        span: 7,
      },
      wrapperCol: {
        span: 17,
      },
    };

    // const {countDownTimer,qrUrl} = this.state;


    // confirmTag
    return (
      <div>
        <Modal
          title="绑定"
          visible={bindingQRCodeVisible}
          width={360}
          onCancel={handleCancelBindingQRCode}
          maskClosable={false}
          footer={null}
        >
          <div>
            <span style={{color:"#E6A23C",display: "inline-block",textAlign: "center",width:"100%"}}>微信二维码将在{countDownTimer}秒后失效</span>
            <img src={`${bindingQRCode}`} style={{width:"320px"}}></img>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Logistics;
