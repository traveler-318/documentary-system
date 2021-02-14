import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Divider,
  Tree,
  Menu,
  Modal,
  message,
  Tabs,
  Radio,
  Cascader,
  TreeSelect,
  Descriptions
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import { Resizable } from 'react-resizable';

import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';
import func from '../../../utils/Func';
import { setListData } from '../../../utils/publicMethod';
import { ORDERSTATUS, LOGISTICSCOMPANY} from './data.js';
import {
  localPrinting,
  logisticsRepeatPrint,
  updateReminds,
  synCheck,
  syndata,
  subscription,
  productTreelist,
  batchLogisticsSubscription,
  getCurrenttree,
  getCurrentsalesman,
  updateConfirmTag,
  updateVoiceStatus,
  orderMenuTemplate,
  updateOrderHead
} from '../../../services/newServices/order';
import {
  getDataInfo,
  deleteData,
  statusOrLevel,
  putPool,
  receive
}from '../../../services/order/customer';

import styles from './index.less';
import Export from './export'
import PopupDetails from './popupDetails'

import TransferCustomers from './components/TransferCustomers'
import ImportData from '../../Order/components/ImportData';
import Excel from '../../Order/components/excel';
import Text from '../../Order/components/text';
import Journal from '../../Order/components/journal';
import TimeConsuming from '../../Order/components/timeConsuming';
import SMS from '../../Order/components/smsList';
import VoiceList from '../../Order/components/voiceList';
import OrderImport from '../../Order/components/orderImport';
import { getCookie } from '../../../utils/support';
import { getLabelList } from '@/services/user';
import { CITY } from '@/utils/city';
const FormItem = Form.Item;
const { TabPane } = Tabs;
const { TextArea } = Input;
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
      clientLevels:[],//客户级别数组
      clientStatus:[],//客户等级数组
      cityparam:{},

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
      // 耗时检测弹窗
      timeConsumingVisible:false,
      timeConsumingList:{},
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
    let key = this.props.route.key;
    this.setState({
      routerKey:key
    })
    //   'allcustomer': '全部客户',
    //   'subordinate': '下属客户',
    //   'mycustomer': '我的客户',
    //   'allpublic': '全部公海',
    //   'subordinatepublic': '下属公海',
    //   'mypublic': '我的公海',
    console.log(key)
    this.getLabels();
    this.getTreeList();
    this.currenttree();
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
  }
  // 根据组织获取对应的业务员数据
  getSalesmanList = (value = "all_all") => {
    getCurrentsalesman(value).then(res=>{

      console.log(res,"!!!!!!!!!!!!!!!")

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
  //选择地区
  onChange = (value) => {
    this.setState({
      cityparam:{
        province:value[0],
        city:value[1],
        area:value[2],
      }
    })
  };

  getLabels = () =>{
    //获取客户级别
    getLabelList({
      size:100,
      current:1,
      labelType:1
    }).then(res=>{
      this.setState({
        clientLevels:res.data.records
      })
    })

    //客户状态
    getLabelList({
      size:100,
      current:1,
      labelType:2
    }).then(res=>{
      this.setState({
        clientStatus:res.data.records
      })
    })
  }




  // ============ 查询 ===============
  handleSearch = (params) => {
    console.log(params,"查询参数")
    const { salesmanList,cityparam } = this.state;

    let payload = {};
    if(params.cityparam){
      payload = {
        ...params,
        ...cityparam
      };
    }else{
      payload = {
        ...params
      };
    }

    if(payload.createTime)payload.createTime = func.format(payload.createTime, dateFormat)
    if(payload.followTime)payload.followTime = func.format(payload.followTime, dateFormat)

    if(payload.organizationId && payload.organizationId === ""){
      payload.organizationId = null;
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
      ...payload
    };

    delete payload.dateRange;
    delete payload.productType;
    delete payload.cityparam;

    for(let key in payload){
      payload[key] = payload[key] === "" ? null : payload[key]
    }

    console.log(payload,"查询参数")
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

    const { salesmanList, organizationTree,clientLevels,clientStatus } = this.state;

    console.log(clientLevels)
    return (
      <div className={"default_search_form"}>
        <Form.Item label="姓名">
          {getFieldDecorator('clientName',{
          })(<Input placeholder="请输入姓名" />)}
        </Form.Item>
        <Form.Item label="手机号">
          {getFieldDecorator('clientPhone',{
          })(<Input placeholder="请输入手机号" />)}
        </Form.Item>
        <Form.Item label="客户级别">
          {getFieldDecorator('clientLevel',{
          })(
            <Select placeholder={"请选择客户级别"} style={{ width: 200 }}>
              {clientLevels.map(d => (
                <Select.Option key={d.id} value={d.id}>
                  {d.labelName}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="客户状态">
          {getFieldDecorator('clientStatus', {
          })(
            <Select placeholder={"请选择客户状态"} style={{ width: 200 }}>
              {clientStatus.map(d => (
                <Select.Option key={d.id} value={d.id}>
                  {d.labelName}
                </Select.Option>
              ))}
            </Select>
          )}
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
        <Form.Item label="省市区">
          {getFieldDecorator('cityparam', {
          })(
            <Cascader style={{ width: 200 }}
              options={CITY}
              onChange={this.onChange}
            />
          )}
        </Form.Item>
        <div>
          <Form.Item label="创建时间">
            {getFieldDecorator('createTime', {
            })(
              <DatePicker showTime size={"default"} />
            )}
          </Form.Item>
          <Form.Item label="跟进时间">
            {getFieldDecorator('followTime', {
            })(
              <DatePicker showTime size={"default"} />
            )}
          </Form.Item>
          <Form.Item label="创建人">
            {getFieldDecorator('createUser',{
            })(<Input placeholder="请输入创建人" />)}
          </Form.Item>
          <div style={{ float: 'right' }}>
            <Button type="primary" htmlType="submit">
              <FormattedMessage id="button.search.name" />
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={()=>{
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

  chooseState = (v) =>{
    this.setState({
      updateStatusId:v
    })
  }
  chooseLevel = (v) =>{
    this.setState({
      updatelevelId:v
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


  handleSubmitUpdateConfirmTag = (e) => {
    const { confirmTagList,updateStatusId,updatelevelId } = this.state;
    if(!updateStatusId){
      return message.error("请选择需要更改的状态");
    }
    if(!updatelevelId){
      return message.error("请选择需要更改的级别");
    }

    statusOrLevel({
      id:confirmTagList[0].id,
      statusId:updateStatusId,
      levelId:updatelevelId
    }).then(res=>{
      if(res.code === 200){
        message.success(res.msg);
        this.setState({
          updateConfirmTagVisible:false
        });
        this.getDataList();
      }else{
        message.error(res.msg);
      }
    })


  }

  // 放入公海
  putPool = () => {
    const {selectedRows} = this.state;

    if(selectedRows.length <= 0){
      return message.info('请至少选择一条数据');
    }

    let ids = [];
    selectedRows.map(item=>{
      ids.push(item.id)
    })

    putPool({
      ids:ids.join(",")
    }).then(res=>{
      if (res.success) {
        message.info(res.msg);
        this.getDataList();
      }
    })

  }
  //领取
  receive = () => {
    const {selectedRows} = this.state;

    if(selectedRows.length <= 0){
      return message.info('请至少选择一条数据');
    }

    let ids = [];
    selectedRows.map(item=>{
      ids.push(item.id)
    })

    receive({
      ids:ids.join(",")
    }).then(res=>{
      if (res.success) {
        message.info(res.msg);
        this.getDataList();
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

  // 状态进行修改
  bulkModification = () => {
    const {selectedRows} = this.state;
    if(selectedRows.length <= 0){
      return message.info('请至少选择一条数据');
    }
    if(selectedRows.length > 1){
      return message.info('只能选择一条数据');
    }

    this.changeUpdateConfirmTag(selectedRows);
  }

  // 认领
  bulkClaim = () => {
    const {selectedRows} = this.state;
    if(selectedRows.length <= 0){
      return message.info('请至少选择一条数据');
    }
    if(selectedRows.length > 1){
      return message.info('只能选择一条数据');
    }
    let list=[];
    selectedRows.map( item =>{
      list.push({
        id:item.id,
        confirmTag: 6
      })
    })
    Modal.confirm({
      title: '提示',
      content: "是否进行流程状态确认？此操作不可逆转!",
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      keyboard:false,
      onOk:() => {
        return new Promise((resolve, reject) => {
          updateConfirmTag({id:selectedRows[0].id,confirmTag:6}).then(res=>{
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

  // 左侧操作按钮
  renderLeftButton = (tabKey) => {
    let {routerKey} = this.state;
    let key = null;
    switch (routerKey) {
      case  'allcustomer': key = 1;break;//'全部客户',
      case  'subordinate': key = 1;break; //'下属客户',
      case  'mycustomer': key = 1;break; //'我的客户',
      case  'allpublic': key = 2;break; //'全部公海',
      case  'subordinatepublic': key = 2;break; //'下属公海',
      case  'mypublic': key = 2;break; //'我的公海',
    }

    return (
        <div>
            <Button type="primary" icon="plus" onClick={()=>{
              router.push(`/client/customer/add/1`);
            }}>添加</Button>
            <Button
              icon="interaction"
              onClick={this.handleShowTransfer}
            >转移客户</Button>
           {key == 1?(
             <Button
               icon="laptop"
               onClick={this.putPool}
             >放入公海</Button>
           ):(
             <Button
               icon="laptop"
               onClick={this.receive}
             >领取</Button>
           )}
            <Button
              icon="highlight"
              onClick={this.bulkModification}
            >客户状态</Button>
            <Button
              icon="upload"
              onClick={this.importData}
            >导入</Button>
            <Button
            icon="download"
            type={(tabKey === "0" || tabKey === "1" || tabKey === "2" || tabKey === "5" || tabKey === "6") ? "" : "primary"}
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
          // confirmLoading:confirmLoading,
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
    router.push(`/order/executive/edit/${row.id}`);
  }

  onSelectRow = (rows,keys) => {
    this.setState({
      selectedRows: rows,
      selectedRowKeys: keys,
    });
  };

  // 打开详情弹窗
  handleDetails = (row) => {
    const { clientLevels,clientStatus } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: `globalParameters/setDetailData`,
      payload: {
        detail:row,
        clientLevels:clientLevels,
        clientStatus:clientStatus
      },
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

  // 打开短信弹窗
  handleSMS = (row) => {
    this.setState({
      SMSVisible:true,
      smsList:row
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

  onCheck = (checkedKeys) => {
    this.setState({
      checkedOptions: checkedKeys
    });
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



  getOrderMenuTemplate = () => {
    orderMenuTemplate().then(res=>{
      res.data.menuJson.map(item => {
        item.key=item.dataIndex
      })
      this.setState({
        plainOptions:res.data.menuJson,
        editPlainOptions:res.data.menuJson
      })
    })
  }

  setCityVal = (row) =>{
    let v = "";
    CITY.map(c=>{
        if(c.value == row.province){
          v = c.label+'/';
          c.children.map(p=>{
            if(p.value == row.city) {
              v += p.label+'/';
              p.children.map(a=>{
                if(a.value == row.area) {
                  v += a.label;
                }
              })
            }
          })
        }
    })
    return v
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
      detailsVisible,
      journalVisible,
      SMSVisible,
      timeConsumingVisible,
      timeConsumingList,
      smsList,
      VoiceVisible,
      voice,
      journalList,
      selectedRowKeys,
      noDepositVisible,
      updateConfirmTagVisible,
      voiceStatusVisible,
      textVisible,
      excelVisible,
      OrderImportVisible,
      confirmTagList,
      LogisticsAlertVisible,
      TransferVisible,
      tips,
      clientStatus,
      clientLevels
    } = this.state;

    const columns=[
      {
        title: '姓名',
        dataIndex: 'clientName',
        width: 80
      },
      {
        title: '手机号',
        dataIndex: 'clientPhone',
        width: 100,
      },
      {
        title: '地区',
        dataIndex: 'province',
        width: 130,
        render: (key,row)=>{
            return this.setCityVal(row)
        },
        sorter: (a, b) => a.province - b.province,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '详情地址',
        dataIndex: 'clientAddress',
        width: 160,
      },
      {
        title: '客户级别',
        dataIndex: 'clientLevel',
        width: 110,
        sorter: (a, b) => a.clientLevel.length - b.clientLevel.length,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '客户状态',
        dataIndex: 'clientStatus',
        width: 160,
        ellipsis: true,
        sorter: (a, b) => a.clientStatus - b.clientStatus,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '下次跟进时间',
        dataIndex: 'nextFollowTime',
        width: 180
      },
      {
        title: '跟进记录',
        dataIndex: 'followRecords',
        width: 130
      },
      {
        title: '最后跟进时间',
        dataIndex: 'followTime',
        width: 180
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        width: 180,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 180,
        sorter: (a, b) => a.createTime - b.createTime,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '创建人',
        dataIndex: 'createUser',
        width: 100,
        sorter: (a, b) => a.createUser.length - b.createUser.length,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '销售',
        dataIndex: 'salesman',
        width: 80,
        sorter: (a, b) => a.salesman.length - b.salesman.length,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 250,
        render: (text,row) => {
          return(
            <div>
              <a onClick={()=>this.handleSMS(row)}>跟进</a>
              <Divider type="vertical" />
              <a onClick={()=>this.handleJournal(row)}>日志</a>
              <Divider type="vertical" />
              <a onClick={()=>this.handleDetails(row)}>详情</a>
              {/*<Divider type="vertical" />*/}
              {/*<a onClick={()=>this.handleDelect(row)}>删除</a>*/}
            </div>
          )
        },
      },
    ]

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
        <div className={styles.ordersTabs}>
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
              handleCancelDetails={this.handleCancelDetails}
            >
              <TabPane tab={`跟进`} key="3">
                <Descriptions column={2}>
                  <Descriptions.Item label="商户名">Zhou Maomao</Descriptions.Item>
                  <Descriptions.Item label="商户号">1810000000</Descriptions.Item>
                  <Descriptions.Item label="激活时间">Hangzhou, Zhejiang</Descriptions.Item>
                  <Descriptions.Item label="维护时间">empty</Descriptions.Item>
                </Descriptions>
              </TabPane>
              <TabPane tab={`跟进1`} key="4">
              </TabPane>
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

        {/* 导出 */}
        {exportVisible?(
          <Export
            exportVisible={exportVisible}
            handleCancelExport={this.handleCancelExport}
          />
        ):""}

        {/* 转移客户 */}
        {TransferVisible?(
          <TransferCustomers
            TransferVisible={TransferVisible}
            handleCancelTransfer={this.handleCancelTransfer}
          />
        ):""}

        {/* 客户状态 */}
        {noDepositVisible?(
          <ImportData
            noDepositVisible={noDepositVisible}
            handleCancelNoDeposit={this.handleCancelNoDeposit}
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
            <FormItem {...formAllItemLayout} label="客户状态">
                  <Select placeholder={"请选择客户状态"} style={{ width: 200 }} onSelect={value => this.chooseState(value)} >
                    {clientStatus.map(d => (
                      <Select.Option key={d.id} value={d.id}>
                        {d.labelName}
                      </Select.Option>
                    ))}
                  </Select>
            </FormItem>
            <FormItem {...formAllItemLayout} label="客户级别">
              <Select placeholder={"请选择客户级别"} style={{ width: 200 }} onSelect={value => this.chooseLevel(value)} >
                {clientLevels.map(d => (
                  <Select.Option key={d.id} value={d.id}>
                    {d.labelName}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>
          </Form>
        </Modal>


      </Panel>
    );
  }
}
export default AllOrdersList;
