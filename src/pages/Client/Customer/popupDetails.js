import React, { PureComponent } from 'react';
import { Form, Input, Card, Row,Modal, Col, Button, Icon , Select, message, Tabs, Cascader, Radio,Timeline,Tooltip} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from '../../Order/components/edit.less';
import {
  updateReminds
} from '../../../services/newServices/order';
import {getDetail,updateData,clientOrder,clientOperationRecord} from '../../../services/order/customer';
import TabTrends from '@/pages/Client/Customer/components/tabTrends';
import OrderListNew from './components/OrderListNew';
import Ownership from './components/Ownership';
import CustomerDetail from '@/pages/Client/Customer/components/detail';

import func from '@/utils/Func';

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
      this.getEditDetails();
    });

    // let _this = this;
    // setTimeout(()=>{
    //   _this.getEditDetails();
    // },4000)
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
    const params={
      clientPhone:detail.clientPhone,
      size:10,
      current:1
    }
    clientOrder(params).then(res=>{
      const data = res.data;
      this.setState({
        orderDetail:data.records,
        orderPagination:{
          total:data.total,
          current:data.current,
          pageSize:data.size,
        },
        orderListLength:data.total
      })
    })

    //查询归属总条数
    clientOperationRecord({
      clientId:detail.id,
      deptId:detail.deptId,
      tenantId:detail.tenantId,
      type:0,
      size:1,
      current:1
    }).then(res=>{
      const data = res.data;
      this.setState({
        clientOperationRecordLength:data.total
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
      orderPagination,
      detail,
      edit,
      orderListLength,
      clientOperationRecordLength,
      primary,
      primary1
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
                  {/* <Button  icon="folder">归档</Button> */}
                </div>
                <CustomerDetail detail={detail} edit={edit} getFieldDecorator={getFieldDecorator} className={styles.editList} style={{ padding: '20px' }}/>
              </Col>
              <Col span={16} style={{ padding: 0 }} className={styles.rightContent}>
                <Row className={styles.titleBtn}>
                  <Col span={16}>
                    <Button icon="plus" onClick={()=>{message.info('开发中')}}>订单</Button>
                    <Button icon="plus" onClick={()=>{message.info('开发中')}}>产品</Button>
                    <Button icon="plus" onClick={()=>{message.info('开发中')}}>联系人</Button>
                    <Button icon="plus" onClick={()=>{message.info('开发中')}}>工单</Button>
                  </Col>
                  {/*<Col span={8}>*/}
                  {/*  <div>*/}
                  {/*    {detail.voiceStatus === "1" ? (*/}
                  {/*      <Tooltip title="激活自动提醒开关">*/}
                  {/*        <Button icon="bell" onClick={()=>this.voiceSubmit(0)} style={{ float:"right",border:'0',boxShadow:'none'}}></Button>*/}
                  {/*      </Tooltip>*/}
                  {/*    ) :(*/}
                  {/*      <Button style={{ float:"right",border:'0',boxShadow:'none'}} onClick={()=>this.voiceSubmit(1)}>*/}
                  {/*        <Tooltip title="激活自动提醒开关">*/}
                  {/*          <img src={bellShut} style={{float:"right"}} />*/}
                  {/*        </Tooltip>*/}
                  {/*      </Button>*/}
                  {/*    )}*/}
                  {/*  </div>*/}
                  {/*</Col>*/}
                </Row>
                <div className={styles.tabContent} style={{marginRight:20,paddingTop:14}}>
                  <Tabs defaultActiveKey="1" onChange={this.callback}>
                    <TabPane tab="客户动态" key="1">
                      {detail.id?(
                        <TabTrends
                          detail={detail}
                          getEditDetails={this.getEditDetails}
                        />
                      ):''}
                    </TabPane>
                    <TabPane tab={`订单(${orderListLength})`} key="2">
                      <OrderListNew
                        detail={detail}
                        orderDetail={orderDetail}
                        orderPagination={orderPagination}
                        changeDetails={this.changeDetails}
                      />
                    </TabPane>
                    <TabPane tab={`维护(0)`} key="3">
                      {/*<OrderListNew*/}
                      {/*  detail={detail}*/}
                      {/*  orderDetail={orderDetail}*/}
                      {/*  changeDetails={this.changeDetails}*/}
                      {/*/>*/}
                    </TabPane>
                    <TabPane tab={`联系人(0)`} key="4">
                      {/*<OrderListNew*/}
                      {/*  detail={detail}*/}
                      {/*  orderDetail={orderDetail}*/}
                      {/*  changeDetails={this.changeDetails}*/}
                      {/*/>*/}
                    </TabPane>
                    <TabPane tab={`工单(0)`} key="5">
                      {/*<OrderListNew*/}
                        {/*detail={detail}*/}
                        {/*orderDetail={orderDetail}*/}
                        {/*changeDetails={this.changeDetails}*/}
                      {/*/>*/}
                    </TabPane>
                    <TabPane tab={`归属(${clientOperationRecordLength})`} key="6">
                      <Ownership detail={detail}/>
                    </TabPane>
                    <TabPane tab={`日志`} key="7">
                      {/*<OrderListNew*/}
                        {/*detail={detail}*/}
                        {/*orderDetail={orderDetail}*/}
                        {/*changeDetails={this.changeDetails}*/}
                      {/*/>*/}
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
