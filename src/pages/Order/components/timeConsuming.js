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
import { ordertimeinfotask } from '../../../services/newServices/order';

const { Option } = Select;
const FormItem = Form.Item;
const { Dragger } = Upload;
@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class timeConsuming extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:[],
      pagination: {},
      params:{
        size:1,
        current:1,
      },
    };
  }


  componentWillMount() {
    this.get0rdertimeinfotask()
  }

  get0rdertimeinfotask = () =>{
    const {timeConsumingList}=this.props;
    const {params}=this.state;
    ordertimeinfotask(params).then(res=>{
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

  };


  render() {
    const {
      form: { getFieldDecorator },
      timeConsumingVisible,
      handleCancelTimeConsuming,
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
        title: '跟进耗时',
        dataIndex: 'followTimeConsuming',
        width: 200,
      },
      {
        title: '跟进时效',
        dataIndex: 'followAgeing',
        width: 200,
      },
      {
        title: '激活耗时',
        dataIndex: 'activateTimeConsuming',
        width: 200,
      },
    ]

    return (
      <div>
        <Modal
          title="耗时检测"
          visible={timeConsumingVisible}
          width={850}
          onCancel={handleCancelTimeConsuming}
          maskClosable={false}
          footer={[
            <Button key="back" onClick={handleCancelTimeConsuming}>
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

export default timeConsuming;
