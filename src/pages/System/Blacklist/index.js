import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Divider,
  Modal,
  message, Checkbox,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';

import { getRemove, getSuthorizationStatus,getUrl } from '../../../services/newServices/logistics';
import { getList,save} from '../../../services/newServices/blacklist';
import moment from 'moment';


const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class Blacklist extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data:{},
      loading:false,
      params:{
        size:10,
        current:1
      },
      beginTime:'',
      dataType:[
        {name:"IP黑名单",key:1},
        {name:"手机黑名单",key:2},
        {name:"地址黑名单",key:3},
        {name:"其它黑名单",key:4},
      ],
      shieldingChannel:[
        {name:"订单",key:1},
        {name:"导入",key:2},
        {name:"平台",key:3},
      ],
      checkedList:[],
      inputValue:'',
      shieldingReason:'',
      updateAddVisible:false
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
  }

  // ============ 查询 ===============
  handleSearch = params => {

  };

  // ============ 查询表单 ===============

  renderSearchForm = onReset => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const {dataType,shieldingChannel}=this.state;

    return (
      <div className={"default_search_form"}>
        <Form.Item label="黑名单值">
          {getFieldDecorator('blacklistValue',{
          })(<Input placeholder="请输入黑名单值" />)}
        </Form.Item>
        <Form.Item label="下单时间">
          {getFieldDecorator('dateRange', {
          })(
            <RangePicker showTime size={"default"} onCalendarChange={this.DateOnChange} />
          )}
        </Form.Item>
        <Form.Item label="类型">
          {getFieldDecorator('orderSource', {
          })(
            <Select placeholder={"请选择类型"} style={{ width: 120 }}>
              {dataType.map(item=>{
                return (<Option value={item.key}>{item.name}</Option>)
              })}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="来源">
          {getFieldDecorator('shieldingChannel', {
          })(
            <Select placeholder={"请选择来源"} style={{ width: 120 }}>
              {shieldingChannel.map(item=>{
                return (<Option value={item.name}>{item.name}</Option>)
              })}
            </Select>
          )}
        </Form.Item>
        <div style={{ float: 'right' }}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={onReset}>
            重置
          </Button>
        </div>
      </div>
    );
  };


  DateOnChange = (dates) => {
    this.setState({
      beginTime:moment(dates[0]).format('YYYY-MM-DD HH:mm:ss')
    })
  }

  // 修改数据
  handleEdit = (row) => {

  };


  renderLeftButton = () => (
    <>
      <Button type="primary" onClick={()=>this.handleAdd()}>新增</Button>
      <Button type="primary" onClick={()=>{router.push(`/logistics/authority/add`);}}>导入</Button>
      <Button onClick={()=>{router.push(`/logistics/authority/add`);}}>导出</Button>
    </>
  );

  renderRightButton = () => (
    <>

    </>
  );

  handleSubmit =()=>{
    const {checkedList,inputValue,shieldingReason}=this.state;

    if(!checkedList){
      return message.error("请选择拉黑类型");
    }
    const param={}
    const list=[];
    for (let i in checkedList){
      const params={}
      params.blacklistValue=inputValue
      params.shieldingReason=shieldingReason
      params.dataType=checkedList[i]
      list.push(params)
    }
    param.blacklists=list;
    param.orderId=null;
    param.platformMark=0;
    param.shieldingChannel=2;

    const _this=this;
    save(param).then(res=>{
      if(res.code === 200){
        message.success(res.msg)
        _this.getDataList()
        _this.setState({
          updateAddVisible:false
        })
      }else {
        message.error(res.msg)
      }
    })

  }

  handleCancelAdd =()=>{
    this.setState({
      updateAddVisible:false
    })
  }

  handleAdd =()=>{
    this.setState({
      updateAddVisible:true
    })
  }

  onChange = (e) => {
    this.setState({
      inputValue: e.target.value
    })
  }

  onChange1 = (e) => {
    this.setState({
      shieldingReason: e.target.value
    })
  }

  onChangeChecked = checkedList => {
    this.setState({
      checkedList: checkedList
    })
  }

  render() {
    const {
      form,
    } = this.props;

    const {data,loading,updateAddVisible} = this.state;
    const { getFieldDecorator } = form;

    const formAllItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };

    const columns = [
      {
        title: '黑名单值',
        dataIndex: 'blacklistValue',
        width: 200,
        ellipsis: true,
      },
      {
        title: '类型',
        dataIndex: 'dataType',
        width: 200,
        ellipsis: true,
        // render: (res,key) => {
        //   return(
        //     <Switch checked={res===1?true:false} onChange={() => this.onStatus(res,key)} />
        //   )
        // },
      },
      {
        title: '来源',
        dataIndex: 'shieldingChannel',
        width: 200,
      },
      {
        title: '拉黑原因',
        dataIndex: 'shieldingReason',
        width: 250,
        ellipsis: true,
      },
      {
        title: '拉黑时间',
        dataIndex: 'createTime',
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
              <a onClick={()=>this.handleEdit(row)}>解除</a>
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
          title="新增"
          visible={updateAddVisible}
          maskClosable={false}
          destroyOnClose
          width={600}
          onCancel={this.handleCancelAdd}
          footer={[
            <Button key="back" onClick={this.handleCancelAdd}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={()=>this.handleSubmit()}>
              确定
            </Button>,
          ]}
        >
          <Form>
            <FormItem {...formAllItemLayout} label="黑名单值">
              <Input onChange={this.onChange} placeholder="请输入黑名单值" />
            </FormItem>
            <FormItem {...formAllItemLayout} label="拉黑原因">
              <Input onChange={this.onChange1} placeholder="请输入拉黑原因" />
            </FormItem>
            <FormItem {...formAllItemLayout} label="拉黑类型">
              <Checkbox.Group onChange={this.onChangeChecked}>
                <Checkbox value={1}>IP黑名单</Checkbox>
                <Checkbox value={2}>手机黑名单</Checkbox>
                <Checkbox value={3}>地址黑名单</Checkbox>
                <Checkbox value={4}>其它黑名单</Checkbox>
              </Checkbox.Group>
            </FormItem>
          </Form>
        </Modal>
      </Panel>
    );
  }
}
export default Blacklist;
