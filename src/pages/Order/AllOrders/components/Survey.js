import React, { PureComponent } from 'react';
import { Form, message, Input, Card, Row, Col, Button, Icon, Modal , Select, DatePicker, Tabs, Cascader, Radio,Timeline,} from 'antd';
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
import LogisticsDetails from './LogisticsDetails'
import ReminderTimes from './time'
import EditTime from './editTime'


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
      reminderTimeVisible:false,
      logisticsDetailsVisible:false,
      editTimeVisible:false,
      timeIndex:"",
      editReminderTimes:""
    };
  }

  componentWillMount() {

  }

  UNSAFE_componentWillReceiveProps(nex){
    const { orderType } = this.state;

    const { detail } = this.props;
    let list = [];

    if(nex.detail.followRecords && JSON.parse(nex.detail.followRecords).list){
      list = JSON.parse(nex.detail.followRecords).list
    }

    this.setState({
      detail:nex.detail,
      followRecords:list
    })

    let _type = orderType.map(item=>{
      let _item = {...item}
      if(item.key <= nex.detail.confirmTag){
        _item.className = "clolor"
      }else{
        _item.className = ""
      }

      return _item
    })

    this.setState({
      orderType:_type
    })

  }

  // 修改时间

  handleediTtime = (index,reminderTime) => {
    console.log(index,"index")
    this.setState({
      editTimeVisible:true,
      timeIndex:index,
      editReminderTimes:reminderTime
    })
  }

  // 删除
  handleDelect = (row) => {
    const refresh = this.refreshTable;
    const { followRecords } = this.state;
    const handleUpdate = this.handleUpdate;

    Modal.confirm({
      title: '删除确认',
      content: '确定删除选中记录?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        let newData = []
        for(let i=0; i<followRecords.length; i++){
          if(i != row){
            newData.push(followRecords[i])
          }
        }
        handleUpdate(newData)
      },
      onCancel() {},
    });

  }

  handleUpdate = (data) => {
    const { detail , describe } = this.state;

    let _param = {
      id:detail.id,
      deptId:detail.deptId,
    }
    _param.followRecords = JSON.stringify({
      list:data
    })

    updateData(_param).then(res=>{
      if(res.code === 200){
        message.success(res.msg);
        this.props.getEditDetails()
      }
    })
  }

  TextAreaChange = (e) => {
      this.setState({
        describe:e.target.value
      })
  };

  // 物流详情窗口

  handleDetails = () => {
    const { dispatch } = this.props;
    const {detail} = this.state;
    dispatch({
      type: `globalParameters/setDetailData`,
      payload: detail,
    });
    this.setState({
      logisticsDetailsVisible:true
    })
  };

  handleLogisticsDetails = () => {
    this.setState({
      logisticsDetailsVisible:false
    })
  };

  handleEmpty = () => {
    this.setState({
      describe:""
    })
};

  handleSubmit = () => {
    const { detail , describe, reminderTime } = this.state;
    let { followRecords } = this.state;

    console.log(moment(new Date(),'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'))
    let param = {
      userName:detail.userName,
      describe,
      createTime:moment(new Date(),'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
      type:reminderTime === "" ? "1" : "2",// 1是跟进-2提醒时间，
      reminderTime
    }

    console.log(followRecords,"followRecords")

    followRecords.unshift(param);

    let _param = {
      id:detail.id,
      deptId:detail.deptId,
    }
    _param.followRecords = JSON.stringify({
      list:followRecords
    })

    updateData(_param).then(res=>{
      if(res.code === 200){
        message.success(res.msg);
        this.props.getEditDetails();
        this.handleEmpty();
      }
    })
  }

  handleReminderTime = () => {
    this.setState({
      reminderTimeVisible:true
    })
  }

  handleReminderTimeBack = (data) => {
    console.log(data)
    if(data){
      this.setState({
        reminderTime:data,
        reminderTimeVisible:false
      })
    }else{
      this.setState({
        reminderTimeVisible:false
      })
    }
  }

  handleEditTimeBack = (data) => {

    const {timeIndex,followRecords} = this.state;
    if(data){
      followRecords[timeIndex].reminderTime = data
      this.handleUpdate(followRecords);
    }

    this.setState({
      editTimeVisible:false
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
      reminderTimeVisible,
      reminderTime,
      editTimeVisible,
      editReminderTimes,
      logisticsDetailsVisible
    } = this.state;
    console.log(followRecords,"followRecords")

    return (
      <>
        <div style={{height:"170px",marginBottom:15}} className={styles.main}>
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
          <p><span><label>单号：</label>{detail.logisticsNumber}
            {
              detail.logisticsNumber ?
                (<Button key="primary" onClick={()=>this.handleDetails()} style={{border: "0",background: "none"}}>查看物流信息</Button>)
                :""
            }
            </span>
            <span><label>SN：</label>{detail.productCoding}</span></p>
        </div>
        <div className={styles.timelineContent}>
          <Timeline>
            {followRecords.map((item,index)=>{
              return (
                <Timeline.Item>
                  <p>
                    <span style={{fontWeight:"bold"}}>{item.userName}</span>
                    {item.type === '1' ? '跟进了该客户' : "添加了计划提醒"}
                    <span
                      onClick={()=>this.handleediTtime(index,item.reminderTime)}
                      style={{color:"rgb(90, 205, 216)",marginLeft:5,cursor:"pointer"}}
                    >{item.reminderTime}</span>
                    <span
                      style={{float:"right",cursor:"pointer"}}
                      onClick={()=>this.handleDelect(index)}
                    >
                      <Icon type="close" />
                    </span>
                  </p>
                  <p>{item.describe}</p>
                  <p>{item.createTime}</p>
                </Timeline.Item>
              )
            })}
          </Timeline>
        </div>
        <div className={styles.tabText}>
          <TextArea
            rows={4}
            value={describe}
            onChange={this.TextAreaChange}
            placeholder='请输入内容（Alt+Enter快速提交）'
          />
          <div>
            <div
              onClick={this.handleReminderTime}
              style={{float:"left",cursor:"pointer"}}
            >
              <Icon
                type="clock-circle"
                style={{margin:"0 10px 0 15px"}}
              />
              计划提醒
            </div>
            <div
              style={{float:"left",cursor:"pointer"}}
            >
              {reminderTime}
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
        </div>
        {reminderTimeVisible?(
          <ReminderTimes
            reminderTimeVisible={reminderTimeVisible}
            handleReminderTimeBack={this.handleReminderTimeBack}
          />
        ):""}
      {/* 物流详情 */}
        {logisticsDetailsVisible?(
          <LogisticsDetails
            logisticsDetailsVisible={logisticsDetailsVisible}
            handleLogisticsDetails={this.handleLogisticsDetails}
          />
        ):""}
        {editTimeVisible?(
          <EditTime
            editTimeVisible={editTimeVisible}
            handleEditTimeBack={this.handleEditTimeBack}
            editReminderTimes={editReminderTimes}
          />
        ):""}
      </>
    );
  }
}

export default Survey;
