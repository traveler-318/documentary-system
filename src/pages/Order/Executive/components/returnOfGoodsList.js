import React, { PureComponent } from 'react';
import {
  Modal,
  Form,
  Upload, Table, Divider, Button, message, Empty, Timeline, Input,
} from 'antd';
import { connect } from 'dva';
import {
  returnGoodsList,
  cancelCourier,
  returnLogisticsQuery
} from '../../../../services/newServices/order';

import ReturnOfGoodsForm from './returnOfGoodsForm';
import ReturnOfGoodsDetail from './returnOfGoodsDetail'

import { remove } from '@/services/region';
import styles from '../../components/edit.less';
const FormItem = Form.Item;
const { TextArea } = Input;

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
      params:{
        size:10,
        current:1
      },
      fromVisible:false,
      detailVisible:false,
      logisticsDetailsVisible:false,
      ReturnReasonVisible:false,
      datailDataInfo:{},
      pagination:{},
      LogisticsList:[],
      list:{},
      cancelMessage:''
    };
  }

  componentWillMount() {
    let {returnOfGoodsDataList} = this.props;
    const {params}=this.state;
    params.orderId=returnOfGoodsDataList[0].id;
    console.log(params)
    this.getDataInfo(params);
  }

  getDataInfo =(params) =>{
    returnGoodsList(params).then(res=>{
      if(res.code ===200) {
        this.setState({
          dataSource: res.data.records,
          pagination:{
            current: res.data.current,
            pageSize: res.data.size,
            total: res.data.total
          },
        })
      }
    })
  }

  handleTableChange = (pagination) => {
    let {returnOfGoodsDataList} = this.props;
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    const {params}=this.state;
    params.current=pagination.current;
    params.orderId=returnOfGoodsDataList[0].id
    this.getDataInfo(params)
  };

  handleClick = ()=>{
    this.setState({fromVisible:true})
  }

  handleFormCancel= ()=>{
    this.setState({fromVisible:false})
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

    const formAllItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };

    const {loading,dataSource,fromVisible,detailVisible,datailDataInfo,
      pagination,logisticsDetailsVisible,LogisticsList,ReturnReasonVisible} = this.state;

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
        width:110
      },
      {
        title: '快递员电话',
        dataIndex: 'courierMobile',
        width:130
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
        width:150
      },
      {
        title: '下单人',
        dataIndex: 'createBy',
        width:160
      },
      {
        title: '操作',
        width: 200,
        render: (text,row) => {
          return(
            <div>
              <a onClick={()=>this.handleDetailOrder(row)}>详情</a>
              {row.kuaidinum !=="" ? (
                <>
                  <Divider type="vertical" />
                  <a onClick={()=>this.handleDetails(row)}>查询物流</a>
                </>
              ):""}
              <Divider type="vertical" />
              <a onClick={()=>this.handleCancelOrder(row)}>取消下单</a>
            </div>
          )
        },
      },
    ];

    return (
      <>
        <Modal
          title="退货"
          width={1250}
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
            pagination={pagination}
            onChange={this.handleTableChange}
          />
          <div style={{textAlign:'right',marginTop:'10px'}}>
            <Button type='primary' onClick={()=>{
              this.handleClick()
            }}>退货</Button>
          </div>

        </Modal>

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
