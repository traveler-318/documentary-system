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
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import { Resizable } from 'react-resizable';

import Panel from '../../components/Panel';
import Grid from '../../components/Sword/Grid';
import QueryParamPage from '@/pages/BranchOrder/components/QueryParamPage';
import func from '../../utils/Func';
import { setListData } from '../../utils/publicMethod';
import { ORDERSTATUS, ORDERTYPPE, GENDER, ORDERTYPE, ORDERSOURCE, TIMETYPE, LOGISTICSCOMPANY, LOGISTICSSTATUS } from './components/data.js';
import {
  getPermissions,
  deleteData,
  localPrinting,
  logisticsRepeatPrint,
  updateReminds,
  toExamine,
  synCheck,
  syndata,
  subscription,
  updateData,
  productTreelist,
  batchLogisticsSubscription,
  getCurrenttree,
  getCurrentsalesman,
  updateConfirmTag,
  updateVoiceStatus,
  orderMenuHead,
  orderMenuTemplate,
  updateOrderHead
} from '../../services/newServices/order';
import {
  branchTree,
  orderList,
  branchSalesman
} from '../../services/branch';

// getList as getSalesmanLists,
// import { getSalesmangroup } from '../../../services/newServices/sales';
import styles from './index.less';
import Export from './components/export'
// import TransferCustomers from './components/TransferCustomers'
// import LogisticsConfig from './components/LogisticsConfig'
import PopupDetails from './components/popupDetails'
//
// import ImportData from '../components/ImportData';
// import Excel from '../components/excel';
// import Text from '../components/text';
// import Journal from '../components/journal';
// import TimeConsuming from '../components/timeConsuming';
// import SMS from '../components/smsList';
// import VoiceList from '../components/voiceList';
// import OrderImport from '../components/orderImport';
import SearchButton from './components/button';
import { getCookie } from '../../utils/support';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { SubMenu } = Menu;
const { TextArea } = Input;
const { TreeNode } = Tree;

const dateFormat = 'YYYY-MM-DD HH:mm:ss';


let modal;


@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class BranchOffice extends PureComponent {

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
      tabKey:sessionStorage.executiveOrderTabKey ? sessionStorage.executiveOrderTabKey : '0',
      selectedRows:[],
      productList:[],
      // 导出
      exportVisible:false,
      // 详情弹窗
      detailsVisible:false,
      // 免押宝导入弹窗
      noDepositVisible:false,
      confirmLoading: false,
      // SN激活导入弹窗
      excelVisible:false,
      // 文本导入弹窗
      textVisible:false,
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
      voiceStatusVisible:false,
      confirmTagList:[],
      _listArr:[],
      organizationTree:[]
    };
  }

  // ============ 初始化数据 ===============
  componentWillMount() {
    this.getOrderMenuHead();
    this.getOrderMenuTemplate();
  }

  getDataList = () => {
    const {params} = this.state;
    this.setState({
      loading:true,
    })
    orderList(params).then(res=>{
      this.setState({
        countSice:res.data.total,
        data:setListData(res.data),
        loading:false,
        selectedRowKeys:[]
      })
    })
  }

  // ============ 查询 ===============
  handleSearch = (params) => {
    const { dateRange,sorts,printTime } = params;

    const { tabKey, salesmanList } = this.state;
    let payload = {
      ...params,
    };
    if (dateRange) {
      payload.startTime= dateRange ? func.format(dateRange[0], dateFormat) : null;
      payload.endTime= dateRange ? func.format(dateRange[1], dateFormat) : null;
      // payload.dateRange = null;
    }
    if(printTime){
      payload.printStartTime= printTime ? func.format(printTime[0], dateFormat) : null;
      payload.printEndTime= printTime ? func.format(printTime[1], dateFormat) : null;
    }

    if(sorts){
      payload.orderBy = sorts.order ==='ascend' ? true:false
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
    console.log("--------------"+payload.salesman)
    if(payload.salesman != undefined ){
      if(payload.salesman[0] === "全部" || payload.salesman === ""){
        for(let i=0; i<salesmanList.length; i++){
          if(salesmanList[i].value){
            text +=salesmanList[i].value+","
          }
        }
        payload.salesman = text.replace(/^,+/,"").replace(/,+$/,"");
      }else{
        payload.salesman = payload.salesman.toString()
      }
    }


    payload = {
      ...payload,
      confirmTag:tabKey === 'null' ? null : tabKey
    };

    payload.payPanyId = payload.productType ? payload.productType[0] : payload.payPanyId ? payload.payPanyId : null;
    payload.productTypeId = payload.productType ? payload.productType[1] : payload.productTypeId ? payload.productTypeId  : null;
    payload.productId = payload.productType ? payload.productType[2] : payload.productId ? payload.productId  : null;

    delete payload.dateRange;
    delete payload.printTime;
    delete payload.productType;

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

    const { params} = this.state;
    return (
      <QueryParamPage getFieldDecorator={getFieldDecorator}
                      params={params}
                      onReset={onReset}
                      form={form}  />
    );
  };

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

  btnButtonBack = (code) => {
    if(code === "deliver-goods"){
      // 发货
      this.bulkDelivery()
    }else if(code === "export"){
      // 导出
      this.exportFile()
    }
  }
  // 左侧操作按钮
  renderLeftButton = (tabKey) => {
    return (<>
      <SearchButton
        btnButtonBack={this.btnButtonBack}
        tabKey={tabKey}
        code={"branchOrder"}
      />
    </>)
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

  refreshTable = () => {
    this.getDataList();
  }

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
      this.getOrderMenuHead()
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

  // 打开物流弹窗
  handleShowLogistics = (data) => {
    const { dispatch } = this.props;

    dispatch({
      type: `globalParameters/setListId`,
      payload: data,
    });
    router.push('/order/executive/logisticsConfiguration');

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
      menuType:0,
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
      menuType:0,
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
    const {tabKey}=this.state;
    orderMenuHead(0).then(resp=>{
      if(resp.code === 200){
        const list=resp.data.menuJson;
        const checked=[];

        list.map(item => {
          // 姓名
          if(item.dataIndex === "userName"){
            item.render=(key,row)=>{
              return (
                <div className={styles.userName}>
                  {
                    row.expireClaim === '1' ? (<p><span>过期</span></p>):""
                  }
                  <span>{key}</span>
                </div>
              )
            }
          }
          // 订单状态
          if(item.dataIndex === "confirmTag"){
            item.render=(key,row)=>{
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
                  <div style={{cursor: 'pointer'}}>
                    <Tag color={this.getORDERSCOLOR(key)}>
                      {this.getORDERSTATUS(key)}
                    </Tag>
                  </div>
                )
              }
            }
          }
          // 订单状态(免押宝)
          if(item.dataIndex === "mianyaStatus"){
            item.render=(key,row)=>{
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
          }
          // 机器状态(免押宝)
          if(item.dataIndex === "machineStatus"){
            item.render=(key,row)=>{
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
          }
          // 订单类型
          if(item.dataIndex === "orderType"){
            item.render=(key)=>{
              return (
                <div>{this.getORDERTYPE(key)} </div>
              )
            }
          }
          // 订单来源
          if(item.dataIndex === "orderSource"){
            item.render=(key)=> {
              return (
                <div>{this.getORDERSOURCE(key)} </div>
              )
            }
          }
          // 物流状态
          if(item.dataIndex === "logisticsStatus"){
            item.render=(key)=>{
              return (
                <div>{this.getLogisticsStatusValue(key)} </div>
              )
            }
          }
          // 签收时间
          if(tabKey === '5'){
            // item.defaultSortOrder= 'descend'
            if(item.dataIndex === "logisticsSigntime"){
              item.sorter=true
            }
          }
          // 最后跟进时间
          if(tabKey === '6'){
            // item.defaultSortOrder= 'descend'
            if(item.dataIndex === "followTime"){
              item.sorter=true
            }
          }
          // 激活时间
          if(tabKey === '7'){
            // item.defaultSortOrder= 'descend'
            if(item.dataIndex === "activationSigntime"){
              item.sorter=true
            }
          }
          // SN
          if(item.dataIndex === "productCoding"){
            item.ellipsis=true
          }
          // 收货地址
          if(item.dataIndex === "userAddress"){
            item.ellipsis=true
          }
          // 销售
          if(item.dataIndex === "salesman"){
            item.ellipsis=true
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
    orderMenuTemplate(0).then(res=>{
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

    const {
      data,
      loading,
      tabKey,
      exportVisible,
      detailsVisible,
      selectedRowKeys,
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
        width: 100,
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
              showIcon={true}
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
                style={{ width: "60px", marginRight: "10px" }}
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
              <a onClick={()=>this.handleDetails(row)}>详情</a>

            </div>
          )
        },
      }
    )

    list = list.map((col, index) => ({
      ...col,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));



    return (
      <Panel>
        <div className={styles.ordersTabs}>
          <Tabs type="card" defaultActiveKey={tabKey} onChange={this.statusChange} style={{height:59}}>
            {ORDERSTATUS.map(item=>{
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
                        item.key === '7' ||
                        item.key === '8' ||
                        item.key === '9' ||
                        item.key === '10' ||
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
            columns={list}
            scroll={{ x: 1000 }}
            renderLeftButton={()=>this.renderLeftButton(tabKey)}
            // renderRightButton={this.renderRightButton}
            counterElection={true}
            onChangeCheckbox={this.onChangeCheckbox}
            selectedKey={selectedRowKeys}

            // multipleChoice={true}
          />
          {/* 详情 */}
          {detailsVisible?(
            <PopupDetails
              detailsVisible={detailsVisible}
              handleCancelDetails={this.handleCancelDetails}
            />
          ):""}
        </div>

        {/* 导出 */}
        {exportVisible?(
          <Export
            exportVisible={exportVisible}
            handleCancelExport={this.handleCancelExport}
          />
        ):""}

      </Panel>
    );
  }
}
export default BranchOffice;
