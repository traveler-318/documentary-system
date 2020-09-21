import React, { PureComponent } from 'react';
import { Modal, Checkbox, Form, Input, Card, Row, Col, Button, TreeSelect, Select, DatePicker, message, Cascader, Radio } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import { getCookie } from '../../../../utils/support';
import {equipment} from '../../../../services/newServices/order'
import {getAdditionalList,getList,getSurfacesingleList,getGoodsList,getDeliveryList } from '../../../../services/newServices/logistics';
import styles from '../index.less';
import Authority from '../Logistics/authority'
import FaceSheet from '../Logistics/faceSheet'
import Sender from '../Logistics/sender'
import Goods from '../Logistics/goods'
import Additional from '../Logistics/additional'

const FormItem = Form.Item;
const { TextArea } = Input;


@connect(({ globalParameters}) => ({
  globalParameters,
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

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { detail } = this.state;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.deptId = getCookie("dept_id");
        values = {...values};
        values.outOrderNo = detail.outOrderNo
        values.id = detail.id
        values.sms_confirmation = false;

        equipment(values).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            this.props.handleCancelLogisticsConfig("getlist");
          }
        })
      }
    });
  };

  onChange = e => {
    console.log('checked = ', e.target.checked);
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
        title:e,
      })
    }else if(e === '打印模板'){
      this.setState({
        faceSheetVisible:true,
        title:e,
      })
    }else if(e === '寄件人信息'){
      this.setState({
        SenderVisible:true,
        title:e,
      })
    }else if(e === '物品信息'){
      this.setState({
        GoodsVisible:true,
        title:e,
      })
    }else if(e === '附加信息'){
      this.setState({
        AdditionalVisible:true,
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
      } = this.state;
    console.log(additionalItem)

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
            <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
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
            <Checkbox onChange={this.onChange} checked={checked} style={{color:"#409eff"}}>物流订阅</Checkbox>
            <Checkbox onChange={this.onChange1} checked={checked1} style={{color:"#409eff"}}>发货提醒</Checkbox>
          </div>
        </Modal>
        <Modal
          title={title}
          visible={LogisticsVisible}
          onCancel={this.handleCancel}
          width={1000}
          footer={[
            <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
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
              LogisticsConfigList={title}
              handleCancel={this.handleCancel}
            />
          ):""}
          {/* 寄件人信息 */}
          {SenderVisible?(
            <Sender
              SenderVisible={SenderVisible}
              LogisticsConfigList={title}
              handleCancel={this.handleCancel}
            />
          ):""}
          {/* 物品信息 */}
          {GoodsVisible?(
            <Goods
              GoodsVisible={GoodsVisible}
              LogisticsConfigList={title}
              handleCancel={this.handleCancel}
            />
          ):""}
          {/* 附加信息 */}
          {AdditionalVisible?(
            <Additional
              AdditionalVisible={AdditionalVisible}
              LogisticsConfigList={title}
              handleCancel={this.handleCancel}
            />
          ):""}

        </Modal>
      </div>

    );
  }
}

export default LogisticsConfig;
