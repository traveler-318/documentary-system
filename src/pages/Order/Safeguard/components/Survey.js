import React, { PureComponent } from 'react';
import {
  Form,
  message,
  Input,
  Card,
  Row,
  Col,
  Empty,
  Button,
  Icon,
  Modal,
  Dropdown,
  Menu,
  Select,
  Timeline,
  Descriptions,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from './edit.less';
import {followupdate,followway,phrase,updateData} from '../../../../services/order/ordermaintenance'
import ReminderTimes from './time'
import EditTime from './editTime'


const { TextArea } = Input;
const { confirm } = Modal;

@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class Survey extends PureComponent {

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
      followType:'',
      followRecords:[],
      reminderTime:"",
      reminderTimeVisible:false,
      editTimeVisible:false,
      timeIndex:"",
      editReminderTimes:"",

      followways:[],
      isPhrase:false,
      phrases:[],
      transactionRecords:[]
    };
  }

  componentWillMount() {
    this.getFollowway();
    this.getPhrase();
  }
  componentDidMount() {
    // let offsetLeftDistance = document.documentElement.clientWidth - this.myRef.current.clientWidth
    // this.setState({
    //   offsetLeftDistance
    // })
  }

  UNSAFE_componentWillReceiveProps(nex){

    const { detail } = this.props;
    let list = [];

    if(nex.detail.followRecords && JSON.parse(nex.detail.followRecords).list){
      list = JSON.parse(nex.detail.followRecords).list
    }

    let d = nex.detail.transactionRecords;
    let list1 = [];
    if(d && JSON.parse(d).list){
      list1 = JSON.parse(d).list
    }

    this.setState({
      detail:nex.detail,
      followRecords:list,
      transactionRecords:list1
    })

  }

  // 修改时间

  handleediTtime = (index,reminderTime) => {
    this.setState({
      editTimeVisible:true,
      timeIndex:index,
      editReminderTimes:reminderTime
    })
  }

  getFollowway(){
    followway().then(res=>{
      this.setState({
        followways:res.data
      })
    })
  }
  getPhrase(){
    phrase().then(res=>{
      this.setState({
        phrases:res.data
      })
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
  handleChange(val){
    this.setState({
      followType:val
    })
  }

  handleEmpty = () => {
    this.setState({
      describe:"",
      reminderTime:"",
    })
};

  handleSubmit = () => {
    const { detail , describe,followType, reminderTime,phrase } = this.state;
    let { followRecords } = this.state;
    if(describe === ""){
      return message.error("请输入跟进内容");
    }
    let param = {
      userName:detail.userName,
      describe,
      followway:followType,
      phrase:phrase,
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

    // if(detail.confirmTag === '4'){
    followupdate(_param).then(res=>{
      if(res.code === 200){
        message.success(res.msg);
        this.props.getEditDetails();
        this.handleEmpty();
      }else{
        message.error(res.msg);
      }
    })
    // }else {
    //   message.warning("当物流签收后才能进入跟进状态");
    // }

  }


  handleReminderTime = () => {
    this.setState({
      reminderTimeVisible:true
    })
  }

  handleReminderTimeBack = (data) => {
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

  handleMenuClick = (e) =>{
    let key = e.key;
    const { phrases,describe } = this.state;
    let val = phrases[key];
    if(describe){
      this.showConfirm(val);
      return false;
    }
    this.setDescribe(val)
  }
  setDescribe(val){
    this.setState({
      describe:val,
      phrase:val
    })
  }

  showConfirm(val) {
    let _this = this;
    confirm({
      content: '你选择的常用语将覆盖当前填写内容？',
      cancelText:'取消',
      okText:'确定',
      onOk() {
        _this.setDescribe(val)
      },
      onCancel() {
      },
    });
  }

  clientStatusName(){
    const {detail} = this.state;
    let s = this.props.clientStatus.find(item=>item.id == detail.clientStatus);
    return s? s.labelName :''
  }

  transdate (time) {
    let date = new Date();
    date.setFullYear(time.substring(0, 4));
    date.setMonth(time.substring(5, 7) - 1);
    date.setDate(time.substring(8, 10));
    date.setHours(time.substring(11, 13));
    date.setMinutes(time.substring(14, 16));
    date.setSeconds(time.substring(17, 19));
    return Date.parse(date) / 1000;
  }

  timediff ($begin_time) {
    if(!$begin_time) return '';
    let $end_time = Date.parse(new Date())/ 1000;
    $begin_time = this.transdate($begin_time);
    let $starttime = $begin_time
    let $endtime = $end_time
    //计算天数
    let $timediff = $endtime - $starttime;
    var $days = parseInt($timediff / 86400);
    //计算小时数
    var $remain = $timediff % 86400;
    var $hours = parseInt($remain / 3600);
    //计算分钟数
    var $remain = $remain % 3600;
    var $mins = parseInt($remain / 60);
    //计算秒数
    // var $secs = $remain % 60;
    // $days=>天
    // $hours=>时
    // $mins=>分
    // $secs=>秒
    let $res = '';
    if($days>0){
      $res += $days+'天';
    }
    if($hours>0){
      $res += $hours+'小时';
    }
    if($hours>0){
      $res += $mins+'分钟';
    }
    return $res
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const {
      detail,
      describe,
      followRecords,
      reminderTimeVisible,
      reminderTime,
      editTimeVisible,
      editReminderTimes,
      followways,
      phrases,
      transactionRecords
    } = this.state;
    console.log(followRecords,"followRecords")

    const menu = (
      <Menu onClick={(e)=>this.handleMenuClick(e)}>
        {phrases.map((item,index)=>{
          return (
            <Menu.Item key={index}>
                {item}
            </Menu.Item>
          )
        })}
      </Menu>
    );

    return (
      <>
        <div style={{marginBottom:15,paddingBottom:5}} className={styles.main}>
          <Descriptions column={2}>
            <Descriptions.Item label="商户名">{detail.merchantName}</Descriptions.Item>
            <Descriptions.Item label="商户号">{detail.merchants}</Descriptions.Item>
            <Descriptions.Item label="激活时间">{detail.activationSigntime}</Descriptions.Item>
            <Descriptions.Item label="维护时间">{detail.createTime}</Descriptions.Item>
          </Descriptions>
          <Row gutter={16} style={{textAlign:'center'}}>
            <Col span={6}>
              <Card bordered={true} style={{lineHeight:'30px',height:'70px',backgroundColor:'#F1F6FC'}}>
                <div style={{fontWeight:'bold'}}>维护状态</div>
                <div>{this.clientStatusName()}</div>
              </Card>
            </Col>
            <Col span={6}>
              <Card bordered={true} style={{lineHeight:'30px',height:'70px',backgroundColor:'#F1F6FC'}}>
                <div style={{fontWeight:'bold'}}>交易总额</div>
                <div>{detail.totalTradingVolume}元</div>
              </Card>
            </Col>
            <Col span={6}>
              <Card bordered={true} style={{lineHeight:'30px',height:'70px',backgroundColor:'#F1F6FC'}}>
                <div style={{fontWeight:'bold'}}>交易次数</div>
                <div>{transactionRecords.length}次</div>
              </Card>
            </Col>
            <Col span={6}>
              <Card bordered={true} style={{lineHeight:'30px',height:'70px',backgroundColor:'#F1F6FC'}}>
                <div style={{fontWeight:'bold'}}>距离上次跟进</div>
                <div>{this.timediff(detail.followTime)}</div>
              </Card>
            </Col>
          </Row>
        </div>
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
                    <span
                      onClick={()=>this.handleediTtime(index,item.reminderTime)}
                      style={{color:"rgb(90, 205, 216)",marginLeft:5,cursor:"pointer"}}
                    >{item.reminderTime}</span>
                    <span
                      style={{float:"right",cursor:"pointer",color:"#bfbfbf"}}
                      onClick={()=>this.handleDelect(index)}
                    >
                      <Icon type="close" />
                    </span>
                  </p>
                  <p>{item.followway+','+item.describe}</p>
                  <p>{item.createTime}</p>
                </Timeline.Item>
              )
            })}
          </Timeline>
          )}
        </div>
        <div className={styles.tabText}
          // style={{
          //   position:"fixed",
          //   bottom:0,
          //   left:offsetLeftDistance-24,
          //   right:"44px"
          // }}
        >
          <div style={{margin:'5px'}}>
            <Select placeholder={"选择跟进方式"} onSelect={(v)=>this.handleChange(v)} style={{ width: 200,paddingRight:'5px' }}>
              {followways.map((item,index)=>{
                return (<Select.Option key={index} value={item}>{item}</Select.Option>)
              })}
            </Select>
            <div style={{cursor:"pointer",border:"1px solid #ccc",height:'32px',padding:'4px 6px',display:'inline-block',marginRight:'5px', color: '#bfbfbf',borderRadius:'2px'}} >
              <span
                onClick={this.handleReminderTime}>
                <Icon
                  type="clock-circle"
                  style={{margin:"0 10px 0 5px"}}
                />
                计划提醒
              </span>
              <span>
                {reminderTime}
              </span>
            </div>
            <Dropdown overlay={menu} placement="bottomLeft" trigger='click'>
              <Button>常用语</Button>
            </Dropdown>
          </div>
          <TextArea
            rows={2}
            value={describe}
            onChange={this.TextAreaChange}
            placeholder='请输入内容（Alt+Enter快速提交）'
          />
          <div>

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
