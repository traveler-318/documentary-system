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
    const {bindingQRCode} = this.props;
    console.log(bindingQRCode)
  }

  handleChange = value => {

  };

  render() {
    const {
      form: { getFieldDecorator },
      bindingQRCodeVisible,
      bindingQRCode,
      handleCancelBindingQRCode,
      money
    } = this.props;
    // const {countDownTimer,qrUrl} = this.state;


    // confirmTag
    return (
      <div>
        <Modal
          title="支付宝支付"
          visible={bindingQRCodeVisible}
          width={360}
          onCancel={handleCancelBindingQRCode}
          footer={[

          ]}
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
