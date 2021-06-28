import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Form, Divider, Modal, Timeline, Empty, Button, Input, message } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';

import { cancelCourier, orderDetail, returnGoodsList, returnLogisticsQuery } from '../../../services/newServices/order';
import ReturnOfGoodsDetail from '../Executive/components/returnOfGoodsDetail';
import styles from './edit.less';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class ReturnOfGoods extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:{},
      pagination:{},
      params:{
        size:10,
        current:1
      },
      etailVisible:false,
      datailDataInfo:{},
      list:{},
      LogisticsList:[],
      logisticsDetailsVisible:false,
      ReturnReasonVisible:false,
    };
  }

  // ============ 初始化数据 ===============
  componentWillMount() {
    const { detail } = this.props;
    const {params}=this.state;
    params.orderId=detail.id
    this.getList(params)
  }

  getList = (params) =>{
    returnGoodsList(params).then(res=>{
      if(res.code ===200) {
        this.setState({
          data:{
            list:res.data.records
          },
          pagination:{
            current: res.data.current,
            pageSize: res.data.size,
            total: res.data.total
          },
        })
      }
    })
  }


  handleCancelOrder = (row)=>{
    this.setState({
      ReturnReasonVisible:true,
      list:row
    })
  }

  handleCancelReturnReason =()=>{
    this.setState({
      ReturnReasonVisible:false
    })
  }

  handlEcancelCourier =()=>{
    const {list}=this.state
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        cancelCourier({
          id:list.id,
          cancelMessage:values.cancelMessage
        }).then(res=>{
          if(res.code ===200) {
            this.getDataInfo();
            message.success("取消成功")
            this.setState({
              ReturnReasonVisible:false
            })
          }else {
            message.error(res.msg)
          }
        })

      }
    })
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

  // 物流详情窗口
  handleDetails = (row) => {
    returnLogisticsQuery({
      kuaidinum:row.kuaidinum
    }).then(resp => {
      console.log(resp)
      this.setState({
        LogisticsList:resp.data,
        logisticsDetailsVisible:true,
      })
    });
  };

  handleLogisticsDetails = () => {
    this.setState({
      logisticsDetailsVisible:false
    })
  };

  render() {

    const {
      form:{getFieldDecorator },
    } = this.props;

    const {
      data,
      detailVisible,datailDataInfo,pagination,logisticsDetailsVisible,LogisticsList,ReturnReasonVisible
    } = this.state;

    const formAllItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };

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
        width: 210,
        render: (text,row) => {
          return(
            <div>
              <a onClick={()=>this.handleDetailOrder(row)}>详情</a>
              <Divider type="vertical" />
              <a onClick={()=>this.handleDetails(row)}>查询物流</a>
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
          <Table columns={columns} bordered={true} pagination={pagination} onChange={this.handleTableChange} dataSource={data.list} scroll={{ x: 1080 }} />
        </div>
        {/*详情*/}
        {detailVisible?(
          <ReturnOfGoodsDetail
            visible={detailVisible}
            datailDataInfo={datailDataInfo}
            handleCancel={this.handleDetailCancel}></ReturnOfGoodsDetail>
        ):''}

        <Modal
          title="物流详情"
          visible={logisticsDetailsVisible}
          maskClosable={false}
          width={550}
          onCancel={this.handleLogisticsDetails}
          footer={null}
        >
          <div className={styles.logisticsTime}>
            {LogisticsList.length <= 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <Timeline>
                {LogisticsList.map(item=>{
                  console.log(item)
                  return (
                    <Timeline.Item>
                      <p>{item.time}</p>
                      <p>{item.status}</p>
                    </Timeline.Item>
                  )
                })}
              </Timeline>
            )}
          </div>
        </Modal>

        <Modal
          title="取消原因"
          visible={ReturnReasonVisible}
          maskClosable={false}
          destroyOnClose
          width={660}
          onCancel={this.handleCancelReturnReason}
          footer={[
            <Button key="back" onClick={this.handleCancelReturnReason}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={()=>this.handlEcancelCourier()}>
              确定
            </Button>,
          ]}
        >
          <Form>
            <FormItem {...formAllItemLayout} label="取消原因">
              {getFieldDecorator('cancelMessage',{
                rules: [
                  {
                    required: true,
                    message: '请填写取消原因',
                  },
                ],
              })(
                <TextArea rows={2} />
              )}
            </FormItem>
          </Form>
        </Modal>



      </>

    );
  }
}
export default ReturnOfGoods;
