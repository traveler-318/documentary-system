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
    this.getImg()
  }

  getImg = () =>{
    const {params}=this.state
    getImg(params.current,params.pageSize).then(res=>{
      console.log(res)
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
        title: '',
        dataIndex: 'id',
        width: 50,
        render: (res,rows) => {
          return(
            <Radio checked={res===senderId?true:false} onChange={() =>this.onChange(rows)}></Radio>
          )
        },
      },
      {
        title: '详情图',
        dataIndex: 'link',
        width: 400,
      },{
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 80,
        render: (row) => {
          return(
            <div>
              <a onClick={()=>this.handleImg(row)}>查看</a>
            </div>
          )
        },
      },
    ]

    return (
      <div>
        <Modal
          title="选择图片"
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
