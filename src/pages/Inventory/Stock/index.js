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
class StockList extends PureComponent {
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
      warehouseVisible:false
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
        <Form.Item label="制单人">
          {getFieldDecorator('complaintsType', {
          })(
            <Select placeholder={"请选择制单人"} style={{ width: 200 }}>
              {warehouseStatus.map((item,index)=>{
                return (<Option key={index} value={item.id}>{item.name}</Option>)
              })}
            </Select>
          )}
        </Form.Item>
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
        <Form.Item label="单据来源">
          {getFieldDecorator('complaintsType', {
          })(
            <Select placeholder={"请选择单据来源"} style={{ width: 200 }}>
              {warehouseStatus.map((item,index)=>{
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

  // ============ 新增弹框 ===============
  handleClick = () => {
    this.setState({
      warehouseVisible:true
    })
  };

  handleCancelWarehouse = () => {
    this.setState({
      warehouseVisible:false
    })
  };

  // 修改数据
  handleEdit = (row) => {

  };

  renderLeftButton = () => (
    <>
      <Button type="primary" icon='plus' onClick={()=>{this.handleClick()}}>设置库存初始化</Button>
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
    const {data,loading,warehouseVisible} = this.state;
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
        dataIndex: 'company',
        width: 200,
        ellipsis: true,
      },
      {
        title: '数量',
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
        title: '制单时间 ',
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

        <Modal
          title="新建仓库"
          visible={warehouseVisible}
          maskClosable={false}
          destroyOnClose
          width={600}
          onCancel={this.handleCancelWarehouse}
          footer={[
            <Button key="back" onClick={this.handleCancelWarehouse}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={()=>this.addDeliveryTime()}>
              确定
            </Button>,
          ]}
        >
          <Form>
            <FormItem {...formAllItemLayout} label="仓库名称">
              {getFieldDecorator('deliveryTime', {
                rules: [
                  {
                    required: true,
                    message: '请输入仓库名称',
                  },
                ],
              })(
                <Input placeholder="请输入仓库名称" />
              )}
            </FormItem>
            <FormItem {...formAllItemLayout} label="仓库位置">
              {getFieldDecorator('deliveryTime', {
                rules: [
                  {
                    required: true,
                    message: '请输入仓库位置',
                  },
                ],
              })(
                <Input placeholder="请输入仓库位置" />
              )}
            </FormItem>
            <FormItem {...formAllItemLayout} label="状态">
              {getFieldDecorator('deliveryTime')(
                <Radio.Group onChange={this.onChangeRadio}>
                  <Radio value={1}>启用</Radio>
                  <Radio value={2}> 禁用</Radio>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem {...formAllItemLayout} label="备注">
              {getFieldDecorator('deliveryTime')(
                <TextArea
                  rows={3}
                  onChange={this.TextAreaChange}
                  placeholder='请输入描述信息'
                />
              )}
            </FormItem>
          </Form>
        </Modal>
      </Panel>
    );
  }
}
export default StockList;
