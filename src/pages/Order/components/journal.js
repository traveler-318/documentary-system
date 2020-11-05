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
      pagination: {},
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
        this.setState({
          data:{
            list:res.data.records
          },
          pagination:{
            current: res.data.current,
            pageSize: res.data.size,
            total: res.data.total
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
      pagination,
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
        title: '操作人',
        dataIndex: 'receivingUser',
        width: 200,
      },
      {
        title: '操作内容',
        dataIndex: 'link',
        width: 200,
      },
      {
        title: '操作时间',
        dataIndex: 'deliveryTime',
        width: 200,
        render: (res) => {

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
          <Table rowKey={(record, index) => `${index}`} dataSource={data.list} pagination={pagination} columns={columns} onChange={this.handleSearch} />
        </Modal>
      </div>
    );
  }
}

export default Background;
