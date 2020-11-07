import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, Row, Select, DatePicker, Divider, Dropdown, Menu, Icon, Modal, message, Tabs } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';


import Panel from '../../../../components/Panel';
import Grid from '../../../../components/Sword/Grid';
import { ORDER_LIST } from '../../../../actions/order';
import func from '../../../../utils/Func';
import { orderDetail } from '../../../../services/newServices/order';
import { ORDERSTATUS, ORDERTYPPE, GENDER, ORDERTYPE, ORDERSOURCE, TIMETYPE, LOGISTICSCOMPANY } from '../data.js';

const FormItem = Form.Item;

@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class OrderList extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:{
        salesman:'123'
      },
      loading:false,
      params:{
        size:10,
        current:1
      },
    };
  }

  // ============ 初始化数据 ===============
  componentWillMount() {
    const { orderDetail } = this.props;
    this.setState({
      data:{
        list:orderDetail
      }
    })
  }

  getList = (detail) =>{
    const params={
      userAddress:detail.userAddress,
      userPhone:detail.userPhone,
      userName:detail.userName,
      size:100,
      current:1
    }
    orderDetail(params).then(res=>{
      console.log(res)
      const data = res.data.records;
      console.log(data)
      let list=[]
      for(let i=0; i<data.length; i++){
        if(data[i].id != detail.id){
          list.push(data[i])
        }
      }
      this.setState({
        data:{
          list:list
        }
      })
    })
  }

  // 详情
  handleDetsils = (row) => {
    router.push(`/order/allOrders/edit/${row.id}`);
  }

  getText = (key, type) => {
    let text = ""
    type.map(item=>{
      if(item.key === key){
        text = item.name
      }
    })
    console.log(text)
    return text
  }

  render() {

    const {
      form,
    } = this.props;

    const {
      data,
      loading,
    } = this.state;

    const columns = [
        {
            title: '订单来源',
            dataIndex: 'orderSource',
            ellipsis: true,
            render: (key)=>{
              return (
                <div>{this.getText(parseInt(key),ORDERSOURCE)} </div>
              )
            }
        },
        {
            title: '产品分类',
            dataIndex: 'productType',
            ellipsis: true,
        },
        {
            title: '归属销售',
            dataIndex: 'salesman',
            ellipsis: true,
        },
        {
            title: '下单时间',
            dataIndex: 'createTime',
            ellipsis: true,
        },
        {
            title: '订单状态',
            dataIndex: 'confirmTag',
            ellipsis: true,
            render: (key)=>{
              return (
                <div>{this.getText(key,ORDERSTATUS)} </div>
              )
            }
        },
        {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (text,row) => {
                return(
                  <div>
                    <a onClick={()=>this.handleDetsils(row)}>详情</a>
                  </div>
                )
            },
        },
    ];

    return (
      <Grid
        form={form}
        data={data}
        loading={loading}
        columns={columns}
        // multipleChoice={true}
      />
    );
  }
}
export default OrderList;
