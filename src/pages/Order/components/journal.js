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
import router from 'umi/router';
import { getToken } from '@/utils/authority';
import {getRecord } from '../../../services/newServices/order';

const { Option } = Select;
const FormItem = Form.Item;
const { Dragger } = Upload;
@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class Background extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:[],
      senderId:'',
      params:{
        pageSize:10,
        current:1
      },
      handleImgDetailsVisible:false,
      visible:false,
    };
  }


  componentWillMount() {
    this.getRecord()
  }

  getRecord = () =>{
    const {journalList}=this.props
    getRecord(journalList.id).then(res=>{
      console.log(res)

      if(res.code === 200){
        const data=res.data
        const list=[];

        if(data.thereviewUser){
          const item={};
          item.name=data.thereviewUser
          item.time=data.thereviewTime
          item.content="初审"
          list.push(item)
        }
        if(data.approvedUser){
          const item={};
          item.name=data.approvedUser
          item.time=data.approvedTime
          item.content="终审"
          list.push(item)
        }
        if(data.deliveryUser){
          const item={};
          item.name=data.deliveryUser
          item.time=data.deliveryTime
          item.content="已发货"
          list.push(item)
        }
        if(data.onthewayUser){
          const item={};
          item.name=data.onthewayUser
          item.time=data.onthewayTime
          item.content="在途中"
          list.push(item)
        }
        if(data.receivingUser){
          const item={};
          item.name=data.receivingUser
          item.time=data.receivingTime
          item.content="已签收"
          list.push(item)
        }
        if(data.ongoingUser){
          const item={};
          item.name=data.ongoingUser
          item.time=data.ongoingTime
          item.content="跟进中"
          list.push(item)
        }
        if(data.activationUser){
          const item={};
          item.name=data.activationUser
          item.time=data.activationTime
          item.content="已激活"
          list.push(item)
        }
        if(data.refundUser){
          const item={};
          item.name=data.refundUser
          item.time=data.refundTime
          item.content="已退回"
          list.push(item)
        }
        if(data.cancelUser){
          const item={};
          item.name=data.cancelUser
          item.time=data.cancelTime
          item.content="已取消"
          list.push(item)
        }

        if(data.overdueUser){
          const item={};
          item.name=data.overdueUser
          item.time=data.overdueTime
          item.content="已过期"
          list.push(item)
        }
        this.setState({
          data:{
            list:list
          }
        })
      }else {
        message.error(res.msg)
      }
    })
  }

  // ============ 查询 ===============
  handleSearch = params => {
    console.log(params)
    this.setState({
      params
    },()=>{
      this.getImg();
    })
  };


  render() {
    const {
      form: { getFieldDecorator },
      journalVisible,
      handleCancelJournal,
      } = this.props;

    const {
      data,
      } = this.state;

    console.log(data)

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 16 },
      },
    };

    const columns=[
      {
        title: '操作类型(首次) ',
        dataIndex: 'content',
        width: 200,
      },
      {
        title: '操作人',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '操作时间',
        dataIndex: 'time',
        width: 200,
        render: (res) => {
          return(
            moment(res).format('YYYY-MM-DD HH:mm:ss')
          )
        },
      }
    ]

    return (
      <div>
        <Modal
          title="操作日志"
          visible={journalVisible}
          width={550}
          onCancel={handleCancelJournal}
          footer={[
            <Button key="back" onClick={handleCancelJournal}>
              取消
            </Button>,
            <Button type="primary" onClick={handleCancelJournal}>
              确定
            </Button>,
          ]}
        >
          <Table rowKey={(record, index) => `${index}`} dataSource={data.list} pagination={false} columns={columns} onChange={this.handleSearch} />
        </Modal>
      </div>
    );
  }
}

export default Background;
