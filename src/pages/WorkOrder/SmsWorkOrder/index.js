import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Button,
  Form,
  Badge,
  Select,
  Divider,
  Modal,
  message,
  Tabs,
  Tag,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import { Resizable } from 'react-resizable';

import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';
import { getButton } from '../../../utils/authority';
import { ORDERSTATUS,TYPESTATUS } from './data.js';
import {repairorderList,remove,repairorderUpdate } from '../../../services/newServices/workOrder';
import styles from './index.less';
import moment from 'moment';

const { TabPane } = Tabs;
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
class WorkOrderList extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:{},
      loading:false,
      params:{
        size:10,
        current:1
      },
      tabKey:sessionStorage.executiveOrderTabKey ? sessionStorage.executiveOrderTabKey : null,
      // 详情弹窗
      detailsVisible:false,
      countSice:0,
    };
  }

  // ============ 初始化数据 ===============
  componentWillMount() {
    this.getList()
  }

  getList = () => {
    const {params} = this.state;
    this.setState({
      loading:true,
    })
    repairorderList(params.current,params.size).then(res=>{
      console.log(res.data)
      this.setState({
        countSice:res.data.total,
        data:{
          list:res.data.records,
          pagination:{
            current: res.data.current,
            pageSize: res.data.size,
            total: res.data.total
          }
        },
        loading:false,
      })
    })
  }

  // ============ 查询 ===============
  handleSearch = (params) => {
    console.log(params,"查询参数")
    // this.setState({
    //   params:params
    // },()=>{
    //   this.getList();
    // })
  };

  // ============ 查询表单 ===============
  renderSearchForm = onReset => {
    // const {
    //   form,
    // } = this.props;
    // const { getFieldDecorator } = form;
    //
    // const { platformReplyStatus } = this.state;
    //
    // return (
    //   <div className={"default_search_form"}>
    //     <Form.Item label="工单状态">
    //       {getFieldDecorator('platformReplyStatus', {
    //       })(
    //         <Select placeholder={"请选择工单状态"} style={{ width: 200 }}>
    //           {ORDERSTATUS.map((item,index)=>{
    //             return (<Option key={index} value={item.key}>{item.name}</Option>)
    //           })}
    //         </Select>
    //       )}
    //     </Form.Item>
    //     <Form.Item label="工单类型">
    //       {getFieldDecorator('complaintsType', {
    //       })(
    //         <Select placeholder={"请选择工单类型"} style={{ width: 200 }}>
    //           {TYPESTATUS.map((item,index)=>{
    //             return (<Option key={index} value={item.key}>{item.name}</Option>)
    //           })}
    //         </Select>
    //       )}
    //     </Form.Item>
    //     <div style={{ float: 'right',height:'32px' }}>
    //       <Button type="primary" htmlType="submit">
    //         <FormattedMessage id="button.search.name" />
    //       </Button>
    //       <Button style={{ marginLeft: 8 }} onClick={()=>{
    //         // this.getSalesman();
    //         onReset()
    //       }}>
    //         <FormattedMessage id="button.reset.name" />
    //       </Button>
    //     </div>
    //   </div>
    // );
  };


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
        remove({
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
    this.getList();
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
    if(key === 1 || key === '1'){ text = "#F56C6C" }
    if(key === 2 || key === '2'){ text = "#67C23A" }
    return text;
  }
  // 工单状态
  getORDERSTATUS = (key) => {
    let text = ""
    if(key === 0 || key === '0'){ text = "待回复" }
    if(key === 1 || key === '1'){ text = "已回复" }
    if(key === 2 || key === '2'){ text = "已完成" }
    return text;
  }

  statusChange = (key) => {
    sessionStorage.executiveOrderTabKey = key;
    let _params = {...this.state.params}
    const {params} = this.state;
    _params.current = 1
    this.setState({
      tabKey:key,
      params:_params
    },()=>{
      if(key === "null"){
        params.platformReplyStatus=null
      }else {
        params.platformReplyStatus=Number(key)
      }
      this.setState({
        params:params
      },()=>{
        this.getList();
      })
    })
  }

  // 工单是否已处理
  handleDetails = (row) => {
    console.log(row)
    let params={
      id:row.id,
      processingStatus:1
    }
    console.log(params)
    Modal.confirm({
      title: '提示',
      content: `确认当前工单是否已经处理！`,
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      onOk: () => {
        console.log("123")

        repairorderUpdate(params).then(res=>{
          if(res.code === 200){
            message.success(res.msg)
          }else {
            message.error(res.msg)
          }
        })
      },
      onCancel() {

      },
    });


  }
  // 关闭详情弹窗
  handleCancelDetails = () => {
    this.setState({
      detailsVisible:false
    })
  }

  components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  render() {
    const code = 'workOrderList';

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
      params,
      detailsVisible
    } = this.state;

    const columns = [
      {
        title: '业务员账号',
        dataIndex: 'salesman',
        width: 100,
      },
      {
        title: '发送手机号',
        dataIndex: 'mobilePhone',
        width: 150,
      },
      {
        title: '回复内容',
        dataIndex: 'content',
        width: 500,
      },
      {
        title: '回复时间',
        dataIndex: 'receiveTime',
        width: 200,
        render: (res) => {
          return(
            <div>
              {
                res === '' ?
                  (res)
                  :(moment(res).format('YYYY-MM-DD HH:mm:ss'))
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
              <a onClick={()=>this.handleDetails(row)}>处理</a>
              <Divider type="vertical" />
              {/*<a onClick={() => this.handleDelect(res)}>删除</a>*/}
            </div>
          )
        },
      },
    ];

    return (
      <Panel>
        <div className={styles.ordersTabs}>
          {/*<Tabs type="card" defaultActiveKey={tabKey} onChange={this.statusChange} style={{height:59}}>*/}
            {/*{ORDERSTATUS.map((item,i)=>{*/}
              {/*return (*/}
                {/*<TabPane tab={*/}
                  {/*<span>*/}
                    {/*{(*/}
                      {/*item.key === tabKey ||*/}
                      {/*JSON.stringify(item.key) === tabKey*/}
                    {/*) ? (*/}
                      {/*<Badge count={countSice} overflowCount={999}>*/}
                        {/*<a href="#" className="head-example" />*/}
                      {/*</Badge>) : ""*/}
                    {/*}*/}
                    {/*{item.name}*/}
                  {/*</span>*/}
                {/*} key={item.key}>*/}
                {/*</TabPane>*/}
              {/*)*/}
            {/*})}*/}
          {/*</Tabs>*/}

          <Grid
            form={form}
            onSearch={this.handleSearch}
            renderSearchForm={this.renderSearchForm}
            data={data}
            loading={loading}
            columns={columns}
            scroll={{ x: 1000 }}
            renderLeftButton={()=>this.renderLeftButton(tabKey)}
          />

        </div>

      </Panel>
    );
  }
}
export default WorkOrderList;
