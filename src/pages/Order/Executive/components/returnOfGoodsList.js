import React, { PureComponent } from 'react';
import {
  Modal,
  Form,
  Upload, Table, Divider, Button,
} from 'antd';
import { connect } from 'dva';
import {
  returnGoodsList
} from '../../../../services/newServices/order';

import ReturnOfGoodsForm from './returnOfGoodsForm';

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

  render() {
    const {
      form: { getFieldDecorator },
      visible,
      confirmLoading,
      handleCancel,
      returnOfGoodsDataList
    } = this.props;

    const {loading,dataSource,fromVisible} = this.state;

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
        dataIndex: 'status',
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
        dataIndex: 'courier_name',
        width:130
      },
      {
        title: '快递员电话',
        dataIndex: 'courier_mobile',
        width:150
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
          width={950}
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

      </>
    );
  }
}

export default ReturnOfGoodsList;
