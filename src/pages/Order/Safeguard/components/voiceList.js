import React, { PureComponent } from 'react';
import {
  Modal,
  Checkbox,
  Form,
  Input,
  Button,
  message,
  Radio,
  Table, Select, Icon, Tooltip,Upload
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { getFindVoiceRecord } from '../../../../services/newServices/order';

@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class Voice extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:[],
      pagination: {},
    };
  }


  componentWillMount() {
    this.getRecord()
  }

  getRecord = () =>{
    const {voice}=this.props;
    console.log(voice)
    getFindVoiceRecord(voice.outOrderNo).then(res=>{
      if(res.code === 200){
        this.setState({
          data:{
            list:res.data
          },
          // pagination:{
          //   current: res.data.current,
          //   pageSize: res.data.size,
          //   total: res.data.total
          // }
        })
      }else {
        message.error(res.msg)
      }
    })
  }

  // ============ 查询 ===============
  handleSearch = params => {

  };

  // 订单来源
  getStatusCode = (key) => {
    let text = ""
    if(key === 200000 || key === '200000'){ text = "成功" }
    if(key === 200002 || key === '200002'){ text = "用户占线" }
    if(key === 200005 || key === '200005'){ text = "用户无法接通(拒绝)" }
    if(key === 200003 || key === '200003'){ text = "无答应" }
    if(key === 200010 || key === '200010'){ text = "关机" }
    if(key === 200011 || key === '200011'){ text = "停机" }
    if(key === 200007 || key === '200007'){ text = "用户无法接通(不在服务区)" }
    if(key === 200004 || key === '200004'){ text = "空号" }
    if(key === 200012 || key === '200012'){ text = "呼损" }
    if(key === 200130 || key === '200130'){ text = "其他(无法识别)" }
    return text;
  }

  render() {
    const {
      form: { getFieldDecorator },
      VoiceVisible,
      handleCancelVoice,
      } = this.props;

    const {
      data,
      pagination
      } = this.state;

    console.log(data)

    const columns=[
      {
        title: '主叫号码',
        dataIndex: 'caller',
        width: 200,
      },
      {
        title: '接听号码',
        dataIndex: 'callee',
        width: 200,
      },
      {
        title: '语音呼叫结果',
        dataIndex: 'statusCode',
        width: 200,
        render: (key)=>{
          return (
            <div>{this.getStatusCode(key)} </div>
          )
        }
      },
      {
        title: '语音类型',
        dataIndex: 'tollType',
        width: 160,
      },
      {
        title: '语音时长',
        dataIndex: 'duration',
        width: 150,
      },
      {
        title: '语音挂断方',
        dataIndex: 'hangupDirection',
        width: 160,
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        width: 250,
        render: (res) => {
          return(
            moment(res).format('YYYY-MM-DD HH:mm:ss')
          )
        },
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        width: 250,
        render: (res) => {
          return(
            moment(res).format('YYYY-MM-DD HH:mm:ss')
          )
        },
      },
    ]

    return (
      <div>
        <Modal
          title="语音"
          visible={VoiceVisible}
          maskClosable={false}
          width={1100}
          onCancel={handleCancelVoice}
          footer={[
            <Button key="back" onClick={handleCancelVoice}>
              取消
            </Button>,
          ]}
        >
          <Table rowKey={(record, index) => `${index}`} dataSource={data.list} pagination={false} columns={columns} />
        </Modal>
      </div>
    );
  }
}

export default Voice;
