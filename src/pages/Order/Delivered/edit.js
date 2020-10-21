import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, Icon , Select, message, Tabs, Cascader, Radio,Timeline,} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import Panel from '../../../components/Panel';
import FormTitle from '../../../components/FormTitle';
import styles from './edit.less';
import { CITY } from '../../../utils/city';
import { getQueryString } from '../../../utils/utils';
import { getCookie } from '../../../utils/support';
import { updateData, getDetails,orderDetail,updateReminds } from '../../../services/newServices/order';
import {ORDERSTATUS,ORDERSOURCE} from './data.js';
import FormDetailsTitle from '../../../components/FormDetailsTitle';
import Survey from './components/Survey'
import { setListData } from '../../../utils/publicMethod';
import OrderList from './components/OrderList';


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
    };
  }


  componentWillMount() {

    const { globalParameters } = this.props;
    console.log(globalParameters)
    // 获取详情数据
    this.setState({
      detail:globalParameters.detailData,
    })

    this.getEditDetails()
  }


  getEditDetails = () => {
    const params={
      id:this.props.match.params.id
    }
    getDetails(params).then(res=>{
      this.setState({
        detail:res.data,
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
    Modal.confirm({
      title: '提醒',
      content: "确定提示此订单吗？",
      okText: '确定',
      okType: 'info',
      cancelText: '取消',
      onOk() {
        const { detail } = this.state;
        updateReminds({
          deptId:detail.deptId,
          id:detail.id,
          outOrderNo:detail.outOrderNo,
          payAmount:Number(detail.payAmount),
          userPhone:detail.userPhone,
          userName:detail.userName,
        }).then(res=>{
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
    const { detail } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      //ORDERSTATUS.map(item => {
      //  if(item.name === values.confirmTag){
      //    values.confirmTag = item.key
      //  }
      //})
      ORDERSOURCE.map(item => {
        if(item.name === values.orderSource){
          values.orderSource = item.key
        }
      })
      values.id = detail.id
      if (!err) {
        const params = {
          ...values
        };
        console.log(params)
        updateData(params).then(res=>{
          message.success(res.msg);
          this.setState({
            edit:true
          })
          // router.push('/order/allOrders');
        })
      }
    });
  };

  handleChange = value => {
  };

  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  }

  onChange = (value, selectedOptions) => {
    this.setState({
      cityparam:{
        province:value[0],
        city:value[1],
        area:value[2],
      }
    })
  };

  clickEdit = () => {
    this.setState({
      edit:false
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

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const {
      data,
      loading,
      orderDetail,
      detail,
      edit,
      orderListLength,
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
console.log(detail.confirmTag,edit,edit && detail.confirmTag === 0)

    return (
      <Panel title="详情" back="/order/Delivered">
        <Form style={{ marginTop: 8 }}>
          <Card bordered={false} className={styles.editContent}>
            <Row gutter={24} style={{ margin: 0 }}>
              <Col span={8} style={{ padding: 0 }} className={styles.leftContent}>
                <div className={styles.titleBtn}>
                  <Button type="primary" onClick={this.handleSubmit}>保存</Button>
                  <Button icon="edit" onClick={this.clickEdit}>编辑</Button>
                  {/* <Button  icon="delete">删除</Button> */}
                  <Button
                    icon="bell"
                    onClick={this.handleReminds}
                  >提醒</Button>
                  {/* <Button  icon="folder">归档</Button> */}
                </div>
                <div className={styles.editList} style={{ padding: '20px' }}>
                  <FormDetailsTitle title="订单信息" style={{ margin:'0'}} />
                  <Form span={24}>


                  <FormItem {...formAllItemLayout} label="客户姓名">
                    {getFieldDecorator('userName', {
                      rules: [
                        {
                          message: '请输入客户姓名',
                        },
                      ],
                      initialValue: detail.userName,
                    })(<Input disabled={detail.confirmTag === 0 ? edit : true} placeholder="请输入客户姓名" />)}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="手机号">
                    {getFieldDecorator('userPhone', {
                      rules: [
                        {
                          message: '请输入手机号',
                        },
                        {
                          len: 11,
                          message: '请输入正确的手机号',
                        },
                      ],
                      initialValue: detail.userPhone,
                    })(<Input disabled={detail.userPhone ? true : edit} placeholder="" />)}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="备用手机号">
                    {getFieldDecorator('backPhone', {
                      initialValue: detail.backPhone,
                    })(<Input disabled={detail.backPhone ? true : edit} placeholder="" />)}
                  </FormItem>

                  <FormItem {...formAllItemLayout} label="所在地区">
                    {getFieldDecorator('region', {
                      initialValue: [detail.province, detail.city, detail.area],
                    })(
                      <Cascader
                        // defaultValue={[detail.province, detail.city, detail.area]}
                        options={CITY}
                        disabled={(detail.confirmTag === 0 || detail.confirmTag === '0' || detail.confirmTag === 1 || detail.confirmTag === '1') ? edit : true}
                        onChange={this.onChange}
                      />
                    )}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="收货地址">
                    {getFieldDecorator('userAddress', {
                      rules: [
                        {
                          message: '请输入收货地址',
                        },
                      ],
                      initialValue: detail.userAddress,
                    })(<Input title={detail.userAddress} disabled={(detail.confirmTag === 0 || detail.confirmTag === '0' || detail.confirmTag === 1 || detail.confirmTag === '1') ? edit : true} placeholder="请输入收货地址" />)}
                  </FormItem>
{/*                  <FormItem {...formAllItemLayout} label="客戶状态">
                    {getFieldDecorator('userAddress', {
                      rules: [
                        {
                          message: '',
                        },
                      ],
                      initialValue: detail.userAddress,
                    })(<Input disabled={edit} placeholder="" />)}
                  </FormItem>*/}
{/*                  <FormItem {...formAllItemLayout} label="订单状态">
                    {getFieldDecorator('confirmTag', {
                      rules: [
                        {
                          message: '',
                        },
                      ],
                      initialValue: this.getText(detail.confirmTag,ORDERSTATUS),
                    })(<Input disabled={edit} placeholder="" />)}
                  </FormItem>*/}
                  <FormItem {...formAllItemLayout} label="订单来源">
                    {getFieldDecorator('orderSource', {
                      initialValue: this.getText(parseInt(detail.orderSource),ORDERSOURCE),
                    })(<Input disabled placeholder="" />)}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="订单归属" className={styles.salesman}>
                    {getFieldDecorator('salesman', {
                      rules: [
                        {
                          message: '',
                        },
                      ],
                      initialValue: detail.salesman,
                    })(<Input disabled placeholder="" />)}
                  </FormItem>
                  <FormDetailsTitle title="其他信息" />
                  <FormItem {...formAllItemLayout} label="微信号">
                    {getFieldDecorator('wechatId', {
                      initialValue: detail.wechatId,
                    })(<Input disabled={detail.wechatId ? true : edit} placeholder="" />)}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="备注">
                    {getFieldDecorator('orderNote', {
                      initialValue: detail.orderNote,
                    })(<TextArea rows={4} disabled={edit} placeholder="请输入备注信息" />)}
                  </FormItem>
                  </Form>
                </div>
              </Col>
              <Col span={16} style={{ padding: 0 }} className={styles.rightContent}>
                <div className={styles.titleBtn}>
                  {/* <Button icon="plus">工单</Button>
                  <Button  icon="plus">产品</Button>
                  <Button  icon="plus">地址</Button> */}
                </div>
                <div className={styles.tabContent} style={{marginRight:20}}>
                  <Tabs defaultActiveKey="1" onChange={this.callback}>
                    <TabPane tab="概况" key="1">
                      <Survey
                        detail={detail}
                        getEditDetails={this.getEditDetails}
                      />
                    </TabPane>
                    <TabPane tab={`订单(${orderListLength})`} key="2">
                      <OrderList
                        detail={detail}
                        orderDetail={orderDetail}
                      />
                    </TabPane>
                    {/* <TabPane tab={`跟进(${data.followUp})`} key="3">
                      <FollowUp />
                    </TabPane> */}
                    {/* <TabPane tab={`服务(${data.service0rder})`} key="4">
                      服务工单()
                    </TabPane>
                    <TabPane tab={`产品(${data.product})`} key="5">
                      产品记录()
                    </TabPane>
                    <TabPane tab={`归属(${data.ownership})`} key="6">
                      归属记录
                    </TabPane>
                    <TabPane tab="操作" key="7">
                      操作日志()
                    </TabPane> */}
                  </Tabs>
                </div>
              </Col>
            </Row>
          </Card>
        </Form>
      </Panel>
    );
  }
}

export default OrdersEdit;
