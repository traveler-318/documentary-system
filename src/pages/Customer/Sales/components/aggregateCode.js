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

import { tenantMode } from '../../../../defaultSettings';
import { getCookie } from '../../../../utils/support';
import { getCodeUrl } from '../../../../services/newServices/sales';


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
      codeUrl:'',
      data:{},
      value:''
    };
  }

  componentWillMount() {
    this.getUrl()
  }

  getUrl = () => {
    getCodeUrl().then(res=>{
      console.log(res)
      this.setState({
        codeUrl:res.data
      })
    })
  }

  handleChange = value => {
    console.log("1111")
  };

  // ======关闭弹窗==========

  handleCancelGroupAdd = () =>{
    this.setState({
      groupAddVisible:false,
    })
  }

  // ======确认==========

  handleSubmit = e => {
    const {  form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      const res = /[^\d+(\d\d\d)*.\d+$]/g;
      var reg1=/^[1-9]\d*$/; // 验证正整数
      if(Number(values.payAmount) < 1  || !reg1.test(values.payAmount)){
        message.error('请输入不小于1的正整数');
        return false
      }
      if(Number(values.payAmount) <= 0  || res.test(values.payAmount) ){
        message.error('请输入不小于等于0的数字');
        return false
      }else{
        if(Number(values.payAmount) > 300){
          message.success('支付金额不能超过上限300');
          return false
        }
        const serverAddress = getCookie("serverAddress");
        const { globalParameters } = this.props;
        const { codeUrl } = this.state;
        console.log(globalParameters)
        //const url = codeUrl+"&userName="+globalParameters.detailData.userName+"&deptId="+globalParameters.detailData.deptId+"&payAmount="+values.payAmount;
        const url = codeUrl+globalParameters.detailData.userAccount+"_"+values.payAmount;

        console.log(url)
        this.props.handleCancelAggregateCode()
        this.setState({
          groupAddVisible:true,
          qrUrl:url,
        })
      }
    });

  };

  changeRechargeAmount = (e) => {
    this.setState({
      RechargeAmount:e,
    })
  };

  render() {
    const {
      form: { getFieldDecorator },
      handleCancelAggregateCode,
      handleAggregateCodeVisible
    } = this.props;

    const formItemLayout = {
      labelCol: {
        span: 7,
      },
      wrapperCol: {
        span: 17,
      },
    };

    const {groupAddVisible,qrUrl,value} = this.state;


    // confirmTag
    return (
      <div>
        <Modal
          title="支付金额"
          visible={handleAggregateCodeVisible}
          width={360}
          onCancel={handleCancelAggregateCode}
          footer={[
            <Button key="back" onClick={handleCancelAggregateCode}>
              取消
            </Button>,
            <Button type="primary" key="primary" onClick={()=>this.handleSubmit()}>
              确认
            </Button>
          ]}
        >
          <FormItem {...formItemLayout} label="支付金额：">
            {getFieldDecorator('payAmount', {
              rules: [
                {
                  required: true,
                  message: '请输入支付金额',
                },
              ],
              initialValue: value,
            })(<Input placeholder="请输入支付金额" />)}
          </FormItem>
        </Modal>
        <Modal
          title="聚合码"
          visible={groupAddVisible}
          width={300}
          onCancel={this.handleCancelGroupAdd}
          footer={[

          ]}
        >
          <div>
            <QRCode
              value={qrUrl}
              size={250}
              fgColor="#000000"
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default Logistics;
