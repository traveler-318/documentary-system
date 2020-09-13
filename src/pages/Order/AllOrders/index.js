import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, Row, Select, DatePicker, Divider, Dropdown, Menu, Icon, Modal, message } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';
import { ORDER_LIST } from '../../../actions/order';
import func from '../../../utils/Func';
import {setListData} from '../../../utils/publicMethod';
import {ORDERSTATUS, ORDERTYPPE, GENDER, ORDERTYPE, ORDERSOURCE, TIMETYPE} from './data.js'

import {getList,deleteData} from '../../../services/newServices/order'

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class AllOrdersList extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys:[],
      salesmanList:[
        {
          name:"全部",
          id:null
        },
        {
          name:"测试销售",
          id:"1"
        }
      ],
      data:{},
      loading:false,
      params:{
        size:10,
        current:1
      }
    };
  }

  // ============ 初始化数据 ===============
  componentWillMount() {
    this.getDataList();
  }

  getDataList = () => {
    const {params} = this.state;
    this.setState({
      loading:true,
    })
    getList(params).then(res=>{
      this.setState({
        data:setListData(res.data),
        loading:false,
      })
    })
  }

  // ============ 查询 ===============
  handleSearch = params => {
    const { dateRange } = params;
    
    let payload = {
      ...params,
    };
    if (dateRange) {
      payload = {
        ...params,
        start_time: dateRange ? func.format(dateRange[0], 'YYYY-MM-DD hh:mm:ss') : null,
        end_time: dateRange ? func.format(dateRange[1], 'YYYY-MM-DD hh:mm:ss') : null,
      };
      payload.dateRange = null;
    }
    if(payload.salesman && payload.salesman === "全部"){
      payload.salesman = null;
    }
    console.log(payload,"params")
    this.setState({
      params:payload
    },()=>{
      this.getDataList();
    })
  };

  // ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const {
      form,
    } = this.props;
    const { getFieldDecorator } = form;

    const { selectedRowKeys, salesmanList } = this.state;

    return (
      <div className={"default_search_form"}>
        <Form.Item label="姓名">
            {getFieldDecorator('userName')(<Input placeholder="请输入姓名" />)}
          </Form.Item>
          <Form.Item label="订单状态">
            {getFieldDecorator('confirmTag', {
              initialValue: null,
            })(
              <Select placeholder={"请选择订单状态"} style={{ width: 120 }}>
                {ORDERSTATUS.map(item=>{
                  return (<Option value={item.key}>{item.name}</Option>)
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="订单类型">
            {getFieldDecorator('orderType', {
                initialValue: null,
              })(
              <Select placeholder={"请选择订单类型"} style={{ width: 120 }}>
                {ORDERTYPPE.map(item=>{
                  return (<Option value={item.key}>{item.name}</Option>)
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="销售">
            {getFieldDecorator('salesman', {
                  initialValue: "全部",
                })(
                <Select placeholder={"请选择销售"} style={{ width: 120 }}>
                  {salesmanList.map(item=>{
                    return (<Option value={item.name}>{item.name}</Option>)
                  })}
                </Select>
              )}
          </Form.Item>
          <div>
            {/* <Form.Item label="时间类型">
              {getFieldDecorator('timeType', {
                initialValue: 1,
              })(
                <Select placeholder={"请选择时间类型"} style={{ width: 120 }}>
                  {TIMETYPE.map(item=>{
                    return (<Option value={item.key}>{item.name}</Option>)
                  })}
                </Select>
              )}
            </Form.Item> */}
            <Form.Item label="下单时间">
              {getFieldDecorator('dateRange', {
                initialValue: null,
              })(
                <RangePicker showTime size={"default"} />
              )}
            </Form.Item>

            <div style={{ float: 'right' }}>
              <Button type="primary" htmlType="submit">
                <FormattedMessage id="button.search.name" />
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={onReset}>
                <FormattedMessage id="button.reset.name" />
              </Button>
            </div>
          </div>
          
      </div>
    );
  };
  moreMenu = () => (
    <Menu onClick={this.handleMenuClick}>
      <Menu.Item key="1">
        <Icon type="menu-unfold" />
        批量审核
      </Menu.Item>
      <Menu.Item key="2">
        <Icon type="appstore" />
        批量发货
      </Menu.Item>
      <Menu.Item key="3">
        <Icon type="bell" />
        批量提醒
      </Menu.Item>
      <Menu.Item key="1">
        <Icon type="loading-3-quarters" />
        转移客户
      </Menu.Item>
      <Menu.Item key="2">
        <Icon type="highlight" />
        批量编辑
      </Menu.Item>
      {/* <Menu.Item key="3">
        <Icon type="delete" />
        批量删除
      </Menu.Item> */}
    </Menu>
  );

  handleMenuClick = (e) => {
    message.info('Click on menu item.');
    console.log('click', e);
  }

  renderLeftButton = () => (
    <>
      <Button type="primary" icon="plus" onClick={()=>{
        router.push(`/order/AllOrders/add`);
      }}>添加</Button>
      <Button icon="download">导入</Button>
      <Button icon="upload">导出</Button>
      <Dropdown overlay={this.moreMenu()}>
        <Button>
          更多 <Icon type="down" />
        </Button>
      </Dropdown>
    </>
  );

  refreshTable = () => {
    this.getDataList();
  }

  // 修改数据
  handleEdit = (row) => {
    // 
    const { dispatch } = this.props;
    dispatch({
      type: `globalParameters/setDetailData`,
      payload: row,
    });

    router.push('/order/allOrders/edit');
    // row.id
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

  renderRightButton = () => (
    <>
      <Button icon="ordered-list">排序</Button>
      <Button icon="unordered-list">列表</Button>
    </>
  );

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
    const code = 'allOrdersList';

    const {
      form,
    } = this.props;

    const {data, loading} = this.state;

    const columns = [
      {
        title: '姓名',
        dataIndex: 'userName',
        width: 100,
      },
      {
        title: '手机号',
        dataIndex: 'userPhone',
        width: 100,
      },
      {
        title: '收货地址',
        dataIndex: 'userAddress',
        width: 200,
      },
      {
        title: '产品分类',
        dataIndex: 'productName',
        width: 100,
      },
      {
        title: '产品型号',
        dataIndex: 'productModel',
        width: 100,
      },
      {
        title: '序列号',
        dataIndex: 'deviceSerialNumber',
        width: 100,
      },
      {
        title: '订单状态',
        dataIndex: 'confirmTag',
        width: 100,
        render: (key)=>{
          return (
            <div>{this.getText(key,ORDERSTATUS)} </div>
          )
        }
      },
      {
        title: '订单类型',
        dataIndex: 'orderType',
        width: 100,
        render: (key)=>{
          return (
            <div>{this.getText(key,ORDERTYPE)} </div>
          )
        }
      },
      {
        title: '订单来源',
        dataIndex: 'orderSource',
        width: 100,
        render: (key)=>{
          return (
            <div>{this.getText(key,ORDERSOURCE)} </div>
          )
        }
      },
      {
        title: '销售',
        dataIndex: 'salesman',
        width: 100,
      },
      {
        title: '快递公司',
        dataIndex: 'logisticsCompany',
        width: 100,
      },
      {
        title: '快递单号',
        dataIndex: 'logisticsNumber',
        width: 100,
      },
      {
        title: '下单时间',
        dataIndex: 'createTime',
        width: 160,
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 250,
        render: (text,row) => {
            return(
                <div>
                    <a>审核</a>
                    <Divider type="vertical" />
                    <a>跟进</a>
                    <Divider type="vertical" />
                    <a onClick={()=>this.handleEdit(row)}>编辑</a>
                    <Divider type="vertical" />
                    <a>置顶</a>
                    <Divider type="vertical" />
                    <a>归档</a>
                </div>
            )
        },
      },
    ];

    return (
      <Panel>
        <Grid
          code={code}
          form={form}
          onSearch={this.handleSearch}
          renderSearchForm={this.renderSearchForm}
          loading={loading}
          data={data}
          columns={columns}
          scroll={{ x: 1000 }} 
          renderLeftButton={this.renderLeftButton}
          renderRightButton={this.renderRightButton}
          counterElection={true}
        />
      </Panel>
    );
  }
}
export default AllOrdersList;
