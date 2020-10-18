import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  DatePicker,
  Divider,
  Dropdown,
  Menu,
  Icon,
  Switch,
  Modal,
  message,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';

import { getList,getSalesmangroup,updateStatus,getSendTest,getUnWeChatBind,getWeChatBinding } from '../../../services/newServices/sales';
import Grouping from './components/Mgrouping'
import Recharge from './components/recharge'
import AggregateCode from './components/aggregateCode'
import ModifyGroup from './components/modifyGroup'
import BindingQRCode from './components/bindingQRCode'

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class AuthorityList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data:{ },
      loading:false,
      handleGroupingVisible:false,
      handleRechargeVisible:false,
      handleAggregateCodeVisible:false,
      ModifyGroupVisible:false,
      bindingQRCodeVisible:false,
      selectDataArrL:[],
      selectedRowKeys:[],
      params:{
        size:10,
        current:1
      },
      groupingList:[],
      countDownTimer:30
    };
  }

  // ============ 初始化数据 ===============

  componentWillMount() {
    this.getDataList();

  }

  getDataList = () => {
    const {params} = this.state;
    this.setState({
      loading:true
    })
    getList(params).then(res=>{
      console.log(res)
      this.setState({
        loading:false
      })
      this.setState({
        data:{
          list:res.data.records,
          pagination:{
            current: res.data.current,
            pageSize: res.data.size,
            total: res.data.total
          }
        }
      })
    })
    getSalesmangroup(params).then(res=>{
      this.setState({
        groupingList:res.data.records
      })
    })
  }

  // ============ 查询 ===============
  handleSearch = params => {
    this.setState({
      params
    },()=>{
      this.getDataList();
    })
  };

  // ============ 查询表单 ===============

  renderSearchForm = onReset => {

  };

  // ============ 删除 ===============

  handleClick = ( id) => {

  };


  // ============ 修改默认开关 =========

  onStatus = (value,key) => {
    console.log(value)
    const refresh = this.getDataList;
    const data= value === 0 ? 1 : 0;
    const params = {
      id:key.id,
      salesmanStatus:data
    };
    Modal.confirm({
      title: '修改确认',
      content: '是否要修改该状态??',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        updateStatus(params).then(resp=>{
          console.log(resp)
          if (resp.success) {
           message.success(resp.msg);
           refresh()
          } else {
           message.error(resp.msg || '修改失败');
          }
        })
      },
      onCancel(){},
    });
  };

  // 修改数据
  handleEdit = (row) => {
    const { dispatch } = this.props;
    dispatch({
      type: `globalParameters/setDetailData`,
      payload: row,
    });
    router.push('/customer/sales/edit');
  };

  onSelectRow = (rows,key) => {
    this.setState({
      selectDataArrL: rows,
      selectedRowKeys: key
    });
    const { dispatch } = this.props;
    dispatch({
      type: `globalParameters/setDetailData`,
      payload: rows,
    });
  };
// =========分组弹窗========

  handleGrouping = () => {
    this.setState({
      handleGroupingVisible:true
    })
  };
  // =========关闭分组弹窗========

  handleCancelGrouping = () => {
    this.setState({
      handleGroupingVisible:false
    })
  }
  // =========修改分组弹窗========

  handleModifyGroup = () => {
    this.setState({
      ModifyGroupVisible:true
    })
  };

  // =========关闭分组分组弹窗========

  handleCancelModifyGroup = () => {
    this.setState({
      ModifyGroupVisible:false
    })
  }

  // =========关闭充值弹窗========

  handleCancelRecharge = () => {
    this.setState({
      handleRechargeVisible:false
    })
  }

  // =========聚合码弹窗========

  handleAggregateCode = (res) => {
    if(res.salesmanStatus === 0){
      message.success('当前业务员关闭状态,不能生成聚合码');
      return false
    }
    const { dispatch } = this.props;
    dispatch({
      type: `globalParameters/setDetailData`,
      payload: res,
    });
    const {handleAggregateCodeVisible}=this.state
    console.log(handleAggregateCodeVisible)
    this.setState({
      handleAggregateCodeVisible:true
    })
  };
// =========关闭聚合码弹窗========

  handleCancelAggregateCode = () => {
    this.setState({
      handleAggregateCodeVisible:false
    })
  }

  handleBinding = (row,type) => {
    const refresh = this.getDataList;
    if(type ==="0"){
      Modal.confirm({
        title: '提醒',
        content: '是否确认解绑?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          getUnWeChatBind(row.userAccount,row.openid).then(res=>{
            refresh();
            message.success(res.msg);
          })
        },
        onCancel() {},
      });
    }else {
      getWeChatBinding(row.userAccount).then(res=>{
        console.log(res)
        const imgUrl = "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket="+res.data;
        this.setState({
          bindingQRCodeVisible:true,
          bindingQRCode:imgUrl
        })
        this.countDown();
      })
    }
  }

  countDown= () =>{
    setTimeout(()=>{
      this.setState({
        countDownTimer: this.state.countDownTimer - 1,
      })
      if(this.state.countDownTimer === 0){
        this.getDataList();
        this.setState({
          bindingQRCodeVisible:false,
          countDownTimer:30
        })
      }else{
        this.countDown();
      }
    },1000)
  }


  // =========关闭二维码弹窗========
  handleCancelBindingQRCode = () => {
    this.setState({
      bindingQRCodeVisible:false,
      countDownTimer:30
    })
    this.getDataList();
  }


  handleTest = (row) => {
    if(row.openid === ""){
      message.success('请点击绑定按钮进行二维码绑定操作!如已绑定请点击刷新页面后点击测试消息发送!');
      return false
    }
    getSendTest(row.openid).then(res=>{
      message.success(res.msg);
    })
  }



  renderLeftButton = () => (
    <>
      数据列表
    </>
  );

  renderRightButton = (selectDataArrL) => {
    return(
      <div>
        {
          selectDataArrL.length > 0 ?
            (<Button type="primary" onClick={this.handleModifyGroup}>修改分组</Button>)
          :""
        }

        <Button onClick={this.handleGrouping}>分组</Button>

  {/*
        <Button type="primary" onClick={this.handleRecharge}>充值</Button>
  */}

        <Button type="primary" onClick={()=>{router.push(`/customer/sales/add`);}}>添加</Button>
      </div>
    )
  };

  render() {
    const {
      form,
    } = this.props;

    const {
      selectedRowKeys,
      selectDataArrL,
      data,loading,
      handleGroupingVisible,
      handleRechargeVisible,
      groupingList,handleAggregateCodeVisible,
      ModifyGroupVisible,bindingQRCodeVisible,bindingQRCode,countDownTimer
    } = this.state;

    const columns = [
      {
        title: '业务员账号',
        dataIndex: 'userAccount',
        width: 150,
      },
      {
        title: '业务员姓名',
        dataIndex: 'userName',
        width: 150,
      },
      {
        title: '分组',
        dataIndex: 'groupId',
        width: 150,
        render: (res) => {
          let name='';
          for(let i=0; i<groupingList.length; i++){
            if(groupingList[i].id === res){
              name = groupingList[i].groupName
            }
          }
          return(
            name
          )
        },
      },
      {
        title: '手机号',
        dataIndex: 'userPhone',
        width: 150,
      },
      {
        title: '售后',
        dataIndex: 'name',
        width: 120,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 200,
      },
      {
        title: '默认开关',
        dataIndex: 'salesmanStatus',
        width: 150,
        render: (res,key) => {
          return(
            <Switch checked={res===1?true:false} onChange={() => this.onStatus(res,key)} />
          )
        },
      },
      {
        title: '授权类型',
        dataIndex: 'authorizationType',
        width: 150,
        render: (res) => {
          const value = res === 1 ? "伪授权" :
                res === 2 ? "免费" : "";
          return(
            value
          )
        },
      },
      {
        title: '公众号通知',
        dataIndex: 'openid',
        width: 150,
        render: (res,row) => {
          return(
            <div>
              {
                res === '' ?
                  (<a onClick={()=>this.handleBinding(row,"1")}>绑定</a>)
                  :(<><a onClick={()=>this.handleBinding(row,"0")}>解绑</a><Divider type="vertical" /><a onClick={()=>this.handleTest(row)}>测试</a></>)
              }
            </div>
          )
        },
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 200,
        render: (res,row) => {
          return(
            <div>
              <Divider type="vertical" />
              <a onClick={()=>this.handleEdit(row)}>修改</a>
              <Divider type="vertical" />
              <a onClick={()=>this.handleAggregateCode(row)}>聚合码</a>
            </div>
          )
        },
      },
    ];
    return (
      <Panel>
        <Grid
          form={form}
          onSearch={this.handleSearch}
          renderSearchForm={this.renderSearchForm}
          data={data}
          onSelectRow={this.onSelectRow}
          loading={loading}
          columns={columns}
          scroll={{ x: 1000 }}
          renderLeftButton={this.renderLeftButton}
          renderRightButton={()=>this.renderRightButton(selectDataArrL)}
          selectedKey={selectedRowKeys}
        />
        {/* 分组 */}
        {handleGroupingVisible?(
          <Grouping
            handleGroupingVisible={handleGroupingVisible}
            handleCancelGrouping={this.handleCancelGrouping}
          />
        ):""}
        {/* 修改分组 */}
        {ModifyGroupVisible?(
          <ModifyGroup
            ModifyGroupVisible={ModifyGroupVisible}
            handleCancelModifyGroup={this.handleCancelModifyGroup}
          />
        ):""}
        {/* 充值 */}
        {handleRechargeVisible?(
          <Recharge
            handleRechargeVisible={handleRechargeVisible}
            handleCancelRecharge={this.handleCancelRecharge}
          />
        ):""}
        {/* 聚合码弹框 */}
        <AggregateCode
          handleAggregateCodeVisible={handleAggregateCodeVisible}
          handleCancelAggregateCode={this.handleCancelAggregateCode}
        />
        {/* 二维码 */}
        {bindingQRCodeVisible?(
          <BindingQRCode
            bindingQRCodeVisible={bindingQRCodeVisible}
            bindingQRCode={bindingQRCode}
            countDownTimer={countDownTimer}
            handleCancelBindingQRCode={this.handleCancelBindingQRCode}
          />
        ):""}
      </Panel>
    );
  }
}
export default AuthorityList;
