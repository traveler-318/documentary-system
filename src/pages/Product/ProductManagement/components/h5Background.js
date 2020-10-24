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
import { getCookie } from '../../../../utils/support';
import { getImg} from '../../../../services/newServices/product';
import Img from './Img'
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



  // ======确认==========

  handleSubmit = () => {
    const {  list } = this.state;
    this.props.handleClick(list)
    this.props.handleCancelImg(list)
  };

  onChange = (row) => {
    console.log(row)
    this.setState({
      list:row,
      senderId: row.id,
    })
  }

  // 图片弹框
  handleImg = (row) => {
    console.log(row)
    this.setState({
      handleImgDetailsVisible:true,
      ImgDetails:row.link
    })
  }

  handleCancelImgDetails = () => {
    this.setState({
      handleImgDetailsVisible:false
    })
  }


  //图片上传弹框
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  cancelModal = () =>{
    this.setState({
      visible: false,
    });
    this.getImg()
  }
    
  onUpload = info => {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} 附件上传成功!`);
      this.cancelModal();
    } else if (status === 'error') {
      message.error(`${info.file.response.msg}`);
    }
  };


    

  render() {
    const {
      form: { getFieldDecorator },
      handleImgVisible,
      handleCancelImg,
      } = this.props;

    const {
      data,
      loading,
      handleImgDetailsVisible,
      ImgDetails,
      visible,
      senderId,
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

    const uploadProps = {
      name: 'file',
      headers: {
        'Blade-Auth': getToken(),
      },
      action: '/api/blade-resource/oss/endpoint/put-file-attach',
    };

    return (
      <div>
        <Modal
          title="选择图片"
          visible={handleImgVisible}
          width={550}
          onCancel={handleCancelImg}
          footer={[
            <Button key="back" onClick={handleCancelImg}>
              取消
            </Button>,
            <Button type="danger" onClick={this.showModal}>
            上传
          </Button>,
            <Button type="primary" loading={loading} onClick={()=>this.handleSubmit()}>
              确定
            </Button>,
          ]}
        >
          <Table rowKey={(record, index) => `${index}`} dataSource={data.list} pagination={pagination} columns={columns} onChange={this.handleSearch} />
        </Modal>
        {/* 查看图片 */}
        {handleImgDetailsVisible?(
          <Img
            handleImgDetailsVisible={handleImgDetailsVisible}
            ImgDetails={ImgDetails}
            handleCancelImgDetails={this.handleCancelImgDetails}
          />
        ):""}

      <Modal
          title="附件上传"
          width={500}
          visible={visible}
          onOk={this.cancelModal}
          onCancel={this.cancelModal}
          okText="确认"
          cancelText="取消"
        >
          <Form style={{ marginTop: 8 }} hideRequiredMark>
            <FormItem {...formItemLayout} label="附件上传">
              <Dragger {...uploadProps} onChange={this.onUpload}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">将文件拖到此处，或点击上传</p>
              </Dragger>
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Background;
