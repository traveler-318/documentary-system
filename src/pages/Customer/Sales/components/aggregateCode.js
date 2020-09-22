import React, { PureComponent } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Tag,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import { tenantMode } from '../../../../defaultSettings';
import { getCookie } from '../../../../utils/support';
import { updateLogistics, logisticsRemind } from '../../../../services/newServices/order'
import { getDeliverySave } from '../../../../services/newServices/logistics';
import styles from '../index.less';


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
      // 添加分组弹窗
      groupAddVisible:false,
      data:[
        {
          key:1,
          name:"测试2组"
        },{
          key:2,
          name:"测试3组"
        }
      ],
    };
  }

  componentWillMount() {

  }

  handleChange = value => {
    console.log("1111")
  };

  // ======添加分组弹窗==========

  groupAdd = () =>{
    this.setState({
      groupAddVisible:true,
    })
  }

  // ======关闭弹窗==========

  handleCancelGroupAdd = () =>{
    this.setState({
      groupAddVisible:false,
    })
  }

  // ======确认==========

  handleSubmit = e => {

    const {  RechargeAmount } = this.state;
    console.log(RechargeAmount)

  };

  changeRechargeAmount = (e) => {
    this.setState({
      RechargeAmount:e,
    })
  };

  render() {
    const {
      form: { getFieldDecorator },
      handleAggregateCodeVisible,
      handleCancelAggregateCode,
    } = this.props;

    const formItemLayout = {
      labelCol: {
        span: 7,
      },
      wrapperCol: {
        span: 17,
      },
    };

    const {groupAddVisible} = this.state;


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
            <Button key="primary" onClick={()=>this.handleSubmit()}>
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
            })(<Input placeholder="请输入支付金额" />)}
          </FormItem>
        </Modal>
        <Modal
          title="添加分组"
          visible={groupAddVisible}
          width={550}
          onCancel={this.handleCancelGroupAdd}
          footer={[
            <Button key="primary" onClick={this.handleSubmit}>
              确认
            </Button>,
          ]}
        >
        </Modal>
      </div>
    );
  }
}

export default Logistics;
