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
  Radio,
  Switch,
  Modal,
  message,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';
import {
  getDeliveryList,
  getDeliveryRemove,
  getDeliveryStatus,
} from '../../../services/newServices/logistics';
import { ORDERSTATUS, TYPESTATUS } from '../../WorkOrder/WorkOrderList/data';
import Add from './add';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class StockList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data:[],
      loading:false,
      stockVisible:false,
      params:{
        size:10,
        current:1
      },
      warehouseStatus:[
        {
          id:1,
          name:'在线'
        },{
          id:2,
          name:'不在线'
        }
      ]
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
    getDeliveryList(params).then(res=>{
      this.setState({
        loading:false
      })
      const data = res.data.records;
      // JSON.parse(row.addr_coding)
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
        <Form.Item label="单据号">
          {getFieldDecorator('platformReplyStatus', {
          })(
            <Input placeholder="请输入单据号" />
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
        {/*<Form.Item label="制单人">*/}
          {/*{getFieldDecorator('complaintsType', {*/}
          {/*})(*/}
            {/*<Select placeholder={"请选择制单人"} style={{ width: 200 }}>*/}
              {/*{warehouseStatus.map((item,index)=>{*/}
                {/*return (<Option key={index} value={item.id}>{item.name}</Option>)*/}
              {/*})}*/}
            {/*</Select>*/}
          {/*)}*/}
        {/*</Form.Item>*/}
        <Form.Item label="产品">
          {getFieldDecorator('complaintsType', {
          })(
            <Select placeholder={"请选择产品"} style={{ width: 200 }}>
              {warehouseStatus.map((item,index)=>{
                return (<Option key={index} value={item.id}>{item.name}</Option>)
              })}
            </Select>
          )}
        </Form.Item>
        {/*<Form.Item label="单据来源">*/}
          {/*{getFieldDecorator('complaintsType', {*/}
          {/*})(*/}
            {/*<Select placeholder={"请选择单据来源"} style={{ width: 200 }}>*/}
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

  handleStockVisible = () => {
    this.setState({
      stockVisible:true
    })
  };

  handleStockVisibleCancel = () => {
    this.setState({
      stockVisible:false
    })
  };

  renderLeftButton = () => (
    <>
      <Button type="primary" icon='plus' onClick={this.handleStockVisible}>设置库存初始化</Button>
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

    const { getFieldDecorator } = form;

    const formAllItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };
    const {data,loading,stockVisible} = this.state;
    const columns = [
      {
        title: '单据号',
        dataIndex: 'name',
        width: 250,
      },
      {
        title: '单据来源',
        dataIndex: 'mobile',
        width: 200,
      },
      {
        title: '所属仓库',
        dataIndex: 'administrativeAreas',
        width: 150,
        render: (res,key) => {
          let Areas =res + key.printAddr;
          return(
            Areas
          )
        },
        ellipsis: true,
      },
      {
        title: '产品名称',
        dataIndex: 'name',
        width: 200,
        ellipsis: true,
      },
      {
        title: '数量',
        dataIndex: 'nul',
        width: 200,
        ellipsis: true,
      },
      {
        title: '制单人',
        dataIndex: '123',
        width: 200,
        ellipsis: true,
      },
      {
        title: '制单时间 ',
        dataIndex: 'time',
        width: 200,
        ellipsis: true,
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
              <a>日志</a>
              <Divider type="vertical" />
              <a>详情</a>
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
          loading={loading}
          columns={columns}
          scroll={{ x: 1000 }}
          renderLeftButton={this.renderLeftButton}
          renderRightButton={this.renderRightButton}
        />
        {/* 耗时检测弹框 */}
        {stockVisible?(
          <Add
            stockVisible={stockVisible}
            handleStockVisibleCancel={this.handleStockVisibleCancel}
          />
        ):""}
      </Panel>

    );
  }
}
export default StockList;
