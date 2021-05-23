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
import { getButton } from '../../../utils/authority';
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
import PopupDetails from './components/popupDetails'
import { getCookie } from '../../../utils/support';
import { getLabelList } from '@/services/user';
import styles from './index.less';

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
      tabKey:sessionStorage.executiveOrderTabKey ? sessionStorage.executiveOrderTabKey : null,
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
      organizationTree:[],


      workOrderStatus:[
        {
          id:1,
          name:'未开始'
        },
        {
          id:1,
          name:'开始'
        },
      ]

    };
  }

  // ============ 初始化数据 ===============
  componentWillMount() {

    this.getTreeList();
    this.currenttree();
    this.getOrderMenuHead();
    this.getOrderMenuTemplate();

  }

  getTreeList = () => {
    productTreelist().then(res=>{
      this.setState({productList:res.data})
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

    const { workOrderStatus, salesmangroup, params, productList,organizationTree,clientStatus } = this.state;

    return (
      <div className={"default_search_form"}>
        <Form.Item label="工单状态">
          {getFieldDecorator('status', {
          })(
            <Select placeholder={"请选择工单状态"} style={{ width: 200 }}>
              {workOrderStatus.map((item,index)=>{
                return (<Option key={index} value={item.id}>{item.name}</Option>)
              })}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="工单类型">
          {getFieldDecorator('status', {
          })(
            <Select placeholder={"请选择工单类型"} style={{ width: 200 }}>
              {workOrderStatus.map((item,index)=>{
                return (<Option key={index} value={item.id}>{item.name}</Option>)
              })}
            </Select>
          )}
        </Form.Item>
        <div style={{ float: 'right',height:'32px' }}>
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

    if (selectedRows.length === 0) {
      return message.info('请先选择一条数据!');
    }
    if (selectedRows.length > 1) {
      return message.info('只能选择一条数据!');
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

    if (selectedRows.length === 0) {
      return message.info('请先选择一条数据!');
    }
    if (selectedRows.length > 1) {
      return message.info('只能选择一条数据!');
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
    message.info('开发中');
    return false;
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


  handleClick(code){

  }

  // 左侧操作按钮
  renderLeftButton = (tabKey) => {
    let buttons = getButton('safeguard');
    const actionButtons = buttons.filter(button => button.action === 2 || button.action === 3);

    return (
      <>
        {/*<Button icon='plus' onClick={()=>{*/}
          {/*this.handleClick()*/}
        {/*}}>添加</Button>*/}
        {/*<Button icon='upload' onClick={()=>{*/}
          {/*this.handleClick()*/}
        {/*}}>导入</Button>*/}
        {/*<Button icon='export' onClick={()=>{*/}
          {/*this.handleClick()*/}
        {/*}}>导出</Button>*/}
        {/*<Button icon='sync' onClick={()=>{*/}
          {/*this.handleClick()*/}
        {/*}}>分配工单</Button>*/}
      </>
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

  getText = (key, type) => {
    let text = ""
    type.map(item=>{
      if(item.key === key){
        text = item.name
        return item.name
      }
    })

  }
  // 工单状态颜色
  getORDERSCOLOR = (key) => {
    let text = ""
    if(key === 0 || key === '0'){ text = "#E6A23C" }
    if(key === 1 || key === '1'){ text = "#409EFF" }
    if(key === 5 || key === '5'){ text = "#F56C6C" }
    if(key === 7 || key === '7'){ text = "#67C23A" }
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
      countSice,
      plainOptions,
      checkedOptions,
      columns,
      params,
      selectedRowKeys,
      detailsVisible
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
    const tableColumns = list.map((col, index) => ({
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
            columns={tableColumns}
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
          {/* 详情*/}
          {detailsVisible?(
            <PopupDetails
              detailsVisible={detailsVisible}
              handleCancelDetails={this.handleCancelDetails}
            >
            </PopupDetails>
          ):""}


        </div>

      </Panel>
    );
  }
}
export default AllOrdersList;
