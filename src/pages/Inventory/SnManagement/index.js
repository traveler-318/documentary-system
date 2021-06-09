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
          id:1,
          name:'在线'
        },{
          id:2,
          name:'不在线'
        }
      ],
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
        dataIndex: 'name',
        width: 150,
      },
      {
        title: '批次单据号',
        dataIndex: 'mobile',
        width: 200,
      },
      {
        title: '所属仓库',
        dataIndex: 'mobile',
        width: 100,
      },
      {
        title: '产品名称',
        dataIndex: 'mobile',
        width: 100,
      },
      {
        title: '库存年龄',
        dataIndex: 'mobile',
        width: 100,
      },
      {
        title: 'SN状态',
        dataIndex: 'mobile',
        width: 100,
      },
      {
        title: '是否代理',
        dataIndex: 'mobile',
        width: 100,
      },
      {
        title: '数据来源',
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
        title: '冻结状态',
        dataIndex: 'company',
        width: 200,
        ellipsis: true,
      },
      {
        title: '制单人',
        dataIndex: 'company',
        width: 200,
        ellipsis: true,
      },
      {
        title: '创建时间 ',
        dataIndex: 'company',
        width: 200,
        ellipsis: true,
      },
      {
        title: '更新时间 ',
        dataIndex: 'company',
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
      </Panel>
    );
  }
}
export default SnManagementList;
