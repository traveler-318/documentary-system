import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, Row, Select, DatePicker, Divider, Dropdown, Menu, Icon, Modal, message, Tabs } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';


import Panel from '../../../../components/Panel';
import Grid from '../../../../components/Sword/Grid';
import { ORDER_LIST } from '../../../../actions/order';
import func from '../../../../utils/Func';
import { setListData } from '../../../../utils/publicMethod';
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
      data:{},
      loading:false,
      params:{
        size:10,
        current:1
      },
    };
  }

  // ============ 初始化数据 ===============
  componentWillMount() {
    this.getList();
  }

  getList = () =>{
    this.setState({
        data:{
          list:[
            {
              orderSource:"123213",
              productType:"",
              salesman:"salesman"
            }
        ],
      }
    })
  }

  // 详情
  handleDetsils = (row) => {
   
  }

  // 列表删除
  handleDelect = (row) => {
    const refresh = this.refreshTable;
    Modal.confirm({
      title: '删除确认',
      content: '确定删除选中记录?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        deleteData({
          ids:row.id
        }).then(res=>{
          message.success(res.msg);
          refresh();
        })
      },
      onCancel() {},
    });
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
            title: '订单来源',
            dataIndex: 'orderSource',
            ellipsis: true,
            render: (key)=>{
              return (
                <div>{this.getText(key,ORDERSOURCE)} </div>
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
                        <Divider type="vertical" />
                        <a onClick={()=>this.handleDelect(row)}>删除</a>
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
            multipleChoice={true}
        />
    );
  }
}
export default OrderList;
