import React, { PureComponent } from 'react';
import {
  Modal,
  Form,
  Upload, Table, Divider, Button, message,
} from 'antd';
import { connect } from 'dva';
import {
  returnGoodsList,
  cancelCourier
} from '../../../../services/newServices/order';

import ReturnOfGoodsForm from './returnOfGoodsForm';
import ReturnOfGoodsDetail from './returnOfGoodsDetail'

import { remove } from '@/services/region';

@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class ReturnOfGoodsList extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dataSource:[],
      fromVisible:false,
      detailVisible:false,
      datailDataInfo:{}
    };
  }

  componentWillMount() {
    this.getDataInfo();
  }

  getDataInfo =() =>{
    let {returnOfGoodsDataList} = this.props;
    returnGoodsList({
      orderId:returnOfGoodsDataList[0].id
    }).then(res=>{
      if(res.code==200) {
        this.setState({ dataSource: res.data.records })
      }
    })
  }

  handleClick = ()=>{
    this.setState({fromVisible:true})
  }

  handleFormCancel= ()=>{
    this.setState({fromVisible:false})
  }

  handleCancelOrder = (row)=>{
    Modal.confirm({
      title: '取消下单确认',
      content: '确定取消下单该条记录?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        cancelCourier({
          id:row.id
        }).then(res=>{
          if(res.code==200) {
            this.getDataInfo();
          }
        })
      },
      onCancel() {},
    });

  }
  handleDetailOrder = (row) =>{

    this.setState({
      detailVisible:true,
      datailDataInfo:JSON.parse(row.requstJson)
    })
  }

  handleDetailCancel = ()=>{
    this.setState({
      detailVisible:false
    })
  }
  render() {
    const {
      form: { getFieldDecorator },
      visible,
      confirmLoading,
      handleCancel,
      returnOfGoodsDataList
    } = this.props;

    const {loading,dataSource,fromVisible,detailVisible,datailDataInfo} = this.state;

    const columns = [
      {
        title: '物流名称',
        dataIndex: 'kuaidiname',
      },
      {
        title: '物流单号',
        dataIndex: 'kuaidinum',
        width:100
      },
      {
        title: '下单状态',
        dataIndex: 'placeOrderStatus',
        width:100
        // render: (text,row) => {
        //   return(<>
        //     <a onClick={()=>this.handleSubmit(row)}>二维码</a>
        //     <Divider type="vertical" />
        //     <a onClick={()=>this.handlePreview(row)}>预览</a>
        //     <Divider type="vertical" />
        //     <a onClick={()=>this.handleCopy(row)}>复制链接</a>
        //   </>)
        // },
      },
      {
        title: '快递员名字',
        dataIndex: 'courierName',
        width:130
      },
      {
        title: '快递员电话',
        dataIndex: 'courierMobile',
        width:150
      },
      {
        title: '订单金额',
        dataIndex: 'freight',
        width:100
      },
      // {
      //   title: '订单重量',
      //   dataIndex: 'weight',
      //   width:100
      // },
      {
        title: '下单时间',
        dataIndex: 'createTime',
        width:100
      },
      {
        title: '下单人',
        dataIndex: 'createBy',
        width:100
      },
      {
        title: '操作',
        width: 140,
        render: (text,row) => {
          return(
            <div>
              <a onClick={()=>this.handleCancelOrder(row)}>取消下单</a>
              <Divider type="vertical" />
              <a onClick={()=>this.handleDetailOrder(row)}>详情</a>
            </div>
          )
        },
      },
    ];

    return (
      <>
        <Modal
          title="退货"
          width={1150}
          visible={visible}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          maskClosable={false}
          loading={loading}
          footer={null}
        >
          <Table
            columns={columns}
            dataSource={dataSource}
            bordered
            pagination={false}
          />
          <div style={{textAlign:'right',marginTop:'10px'}}>
            <Button type='primary' onClick={()=>{
              this.handleClick()
            }}>退货</Button>
          </div>

        </Modal>

        {/*退货*/}
        {fromVisible?(
          <ReturnOfGoodsForm
            visible={fromVisible}
            returnOfGoodsDataList={returnOfGoodsDataList}
            handleCancel={this.handleFormCancel}
          ></ReturnOfGoodsForm>
        ):''}

        {/*详情*/}
        {detailVisible?(
          <ReturnOfGoodsDetail
            visible={detailVisible}
            datailDataInfo={datailDataInfo}
            handleCancel={this.handleDetailCancel}></ReturnOfGoodsDetail>
        ):''}
      </>
    );
  }
}

export default ReturnOfGoodsList;
