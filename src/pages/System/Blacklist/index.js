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
  Radio,
  message, Checkbox, Tag,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';
import { getList,save,remove} from '../../../services/newServices/blacklist';
import moment from 'moment';

const { TextArea } = Input;
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
        {name:"订单",key:0},
        {name:"导入",key:1},
        {name:"平台",key:2},
      ],
      checkedList:'',
      checkedList1:'',
      inputValue:'',
      shieldingReason:'',
      updateAddVisible:false,
      updateImportVisible:false,
      textAreaValue:'',
      tips:''
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
    let payload = {
      ...params,
    };

    if(payload.blacklistValue === undefined){
      payload.blacklistValue = null;
    }
    // if(payload.dateRange === undefined){
    //   payload.dateRange = null;
    // }
    if(payload.orderSource === undefined){
      payload.orderSource = null;
    }
    if(payload.shieldingChannel === undefined){
      payload.shieldingChannel = null;
    }
    delete payload.sorts
    this.setState({
      params:payload
    },()=>{
      this.getDataList();
    })
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
        {/*<Form.Item label="拉黑时间">*/}
          {/*{getFieldDecorator('dateRange', {*/}
          {/*})(*/}
            {/*<RangePicker showTime size={"default"} onCalendarChange={this.DateOnChange} />*/}
          {/*)}*/}
        {/*</Form.Item>*/}
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
                return (<Option value={item.key}>{item.name}</Option>)
              })}
            </Select>
          )}
        </Form.Item>
        <div style={{ float: 'right' }}>
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
      <Button onClick={()=>this.handleImport()}>导入</Button>
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
    const params={}
    params.blacklistValue=inputValue
    params.shieldingReason=shieldingReason
    params.dataType=checkedList
    list.push(params)
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

  handleCancelImport =()=>{
    this.setState({
      updateImportVisible:false
    })
  }

  handleImport =()=>{
    this.setState({
      updateImportVisible:true
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

  onTextArea = (e) => {
    this.setState({
      textAreaValue: e.target.value
    })
  }

  handleImportSubmit = () => {
    const {textAreaValue,checkedList1}=this.state;
    if(!textAreaValue){
      return message.error("请填写拉黑内容")
    }
    if(!checkedList1){
      return message.error("请选择拉黑类型")
    }

    let arr=[]
    arr=textAreaValue.split(/[(\r\n)\r\n]+/);

    let length=''
    if(checkedList1 === 2){
      for(let i=0; i<arr.length; i++){
        if (!(/^1[3456789]\d{9}$/.test(arr[i]))) {
          console.log(i)
          length+=i+1+","
        }
      }
    }
    if(checkedList1 === 1){
      let ip=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
      for(let i=0; i<arr.length; i++){
        if (!ip.test(arr[i])) {
          console.log(i)
          length+=i+1+","
        }
      }
    }
    let a=''
    if(length){
      a="请检查"+length.substring(0,length.length-1)+"行，存在错误";
    }else {
      a=''
    }
    this.setState({
      tips:a
    })

    if(a !== ''){
      return false;
    }

    const params={};
    const item=[]
    for (let i in arr){
      const param={}
      param.blacklistValue=arr[i];
      param.dataType=checkedList1
      item.push(param)
    }
    params.blacklists=item;
    params.orderId=null;
    params.platformMark=0;
    params.shieldingChannel=1

    const _this=this;
    save(params).then(res=>{
      if(res.code === 200){
        message.success(res.msg)
        _this.getDataList()
        _this.setState({
          updateImportVisible:false
        })
      }else {
        message.error(res.msg)
      }
    })

  }



  onChangeChecked = (e) => {
    this.setState({
      checkedList: e.target.value
    })
  }

  onChangeChecked1 = (e) => {
    this.setState({
      checkedList1: e.target.value
    })
  }

  // 来源渠道
  getTYPE = (key) => {
    let text = ""
    if(key === 0 || key === '0'){
      text = "订单"
    }
    if(key === 1 || key === '1'){
      text = "导入"
    }
    if(key === 2 || key === '2'){
      text = "平台"
    }
    return text;
  }

  // 类型
  dataType = (key) => {
    let text = ""
    if(key === 1 || key === '1'){
      text = "IP"
    }
    if(key === 2 || key === '2'){
      text = "手机"
    }
    if(key === 3 || key === '3'){
      text = "地址"
    }
    if(key === 4 || key === '4'){
      text = "其它"
    }
    return text;
  }

  handleRemove=(row)=>{

    const _this=this;
    Modal.confirm({
      title: '提醒',
      content: "此次操作无法再次变更,确认操作!",
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      keyboard:false,
      onOk:() => {
        remove(row.id).then(res=>{
          if (res.code === 200){
            message.success(res.msg)
            _this.getDataList()
          } else {
            message.error(res.msg)
          }
        })
      },
      onCancel(){},
    });
  }

  render() {
    const {
      form,
    } = this.props;

    const {data,loading,updateAddVisible,updateImportVisible,tips} = this.state;
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
        width: 150,
        ellipsis: true,
        render: (key) => {
          let version='';
          let color='';
          if(key === 1 || key === '1'){
            version = "IP"
            color='geekblue'
          }
          if(key === 2 || key === '2'){
            version = "手机"
            color="gold"
          }
          if(key === 3 || key === '3'){
            version = "地址"
            color="green"
          }
          if(key === 4 || key === '4'){
            version = "其他"
            color='yellow'
          }

          return(
            <Tag color={color}>
              {version}
            </Tag>
          )
        },
      },
      {
        title: '来源',
        dataIndex: 'shieldingChannel',
        width: 100,
        render: (key) => {
          return (
            <div>{this.getTYPE(key)} </div>
          )
        },
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
              <a onClick={()=>this.handleRemove(row)}>解除</a>
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
            <FormItem {...formAllItemLayout} label="拉黑类型">
              <Radio.Group onChange={this.onChangeChecked}>
                <Radio value={1}>IP黑名单</Radio>
                <Radio value={2}>手机黑名单</Radio>
                <Radio value={3}>地址黑名单</Radio>
                <Radio value={4}>其它黑名单</Radio>
              </Radio.Group>
            </FormItem>
            <FormItem {...formAllItemLayout} label="黑名单值">
              <Input onChange={this.onChange} placeholder="请输入黑名单值" />
            </FormItem>
            <FormItem {...formAllItemLayout} label="拉黑原因">
              <Input onChange={this.onChange1} placeholder="请输入拉黑原因" />
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title="导入"
          visible={updateImportVisible}
          maskClosable={false}
          destroyOnClose
          width={600}
          onCancel={this.handleCancelImport}
          footer={[
            <Button key="back" onClick={this.handleCancelImport}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={()=>this.handleImportSubmit()}>
              确定
            </Button>,
          ]}
        >
          <Form>
            <FormItem {...formAllItemLayout} label="导入内容">
              <TextArea onChange={this.onTextArea} placeholder='每次只能选择一种类型手机号或IP地址，每行一个' rows={4} />
              <p style={{color:"red",marginBottom:'0'}}>{tips}</p>
            </FormItem>
            <FormItem {...formAllItemLayout} label="导入类型">
              <Radio.Group onChange={this.onChangeChecked1}>
                <Radio value={2}>手机号</Radio>
                <Radio value={1}>IP</Radio>
              </Radio.Group>
            </FormItem>
          </Form>
        </Modal>
      </Panel>
    );
  }
}
export default Blacklist;
