import React, { PureComponent } from 'react';
import {
  Modal,
  Form,
  Upload, Table, Divider, Button,
} from 'antd';
import { connect } from 'dva';
import {
  returnOfGoodsList
} from '../../../../services/newServices/order';

import returnOfGoodsForm from './returnOfGoodsForm';

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
      fromVisible:false
    };
  }

  componentWillMount() {
    this.getDataInfo();
  }

  getDataInfo =() =>{
    let {returnOfGoodsList} = this.props;
    returnOfGoodsList({
      orderId:returnOfGoodsList[0].id
    }).then(res=>{
      this.setState({dataSource:res.data})
    })
  }

  handleClick = ()=>{
    this.setState({fromVisible:true})
  }

  handleFormCancel= ()=>{
    this.setState({fromVisible:false})
  }

  render() {
    const {
      form: { getFieldDecorator },
      visible,
      confirmLoading,
      handleOrderImportCancel,
      returnOfGoodsList
    } = this.props;

    const {loading,dataSource,fromVisible} = this.state;

    const columns = [
      {
        title: '物流名称',
        dataIndex: 'kuaidicom',
        width:180
      },
      {
        title: '物流单号',
        dataIndex: 'kuaidinum',
        width:100
      },
      {
        title: '下单状态',
        dataIndex: 'status',
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
        dataIndex: 'courier_name',
        width:100
      },
      {
        title: '快递员电话',
        dataIndex: 'courier_mobile',
        width:100
      },
      {
        title: '订单金额',
        dataIndex: 'freight',
        width:100
      },
      {
        title: '订单重量',
        dataIndex: 'weight',
        width:100
      },
    ];

    return (
      <>
        <Modal
          title="退货"
          width={550}
          visible={visible}
          confirmLoading={confirmLoading}
          onCancel={handleOrderImportCancel}
          maskClosable={false}
          loading={loading}
        >
          <Table
            columns={columns}
            dataSource={dataSource}
            bordered
            pagination={false}
          />
          <Button type='primary' onClick={()=>{
            this.handleClick()
          }}>退货</Button>
        </Modal>

        {/*退货*/}
        {fromVisible?(
          <returnOfGoodsForm
            visible={fromVisible}
            returnOfGoodsList={returnOfGoodsList}
            handleCancel={this.handleFormCancel}
          ></returnOfGoodsForm>
        ):''}
      </>
    );
  }
}

export default ReturnOfGoodsList;
