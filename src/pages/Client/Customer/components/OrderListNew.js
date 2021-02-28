import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form} from 'antd';



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
      current:p.current
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
              <div>{this.getText(key,ORDERSTATUS)} </div>
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
