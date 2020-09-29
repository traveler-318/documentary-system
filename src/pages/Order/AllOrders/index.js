import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, Row, Select, DatePicker, Divider, Dropdown, Menu, Icon, Modal, message, Tabs } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';


import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';
import { ORDER_LIST } from '../../../actions/order';
import func from '../../../utils/Func';
import { setListData } from '../../../utils/publicMethod';
import { ORDERSTATUS, ORDERTYPPE, GENDER, ORDERTYPE, ORDERSOURCE, TIMETYPE, LOGISTICSCOMPANY } from './data.js';
import { 
  getList, 
  deleteData, 
  updateRemind,
  logisticsRepeatPrint,
  updateReminds,
  toExamine
} from '../../../services/newServices/order';
import { getList as getSalesmanLists } from '../../../services/newServices/sales';
import styles from './index.less';
import Logistics from './components/Logistics'
import TransferCustomers from './components/TransferCustomers'
import LogisticsConfig from './components/LogisticsConfig'
import Details from './components/details'


const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { SubMenu } = Menu;

@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class AllOrdersList extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      // 反选数据
      selectedRowKeys:[],
      selectedRowKey:[],
      salesmanList:[],
      data:{},
      loading:false,
      params:{
        size:10,
        current:1
      },
      tabKey:0,
      selectedRows:[],
      // 物流弹窗
      logisticsVisible:false,
      // 转移客户
      TransferVisible:false,
      // 批量物流下单弹窗
      LogisticsConfigVisible:false,
      // 详情弹窗
      detailsVisible:false,
    };
  }

  // ============ 初始化数据 ===============
  componentWillMount() {
    this.getDataList();
    this.getSalesmanList();
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

  // 获取业务员数据
  getSalesmanList = () => {
    getSalesmanLists({size:100,current:1}).then(res=>{
      this.setState({
        salesmanList:res.data.records
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
    payload.confirmTag = this.state.tabKey;
    delete payload.dateRange
    // console.log(payload,"params")
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

    const { salesmanList } = this.state;

    return (
      <div className={"default_search_form"}>
        <Form.Item label="姓名">
            {getFieldDecorator('userName')(<Input placeholder="请输入姓名" />)}
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
                    return (<Option value={item.userName}>{item.userName}</Option>)
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

  // =========首次打印===========
  first = () => {
    const {selectedRows} = this.state;
    const { dispatch } = this.props;
    const  tips=[];
    if(selectedRows.length > 20){
      message.info('最多批量操作20条数据');
    }else{
      for(let i=0; i<selectedRows.length; i++){
        if(selectedRows[i].taskId){
          tips.push(selectedRows[i].userName);
          Modal.confirm({
            title: '提示',
            content: "客户"+selectedRows[i].userName+"订单已打印过!只能进行重复打印!",
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {},
            onCancel() {},
          });
        }
      }
      if(tips.length > 0 ){
        return false;
      }
      dispatch({
        type: `globalParameters/setDetailData`,
        payload: selectedRows,
      });
      this.setState({
        LogisticsConfigVisible:true
      })
    }

  }

  // =========重复打印=============

  repeat = () =>{
    const {selectedRows} = this.state;
    const { dispatch } = this.props;
    const  tips=[]
    // 当前时间戳
    const timestamp = (new Date()).getTime();
    const timeInterval = 24 * 60 * 60 * 1000 * 2;
    if(selectedRows.length > 20){
      message.info('最多批量操作20条数据');
    }else{
      for(let i=0; i<selectedRows.length; i++){
        const time = timestamp - (new Date(selectedRows[i].taskCreateTime)).getTime();
        if(!selectedRows[i].taskId){
          tips.push(selectedRows[i].userName)
          Modal.confirm({
            title: '提示',
            content: selectedRows[i].userName+"客户没有首次打印记录,不能进行重复打印!",
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {},
            onCancel() {},
          });
        }else if( time > timeInterval){
          tips.push(selectedRows[i].userName)
          Modal.confirm({
            title: '提示',
            content: selectedRows[i].userName+"客户的订单 距离首次时间超过2天 禁止打印！",
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {},
            onCancel() {},
          });
        }
      }
      if(tips.length > 0 ){
        return false;
      }
      let param = [];
      for(let i=0; i<selectedRows.length; i++){
        param.push(selectedRows[i].id)
      }

      const {params} = {
        orderIds:param
      };
      logisticsRepeatPrint(params).then(res=>{
        if(res.code === 200){
          message.success(res.msg);
        }
      })


    }
  }

  // =========关闭物流弹窗========
  handleCancelLogisticsConfig = () => {
    this.setState({
      LogisticsConfigVisible:false
    })
  }

  // 批量审核
  batchAudit = () => {
    const {selectedRows} = this.state;
    if(selectedRows.length <= 0){
      return message.info('请至少选择一条数据');
    }

    let _data = selectedRows.map(item=>{
      return item.id
    })

    toExamine({
      confirmTag:1,
      list:_data
    }).then(res=>{
      if(res.code === 200){
        message.success(res.msg);
        
      }
    })
  }

  // 批量发货
  bulkDelivery = () => {
    const {selectedRows} = this.state;
    if(selectedRows.length <= 0){
      return message.info('请至少选择一条数据');
    }

    this.handleShowLogistics(selectedRows)
  }

  // 左侧操作按钮
  renderLeftButton = () => (
    <>
      <Button type="primary" icon="plus" onClick={()=>{
        router.push(`/order/AllOrders/add`);
      }}>添加</Button>
      <Button 
        icon="menu-unfold"
        onClick={this.batchAudit}
      >审核</Button>
      <Button 
        icon="appstore"
        onClick={this.bulkDelivery}
      >发货</Button>
      <Button
        icon="bell"
        onClick={this.batchReminders}
      >提醒</Button>
      <Button icon="download">导入</Button>
      <Dropdown overlay={this.moreMenu()}>
        <Button>
          更多 <Icon type="down" />
        </Button>
      </Dropdown>
    </>
  );
  moreMenu = () => (
    <Menu onClick={this.handleMenuClick}>
      <Menu.Item key="3">
        <Icon type="upload" />
        导出
      </Menu.Item>
      <Menu.Item key="4">
        <Icon type="loading-3-quarters" />
        转移客户
      </Menu.Item>
      {/* <Menu.Item key="5">
        <Icon type="highlight" />
        批量编辑
      </Menu.Item> */}
      <SubMenu key="sub1" title="批量物流下单">
        <Menu.Item key="6" onClick={this.repeat}>
          重复打印
        </Menu.Item>
        <Menu.Item key="7" onClick={this.first}>
          首次打印
        </Menu.Item>
      </SubMenu>
    </Menu>
  );

  handleMenuClick = (menuRow) => {
    console.log('click', menuRow);
    const {selectedRows} = this.state;
    if(selectedRows.length <= 0){
      return message.info('请至少选择一条数据');
    }
    // 转移客户
    if(menuRow.key === "4"){
      this.handleShowTransfer();
    }
  }

  // 删除
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

  // 提醒
  handleReminds = (data) => {
    Modal.confirm({
      title: '提醒',
      content: "确定提示此订单吗？",
      okText: '确定',
      okType: 'info',
      cancelText: '取消',
      onOk() {
        let _data = data.map(item=>{
          return {
            deptId:item.deptId,
            id:item.id,
            outOrderNo:item.outOrderNo,
            payAmount:Number(item.payAmount),
            userPhone:item.userPhone,
          }
        })
        updateReminds(_data).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
          }
        })
      },
      onCancel() {},
    });
  }

  // 批量提醒
  batchReminders = () => {
    const {selectedRows} = this.state;
    if(selectedRows.length <= 0){
      return message.info('请至少选择一条数据');
    }
    this.handleReminds(selectedRows)
  }

  refreshTable = () => {
    this.getDataList();
  }

  // 修改数据
  handleEdit = (row) => {
    const { dispatch } = this.props;
    dispatch({
      type: `globalParameters/setDetailData`,
      payload: row,
    });
    router.push(`/order/allOrders/edit/${row.id}`);
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

  statusChange = (key) => {
    this.setState({
      tabKey:key
    },()=>{
      this.handleSearch(this.state.params)
    })
  }

  onSelectRow = (rows,keys) => {
    console.log(rows,keys,"rows")
    this.setState({
      selectedRows: rows,
      selectedRowKeys: keys,
    });
  };

  // 打开详情弹窗
  handleDetails = (row) => {
    const { dispatch } = this.props;
    dispatch({
      type: `globalParameters/setDetailData`,
      payload: row,
    });
    this.setState({
      detailsVisible:true
    })
  }
  // 关闭详情弹窗
  handleCancelDetails = () => {
    this.setState({
      detailsVisible:false
    })
  }

  // 打开物流弹窗
  handleShowLogistics = (data) => {
    const { dispatch } = this.props;

    let listId = [];
    data.map(item=>{
      listId.push(item.id)
    })

    console.log(listId,"listId")

    dispatch({
      type: `globalParameters/setListId`,
      payload: listId,
    });
    router.push('/order/allOrders/logisticsConfiguration');

    // this.setState({
    //   logisticsVisible:true
    // })
  }
  // 关闭物流弹窗
  handleCancelLogistics = (type) => {
    // getlist代表点击保存成功关闭弹窗后需要刷新列表
    if(type === "getlist"){
      this.getDataList();
    }
    this.setState({
      logisticsVisible:false
    })
  }

  // 打开转移客户弹窗
  handleShowTransfer = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    dispatch({
      type: `globalParameters/setListId`,
      payload: selectedRows,
    });
    this.setState({
      TransferVisible:true
    })
  }
  // 转移客户
  handleCancelTransfer = (type) => {
    // getlist代表点击保存成功关闭弹窗后需要刷新列表
    if(type === "getlist"){
      this.getDataList();
    }
    this.setState({
      TransferVisible:false
    })
  }

  // 反选数据
  onChangeCheckbox = () => {
    const { selectedRowKeys, data } = this.state;

    let rowKeys = [];
    let row = []
    data.list.map(item=>{
      if(selectedRowKeys.indexOf(item.id) === -1){
        rowKeys.push(item.id)
        row.push(item)
      }
    })
    this.setState({
      selectedRowKeys:rowKeys,
      selectedRows:row
    })
  }

  render() {
    const code = 'allOrdersList';

    const {
      form,
    } = this.props;

    const { 
      data, 
      loading, 
      tabKey, 
      logisticsVisible, 
      TransferVisible,
      LogisticsConfigVisible,
      selectedRows, 
      detailsVisible,
      selectedRowKeys
    } = this.state;

    console.log(selectedRowKeys,"selectedRowKeys")

    const TabPanes = () => (
      <div className={styles.tabs}>
        {ORDERSTATUS.map(item=>{
          return (
            <div
              onClick={()=>this.statusChange(item.key)}
              className={item.key === tabKey ? styles.status_item_select : styles.status_item}
            >{item.name}</div>
          )
        })}
      </div>
    );

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
        ellipsis: true,
      },
      {
        title: '产品分类',
        dataIndex: 'productType',
        width: 130,
      },
      {
        title: '产品型号',
        dataIndex: 'productName',
        width: 100,
      },
      {
        title: 'SN码',
        dataIndex: 'productCoding',
        width: 200,
        ellipsis: true,
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
        width: 130,
      },
      {
        title: '快递单号',
        dataIndex: 'logisticsNumber',
        width: 130,
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
        width: 280,
        render: (text,row) => {
            return(
                <div>
                    <a onClick={()=>this.handleDelect(row)}>删除</a>
                    <Divider type="vertical" />
                    {/* <a>跟进</a>
                    <Divider type="vertical" />
                    <a onClick={()=>this.handleEdit(row)}>编辑</a>
                    <Divider type="vertical" />
                    <a>置顶</a>
                    <Divider type="vertical" />
                    <a>归档</a>
                    <Divider type="vertical" /> */}
                    <a onClick={()=>this.handleEdit(row)}>详情</a>
                    {/* <Divider type="vertical" /> */}
                    {/* <a onClick={()=>this.handleShowLogistics([row])}>发货</a> */}
                    {/* <Divider type="vertical" />
                    <a >短信</a> */}
                    {/* <Divider type="vertical" /> */}
                    {/* <a onClick={()=>this.handleReminds([row])}>提醒</a> */}
                </div>
            )
        },
      },
    ];

    return (
      <Panel>
        <TabPanes/>
        <Grid
          code={code}
          form={form}
          onSearch={this.handleSearch}
          onSelectRow={this.onSelectRow}
          renderSearchForm={this.renderSearchForm}
          loading={loading}
          data={data}
          columns={columns}
          scroll={{ x: 1000 }}
          renderLeftButton={this.renderLeftButton}
          renderRightButton={this.renderRightButton}
          counterElection={true}
          onChangeCheckbox={this.onChangeCheckbox}
          selectedKey={selectedRowKeys}
          // multipleChoice={true}
        />
        {/* 详情 */}
        {detailsVisible?(
          <Details
            detailsVisible={detailsVisible}
            handleCancelDetails={this.handleCancelDetails}
          />
        ):""}

        {/* 物流 */}
        {logisticsVisible?(
          <Logistics
            logisticsVisible={logisticsVisible}
            handleCancelLogistics={this.handleCancelLogistics}
          />
        ):""}

        {/* 设备 */}
        {TransferVisible?(
          <TransferCustomers
            TransferVisible={TransferVisible}
            handleCancelTransfer={this.handleCancelTransfer}
          />
        ):""}
        {/* 批量物流下单 */}
        {LogisticsConfigVisible?(
          <LogisticsConfig
            LogisticsConfigVisible={LogisticsConfigVisible}
            LogisticsConfigList={selectedRows}
            handleCancelLogisticsConfig={this.handleCancelLogisticsConfig}
          />
        ):""}

      </Panel>
    );
  }
}
export default AllOrdersList;
