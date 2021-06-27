import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Form, Divider, Modal, message } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';

import { cancelCourier, orderDetail, returnGoodsList } from '../../../services/newServices/order';
import ReturnOfGoodsDetail from '../Executive/components/returnOfGoodsDetail';

const FormItem = Form.Item;

@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class ReturnOfGoods extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:{},
      etailVisible:false,
      datailDataInfo:{}
    };
  }

  // ============ 初始化数据 ===============
  componentWillMount() {
    const { detail } = this.props;
    this.getList(detail)
  }

  getList = (detail) =>{
    returnGoodsList({
      orderId:detail.id
    }).then(res=>{
      if(res.code === 200) {
        this.setState({
          data:{
            list:res.data.records
          }
        })
      }
    })
  }

  handleCancelOrder = (row)=>{
    const _this=this;
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
          if(res.code ===200) {
            _this.getDataInfo();
            message.success("取消成功")
          }else {
            message.error(res.msg)
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
      form,
    } = this.props;

    const {
      data,
      detailVisible,datailDataInfo
    } = this.state;

    const columns = [
      {
        title: '物流名称',
        dataIndex: 'kuaidiname',
        width:90
      },
      {
        title: '物流单号',
        dataIndex: 'kuaidinum',
        width:90
      },
      {
        title: '下单状态',
        dataIndex: 'placeOrderStatus',
        width:90
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
        width:100
      },
      {
        title: '快递员电话',
        dataIndex: 'courierMobile',
        width:120
      },
      {
        title: '订单金额',
        dataIndex: 'freight',
        width:90
      },
      {
        title: '下单时间',
        dataIndex: 'createTime',
        width:160
      },
      {
        title: '下单人',
        dataIndex: 'createBy',
        width:160
      },
      {
        title: '操作',
        fixed: 'right',
        width: 140,
        render: (text,row) => {
          return(
            <div>
              <a onClick={()=>this.handleDetailOrder(row)}>详情</a>
              <Divider type="vertical" />
              <a onClick={()=>this.handleCancelOrder(row)}>取消下单</a>
            </div>
          )
        },
      },
    ];
    return (
      <>
        <div style={{margin:"20px"}}>
          <Table columns={columns} bordered={true} pagination={false} dataSource={data.list} scroll={{ x: 1080 }} />
        </div>
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
export default ReturnOfGoods;
