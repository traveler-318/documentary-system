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
import { getFindSmsRecord } from '../../../../services/newServices/order';

@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class SMS extends PureComponent {

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
    const {smsList}=this.props;
    getFindSmsRecord(smsList.outOrderNo).then(res=>{
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


  render() {
    const {
      form: { getFieldDecorator },
      SMSVisible,
      handleCancelSMS,
      } = this.props;

    const {
      data,
      pagination
      } = this.state;

    console.log(data)

    const columns=[
      {
        title: '订单号',
        dataIndex: 'outOrderNo',
        width: 260,
      },
      {
        title: '发送类型',
        dataIndex: 'smsCategory',
        width: 140,
      },
      {
        title: '接收人电话',
        dataIndex: 'userPhone',
        width: 160,
      },
      {
        title: '发送时间',
        dataIndex: 'sendTime',
        width: 250,
        render: (res) => {
          return(
            moment(res).format('YYYY-MM-DD HH:mm:ss')
          )
        },
      },
      {
        title: '发送结果',
        dataIndex: 'asynchronousStatus',
        width: 140,
      },
    ]

    return (
      <div>
        <Modal
          title="短信"
          visible={SMSVisible}
          width={850}
          onCancel={handleCancelSMS}
          maskClosable={false}
          footer={[
            <Button key="back" onClick={handleCancelSMS}>
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

export default SMS;
