import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, Badge, Row, Select, DatePicker, Divider, Dropdown, Menu, Icon, Modal, message, Tabs, Radio, Tag } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import { Resizable } from 'react-resizable';

import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';
import { ORDER_LIST } from '../../../actions/order';
import func from '../../../utils/Func';
import { setListData } from '../../../utils/publicMethod';
import { ORDERSTATUS, ORDERTYPPE, GENDER, ORDERTYPE, ORDERSOURCE, TIMETYPE, LOGISTICSCOMPANY, LOGISTICSSTATUS } from './data.js';
import {
  getList,
  deleteData,
  updateRemind,
  logisticsRepeatPrint,
  localPrinting,
  updateReminds,
  toExamine,
  synCheck,
  syndata,
  getSalesmanLists,
  subscription,
  updateData,
  salesmanList,
  menuTab
} from '../../../services/newServices/order';

// getList as getSalesmanLists,
import { getSalesmangroup } from '../../../services/newServices/sales';
import styles from './index.less';
import Logistics from './components/Logistics'
import Export from './components/export'
import TransferCustomers from './components/TransferCustomers'
import LogisticsConfig from './components/LogisticsConfig'
import Details from './components/details'
import ImportData from './components/ImportData'

import { getAdditionalinformationStatus } from '../../../services/newServices/logistics';

import Excel from './components/excel';
import Text from './components/text';
import Journal from '../components/journal';
import SMS from '../components/smsList';
import VoiceList from '../components/voiceList';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { SubMenu } = Menu;

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

let modal;

const ResizeableTitle = props => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

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
      params:localStorage.afterSaleOrderParams ? JSON.parse(localStorage.afterSaleOrderParams) : {
        size:10,
        current:1
      },
      tabCode:[],
      tabKey:sessionStorage.afterSaleOrderTabKey ? sessionStorage.afterSaleOrderTabKey : '0',
      selectedRows:[],
      // 物流弹窗
      logisticsVisible:false,
      // 导出
      exportVisible:false,
      // 转移客户
      TransferVisible:false,
      // 批量物流下单弹窗
      LogisticsConfigVisible:false,
      // 详情弹窗
      detailsVisible:false,
      // 日志弹窗
      journalVisible:false,
      journalList:{},
      // 短信弹窗
      SMSVisible:false,
      smsList:{},
      // 语音弹窗
      VoiceVisible:false,
      voice:{},
      // 免押宝导入弹窗
      noDepositVisible:false,
      confirmLoading: false,
      // SN激活导入弹窗
      excelVisible:false,
      // 文本导入弹窗
      textVisible:false,
      // 订单导入弹窗
      OrderImportVisible:false,
      salesmangroup:[],
      countSice:0,
      columns:[
        {
          title: '姓名',
          dataIndex: 'userName',
          width: 100,
        },
        {
          title: '手机号',
          dataIndex: 'userPhone',
          width: 120,
        },
        {
          title: '收货地址',
          dataIndex: 'userAddress',
          width: 200,
          ellipsis: true,
        },
        {
          title: '订单状态',
          dataIndex: 'confirmTag',
          width: 100,
          render: (key,row)=>{
            // 待审核、已激活、已取消、已退回-不可切换状态
            if(key == '0' || key == '7' || key == '8' || key == '9'){
              return (
                <div>
                  <Tag color={this.getORDERSCOLOR(key)}>
                    {this.getORDERSTATUS(key)}
                  </Tag>
                </div>
              )
            }else{
              return (
                <div style={{cursor: 'pointer'}} onClick={()=>{this.changeConfirmTag(row)}}>
                  <Tag color={this.getORDERSCOLOR(key)}>
                    {this.getORDERSTATUS(key)}
                  </Tag>
                </div>
              )
            }
          }
        },
        {
          title: '订单状态(免押宝)',
          dataIndex: 'mianyaStatus',
          width: 130,
          render: (key,row)=>{
            let type=''
            if (key === 0) {
              type ='未授权';
            } else if(key === 1){
              type ='已授权';
            }else if(key === 2){
              type ='解冻';
            }else if(key === 3){
              type ='扣款';
            }
            return (
              type
            )
          }
        },
        {
          title: '机器状态(免押宝) ',
          dataIndex: 'machineStatus',
          width: 130,
          render: (key,row)=>{
            let type=''
            if (key === 0) {
              type ='未激活';
            } else if(key === 1){
              type ='已激活';
            }else if(key === 2){
              type ='已退回';
            }else if(key === 3){
              type ='被投诉';
            }
            return (
              type
            )
          }
        },
        {
          title: '产品分类',
          dataIndex: 'productType',
          width: 130,
        },
        {
          title: '产品型号',
          dataIndex: 'productName',
          width: 160,
        },
        {
          title: 'SN',
          dataIndex: 'productCoding',
          width: 200,
          ellipsis: true,
        },
        {
          title: '订单金额',
          dataIndex: 'payAmount',
          width: 150,
        },
        
        {
          title: '订单类型',
          dataIndex: 'orderType',
          width: 100,
          render: (key)=>{
            return (
              <div>{this.getORDERTYPE(key)} </div>
            )
          }
        },
        {
          title: '订单来源',
          dataIndex: 'orderSource',
          width: 100,
          render: (key)=>{
            return (
              <div>{this.getORDERSOURCE(key)} </div>
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
          width: 150,
        },
        {
          title: '物流状态',
          dataIndex: 'logisticsStatus',
          width: 100,
          render: (key)=>{
            return (
              <div>{this.getLogisticsStatusValue(key)} </div>
            )
          }
        },
        {
          title: '下单时间',
          dataIndex: 'createTime',
          width: 170,
        },
        {
          title: '操作',
          key: 'operation',
          fixed: 'right',
          width: 150,
          render: (text,row) => {
              return(
                  <div>
                    <a onClick={()=>this.handleEdit(row)}>详情</a>
                    <Divider type="vertical" />
                    {
                      row.logisticsCompany && row.logisticsNumber && !row.logisticsStatus ? (<><a onClick={()=>this.logisticsSubscribe(row)}>订阅</a><Divider type="vertical" /></>):''
                    }
                    <a onClick={()=>this.handleJournal(row)}>日志</a>
                    <Divider type="vertical" />
                    <a onClick={()=>this.handleSMS(row)}>短信</a>
                    <Divider type="vertical" />
                    <a onClick={()=>this.handleVoice(row)}>语音</a>

                    {/*<a onClick={()=>this.handleDelect(row)}>删除</a>*/}

                      {/* <a>跟进</a>
                      <Divider type="vertical" />
                      <a onClick={()=>this.handleEdit(row)}>编辑</a>
                      <Divider type="vertical" />
                      <a>置顶</a>
                      <Divider type="vertical" />
                      <a>归档</a>
                      <Divider type="vertical" /> */}

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
      ],
      confirmTagVisible:false,
      currentList:{},
      radioChecked:null
    };
  }

  // ============ 初始化数据 ===============
  componentWillMount() {
    // this.getDataList();
    // this.getSalesmanList();

    // 获取分组数据
    getSalesmangroup({
      size:100,
      current:1
    }).then(res=>{
      const list={
        groupName:"全部",
        id:"",
        userAccount:''
      };
      res.data.records.unshift(list);
      this.setState({
        salesmangroup:res.data.records
      })
    })

    menuTab({
      menuType:"3"
    }).then(res=>{
      const tabCode = res.data.tabCode.split(",");
      let list=[]

      for(let j=0; j<tabCode.length; j++){
        tabCode[j]=tabCode[j];
        if(tabCode[j] === "11"){
          tabCode[j] = null
        }
        for(let i=0; i<ORDERSTATUS.length; i++){
          if(ORDERSTATUS[i].key === tabCode[j]) {
            let item={}
            item.name=ORDERSTATUS[i].name;
            item.key=ORDERSTATUS[i].key;
            list.push(item)
          }
        }
      }
      this.setState({
        tabCode:list
      })
    })

    this.getSalesman()
  }

  // 销售默认全部列表
  getSalesman = () => {
    salesmanList({size:100,current:1}).then(res=>{
      const list={
        userName:"全部",
        userAccount:""
      };
      res.data.records.unshift(list);
      this.setState({
        salesmanList:res.data.records
      })
    })
  }

  getDataList = () => {
    const {params} = this.state;
    this.setState({
      loading:true,
    })
    getList(params).then(res=>{
      this.setState({
        countSice:res.data.total,
        data:setListData(res.data),
        loading:false,
        selectedRowKeys:[]
      })
    })
  }

  // 获取业务员数据
  getSalesmanList = (value = "all_all") => {
    getSalesmanLists(value).then(res=>{
      if(res.code === 200){
        const list={
          userName:"全部",
          userAccount:""
        };
        res.data.unshift(list);
        this.setState({
          salesmanList:res.data
        })
        const { form } = this.props;
        form.setFieldsValue({salesman:"全部"});
      }
    })
  }

  // 选择分组
  changeGroup = (value) => {
    if(value){
      this.getSalesmanList(value)
      this.setState({
        salesmanList:[]
      })
    }else {
      this.getSalesman()
    }
  }

  // ============ 查询 ===============
  handleSearch = params => {
    const { dateRange } = params;
    const { tabKey, salesmanList } = this.state;
    let payload = {
      ...params,
    };
    if (dateRange) {
      payload = {
        ...params,
        startTime: dateRange ? func.format(dateRange[0], 'YYYY-MM-DD HH:mm:ss') : null,
        endTime: dateRange ? func.format(dateRange[1], 'YYYY-MM-DD HH:mm:ss') : null,
      };
      payload.dateRange = null;
    }
    if(payload.salesman && payload.salesman === "全部"){
      payload.salesman = null;
    }
    if(payload.groupId && payload.groupId === "全部"){
      payload.groupId = null;
    }
    if(payload.logisticsStatus && payload.logisticsStatus === "全部"){
      payload.logisticsStatus = null;
    }
    if(payload.orderSource && payload.orderSource === "全部"){
      payload.orderSource = null;
    }
    if(payload.salesman == "全部"){
      payload.salesman = null
    }

    if(payload.groupId && !payload.salesman){
      let text = ""
      for(let i=0; i<salesmanList.length; i++){
        if(salesmanList[i] != "全部"){
          if(payload.salesman == salesmanList[i].userName){
            text +=salesmanList[i].userAccount
          }
        }
      }
      payload.salesman = text;
    }else{
      payload.salesman = payload.salesman
    }

    payload = {
      ...payload,
      confirmTag:tabKey === 'null' ? null : tabKey
    };

    localStorage.setItem("afterSaleOrderParams",JSON.stringify(payload));

    delete payload.dateRange;

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

    const { salesmanList, salesmangroup, params } = this.state;

    return (
      <div className={"default_search_form"}>
        <Form.Item label="姓名">
          {getFieldDecorator('userName',{
            initialValue:params.userName
          })(<Input placeholder="请输入姓名" />)}
        </Form.Item>
        <Form.Item label="手机号">
          {getFieldDecorator('userPhone',{
            initialValue:params.userPhone
          })(<Input placeholder="请输入手机号" />)}
        </Form.Item>
        <Form.Item label="SN">
              {getFieldDecorator('productCoding',{
            initialValue:params.productCoding
          })(<Input placeholder="请输入SN" />)}
            </Form.Item>
        <Form.Item label="订单类型">
          {getFieldDecorator('orderType', {
              initialValue: params.orderType ? params.orderType :null,
            })(
            <Select placeholder={"请选择订单类型"} style={{ width: 120 }}>
              {ORDERTYPPE.map(item=>{
                return (<Option value={item.key}>{item.name}</Option>)
              })}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="分组">
          {getFieldDecorator('groupId', {
                initialValue: params.groupId ? params.groupId : "全部",
              })(
              <Select
                placeholder={"请选择分组"}
                style={{ width: 120 }}
                onChange={this.changeGroup}
              >
                {salesmangroup.map(item=>{
                  return (<Option value={item.id}>{item.groupName}</Option>)
                })}
              </Select>
            )}
        </Form.Item>
        <Form.Item label="销售">
          {getFieldDecorator('salesman', {
                initialValue: params.salesman ? params.salesman : "全部",
              })(
              <Select placeholder={"请选择销售"} style={{ width: 120 }}>
                {salesmanList.map((item,index)=>{
                  return (<Option key={index} value={item.userAccount}>{item.userName}</Option>)
                })}
              </Select>
            )}
        </Form.Item>
        <Form.Item label="订单来源">
          {getFieldDecorator('orderSource', {
            initialValue: params.orderSource ? params.orderSource : "全部",
          })(
            <Select placeholder={"请选择订单来源"} style={{ width: 120 }}>
              {ORDERSOURCE.map(item=>{
                return (<Option value={item.key}>{item.name}</Option>)
              })}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="物流状态">
          {getFieldDecorator('logisticsStatus', {
            initialValue: params.logisticsStatus ? params.logisticsStatus : "全部",
          })(
            <Select placeholder={"请选择物流状态"} style={{ width: 120 }}>
              {LOGISTICSSTATUS.map(item=>{
                return (<Option value={item.key}>{item.name}</Option>)
              })}
            </Select>
          )}
        </Form.Item>
          <div>
            <Form.Item label="下单时间">
              {getFieldDecorator('dateRange', {
                initialValue:params.startTime ? [func.moment(params.startTime, dateFormat), func.moment(params.endTime, dateFormat)]: null,
              })(
                <RangePicker showTime size={"default"} />
              )}
            </Form.Item>


            <div style={{ float: 'right' }}>
              <Button type="primary" htmlType="submit">
                <FormattedMessage id="button.search.name" />
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={()=>{
                this.getSalesman();
                onReset()
              }}>
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
    if(selectedRows.length <= 0){
      return  message.info('请至少选择一条数据');
    }

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
            keyboard:false,
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
    const  tips=[];

    if(selectedRows.length <= 0){
      return  message.info('请至少选择一条数据');
    }

    // 当前时间戳
    const timestamp = (new Date()).getTime();
    const timeInterval = 24 * 60 * 60 * 1000 * 2;

    if(selectedRows[0].logisticsPrintType === "1" || selectedRows[0].logisticsPrintType === "2"){
      if(selectedRows.length > 1){
       return  message.info('您已开启本地打印，一次最多打印一条数据');
      }
    }

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
        param.push(selectedRows[i].taskId)
      }

      if(selectedRows[0].logisticsPrintType === "1" || selectedRows[0].logisticsPrintType === "2"){
        // 本地打印
        localPrinting({
          id:selectedRows[0].id,
          logisticsPrintType:selectedRows[0].logisticsPrintType
        }).then(res=>{
          if(res.code === 200){
            sessionStorage.setItem('imgBase64', res.data)
            window.open(`#/order/allOrders/img`);
          }else{
            message.error(res.msg);
          }
        })
    }else{

      logisticsRepeatPrint(param).then(res=>{
        if(res.code === 200){
          message.success(res.msg);
        }
      })
    }

    }
  }

  //手动切换状态
  changeConfirmTag = (row) => {
    this.setState({
      confirmTagVisible:true,
      currentList:row
    })
  }

  handleCancelConfirmTag = () => {
    this.setState({
      confirmTagVisible:false,
      radioChecked:''
    })
  }

  onChangeRadio = (e) => {
    this.setState({
      radioChecked: e.target.value
    })
  }

  handleSubmitConfirmTag = (e) => {
    const { radioChecked, currentList } = this.state;
    if(!radioChecked){
      return message.error("请选择需要更改的状态");
    }
    updateData({
      id:currentList.id,
      confirmTag:radioChecked,
      outOrderNo:currentList.outOrderNo
    }).then(res=>{
      if(res.code === 200){
        message.success(res.msg);
        this.setState({
          confirmTagVisible:false
        });
        this.getDataList();
      }else{
        message.error(res.msg)
      }
    })
  }

  // =========关闭物流弹窗========
  handleCancelLogisticsConfig = () => {
    this.setState({
      LogisticsConfigVisible:false
    })
  }

  // 批量审核
  batchAudit = () => {
    const {selectedRows,tabKey} = this.state;

    const toExamines = this.toExamines;
    if(selectedRows.length <= 0){
      return message.info('请至少选择一条数据');
    }

    let type = false, _data = [];
    selectedRows.map(item=>{
      if(item.confirmTag === '0' || item.confirmTag === '1'){
        _data.push(item.id)
      }else{
        type = true;
      }
    })
    if(!_data || _data.length === 0){
      // modal.destroy();
      return message.error("您选择的数据中未包含未审核的数据");
    }

    if(tabKey === "0"){
      // 待审核
      modal = Modal.confirm({
        title: '提醒',
        // content: "确定审核此订单吗？",
        okText: '初审',
        cancelText: '终审',
        cancelButtonProps: {
          type:"primary"
        },
        keyboard:false,
        content:<div>
          确定审核此订单吗？
          <Button key="submit" type="danger" style={{ position: 'absolute',right: '177px',bottom: '24px'}} onClick={()=>{toExamines('9');}} >拒绝</Button>
          <Button key="submit" style={{ position: 'absolute',right: '250px',bottom: '24px'}} onClick={()=>{modal.destroy()}} >取消</Button>
        </div>,
        onOk() {
          toExamines('1');
        },
        onCancel() {
          toExamines('2');
        },
      });
    }else if(tabKey === "1"){
      // 一审
      modal = Modal.confirm({
        title: '提醒',
        // content: "确定审核此订单吗？",
        okText: '终审',
        cancelText: '拒绝',
        cancelButtonProps: {
          type:"danger"
        },
        content:<div>
          确定审核此订单吗？
          <Button key="submit" style={{ position: 'absolute',right: '177px',bottom: '24px'}} onClick={()=>{modal.destroy()}} >取消</Button>
        </div>,
        onOk() {
          // toExamines('1');
          toExamines('2');
        },
        onCancel() {
          toExamines('9');
        },
      });
    }


  }

  toExamines = (confirmTag) => {
    const {selectedRows} = this.state;
    let type = false, _data = [];
    const setAudit = this.setAudit;
    selectedRows.map(item=>{
      if(item.confirmTag === '0' || item.confirmTag === '1'){
        const list={}
        list.id=item.id;
        list.outOrderNo=item.outOrderNo;
        _data.push(list)
      }else{
        type = true;
      }
    })

    if(type){
      Modal.confirm({
        title: '提醒',
        content: "您选择的数据中包含已审核的数据，我们将不会对这些数据操作",
        okText: '确定',
        okType: 'info',
        cancelText: '取消',
        keyboard:false,
        onOk() {
          setAudit(_data,confirmTag)
        },
        onCancel() {
          setAudit(_data,confirmTag)
        },
      });
    }else{
      setAudit(_data,confirmTag)
    }
  }


  setAudit = (_data,confirmTag) => {
    
    toExamine({
      confirmTag,
      orderIdAndNo:_data
    }).then(res=>{
      if(res.code === 200){
        message.success(res.msg);
        this.getDataList();
        modal.destroy();
      }else {
        message.error(res.msg);
      }
    })
  }

  // 导出
  exportFile = () => {
    const {params}=this.state;
    const { dispatch } = this.props;
    let param = {
      ...params,
      startTime:params.startTime,
      endTime:params.endTime
    };
    dispatch({
      type: `globalParameters/setDetailData`,
      payload: param,
    });
    this.setState({
      exportVisible:true
    })
  }

  handleCancelExport = () =>{
    this.setState({
      exportVisible:false
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

  // 测试

  // 左侧操作按钮
  renderLeftButton = (tabKey) => {
    return (<>
      {/* 待审核 */}
        {tabKey === '0'?(
        <>
          <Button type="primary" icon="plus" onClick={()=>{
            router.push(`/order/AfterSaleOrder/add`);
          }}>添加</Button>
          <Button
            icon="menu-unfold"
            onClick={this.batchAudit}
          >审核</Button>
          <Button
            icon="download"
            onClick={this.importData}
          >免押同步</Button>
        </>
        ):tabKey === '1'?(
          <>
            <Button
              icon="menu-unfold"
              type="primary"
              onClick={this.batchAudit}
            >审核</Button>
            </>
        ):tabKey === '2'?(
          <>
          {/* 已审核 */}
            <Button
              icon="appstore"
              type="primary"
              onClick={this.bulkDelivery}
            >发货</Button>
          </>
        ):""}

        {/* 已发货什么都没有 */}
        {/* 在途中什么都没有 */}

       {/* 已签收 */}
       {tabKey === '5'?(<>
        <Button
          icon="bell"
          type="primary"
          onClick={this.batchReminders}
        >提醒</Button></>):""}
        {/* 跟进中 */}
        {tabKey === '6'?(<>
        <Button
          icon="bell"
          type="primary"
          onClick={this.batchReminders}
        >提醒</Button></>):""}
        {/* 已激活什么都没有 */}
        {/* 已退回什么都没有 */}
        {/* 已取消什么都没有 */}
        {/* 已过期什么都没有 */}

        {/* 除了全部，其他状态都有导出按钮 */}
          {tabKey != 'null'?(<Button
              icon="upload"
              type={(tabKey === "0" || tabKey === "1" || tabKey === "2" || tabKey === "4" || tabKey === "6") ? "" : "primary"}
              onClick={this.exportFile}
            >导出</Button>):""
          }

        {/* 全部 */}
        {tabKey === 'null'?(<>
          <Button type="primary" icon="plus" onClick={()=>{
            router.push(`/order/AfterSaleOrder/add`);
          }}>添加</Button>
{/*          <Button
            icon="menu-unfold"
            onClick={this.batchAudit}
          >审核</Button>*/}
          <Button
            icon="appstore"
            onClick={this.bulkDelivery}
          >发货</Button>
          <Button
            icon="bell"
            onClick={this.batchReminders}
          >提醒</Button>
          <Dropdown overlay={this.moreMenu()}>
            <Button>
              更多 <Icon type="down" />
            </Button>
          </Dropdown>
          <Dropdown overlay={this.ImporMenu()}>
            <Button>
              导入<Icon type="down" />
            </Button>
          </Dropdown>
        </>):""}

        {/* <Button icon="upload">导出</Button> */}
        {/* <Button icon="loading-3-quarters" onClick={this.handleShowTransfer}>转移客户</Button> */}

      </>)
  };
  moreMenu = () => (
    <Menu onClick={this.handleMenuClick}>
      <Menu.Item key="3" onClick={this.exportFile}>
        <Icon type="upload" />
        导出
      </Menu.Item>
      <Menu.Item key="4"  onClick={this.handleShowTransfer}>
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

  ImporMenu = () => (
    <Menu onClick={this.handleMenuClick}>
      <Menu.Item key="1" onClick={this.handleExcelImport}>
        <Icon type="upload" />
        SN激活导入
      </Menu.Item>
      <Menu.Item key="2" onClick={this.handleTextImport}>
        <Icon type="upload" />
        文本导入
      </Menu.Item>
      <Menu.Item key="2" onClick={this.handleOrderImport}>
        <Icon type="upload" />
        订单导入
      </Menu.Item>
    </Menu>
  );

  handleMenuClick = (menuRow) => {
    const {selectedRows} = this.state;
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
      keyboard:false,
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
      keyboard:false,
      onOk() {
        let _data = data.map(item=>{
          return {
            deptId:item.deptId,
            id:item.id,
            outOrderNo:item.outOrderNo,
            payAmount:Number(item.payAmount),
            userPhone:item.userPhone,
            userName:item.userName,
          }
        })
        updateReminds(_data).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
          }else{
            message.error(res.msg);
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

  // 导入数据
  importData = () => {
    // 检查是否设置同步账号
    synCheck().then(res=>{
      if(res.code === 200 && !res.data){
        // 成功打开面押宝同步弹窗  - false=没有同步，就开打弹窗进行同步验证
        this.setState({
          noDepositVisible:true
        })
      }else{
        // return message.error('当前系统已经绑定您指定的同步账号,请联系管理员进行排查!');
        const {confirmLoading} = this.state;
        Modal.confirm({
          title: '提醒',
          content: "当前系统已经绑定您指定的同步账号,确定同步数据吗？",
          okText: '确定',
          okType: 'primary',
          cancelText: '取消',
          keyboard:false,
          onOk:() => {
            if(confirmLoading){
              return message.info("请勿连续操作，请等待");
            }
            this.setState({
              confirmLoading:true
            })
            return new Promise((resolve, reject) => {
              syndata().then(res=>{
                this.setState({
                  confirmLoading:false
                })
                if(res.code === 200){
                  message.success(res.msg);
                  resolve();
                }else{
                  message.error(res.msg);
                  reject();
                }
              })
            }).catch(() => console.log('Oops errors!'));
            
          },
          onCancel() {},
        });
      }
    })
  }

  handleCancelNoDeposit = () => {
    this.setState({
      noDepositVisible:false
    })
  }

  // 修改数据
  handleEdit = (row) => {
    const { dispatch } = this.props;
    dispatch({
      type: `globalParameters/setDetailData`,
      payload: row,
    });
    router.push(`/order/afterSaleOrder/edit/${row.id}`);
  }

  renderRightButton = () => (
    <>
      <Button icon="ordered-list">排序</Button>
      <Button icon="unordered-list">列表</Button>
    </>
  );

  // 物流订阅
  logisticsSubscribe =(row) =>{
    const list=this.getDataList;
    Modal.confirm({
      title: '提示',
      content: '请确认订单号、物流名称无误后再进行物流订阅操作！此操作属于扣费行为不可逆转！',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      keyboard:false,
      async onOk() {
        let type=''
        for(let key in LOGISTICSCOMPANY){
          if(LOGISTICSCOMPANY[key] === row.logisticsCompany){
            type = key
          }
        }
        const params={
          deptId:row.deptId,
          id:row.id,
          logisticsCompany:row.logisticsCompany,
          logisticsNumber:row.logisticsNumber,
          logisticsType: type,
          outOrderNo: row.outOrderNo,
          productCoding: row.productCoding,
          productName: row.productName,
          shipmentRemind: true,
          tenantId: row.tenantId,
          userPhone: row.userPhone,
          confirmTag: row.confirmTag,
        }
        subscription(params).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            list()
          }else{
            message.error(res.msg);
          }
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
        return item.name
      }
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
    if(key === 8 || key === '8'){ text = "#909399" }
    if(key === 9 || key === '9'){ text = "#909399" }
    if(key === 10 || key === '10'){ text = "#909399" }
    return text;
  }
  // 订单类型
  getORDERTYPE = (key) => {
    let text = ""
    if(key === 1 || key === '1'){
      text = "免费"
    }
    if(key === 2 || key === '2'){
      text = "到付"
    }
    if(key === 3 || key === '3'){
      text = "收费"
    }
    if(key === 4 || key === '4'){
      text = "免押"
    }
    if(key === 5 || key === '5'){
      text = "其他"
    }
    return text;
  }
  // 订单来源
  getORDERSOURCE = (key) => {
    let text = ""
    if(key === 1 || key === '1'){ text = "新增" }
    if(key === 2 || key === '2'){ text = "导入" }
    if(key === 3 || key === '3'){ text = "H5扫码" }
    if(key === 4 || key === '4'){ text = "销售" }
    if(key === 5 || key === '5'){ text = "电销" }
    if(key === 6 || key === '6'){ text = "网销" }
    if(key === 7 || key === '7'){ text = "地推" }
    if(key === 7 || key === '8'){ text = "免押宝" }
    return text;
  }

   // 获取物流状态
   getLogisticsStatusValue = (value) => {
    let text =
    value === '-1' ? "单号错误" :
    value === '0' ? "暂无轨迹":
    value === '1' ? "快递收件":
    value === '2' ? "在途中":
    value === '3' ? "已签收":
    value === '4' ? "问题件":
    value === '5' ? "疑难件":
    value === '6' ? "退件签收":
    value === '7' ? "快递揽件":"";
    return text;
  }

  statusChange = (key) => {
    sessionStorage.afterSaleOrderTabKey = key;
    let _params = {...this.state.params}
    _params.current = 1
    this.setState({
      tabKey:key,
      params:_params
    },()=>{
      this.handleSearch(this.state.params)
    })
  }

  onSelectRow = (rows,keys) => {
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

  // 打开日志弹窗
  handleJournal = (row) => {
    this.setState({
      journalVisible:true,
      journalList:row
    })
  }
  // 关闭日志弹窗
  handleCancelJournal = () => {
    this.setState({
      journalVisible:false
    })
  }

  // 打开短信弹窗
  handleSMS = (row) => {
    this.setState({
      SMSVisible:true,
      smsList:row
    })
  }
  // 关闭短信弹窗
  handleCancelSMS = () => {
    this.setState({
      SMSVisible:false
    })
  }

  // 打开语音列表弹窗
  handleVoice = (row) => {
    this.setState({
      VoiceVisible:true,
      voice:row
    })
  }
  // 关闭语音列表弹窗
  handleCancelVoice = () => {
    this.setState({
      VoiceVisible:false
    })
  }

  // 打开物流弹窗
  handleShowLogistics = (data) => {
    const { dispatch } = this.props;

    dispatch({
      type: `globalParameters/setListId`,
      payload: data,
    });
    router.push('/order/AfterSaleOrder/logisticsConfiguration');

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

    if(selectedRows.length <= 0){
      return message.info('请至少选择一条数据');
    }

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

  // SN激活导入弹窗
  handleExcelImport = () =>{
    this.setState({
      excelVisible: true,
    });
  }

  handleExcelCancel = () =>{
    this.setState({
      excelVisible: false,
    });
  }

  // 文本导入弹窗
  handleTextImport = () =>{
    this.setState({
      textVisible: true,
    });
  }

  handleTextCancel = () =>{
    this.setState({
      textVisible: false,
    });
  }

// 订单导入弹窗
handleOrderImport = () =>{
  this.setState({
    OrderImportVisible: true,
  });
}

handleOrderImportCancel = () =>{
  this.setState({
    OrderImportVisible: false,
  });
}

  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

  components = {
    header: {
      cell: ResizeableTitle,
    },
  };

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
      exportVisible,
      TransferVisible,
      LogisticsConfigVisible,
      selectedRows,
      detailsVisible,
      selectedRowKeys,
      noDepositVisible,
      confirmTagVisible,
      journalVisible,
      journalList,
      SMSVisible,
      smsList,
      VoiceVisible,
      voice,
      currentList,
      textVisible,
      excelVisible,
      tabCode,
      countSice,
      params,
      OrderImportVisible
    } = this.state;

    const columns = this.state.columns.map((col, index) => ({
      ...col,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));

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


    return (
      <Panel>
        {/* <TabPanes/> */}
        <div className={styles.ordersTabs}>
          <Tabs type="card" activeKey={tabKey} onChange={this.statusChange} style={{height:59}}>
            {tabCode.map(item=>{
              return (
                <TabPane tab={
                  <span>
                    {((
                      item.key === params.confirmTag || 
                      JSON.stringify(item.key) === params.confirmTag
                      ) && (
                        item.key === '0' ||
                        item.key === '1' ||
                        item.key === '2' ||
                        item.key === '3' ||
                        item.key === '4' ||
                        item.key === '5' ||
                        item.key === '6' ||
                        item.key === null
                      )) ? (
                    <Badge count={countSice} overflowCount={999}>
                        <a href="#" className="head-example" />
                      </Badge>) : ""
                    }
                    {item.name}
                  </span>
                } key={item.key}>
                </TabPane>
              )
            })}
          </Tabs>
        
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
          renderLeftButton={()=>this.renderLeftButton(tabKey)}
          // renderRightButton={this.renderRightButton}
          counterElection={true}
          onChangeCheckbox={this.onChangeCheckbox}
          selectedKey={selectedRowKeys}
          tblProps={
            {components:this.components}
          }
          // multipleChoice={true}
        />
        </div>
        {/* 详情 */}
        {detailsVisible?(
          <Details
            detailsVisible={detailsVisible}
            handleCancelDetails={this.handleCancelDetails}
          />
        ):""}
        {/* 日志弹框 */}
        {journalVisible?(
          <Journal
            journalVisible={journalVisible}
            journalList={journalList}
            handleCancelJournal={this.handleCancelJournal}
          />
        ):""}
        {/* 短信弹框 */}
        {SMSVisible?(
          <SMS
            SMSVisible={SMSVisible}
            smsList={smsList}
            handleCancelSMS={this.handleCancelSMS}
          />
        ):""}
        {/* 语音列表弹框 */}
        {VoiceVisible?(
          <VoiceList
            VoiceVisible={VoiceVisible}
            voice={voice}
            handleCancelVoice={this.handleCancelVoice}
          />
        ):""}

        {/* 导出 */}
        {exportVisible?(
          <Export
            exportVisible={exportVisible}
            handleCancelExport={this.handleCancelExport}
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

        {/* 免押宝导入弹窗 */}
        {noDepositVisible?(
          <ImportData
            noDepositVisible={noDepositVisible}
            handleCancelNoDeposit={this.handleCancelNoDeposit}
          />
        ):""}
        {/* SN激活导入弹窗 */}
        {excelVisible?(
          <Excel
            excelVisible={excelVisible}
            handleExcelCancel={this.handleExcelCancel}
          />
        ):""}

        {/* 文本导入弹窗 */}
        {textVisible?(
          <Text
            textVisible={textVisible}
            handleTextCancel={this.handleTextCancel}
          />
        ):""}

        {/* 订单导入弹窗 */}
        {OrderImportVisible?(
          <OrderImport
          OrderImportVisible={OrderImportVisible}
          handleOrderImportCancel={this.handleOrderImportCancel}
          />
        ):""}
        {
          confirmTagVisible ? (
        <Modal
          title="修改状态"
          visible={confirmTagVisible}
          width={560}
          onCancel={this.handleCancelConfirmTag}
          footer={[
            <Button key="back" onClick={this.handleCancelConfirmTag}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={()=>this.handleSubmitConfirmTag()}>
              确定
            </Button>,
          ]}
        >
          {/* 1、 已审核、已发货、在途中、已签收 跟进中 可以手动切换成已激活、已取消、已退回，
          2、已激活、已取消、已退回这三种状态下不能手动切换状态
          3、已过期  可以手动更改成已激活、已退回 */}
         {/* {"name":"待审核",key:0},
              {"name":"初审",key:1},
              {"name":"终审",key:2},
              {"name":"已发货",key:3},
              {"name":"在途中",key:4},
              {"name":"已签收",key:5},
              {"name":"跟进中",key:6},
              {"name":"已激活",key:7},
              {"name":"已退回",key:8},
              {"name":"已取消",key:9},
              {"name":"已过期",key:10},
              {"name":"全部",key:null}, */}
              {currentList.confirmTag === '10' ? (
                <Radio.Group onChange={this.onChangeRadio}>
                  <Radio value={7}>已激活</Radio>
                  <Radio value={8}>已退回</Radio>
                </Radio.Group>
              ) : (
                <Radio.Group onChange={this.onChangeRadio}>
                  <Radio value={7}>已激活</Radio>
                  <Radio value={8}>已退回</Radio>
                  <Radio value={9}>已取消</Radio>
                </Radio.Group>
              )}
        </Modal>
        ) : ""
      }
      </Panel>
    );
  }
}
export default AllOrdersList;
