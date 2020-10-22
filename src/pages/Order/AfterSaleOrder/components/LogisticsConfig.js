import React, { PureComponent } from 'react';
import { Modal, Checkbox, Form, Input, Card, Row, Col, Button, TreeSelect, Select, DatePicker, message, Cascader, Radio } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import { getCookie } from '../../../../utils/support';
import {getAdditionalList,getList,getSurfacesingleList,getGoodsList,getDeliveryList } from '../../../../services/newServices/logistics';
import {logisticsPrintRequest} from '../../../../services/newServices/order';

import styles from '../index.less';
import Authority from '../Logistics/authority'
import FaceSheet from '../Logistics/faceSheet'
import Sender from '../Logistics/sender'
import Goods from '../Logistics/goods'
import Additional from '../Logistics/additional'

const FormItem = Form.Item;
const { TextArea } = Input;


@connect(({ globalParameters,logisticsParameters}) => ({
  globalParameters,logisticsParameters
}))
@Form.create()
class LogisticsConfig extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      detail:{},
      data:{

      },
      params:{
        size:10,
        current:1
      },
      checked:true,
      checked1:true,
      LogisticsVisible:false,
      // 基础授权配置弹窗
      AuthorityVisible:false,
      // 打印模板弹窗
      faceSheetVisible:false,
      // 寄件人信息弹窗
      SenderVisible:false,
      // 物品信息弹窗
      GoodsVisible:false,
      // 附加信息弹窗
      AdditionalVisible:false,
      additionalItem:'',
      additionalId:'',
      authorizationItem:'',
      authorizationId:'',
      faceSheetItem:'',
      faceSheetId:'',
      goodsItem:'',
      goodsId:'',
      senderItem:'',
      senderId:''
    };
  }

  componentWillMount() {
    const { LogisticsConfigList } = this.props;
    this.getDEfalutData()
  }

  getDEfalutData = () => {
    const {params} = this.state;
    getAdditionalList(params).then(res=>{
      const data = res.data.records;
      for(let i=0; i<data.length; i++){
        if(data[i].status === 1){
          this.setState({
            additionalItem:data[i],
            additionalId:data[i].id,
          })
        }
      }
    })
    getList(params).then(res=>{
      const data = res.data.records;
      for(let i=0; i<data.length; i++){
        if(data[i].status === 1){
          this.setState({
            authorizationItem:data[i],
            authorizationId:data[i].id,
          })
        }
      }
    })
    getSurfacesingleList(params).then(res=>{
      const data = res.data.records;
      for(let i=0; i<data.length; i++){
        if(data[i].status === 1){
          this.setState({
            faceSheetItem:data[i],
            faceSheetId:data[i].id,
          })
        }
      }
    })
    getGoodsList(params).then(res=>{
      const data = res.data.records;
      for(let i=0; i<data.length; i++){
        if(data[i].status === 1){
          this.setState({
            goodsItem:data[i],
            goodsId:data[i].id,
          })
        }
      }
    })
    getDeliveryList(params).then(res=>{
      const data = res.data.records;
      for(let i=0; i<data.length; i++){
        if(data[i].status === 1){
          this.setState({
            senderItem:data[i],
            senderId:data[i].id,
          })
        }
      }
    })
  }

  handleConfirm = e => {
    e.preventDefault();
    const { authorizationItem,faceSheetItem,senderItem,goodsItem,additionalItem,checked,checked1 } = this.state;
    const { globalParameters } = this.props;

    if(authorizationItem === ''){
      message.success('请选择基础授权配置');
      return false
    }else if(faceSheetItem === ''){
      message.success('请选择打印模板');
      return false
    }else if(senderItem === ''){
      message.success('请选择寄件人信息');
      return false
    }else if(goodsItem === ''){
      message.success('请选择物品信息');
      return false
    }else if(additionalItem === ''){
      message.success('请选择附加信息');
      return false
    }
    if(faceSheetItem.online === '0'){
      message.success('当前选择的打印模板不在线!请检查机器网络或者联系管理员排查!');
      return false;
    }
    const params =
      {
        recMans: [],
        ...goodsItem,
        ...faceSheetItem,
        ...additionalItem,
        sendMan:{
          ...senderItem,
        },
        subscribe:checked,
        shipmentRemind:checked1,
        ...authorizationItem
      };

    for(let i=0; i<globalParameters.detailData.length; i++){
      params.recMans.push(
        {
          "mobile": globalParameters.detailData[i].userPhone,
          "name": globalParameters.detailData[i].userName,
          "printAddr": globalParameters.detailData[i].userAddress,
          "out_order_no": globalParameters.detailData[i].outOrderNo,
          "id":globalParameters.detailData[i].id,
          // 'salesman':globalParameters.detailData[i].salesman,
        }
      )
    }
    logisticsPrintRequest(params).then(res=>{
      message.success(res.msg);
      router.push('/order/allOrders');
    })
  };

  handleConfirmList = e => {
    const { faceSheetVisible,AuthorityVisible,AdditionalVisible,GoodsVisible,SenderVisible} = this.state;
    const { logisticsParameters } = this.props;
    console.log(AuthorityVisible)
    console.log(logisticsParameters.listParam)
    if(faceSheetVisible){
      if(logisticsParameters.listParam.online === '0'){
        message.success('当前选择的打印模板不在线!请检查机器网络或者联系管理员排查!');
        return false;
      }else if(logisticsParameters.listParam.online === undefined){
        message.success('当前选择的打印模板不在线!请检查机器网络或者联系管理员排查!');
        return false;
      }
      this.setState({
        faceSheetItem:logisticsParameters.listParam
      })
    }else if(AuthorityVisible){
      this.setState({
        authorizationItem:logisticsParameters.listParam
      })
    }else if(GoodsVisible){
      this.setState({
        goodsItem:logisticsParameters.listParam
      })
    }else if(SenderVisible){
      this.setState({
        senderItem:logisticsParameters.listParam
      })
    }else if(AdditionalVisible){
      this.setState({
        additionalItem:logisticsParameters.listParam
      })
    }
    this.setState({
      LogisticsVisible:false,
    })
  };

  onChange = e => {
    console.log('checked = ', e.target);
    this.setState({
      checked: e.target.checked,
    });
  };

  onChange1 = e => {
    console.log('checked = ', e.target.checked);
    this.setState({
      checked1: e.target.checked
    });
  };

  handleBulkDelivery = (e) =>{
    console.log(e)
    this.setState({
      LogisticsVisible:true,
    })
    if(e === "基础授权配置"){
      this.setState({
        AuthorityVisible:true,
        faceSheetVisible:false,
        SenderVisible:false,
        GoodsVisible:false,
        AdditionalVisible:false,
        title:e,
      })
    }else if(e === '打印模板'){
      this.setState({
        faceSheetVisible:true,
        AuthorityVisible:false,
        SenderVisible:false,
        GoodsVisible:false,
        AdditionalVisible:false,
        title:e,
      })
    }else if(e === '寄件人信息'){
      this.setState({
        SenderVisible:true,
        faceSheetVisible:false,
        AuthorityVisible:false,
        GoodsVisible:false,
        AdditionalVisible:false,
        title:e,
      })
    }else if(e === '物品信息'){
      this.setState({
        GoodsVisible:true,
        faceSheetVisible:false,
        AuthorityVisible:false,
        SenderVisible:false,
        AdditionalVisible:false,
        title:e,
      })
    }else if(e === '附加信息'){
      this.setState({
        AdditionalVisible:true,
        faceSheetVisible:false,
        AuthorityVisible:false,
        SenderVisible:false,
        GoodsVisible:false,
        title:e,
      })
    }
  }

  // 关闭物流弹窗
  handleCancel = () => {
    const {title} =this.state;
    this.setState({
      LogisticsVisible:false,
    })
    if(title === "基础授权配置"){
      this.setState({
        AuthorityVisible:false,
      })
    }else if(title === '打印模板'){
      this.setState({
        faceSheetVisible:false,
      })
    }else if(title === '寄件人信息'){
      this.setState({
        SenderVisible:false,
      })
    }else if(title === '物品信息'){
      this.setState({
        GoodsVisible:false,
      })
    }else if(title === '附加信息'){
      this.setState({
        AdditionalVisible:false,
      })
    }
  }

  render() {
    const {
      form: { LogisticsConfigList },
      LogisticsConfigVisible,
      handleCancelLogisticsConfig,
      } = this.props;

    const {
      loading,
      checked,
      checked1,
      LogisticsVisible,
      AuthorityVisible,
      faceSheetVisible,
      SenderVisible,
      GoodsVisible,
      AdditionalVisible,
      title,
      additionalItem,
      authorizationItem,
      faceSheetItem,
      goodsItem,
      senderItem,
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
      <div>
        <Modal
          title="物流配置"
          visible={LogisticsConfigVisible}
          width={560}
          onCancel={handleCancelLogisticsConfig}
          footer={[
            <Button key="submit" type="primary" loading={loading} onClick={this.handleConfirm}>
              确定
            </Button>,
          ]}
        >
          <Button className={styles.logisticsButton} onClick={()=>this.handleBulkDelivery('基础授权配置')}>
            基础授权配置
          </Button>
          <Button className={styles.logisticsButton} onClick={()=>this.handleBulkDelivery('打印模板')}>
            打印模板
          </Button>
          <Button className={styles.logisticsButton} onClick={()=>this.handleBulkDelivery('寄件人信息')}>
            寄件人信息
          </Button>
          <Button className={styles.logisticsButton} onClick={()=>this.handleBulkDelivery('物品信息')}>
            物品信息
          </Button>
          <Button className={styles.logisticsButton} onClick={()=>this.handleBulkDelivery('附加信息')}>
            附加信息
          </Button>
          <div className={styles.checkbox}>
            <Checkbox onChange={this.onChange} checked={checked} style={{color:"#52b7b4"}}>物流订阅</Checkbox>
            <Checkbox onChange={this.onChange1} checked={checked1} style={{color:"#52b7b4"}}>发货提醒</Checkbox>
          </div>
        </Modal>
        <Modal
          title={title}
          visible={LogisticsVisible}
          onCancel={this.handleCancel}
          width={1000}
          footer={[
            <Button key="submit" type="primary" loading={loading} onClick={this.handleConfirmList}>
              确定
            </Button>,
          ]}
        >
          {/* 基础授权配置 */}
          {AuthorityVisible?(
            <Authority
              AuthorityVisible={AuthorityVisible}
              LogisticsConfigList={authorizationItem}
              handleCancel={this.handleCancel}
            />
          ):""}
          {/* 打印模板 */}
          {faceSheetVisible?(
            <FaceSheet
              faceSheetVisible={faceSheetVisible}
              LogisticsConfigList={faceSheetItem}
              handleCancel={this.handleCancel}
            />
          ):""}
          {/* 寄件人信息 */}
          {SenderVisible?(
            <Sender
              SenderVisible={SenderVisible}
              LogisticsConfigList={senderItem}
              handleCancel={this.handleCancel}
            />
          ):""}
          {/* 物品信息 */}
          {GoodsVisible?(
            <Goods
              GoodsVisible={GoodsVisible}
              LogisticsConfigList={goodsItem}
              handleCancel={this.handleCancel}
            />
          ):""}
          {/* 附加信息 */}
          {AdditionalVisible?(
            <Additional
              AdditionalVisible={AdditionalVisible}
              LogisticsConfigList={additionalItem}
              handleCancel={this.handleCancel}
            />
          ):""}

        </Modal>
      </div>

    );
  }
}

export default LogisticsConfig;
