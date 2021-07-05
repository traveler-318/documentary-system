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
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';
import {
  snmanagerList,
} from '../../../services/newServices/inventory';
import { ORDERSTATUS, TYPESTATUS } from '../../WorkOrder/WorkOrderList/data';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class SnManagementList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data:[],
      loading:false,
      params:{
        size:10,
        current:1
      },
      warehouseStatus:[
        {
          id:0,
          name:'在库'
        },{
          id:1,
          name:'占用'
        },{
          id:2,
          name:'出库'
        }
      ],
    };
  }
  // ============ 初始化数据 ===============

  componentWillMount() {

  }

  getDataList = () => {
    const {params} = this.state;
    this.setState({
      loading:true
    })
    snmanagerList(params).then(res=>{
      this.setState({
        loading:false
      })
      const data = res.data.records;
      this.setState({
        data:{
          list:data,
          pagination:{
            current: res.data.current,
            pageSize: res.data.size,
            total: res.data.total
          }
        }
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
    const {
      form,
    } = this.props;
    const { getFieldDecorator } = form;
    const {warehouseStatus}=this.state
    return (
      <div className={"default_search_form"}>
        <Form.Item label="SN">
          {getFieldDecorator('platformReplyStatus', {
          })(
            <Input placeholder="请输入SN" />
          )}
        </Form.Item>
        <Form.Item label="所属仓库">
          {getFieldDecorator('complaintsType', {
          })(
            <Select placeholder={"请选择所属仓库"} style={{ width: 200 }}>
              {warehouseStatus.map((item,index)=>{
                return (<Option key={index} value={item.id}>{item.name}</Option>)
              })}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="SN状态">
          {getFieldDecorator('complaintsType', {
          })(
            <Select placeholder={"请选择SN状态"} style={{ width: 200 }}>
              {warehouseStatus.map((item,index)=>{
                return (<Option key={index} value={item.id}>{item.name}</Option>)
              })}
            </Select>
          )}
        </Form.Item>
        {/*<Form.Item label="数据来源">*/}
          {/*{getFieldDecorator('complaintsType', {*/}
          {/*})(*/}
            {/*<Select placeholder={"请选择数据来源"} style={{ width: 200 }}>*/}
              {/*{warehouseStatus.map((item,index)=>{*/}
                {/*return (<Option key={index} value={item.id}>{item.name}</Option>)*/}
              {/*})}*/}
            {/*</Select>*/}
          {/*)}*/}
        {/*</Form.Item>*/}
        {/*<Form.Item label="制单人">*/}
          {/*{getFieldDecorator('dateRange', {*/}
          {/*})(*/}
            {/*<Select placeholder={"请选择数据来源"} style={{ width: 200 }}>*/}
              {/*{warehouseStatus.map((item,index)=>{*/}
                {/*return (<Option key={index} value={item.id}>{item.name}</Option>)*/}
              {/*})}*/}
            {/*</Select>*/}
          {/*)}*/}
        {/*</Form.Item>*/}
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

  // 修改数据
  handleEdit = (row) => {

  };

  renderLeftButton = () => (
    <>

    </>
  );

  renderRightButton = () => (
    <>

    </>
  );

  render() {
    const {
      form,
    } = this.props;
    const {data,loading} = this.state;
    const columns = [
      {
        title: 'SN',
        dataIndex: 'sn',
        width: 150,
      },
      {
        title: '批次单据号',
        dataIndex: 'batchOrderNo',
        width: 200,
      },
      {
        title: '所属仓库',
        dataIndex: 'warehouseId',
        width: 100,
      },
      {
        title: '产品名称',
        dataIndex: 'mobile',
        width: 100,
      },
      {
        title: '库存年龄',
        dataIndex: 'stockAge',
        width: 100,
      },
      {
        title: 'SN状态',
        dataIndex: 'snStauts',
        width: 100,
        render: (res) => {
          let status=''
          if(res === 0){
            status="在库"
          }
          if(res === 1){
            status="占用"
          }
          if(res === 2){
            status="出库"
          }
          return(
            status
          )
        },
      },
      {
        title: '是否代理',
        dataIndex: 'isAgent',
        width: 100,
        render: (res) => {
          let status=''
          if(res === 0){
            status="否"
          }
          if(res === 1){
            status="是"
          }
          return(
            status
          )
        },
      },
      {
        title: '数据来源',
        dataIndex: 'dataSource',
        width: 150,
        ellipsis: true,
      },
      {
        title: '冻结状态',
        dataIndex: 'frozenStatus',
        width: 100,
        ellipsis: true,
        render: (res) => {
          let status=''
          if(res === 0){
            status="否"
          }
          if(res === 1){
            status="是"
          }
          return(
            status
          )
        },
      },
      {
        title: '制单人',
        dataIndex: 'updateBy',
        width: 200,
        ellipsis: true,
      },
      {
        title: '创建时间 ',
        dataIndex: 'createTime',
        width: 200,
        ellipsis: true,
      },
      {
        title: '更新时间 ',
        dataIndex: 'updateTime',
        width: 200,
        ellipsis: true,
      },
      // {
      //   title: '操作',
      //   key: 'operation',
      //   fixed: 'right',
      //   width: 200,
      //   render: (res,row) => {
      //     return(
      //       <div>
      //         <Divider type="vertical" />
      //         <a>日志</a>
      //         <Divider type="vertical" />
      //         <a>详情</a>
      //       </div>
      //     )
      //   },
      // },
    ];
    return (
      <Panel>
        <Grid
          form={form}
          onSearch={this.handleSearch}
          renderSearchForm={this.renderSearchForm}
          data={data}
          loading={loading}
          columns={columns}
          scroll={{ x: 1000 }}
          renderLeftButton={this.renderLeftButton}
          renderRightButton={this.renderRightButton}
        />
      </Panel>
    );
  }
}
export default SnManagementList;
