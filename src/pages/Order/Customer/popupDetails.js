import React, { PureComponent } from 'react';
import { Form, Input, Card, Row,Modal, Col, Button, Icon , Select, message, Tabs, Cascader, Radio,Timeline,Tooltip} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from '../components/edit.less';
import { CITY } from '../../../utils/city';
import {
  orderDetail,
  updateReminds,
  productTreelist,
  deleteLogisticsSuber,
  localPrinting,
  logisticsRepeatPrint,
} from '../../../services/newServices/order';
import {getDetail,updateData} from '../../../services/order/customer';
import FormDetailsTitle from '../../../components/FormDetailsTitle';
import Survey from '../components/Survey'
import OrderListNew from '../components/OrderListNew';
import CustomerDetail from '@/pages/Order/Customer/components/detail';
// import {
//   LOGISTICSCOMPANY,
// } from './data.js';
import bellShut from '../../../assets/bellShut.svg'
import func from '@/utils/Func';

const FormItem = Form.Item;
const { TextArea } = Input;
const { TabPane } = Tabs;

@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class OrdersEdit extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      detail:{},
      edit:true,
      data:{
        order:'10',
        followUp:'2',
        service0rder:'6',
        product:"9",
        ownership:"3"
      },
      ids:'',
      selectedOptions:"",
      primary:'primary',
      primary1:'',
      productList:[],
      repeatLoading:false,
      payPanyId:null,
      productTypeId:null,
      productId:null,
      detailsId:null
    };
  }

  componentWillMount() {

    const { globalParameters } = this.props;
    const propData = globalParameters.detailData;
    // 获取详情数据
    this.setState({
      detailsId:propData.detail.id,
    },()=>{
      this.getTreeList();
      this.getEditDetails();
    });

    // let _this = this;
    // setTimeout(()=>{
    //   _this.getEditDetails();
    // },4000)
  }

  getTreeList = () => {
    productTreelist().then(res=>{
      console.log(res.data,"productTreelist")
      this.setState({productList:res.data})
    })
  }

  changeDetails = (id) => {
    // 获取详情数据
    this.setState({
      detailsId:id,
    },()=>{
      this.getEditDetails();
    });
  }

  getEditDetails = () => {
    const params={
      id:this.state.detailsId
    }
    getDetail(params).then(res=>{
      this.setState({
        detail:res.data
      })
      this.getList(res.data)
    })
  }

  getList = (detail) =>{
    console.log(detail)
    const params={
      userAddress:detail.userAddress,
      userPhone:detail.userPhone,
      userName:detail.userName,
      id:detail.id,
      size:100,
      current:1
    }
    orderDetail(params).then(res=>{
      console.log(res)
      const data = res.data.records;
      let list=[];
      for(let i=0; i<data.length; i++){
        if(data[i].id != detail.id){
          list.push(data[i])
        }
      }
      this.setState({
        orderDetail:list,
        orderListLength:list.length
      })
    })
  }

  // 提醒
  handleReminds = () => {
    const { detail } = this.state;
    console.log(detail)
    Modal.confirm({
      title: '提醒',
      content: "确定提示此订单吗？",
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      onOk() {
        updateReminds([{
          deptId:detail.deptId,
          id:detail.id,
          outOrderNo:detail.outOrderNo,
          payAmount:Number(detail.payAmount),
          userPhone:detail.userPhone,
          userName:detail.userName,
        }]).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
          }
        })
      },
      onCancel() {},
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { detail,selectedOptions} = this.state;
    form.validateFieldsAndScroll((err, values) => {
      values.id = detail.id;
      values.clientAddress = `${selectedOptions}${values.clientAddress}`;
      values.nextFollowTime = func.format(values.nextFollowTime);
      if (!err) {
          updateData(values).then(res=>{
            if(res.code === 200){
              message.success(res.msg);
              this.setState({
                edit:true,
                primary:"primary",
                primary1:''
              })
              this.getEditDetails()
            }else {
              message.error(res.msg);
            }
          })
      }
    });
  };

  voiceSubmit = (key) =>{
    const { detail } = this.state;
    const params={
      voiceStatus:key,
      id :detail.id
    }
    updateData(params).then(res=>{
      if(res.code === 200){
        message.success(res.msg);
        this.setState({
          edit:true,
          primary:"primary",
          primary1:''
        })
        this.getEditDetails()
      }else {
        message.error(res.msg);
      }
    })
  };

  handleChange = value => {
  };

  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  }

  onChange = (value, selectedOptions) => {
    let text = ""
    for(let i=0; i<selectedOptions.length; i++){
      text += selectedOptions[i].label
    }
    this.setState({
      cityparam:{
        province:value[0],
        city:value[1],
        area:value[2],
      },
      selectedOptions:text
    })
  };

  RadioChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  clickEdit = () => {
    this.setState({
      edit:false,
      primary:'',
      primary1:'primary'
    })
  };

  // 复打
  repeat = () => {
    const {detail}=this.state;
    // 当前时间戳
    const timestamp = (new Date()).getTime();
    const timeInterval = 24 * 60 * 60 * 1000 * 2;
    const time = timestamp - (new Date(detail.taskCreateTime)).getTime();
    this.setState({
      repeatLoading:true
    });
    const  tips=[];
    if(!detail.taskId){
      tips.push(detail.userName)
      Modal.confirm({
        title: '提示',
        content: detail.userName+"客户没有首次打印记录,不能进行重复打印!",
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {},
        onCancel() {},
      });
    }else if( time > timeInterval){
      tips.push(detail.userName)
      Modal.confirm({
        title: '提示',
        content: detail.userName+"客户的订单 距离首次时间超过2天 禁止打印！",
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {},
        onCancel() {},
      });
    }
    if(tips.length > 0 ){
      return false;
    }

    if(detail.logisticsPrintType === "1" || detail.logisticsPrintType === "2"){
      // 本地打印
      localPrinting({
        id:detail.id,
        logisticsPrintType:detail.logisticsPrintType
      }).then(res=>{
        this.setState({
          repeatLoading:false
        });
        if(res.code === 200){
          sessionStorage.setItem('imgBase64', res.data)
          window.open(`#/order/allOrders/img`);
        }else{
          message.error(res.msg);
        }
      })
    }else{
      let param = [];
      param.push(detail.taskId)
      logisticsRepeatPrint(param).then(res=>{
        this.setState({
          repeatLoading:false
        });
        if(res.code === 200){
          message.success(res.msg);
        }
      })
    }
  };

  getText = (key, type) => {
    let text = ""
    type.map(item=>{
      if(item.key === key){
        text = item.name
      }
    })
    return text
  }

  validatePhone = (rule, value, callback) => {
    if (!(/^1[3456789]\d{9}$/.test(value))) {
      callback(new Error('请输入正确的手机号格式'));
    }else{
      callback();
    }
  }

  render() {

    const {
      form: { getFieldDecorator }
    } = this.props;

    const {
      data,
      loading,
      orderDetail,
      detail,
      edit,
      orderListLength,
      primary,
      primary1,
      productList
    } = this.state;

    return (
        <Modal
        title="详情"
          visible={this.props.detailsVisible}
          width={1290}
          onCancel={this.props.handleCancelDetails}
          footer={null}
          bodyStyle={{paddingTop:0}}
          maskClosable={false}
          style={{
            top:40
          }}
        >
        <Form style={{ marginTop: 8 }}>
          <Card bordered={false} className={styles.editContent}>
            <Row gutter={24} style={{ margin: 0 }}>
              <Col span={8} style={{ padding: 0 }} className={styles.leftContent}>
                <div className={styles.titleBtn}>
                  <Button type={primary} onClick={this.handleSubmit}>保存</Button>
                  <Button type={primary1} icon="edit" onClick={this.clickEdit}>编辑</Button>
                  {/* <Button  icon="delete">删除</Button> */}
                  <Button
                    icon="bell"
                    onClick={this.handleReminds}
                  >提醒</Button>
                  <Button icon="copy" onClick={this.repeat}>复打</Button>
                  {/* <Button  icon="folder">归档</Button> */}
                </div>
                <CustomerDetail detail={detail} edit={edit} getFieldDecorator={getFieldDecorator} className={styles.editList} style={{ padding: '20px' }}/>
              </Col>
              <Col span={16} style={{ padding: 0 }} className={styles.rightContent}>
                <div className={styles.titleBtn}>
                  {detail.voiceStatus === "1" ? (
                    <Tooltip title="激活自动提醒开关">
                      <Button icon="bell" onClick={()=>this.voiceSubmit(0)} style={{ float:"right",border:'0',boxShadow:'none'}}></Button>
                    </Tooltip>
                  ) :(
                    <Button style={{ float:"right",border:'0',boxShadow:'none'}} onClick={()=>this.voiceSubmit(1)}>
                      <Tooltip title="激活自动提醒开关">
                        <img src={bellShut} style={{float:"right"}} />
                      </Tooltip>
                    </Button>
                  )}
                </div>
                <div className={styles.tabContent} style={{marginRight:20,paddingTop:14}}>
                  <Tabs defaultActiveKey="1" onChange={this.callback}>
                    <TabPane tab="概况" key="1">
                      <Survey
                        detail={detail}
                        getEditDetails={this.getEditDetails}
                      />
                    </TabPane>
                    <TabPane tab={`重复订单(${orderListLength})`} key="2">
                      <OrderListNew
                        detail={detail}
                        orderDetail={orderDetail}
                        changeDetails={this.changeDetails}
                      />
                    </TabPane>
                  </Tabs>
                </div>
              </Col>
            </Row>
          </Card>
        </Form>
        </Modal>
    );
  }
}

export default OrdersEdit;
