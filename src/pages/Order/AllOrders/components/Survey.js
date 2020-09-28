import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, Icon , Select, DatePicker, Tabs, Cascader, Radio,Timeline,} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import Panel from '../../../../components/Panel';
import FormTitle from '../../../../components/FormTitle';
import styles from '../edit.less';
import { USER_INIT, USER_CHANGE_INIT, USER_SUBMIT } from '../../../../actions/user';
import func from '../../../../utils/Func';
import { getCookie } from '../../../../utils/support';
import { updateData, getRegion, getDetails } from '../../../../services/newServices/order';
import OrderList from './OrderList'
// import ReminderTimes from './reminderTime'


const FormItem = Form.Item;
const { TextArea } = Input;
const { TabPane } = Tabs;

@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class Survey extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      edit:true,
      detail:{},
      data:{
        order:'10',
        followUp:'2',
        service0rder:'6',
        product:"9",
        ownership:"3"
      },
      describe:"",
      orderType:[
        {"name":"待审核",key:0,className:""},
        {"name":"已审核",key:1,className:""},
        {"name":"已发货",key:2,className:""},
        {"name":"在途中",key:3,className:""},
        {"name":"已签收",key:4,className:""},
        {"name":"跟进中",key:5,className:""},
        {"name":"已激活",key:6,className:""},
        {"name":"已退回",key:7,className:""},
      ],
      followRecords:[],
      reminderTime:"",
      reminderTimeVisible:false
    };
  }

  componentWillMount() {
    // 214324
    const { orderType } = this.state;
    const { detail } = this.props;
    this.setState({
      detail,
      followRecords:detail.followRecords || []
    })
    let _type = orderType.map(item=>{
      let _item = {...item}
      if(item.key <= detail.confirmTag){
        _item.className = "clolor"
      }else{
        _item.className = ""
      }

      return _item
    })

    console.log(_type,"_type")

    this.setState({
      orderType:_type
    })
    
  }

  TextAreaChange = (e) => {
      this.setState({
        describe:e.target.value
      })
  };

  handleEmpty = () => {
    this.setState({
      describe:""
    })
};

  handleSubmit = () => {
    const { detail , describe, followRecords, reminderTime } = this.state;
    console.log(moment(new Date(),'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'))
    let param = {
      userName:detail.userName,
      describe,
      createTime:moment(new Date(),'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
      type:reminderTime === "" ? "1" : "2",//1是跟进-2提醒时间，
      reminderTime
    }

    followRecords.unshift(param);

    let _param = {
      ...detail,
    }
    _param.followRecords = followRecords

    console.log(_param,"_param")

    updateData(_param).then(res=>{

    })
  }

  handleReminderTime = () => {
    this.set({
      reminderTimeVisible:true
    })
  }

  handleReminderTimeBack = (data) => {
    this.set({
      reminderTime:data
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const {
      data,
      loading,
      detail,
      edit,
      describe,
      followRecords,
      orderType,
      reminderTimeVisible
    } = this.state;
    console.log(detail)

    return (
      <>
        <div style={{height:"200px"}} className={styles.main}>
          <ul>
            {orderType.map(item=>{
              return (
                <li className={item.className ? styles.color : styles.defaultColor}>{item.name}</li>
              )
            })}
          </ul>
          <p><label>订单号：</label>{detail.outOrderNo}</p>
          <p><label>订单时间：</label>{detail.createTime}</p>
          <p style={{height:5}}></p>
          <p><span><label>快递：</label>{detail.logisticsCompany}</span><span><label>产品：</label>{detail.productType}</span></p>
          <p><span><label>单号：</label>{detail.logisticsNumber}</span><span><label>SN：</label>{detail.productCoding}</span></p>
        </div>
        <div className={styles.timelineContent}>
          <Timeline>
            <Timeline.Item>
              <p>赵小刚 跟进</p>
              <p>电话无人接听</p>
              <p>2020-09-19</p>
            </Timeline.Item>
            <Timeline.Item>
              <p>赵小刚 新增客户</p>
              <p>上门拜访了客服，客户对产品很满意</p>
              <p>2020-09-19</p>
            </Timeline.Item>
            <Timeline.Item>
              <p>赵小刚 跟进</p>
              <p>电话无人接听</p>
              <p>2020-09-19</p>
            </Timeline.Item>
            <Timeline.Item>
              <p>赵小刚 新增客户</p>
              <p>上门拜访了客服，客户对产品很满意</p>
              <p>2020-09-19</p>
            </Timeline.Item>
          </Timeline>
        </div>
        <div className={styles.tabText}>
          <TextArea 
            rows={4} 
            value={describe}
            onChange={this.TextAreaChange} 
            placeholder='请输入内容（Alt+Enter快速提交）' 
          />
          <div style={{float:"left",cursor:"pointer"}}>
            <Icon 
              type="clock-circle" 
              style={{margin:"0 10px 0 15px"}}
              onClick={this.handleReminderTime}
            />
            计划提醒
          </div>
          <div style={{float:"right"}}>
            <Button
              onClick={this.handleEmpty}
            >清空</Button>
            <Button 
              type="primary"
              onClick={this.handleSubmit}
            >提交</Button>
          </div>
        </div>
        {/* {reminderTimeVisible?(
          <ReminderTimes 
            handleReminderTimeBack={this.handleReminderTimeBack}
          />
        ):""} */}
      </>
    );
  }
}

export default Survey;
