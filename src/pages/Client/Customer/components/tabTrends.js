import React, { PureComponent } from 'react';
import { Form, message, Input,Empty, Button, Icon,Timeline,} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from './edit.less';
// import { orderFollowing } from '../../../services/newServices/order';
import ReminderTimes from '@/pages/Order/components/time';

const { TextArea } = Input;

@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class TabTrends extends PureComponent {

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
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

      ],
      followRecords:[],
      reminderTime:"",
      reminderTimeVisible:false,
      timeIndex:"",
      editReminderTimes:""
    };
  }

  componentWillMount() {

  }
  componentDidMount() {
    // let offsetLeftDistance = document.documentElement.clientWidth - this.myRef.current.clientWidth
    // this.setState({
    //   offsetLeftDistance
    // })
  }

  TextAreaChange = (e) => {
    this.setState({
      describe:e.target.value
    })
  };

  handleEmpty = () => {
    this.setState({
      describe:"",
      reminderTime:"",
    })
  };

  handleSubmit = () => {
    const { detail , describe, reminderTime } = this.state;
    let { followRecords } = this.state;
    if(describe === ""){
      return message.error("请输入跟进内容");
    }
    let param = {
      userName:detail.userName,
      describe,
      createTime:moment(new Date(),'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
      type:reminderTime === "" ? "1" : "2",// 1是跟进-2提醒时间，
      reminderTime
    }

    followRecords.unshift(param);

    let _param = {
      id:detail.id,
      deptId:detail.deptId,
      tenantId:detail.tenantId,
      confirmTag:detail.confirmTag,
      outOrderNo:detail.outOrderNo,
      salesman:detail.salesman,
      userName:detail.userName,
      userPhone:detail.userPhone,
      reminderTime:reminderTime === ""? null:moment(reminderTime,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
    }
    _param.followRecords = JSON.stringify({
      list:followRecords
    })
    console.log(_param)

    // orderFollowing(_param).then(res=>{
    //   if(res.code === 200){
    //     message.success(res.msg);
    //     this.props.getEditDetails();
    //     this.handleEmpty();
    //   }else{
    //     message.error(res.msg);
    //   }
    // })

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

  render() {
    const {
      detail,
      describe,
      followRecords,
      orderType,
      reminderTimeVisible,
      reminderTime
    } = this.state;
    console.log(followRecords,"followRecords")

    return (
      <>
        <div className={styles.timelineContent}>
          {followRecords.length <= 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <Timeline>
              {followRecords.map((item,index)=>{
                return (
                  <Timeline.Item>
                    <p>
                      <span style={{fontWeight:"bold"}}>{item.userName}</span>
                      {item.type === '1' ? '跟进了该客户' : "添加了计划提醒"}
                      <Icon type="close" />
                    </p>
                    <p>{item.describe}</p>
                    <p>{item.createTime}</p>
                  </Timeline.Item>
                )
              })}
            </Timeline>
          )}
        </div>
        <div className={styles.tabText}>
          <TextArea
            rows={2}
            value={describe}
            onChange={this.TextAreaChange}
            placeholder='请输入内容（Alt+Enter快速提交）'
          />
          <div>
            <div
              onClick={this.handleReminderTime}
              style={{float:"left",cursor:"pointer",paddingTop:7}}
            >
              <Icon
                type="clock-circle"
                style={{margin:"0 10px 0 15px"}}
              />
              计划提醒
            </div>
            <div
              style={{float:"left",cursor:"pointer",paddingTop:7}}
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
              >写跟进</Button>
            </div>
          </div>
        </div>
        {reminderTimeVisible?(
          <ReminderTimes
            reminderTimeVisible={reminderTimeVisible}
            handleReminderTimeBack={this.handleReminderTimeBack}
          />
        ):""}
      </>
    );
  }
}

export default TabTrends;
