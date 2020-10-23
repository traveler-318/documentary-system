import React, { PureComponent } from 'react';
import {
  Modal,
  Checkbox,
  Form,
  Input,
  Button,
  message,
  Radio,
  Table, Select, Icon, Tooltip,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { getCookie } from '../../../../utils/support';
import { getImg} from '../../../../services/newServices/product';
import Img from './Img'

const { Option } = Select;
const FormItem = Form.Item;
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
      handleImgDetailsVisible:false
    };
  }


  componentWillMount() {

    getImg(1,100).then(res=>{
      console.log(res)
      this.setState({
        data:{
          list:res.data.records
        }
      })
    })
  }


  // ======确认==========

  handleSubmit = () => {
    const {  list } = this.state;
    this.props.handleClick(list)
    this.props.handleCancelImg(list)
  };

  onChange = (row) => {
    console.log(row)
    this.setState({
      list:row
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
      ImgDetails
      } = this.state;

    console.log(data)

    const columns=[
      {
        title: '',
        dataIndex: 'id',
        width: 50,
        render: (res,rows) => {
          return(
            <Radio onChange={() =>this.onChange(rows)}></Radio>
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
          visible={handleImgVisible}
          width={550}
          onCancel={handleCancelImg}
          footer={[
            <Button key="back" onClick={handleCancelImg}>
              取消
            </Button>,
            <Button type="primary" loading={loading} onClick={()=>this.handleSubmit()}>
              确定
            </Button>,
          ]}
        >
          <Table rowKey={(record, index) => `${index}`} dataSource={data.list} columns={columns} />
        </Modal>
        {/* 查看图片 */}
        {handleImgDetailsVisible?(
          <Img
            handleImgDetailsVisible={handleImgDetailsVisible}
            ImgDetails={ImgDetails}
            handleCancelImgDetails={this.handleCancelImgDetails}
          />
        ):""}
      </div>
    );
  }
}

export default Background;
