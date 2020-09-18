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

import { getList, getRemove, getSubmit,getUrl } from '../../../services/newServices/logistics';
import Grouping from './components/grouping'
import Recharge from './components/recharge'

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
      data:{
        list:[
          {
            authorizationType: 2,
            belongingId: "wykj",
            createTime: "2020-04-21 13:43:26",
            defaultNumber: 0,
            groupId: 1,
            groupName: "测试2组",
            id: 53,
            openid: "",
            performanceNumber: 0,
            qrcodeAddress: "http://47.89.20.105:9091/address?salesman=aaa&belongs=wykj&payAmount=",
            qrcodePrefix: "http://47.89.20.105:9091",
            qrcodeSuffix: "/wechat/wechat_authorization?",
            resultsTotalNumber: 1,
            status: 1,
            stayPerformanceNumber: 1,
            userAddress: null,
            userName: "aaa",
            userPhone: "18081456642"
          }
        ],
      },
      loading:false,
      handleGroupingVisible:false,
      handleRechargeVisible:false,
      selectDataArrL:[],
      params:{
        size:10,
        current:1
      }
    };
  }






  // ============ 初始化数据 ===============

  componentWillMount() {
    // this.getDataList();




  }

  // getDataList = () => {
  //   const {params} = this.state;
  //   this.setState({
  //     loading:true
  //   })
  //   getList(params).then(res=>{
  //     this.setState({
  //       loading:false
  //     })
  //     this.setState({
  //       data:{
  //         list:res.data.records,
  //         pagination:{
  //           current: res.data.current,
  //           pageSize: res.data.size,
  //           total: res.data.total
  //         }
  //       }
  //     })
  //   })
  // }

  // ============ 查询 ===============
  handleSearch = params => {
    // this.setState({
    //   params
    // },()=>{
    //   // this.getDataList();
    // })
  };

  // ============ 查询表单 ===============

  renderSearchForm = onReset => {

  };

  // ============ 删除 ===============

  handleClick = ( id) => {
    const params={
      ids: id
    }
    const refresh = this.getDataList;
    Modal.confirm({
      title: '删除确认',
      content: '确定删除该条记录?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        getRemove(params).then(resp => {
          if (resp.success) {
            message.success(resp.msg);
            refresh()
          } else {
            message.error(resp.msg || '删除失败');
          }
        });
      },
      onCancel() {

      },
    });
  };


  // ============ 修改默认开关 =========

  onStatus = (value,key) => {
    const refresh = this.getDataList;
    const data= value === 0 ? 1 : 0;
    const params = {
      id:key.id,
      status:data
    };
    Modal.confirm({
      title: '修改确认',
      content: '是否要修改该状态??',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        getSubmit(params).then(resp=>{
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

  onSelectRow = rows => {
    console.log(rows,"rows")
    this.setState({
      selectDataArrL: rows,
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

// =========充值弹窗========

  handleRecharge = () => {
    this.setState({
      handleRechargeVisible:true,
    })
  };
  // =========关闭充值弹窗========

  handleCancelRecharge = () => {
    this.setState({
      handleRechargeVisible:false
    })
  }


  renderLeftButton = () => (
    <>
      数据列表
    </>
  );

  renderRightButton = () => (
    <div>
      <Button type="primary" onClick={this.handleGrouping}>修改分组</Button>
      <Button type="primary" onClick={this.handleGrouping}>分组</Button>
{/*
      <Button type="primary" onClick={this.handleRecharge}>充值</Button>
*/}
      <Button type="primary" onClick={()=>{router.push(`/customer/sales/add`);}}>添加</Button>
    </div>
  );

  render() {
    const {
      form,
    } = this.props;

    const {data,loading,handleGroupingVisible,handleRechargeVisible} = this.state;

    const columns = [
      {
        title: '业务员姓名',
        dataIndex: 'userName',
        width: 100,
      },
      {
        title: '分组',
        dataIndex: 'groupName',
        width: 100,
      },
      {
        title: '手机号',
        dataIndex: 'userPhone',
        width: 150,
      },
      // {
      //   title: '客户数',
      //   dataIndex: 'resultsTotalNumber',
      //   width: 100,
      // },
      // {
      //   title: '已履约',
      //   dataIndex: 'performanceNumber',
      //   width: 100,
      // },
      // {
      //   title: '待履约',
      //   dataIndex: 'stayPerformanceNumber',
      //   width: 100,
      // },
      // {
      //   title: '已逾期',
      //   dataIndex: 'defaultNumber',
      //   width: 100,
      // },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 200,
      },
      {
        title: '默认开关',
        dataIndex: 'status',
        width: 100,
        render: (res,key) => {
          return(
            <Switch checked={res===1?true:false} onChange={() => this.onStatus(res,key)} />
          )
        },
      },
      {
        title: '授权类型',
        dataIndex: 'authorizationType',
        width: 100,
        render: (res) => {
          const value = res === 1 ? "免押金" :
            res === 2 ? "预授权" :
              res === 3 ? "伪授权" :
                res === 4 ? "免费" : "";
          return(
            value
          )
        },
      },
      {
        title: '公众号通知',
        dataIndex: 'openid',
        width: 100,
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 150,
        render: (res,row) => {
          return(
            <div>
              <Divider type="vertical" />
              <a onClick={()=>this.handleEdit(row)}>修改</a>
              <Divider type="vertical" />
              <a>聚合码</a>
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
          renderRightButton={this.renderRightButton}
        />
        {/* 分组 */}
        {handleGroupingVisible?(
          <Grouping
            handleGroupingVisible={handleGroupingVisible}
            // LogisticsConfigList={selectedRows}
            handleCancelGrouping={this.handleCancelGrouping}
          />
        ):""}
        {/* 充值 */}
        {handleRechargeVisible?(
          <Recharge
            handleRechargeVisible={handleRechargeVisible}
            // LogisticsConfigList={selectedRows}
            handleCancelRecharge={this.handleCancelRecharge}
          />
        ):""}
      </Panel>
    );
  }
}
export default AuthorityList;
