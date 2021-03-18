import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Tag } from 'antd';



import Grid from '../../../../components/Sword/Grid';
import { ORDERSTATUS } from '../data.js';
import { clientOrder } from '@/services/order/customer';


@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class OrderList extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      detail:{},
      data:{
        salesman:'123'
      },
      loading:false,
    };
  }

  // ============ 初始化数据 ===============
  componentWillMount() {
    const { detail,orderDetail,orderPagination } = this.props;
    this.setState({
      detail:detail,
      data:{
        list:orderDetail,
        pagination:orderPagination
      }
    })
  }

  getList = (p) =>{
    console.log(p,"查询参数")
    const { detail } = this.state;
    const params={
      clientPhone:detail.clientPhone,
      size:p.size,
      current:p.current,
      clientId: detail.id,
      associateOrderId: detail.associateOrderId,
    }
    clientOrder(params).then(res=>{
      const data = res.data.records;
      this.setState({
        data:{
          list:data,
          pagination:{
            total:res.data.total,
            current:res.data.current,
            pageSize:res.data.size,
          }
        }
      })
    })
  }

  // 订单状态
  getORDERSTATUS = (key) => {
    let text = ""
    if(key === 0 || key === '0'){ text = "待审核" }
    if(key === 1 || key === '1'){ text = "已初审" }
    if(key === 2 || key === '2'){ text = "已终审" }
    if(key === 3 || key === '3'){ text = "已发货" }
    if(key === 4 || key === '4'){ text = "在途中" }
    if(key === 5 || key === '5'){ text = "已签收" }
    if(key === 6 || key === '6'){ text = "跟进中" }
    if(key === 7 || key === '7'){ text = "已激活" }
    if(key === 11 || key === '11'){ text = "退回中" }
    if(key === 8 || key === '8'){ text = "已退回" }
    if(key === 9 || key === '9'){ text = "已取消" }
    if(key === 10 || key === '10'){ text = "已过期" }
    return text;
  }
  // 订单状态颜色
  getORDERSCOLOR = (key) => {
    let text = ""
    if(key === 0 || key === '0'){ text = "#E6A23C" }
    if(key === 1 || key === '1'){ text = "#409EFF" }
    if(key === 2 || key === '2'){ text = "#409EFF" }
    if(key === 3 || key === '3'){ text = "#409EFF" }
    if(key === 4 || key === '4'){ text = "#409EFF" }
    if(key === 5 || key === '5'){ text = "#F56C6C" }
    if(key === 6 || key === '6'){ text = "#F56C6C" }
    if(key === 7 || key === '7'){ text = "#67C23A" }
    if(key === 11 || key === '11'){ text = "#909399" }
    if(key === 8 || key === '8'){ text = "#909399" }
    if(key === 9 || key === '9'){ text = "#909399" }
    if(key === 10 || key === '10'){ text = "#909399" }
    return text;
  }

  getText = (key, type) => {
    let text = ""
    type.map(item=>{
      if(item.key === key){
        text = item.name
      }
    })
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
          title: '姓名',
          dataIndex: 'userName',
          ellipsis: true,
        },
        {
            title: '手机号',
            dataIndex: 'userPhone',
            ellipsis: true,
        },
        {
            title: '订单号',
            dataIndex: 'outOrderNo',
            ellipsis: true,
        },
        {
          title: '订单状态',
            dataIndex: 'confirmTag',
          ellipsis: true,
          render: (key)=>{
            return (
              <Tag color={this.getORDERSCOLOR(key)}>
                {this.getORDERSTATUS(key)}
              </Tag>
            )
          }
        },
        {
          title: '销售',
            dataIndex: 'salesman',
          ellipsis: true,
        },
        {
            title: '时间',
            dataIndex: 'createTime',
            ellipsis: true,
        }
    ];

    return (
      <Grid
        form={form}
        data={data}
        loading={loading}
        columns={columns}
        multipleChoice={true}
        onSearch={this.getList}
      />
    );
  }
}
export default OrderList;
