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
      RechargeAmountList:[5,10,20,50,100],
      RechargeAmount:5,
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
      handleRechargeVisible,
      handleCancelRecharge,
    } = this.props;

    const {groupAddVisible,RechargeAmountList,RechargeAmount} = this.state;


    // confirmTag
    return (
      <div>
        <Modal
          title="业务员充值"
          visible={handleRechargeVisible}
          width={550}
          onCancel={handleCancelRecharge}
          footer={[
            <Button type="primary" key="primary" onClick={()=>this.handleSubmit()}>
              确认
            </Button>,
          ]}
        >
          <Form.Item label="充值个数：">
            <div style={{float:'left'}}>
              {RechargeAmountList.map(item=>{
                return (<Tag onClick={()=>this.changeRechargeAmount(item)} className={item === RechargeAmount ? "ant-tag ant-tag-color " : "ant-tag"} key={item}>{item}个</Tag>)
              })}
            </div>
          </Form.Item>
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
