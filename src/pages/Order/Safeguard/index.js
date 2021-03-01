import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Button,
  Col,
  Form,
  Input,
  Badge,
  Row,
  Select,
  DatePicker,
  Divider,
  Dropdown,
  Tree,
  Menu,
  Icon,
  Modal,
  message,
  Tabs,
  Radio,
  Tag,
  Cascader,
  TreeSelect,
  Descriptions
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import { Resizable } from 'react-resizable';

import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';
import Update from '@/pages/Order/Safeguard/update';
import UpdateStatus from '@/pages/Order/Safeguard/components/updateStatus';
import func from '../../../utils/Func';
import { setListData } from '../../../utils/publicMethod';
import { ORDERSTATUS, ORDERTYPPE, GENDER, ORDERTYPE, ORDERSOURCE, TIMETYPE, LOGISTICSCOMPANY, LOGISTICSSTATUS } from './data.js';
import {
  deleteData,
  updateReminds,
  subscription,
  productTreelist,
  getCurrenttree,
  getCurrentsalesman,
  updateConfirmTag,
  orderMenuHead,
  orderMenuTemplate,
  updateOrderHead
} from '../../../services/newServices/order';
import {getDataInfo} from '../../../services/order/ordermaintenance'

// getList as getSalesmanLists,
import { getSalesmangroup } from '../../../services/newServices/sales';
import styles from './index.less';
import Export from './components/export'
// import TransferCustomers from './components/TransferCustomers'
// import LogisticsConfig from './components/LogisticsConfig'
import PopupDetails from './components/popupDetails'

import ImportData from '../components/ImportData';
import Excel from '../components/excel';
import Text from '../components/text';
import Journal from '../components/journal';
import TimeConsuming from '../components/timeConsuming';
import SMS from '../components/smsList';
import VoiceList from '../components/voiceList';
import OrderImport from './components/orderImport';
import SearchButton from '../components/button';
import { getCookie } from '../../../utils/support';
import { getLabelList } from '@/services/user';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { SubMenu } = Menu;
const { TextArea } = Input;
const { TreeNode } = Tree;
const { Option } = Select;

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
      params:{
        size:10,
        current:1,
        orderBy:false
      },
      clientStatus:[],
      tabKey:sessionStorage.executiveOrderTabKey ? sessionStorage.executiveOrderTabKey : '0',
      selectedRows:[],
      productList:[],
      isUpdate:false,
      isUpdateStatus:false,
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
      timeConsumingList:{},
      voice:{},
      // 免押宝导入弹窗
      noDepositVisible:false,
      confirmLoading: false,
      // SN激活导入弹窗
      excelVisible:false,
      // 订单导入弹窗
      OrderImportVisible:false,
      // 首次打印提示弹框
      LogisticsAlertVisible:false,
      tips:[],
      salesmangroup:[],
      countSice:0,
      plainOptions:[],
      checkedOptions:[],
      editPlainOptions: '', // 当前选择的字段列表，未保存
      editCheckedOptions: '', // 当前已选择字段，未保存
      isClickHandleSearch:'',// 设置字段后在未保存的情况下点击空白区域字段重置
      columns:[],
      updateConfirmTagVisible:false,
      confirmTagList:[],
      _listArr:[],
      organizationTree:[]
    };
  }

  // ============ 初始化数据 ===============
  componentWillMount() {

    this.getTreeList();
    this.currenttree();
    this.getLabels();
    this.getOrderMenuHead();
    this.getOrderMenuTemplate();

  }

  getTreeList = () => {
    productTreelist().then(res=>{
      this.setState({productList:res.data})
    })
  }

  getLabels = () =>{
    //获取维护标签
    getLabelList({
      size:100,
      current:1,
      labelType:0
    }).then(res=>{
      this.setState({
        clientStatus:res.data.records
      })
    })
  }

  // 组织列表
  currenttree = () => {
    getCurrenttree().then(res=>{
      this.setState({
        organizationTree:res.data
      })
    })
  }

  getDataList = () => {
    const {params} = this.state;
    this.setState({
      loading:true,
    })
    getDataInfo(params).then(res=>{
      this.setState({
        countSice:res.data.total,
        data:setListData(res.data),
        loading:false,
        selectedRowKeys:[]
      })
    })

    this.onSelectRow([],[])
  }
  // 根据组织获取对应的业务员数据
  getSalesmanList = (value = "all_all") => {
    getCurrentsalesman(value).then(res=>{


      if(res.code === 200){
        res.data.unshift({key:'全部',value:''});
        this.setState({
          salesmanList:res.data
        })
      }
    })
  }
  // 选择组织
  changeGroup = (value) => {
    if(value){
      this.getSalesmanList(value);
      this.setState({
        salesmanList:[]
      })
      this.props.form.setFieldsValue({
        salesman: `全部`
      });
    }
  }

  // ============ 查询 ===============
  handleSearch = (params) => {
    console.log(params,"查询参数")
    const { sorts,dateRange } = params;
    const { tabKey, salesmanList } = this.state;
    let payload = {
      ...params,
      // orderBy:false
    };
    if (dateRange) {
      payload = {
        ...params,
        startTime: dateRange ? func.format(dateRange[0], dateFormat) : null,
        endTime: dateRange ? func.format(dateRange[1], dateFormat) : null,
      };
      // payload.dateRange = null;
    }

    if(sorts){
      if(sorts.field == "followTime"){
        payload.followSort = sorts.order=='ascend' ? true:false
        payload.sortType = 2;
      }
      if(sorts.field == "activationSigntime"){
        payload.activationSort = sorts.order=='ascend' ? true:false
        payload.sortType = 1;
      }
    }

    if(payload.organizationId && payload.organizationId === ""){
      payload.organizationId = null;
    }
    if(payload.logisticsStatus && payload.logisticsStatus === "全部"){
      payload.logisticsStatus = null;
    }
    if(payload.orderSource && payload.orderSource === "全部"){
      payload.orderSource = null;
    }
    let text = "";
    if(payload.salesman === "全部" || payload.salesman === ""){
      for(let i=0; i<salesmanList.length; i++){
        if(salesmanList[i].value){
          text +=salesmanList[i].value+","
        }
      }
      payload.salesman = text.replace(/^,+/,"").replace(/,+$/,"");
    }else{
      payload.salesman = payload.salesman
    }

    payload = {
      ...payload,
      clientLevel:tabKey === 'null' ? null : tabKey
    };

    payload.payPanyId = payload.productType ? payload.productType[0] : payload.payPanyId ? payload.payPanyId : null;
    payload.productTypeId = payload.productType ? payload.productType[1] : payload.productTypeId ? payload.productTypeId  : null;
    payload.productId = payload.productType ? payload.productType[2] : payload.productId ? payload.productId  : null;

    delete payload.dateRange;
    delete payload.productType;
    delete payload.sorts;

    for(let key in payload){
      payload[key] = payload[key] === "" ? null : payload[key]
    }
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

    const { salesmanList, salesmangroup, params, productList,organizationTree,clientStatus } = this.state;

    return (
      <div className={"default_search_form"}>
        <Form.Item label="姓名">
          {getFieldDecorator('userName',{
          })(<Input placeholder="请输入姓名" />)}
        </Form.Item>
        <Form.Item label="手机号">
          {getFieldDecorator('userPhone',{
          })(<Input placeholder="请输入手机号" />)}
        </Form.Item>
        <Form.Item label="SN">
          {getFieldDecorator('productCoding',{
          })(<Input placeholder="请输入SN" />)}
        </Form.Item>
        <Form.Item label="商户号">
          {getFieldDecorator('merchants', {
          })(<Input placeholder="请输入商户号" />)}
        </Form.Item>
        <Form.Item label="所属组织">
          {getFieldDecorator('organizationId', {
          })(
            <TreeSelect
              style={{ width: 200 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              onChange={this.changeGroup}
              treeData={organizationTree}
              allowClear
              showSearch
              treeNodeFilterProp="title"
              placeholder="请选择所属组织"
            />
          )}
        </Form.Item>
        <Form.Item label="销售">
          {getFieldDecorator('salesman', {
          })(
            <Select placeholder={"请选择销售"} style={{ width: 200 }}>
              {salesmanList.map((item,index)=>{
                return (<Option key={index} value={item.value}>{item.key}</Option>)
              })}
            </Select>
          )}
        </Form.Item>
        {/*<Form.Item label="交易量">*/}
        {/*  {getFieldDecorator('orderSource', {*/}
        {/*  })(*/}
        {/*    <Select placeholder={"请选择订单来源"} style={{ width: 120 }}>*/}
        {/*      {ORDERSOURCE.map(item=>{*/}
        {/*        return (<Option value={item.key}>{item.name}</Option>)*/}
        {/*      })}*/}
        {/*    </Select>*/}
        {/*  )}*/}
        {/*</Form.Item>*/}
        <Form.Item label="维护标签">
          {getFieldDecorator('clientStatus', {
            initialValue: params.clientStatus ? params.clientStatus : "",
          })(
            <Select placeholder={"请选择维护标签"} style={{ width: 120 }}>
              <Option value=''>全部</Option>
              {clientStatus.map(item=>{
                return (<Option value={item.id}>{item.labelName}</Option>)
              })}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="产品分类">
          {getFieldDecorator('productType', {
          })(
            <Cascader
              style={{ width: 260 }}
              options={productList}
              fieldNames={{ label: 'value',value: "id"}}
              changeOnSelect={true}
            ></Cascader>
          )}
        </Form.Item>
        <div>
          <Form.Item label="时间类型">
            {getFieldDecorator('timeType', {
            })(
              <Select placeholder={"时间类型"} style={{ width: 130 }}>
                <Option key={2} value={2}>跟进时间</Option>
                <Option key={1} value={1}>激活时间</Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="时间范围">
            {getFieldDecorator('dateRange', {
            })(
              <RangePicker showTime size={"default"} />
            )}
          </Form.Item>
          <div style={{ float: 'right' }}>
            <Button type="primary" htmlType="submit">
              <FormattedMessage id="button.search.name" />
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={()=>{
              // this.getSalesman();
              onReset()
            }}>
              <FormattedMessage id="button.reset.name" />
            </Button>
          </div>
        </div>
      </div>
    );
  };
  // ====== 首次打印提示弹框 ======
  handleLogisticsAlert =() =>{
    this.setState({
      LogisticsAlertVisible:false
    })
  }

  // 对错误订单的状态进行变更操作
  changeUpdateConfirmTag = (row) => {
    this.setState({
      confirmTagList:row,
      updateConfirmTagVisible:true,
    })
  }
  handleCancelUpdateConfirmTag = () => {
    this.setState({
      updateConfirmTagVisible:false,
      radioChecked:''
    })
  }
  onChangeRadio = (e) => {
    this.setState({
      radioChecked: e.target.value
    })
  }

  handleSubmitUpdateConfirmTag = (e) => {
    const { radioChecked, confirmTagList } = this.state;
    if(!radioChecked){
      return message.error("请选择需要更改的状态");
    }

    Modal.confirm({
      title: '提醒',
      content: "此次操作无法再次变更,确认操作!",
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      keyboard:false,
      onOk:() => {
        return new Promise((resolve, reject) => {
          updateConfirmTag({
            id:confirmTagList[0].id,
            clientLevel:radioChecked
          }).then(res=>{
            if(res.code === 200){
              message.success(res.msg);
              this.setState({
                updateConfirmTagVisible:false
              });
              this.getDataList();
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
  // =========关闭物流弹窗========
  handleCancelLogisticsConfig = () => {
    this.setState({
      LogisticsConfigVisible:false
    })
  }
  // 流程变更
  flowUpdate = () => {
    const {selectedRows} = this.state;

    if(selectedRows.length <= 0){
      return message.info('请至少选择一条数据');
    }
    const { dispatch } = this.props;
    dispatch({
      type: `globalParameters/setDetailData`,
      payload: selectedRows[0],
    });

    this.setState({
      isUpdate:true
    })
  }
  flowUpdateCancel = () =>{
    this.setState({
      isUpdate:false
    })
  }
  flowUpdateSuccess = () =>{
    this.flowUpdateCancel()
    this.getDataList()
  }

  //标签变更
  statusUpdate = () => {
    const {selectedRows} = this.state;

    if(selectedRows.length <= 0){
      return message.info('请至少选择一条数据');
    }
    const { dispatch } = this.props;
    dispatch({
      type: `globalParameters/setDetailData`,
      payload: selectedRows[0],
    });

    this.setState({
      isUpdateStatus:true
    })
  }
  statusUpdateCancel = () =>{
    this.setState({
      isUpdateStatus:false
    })
  }
  statusUpdateSuccess =() =>{
    this.statusUpdateCancel();
    this.getDataList()
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


  // 左侧操作按钮
  renderLeftButton = (tabKey) => {
    return (
        <div>
            {/*<Button type="primary" icon="plus" onClick={()=>{*/}
            {/*  router.push(`/order/safeguard/add`);*/}
            {/*}}>添加</Button>*/}
            <Button
              icon="menu-unfold"
              onClick={this.flowUpdate}
            >阶段变更</Button>
            <Button
              icon="menu-unfold"
              onClick={this.statusUpdate}
            >标签变更</Button>
            <Button
              icon="message"
              onClick={this.batchReminders}
            >短信提醒</Button>
            <Button
              icon="upload"
              onClick={this.handleOrderImport}
            >导入交易量</Button>
            <Button
            icon="download"
            onClick={this.exportFile}
            >导出</Button>
          </div>
      )
  };

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
    message.info('开发中');
    return false;
    const {selectedRows} = this.state;
    if(selectedRows.length <= 0){
      return message.info('请至少选择一条数据');
    }
    this.handleReminds(selectedRows)
  }

  refreshTable = () => {
    this.getDataList();
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
    router.push(`/order/executive/edit/${row.id}`);
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
        if(type !=""){
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
            clientLevel: row.clientLevel,
          }
          subscription(params).then(res=>{
            if(res.code === 200){
              message.success(res.msg);
              list()
            }else{
              message.error(res.msg);
            }
          })
        }else {
          Modal.confirm({
            title: '提示',
            content: `${row.userName}(${row.userPhone})订单物流信息有误，请修改物流信息\n`,
            okText: '确定',
            width:'550px',
            okType: 'danger',
            cancelText: '取消',
            keyboard:false,
            onOk() {},
            onCancel() {},
          });
        }

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
    sessionStorage.executiveOrderTabKey = key;
    let _params = {...this.state.params}
    _params.current = 1
    _params.orderBy = false;
    this.setState({
      tabKey:key,
      params:_params
    },()=>{
      // this.getOrderMenuHead()
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

  // // 打开短信弹窗
  // handleSMS = (row) => {
  //   this.setState({
  //     SMSVisible:true,
  //     smsList:row
  //   })
  // }
  // // 关闭短信弹窗
  // handleCancelSMS = () => {
  //   this.setState({
  //     SMSVisible:false
  //   })
  // }

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

  // handleResize = index => (e, { size }) => {
  //   this.setState(({ columns }) => {
  //     const nextColumns = [...columns];
  //     nextColumns[index] = {
  //       ...nextColumns[index],
  //       width: size.width,
  //     };
  //     return { columns: nextColumns };
  //   });
  // };


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

  // // 文本导入弹窗
  // handleTextImport = () =>{
  //   this.setState({
  //     textVisible: true,
  //   });
  // }
  //
  // handleTextCancel = () =>{
  //   this.setState({
  //     textVisible: false,
  //   });
  // }

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
    this.getDataList();
  }

  onCheck = (checkedKeys) => {
    this.setState({
      checkedOptions: checkedKeys
    });
  };

  onFilterDropdownVisibleChange = (visible, type) => {
    const {isClickHandleSearch,editPlainOptions,editCheckedOptions}=this.state
    if (visible && !isClickHandleSearch) {
      this.setState({
        isClickHandleSearch: false
      });
    } else {
      this.setState({
        plainOptions: editPlainOptions,
        checkedOptions: editCheckedOptions
      });
    }
  };

  handleSubmit = confirm => {
    // 确定 保存用户设置的字段排序和需要显示的字段key
    const { plainOptions, checkedOptions } = this.state;
    const arr=[];

    plainOptions.map(item=>{
      if(checkedOptions.indexOf(item.key) != -1){
        arr.push(item)
      }
    })

    const params={
      menuJson:arr,
      menuType:1,
      deptId:getCookie("dept_id")
    }
    updateOrderHead(params).then(res=>{
      if(res.code === 200){
        message.success(res.msg)
        this.getOrderMenuHead();
        this.setState({
            isClickHandleSearch: true,
          },() => {
            confirm();
          }
        )
      }
    })
  };

  handleCancel = clearFilters => {
    // 用户点击取消按钮，重置字段
    clearFilters();
    this.setState({
      plainOptions: this.state.editPlainOptions,
      checkedOptions: this.state.editCheckedOptions
    });
  };
  handleReset = confirm => {
    // 确定 保存用户设置的字段排序和需要显示的字段key
    const { plainOptions } = this.state;
    const params={
      menuJson:plainOptions,
      menuType:1,
      deptId:getCookie("dept_id")
    }
    updateOrderHead(params).then(res=>{
      if(res.code === 200){
        message.success(res.msg)
        this.getOrderMenuHead();
        this.setState({
            isClickHandleSearch: true,
          },() => {
            confirm();
          }
        )
      }
    })
  };

  components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  onDrop = info => {
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split("-");
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);
    if (dropPosition === 1 || dropPosition === -1) {
      const loop = (data, key, callback) => {
        data.forEach((item, index, arr) => {
          if (item.key === key) {
            return callback(item, index, arr);
          }
          if (item.children) {
            return loop(item.children, key, callback);
          }
        });
      };
      const data = [...this.state.plainOptions];
      let dragObj;
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
        dragObj = item;
      });
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
      this.setState({
        plainOptions: data
      });
    }
  };


  // 菜单列表头获取
  getOrderMenuHead = () => {
    orderMenuHead(1).then(resp=>{
      if(resp.code === 200){
        const list=resp.data.menuJson;
        const checked=[];
        list.map(item => {
          item.ellipsis=true;
          // 当前阶段
          if(item.dataIndex === "clientLevel") {
            item.render = (key, row) => {
              let s = row.clientLevel;
              let r = s == 0 || s == '' || s == null ? '' : '阶段' + s;
              return (
                r
              )
            }
          }

          // 维护标签
          if(item.dataIndex === "clientStatus") {
            item.render = (key, row) => {
              const { clientStatus }=this.state;
              let r = clientStatus.find(t => t.id+'' == row.clientStatus) || {}
              return (
                r.labelName
              )
            }
          }
          if(item.dataIndex === "followTime" || item.dataIndex === 'activationSigntime') {
            item.sorter=true
          }
          checked.push(item.dataIndex)
        })
        this.setState({
          checkedOptions:checked,
          columns:list,
          editCheckedOptions:checked
        })
      }else {
        message.error(resp.msg)
      }
    })
  }

  getOrderMenuTemplate = () => {
    orderMenuTemplate(1).then(res=>{
      res.data.menuJson.map(item => {
        item.key=item.dataIndex
      })
      this.setState({
        plainOptions:res.data.menuJson,
        editPlainOptions:res.data.menuJson
      })
    })
  }

  render() {
    const code = 'allOrdersList';

    const {
      form,
    } = this.props;

    const formAllItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };

    const {
      data,
      loading,
      tabKey,
      exportVisible,
      clientStatus,
      detailsVisible,
      journalVisible,
      SMSVisible,
      isUpdate,
      isUpdateStatus,
      smsList,
      voice,
      journalList,
      selectedRowKeys,
      noDepositVisible,
      updateConfirmTagVisible,
      // textVisible,
      excelVisible,
      OrderImportVisible,
      confirmTagList,
      LogisticsFirst,
      LogisticsAlertVisible,
      tips,
      countSice,
      plainOptions,
      checkedOptions,
      columns,
      params
    } = this.state;

    const loop = data =>
      data.map((item, index) => {
        return <TreeNode
          className={styles.TreeNode}
          key={item.key}
          icon={<Icon
            className={styles.TreeNodeIcon}
            style={{
              position: 'absolute',
              // display:"none",
              right: '10px',
              marginTop: '3px'}}
            type="menu" />}
          title={item.title}
        />;
      });

    let list=[];
    columns.map((item, index) => {
      list.push(item)
    });

    list.push(
        {
          title: '操作',
          key: 'operation',
          fixed: 'right',
          width: 90,
          filterDropdown: ({ confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
              <Tree
                checkable
                draggable
                blockNode
                selectable={false}
                onCheck={this.onCheck}
                checkedKeys={checkedOptions}
                onDrop={this.onDrop.bind(this)}
              >
                {loop(plainOptions)}
              </Tree>
              <div>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => this.handleSubmit(confirm)}
                  style={{ width: "60px", marginRight: "10px" }}
                >
                  确定
                </Button>
                <Button
                  size="small"
                  onClick={() => this.handleCancel(clearFilters)}
                  style={{ width: "60px" }}
                >
                  取消
                </Button>
                <Button
                  size="small"
                  onClick={() => this.handleReset(clearFilters)}
                  style={{ width: "60px", marginRight: "10px" }}
                >
                  重置
                </Button>
              </div>
            </div>
          ),
          filterIcon: filtered => <Icon type="setting" theme="filled" />,
          onFilterDropdownVisibleChange: this.onFilterDropdownVisibleChange.bind(
            this
          ),
          render: (text,row) => {
            return(
              <div>
                {/*<a onClick={()=>this.handleDetails(row)}>跟进</a>*/}
                {/*<Divider type="vertical" />*/}
                {/*<a onClick={()=>this.handleJournal(row)}>日志</a>*/}
                {/*<Divider type="vertical" />*/}
                <a onClick={()=>this.handleDetails(row)}>详情</a>
              </div>
            )
          },
        }
    )
    // const columns = this.state.columns.map((col, index) => ({
    //   ...col,
    //   onHeaderCell: column => ({
    //     width: column.width,
    //     onResize: this.handleResize(index),
    //   }),
    // }));

    return (
      <Panel>
        <div className={styles.ordersTabs}>
          <Tabs type="card" defaultActiveKey={tabKey} onChange={this.statusChange} style={{height:59}}>
            {ORDERSTATUS.map((item,i)=>{
              return (
                <TabPane tab={
                  <span>
                    {(
                      item.key === params.clientLevel ||
                      JSON.stringify(item.key) === params.clientLevel
                    ) ? (
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
            columns={list}
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
          {/* 详情 */}
          {detailsVisible?(
            <PopupDetails
              detailsVisible={detailsVisible}
              clientStatus={clientStatus}
              handleCancelDetails={this.handleCancelDetails}
            >
            </PopupDetails>
          ):""}
        </div>
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

        {isUpdate?(
          <Update isUpdate={isUpdate} handleSuccess={this.flowUpdateSuccess} handleCancel={this.flowUpdateCancel}>

          </Update>
        ):''}

        {isUpdateStatus?(
          <UpdateStatus isUpdate={isUpdateStatus} clientStatus={clientStatus} handleSuccess={this.statusUpdateSuccess} handleCancel={this.statusUpdateCancel}/>
        ):''}

        {/* 导出 */}
        {exportVisible?(
          <Export
            exportVisible={exportVisible}
            handleCancelExport={this.handleCancelExport}
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

        {/* 订单导入弹窗 */}
        {OrderImportVisible?(
          <OrderImport
            OrderImportVisible={OrderImportVisible}
            handleOrderImportCancel={this.handleOrderImportCancel}
          />
        ):""}



        <Modal
          title="提示"
          visible={LogisticsAlertVisible}
          maskClosable={false}
          width={500}
          onCancel={this.handleLogisticsAlert}
          footer={[
            <Button key="back" onClick={this.handleLogisticsAlert}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={()=>this.handleLogisticsAlert()}>
              确定
            </Button>,
          ]}
        >
          <div>
            {tips.map(item=>{
              return(
                <p>{item.name}</p>
              )
            })}
          </div>
        </Modal>

        <Modal
          title="状态变更"
          visible={updateConfirmTagVisible}
          maskClosable={false}
          destroyOnClose
          width={660}
          onCancel={this.handleCancelUpdateConfirmTag}
          footer={[
            <Button key="back" onClick={this.handleCancelUpdateConfirmTag}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={()=>this.handleSubmitUpdateConfirmTag()}>
              确定
            </Button>,
          ]}
        >
          <Form>
            <FormItem {...formAllItemLayout} label="订单状态">
              {confirmTagList.map(item=>{
                return (
                  <>
                    {item.clientLevel === "10" ? (
                      <Radio.Group onChange={this.onChangeRadio}>
                        <Radio value={6}>认领</Radio>
                      </Radio.Group>
                    ) : (
                      <Radio.Group onChange={this.onChangeRadio}>
                        <Radio value={6}>跟进中</Radio>
                        <Radio value={7}>已激活</Radio>
                        <Radio value={8}>已退回</Radio>
                        <Radio value={9}>已取消</Radio>
                        <Radio value={11}>退回中</Radio>
                      </Radio.Group>
                    )}
                  </>
                )
              })}
            </FormItem>
            <FormItem {...formAllItemLayout} label="修改原因">
              <TextArea rows={2} disabled />
            </FormItem>
          </Form>
        </Modal>

      </Panel>
    );
  }
}
export default AllOrdersList;
