import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Tag, Badge, Form, Input, Row, Select, DatePicker, Divider, Dropdown, Menu, Icon, Modal, message, Tabs, Radio } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import { Resizable } from 'react-resizable';
import moment from 'moment';
import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';
import func from '../../../utils/Func';
import {
  getList,
} from '../../../services/newServices/timedTasks';
import { setListData } from '../../../utils/publicMethod';
import Edit from './add'


const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { SubMenu } = Menu;

let modal;

let SOURCE = [
  {key:"网站",name:"网站"},
  {key:"广告",name:"广告"},
  {key:"微信",name:"微信"},
  {key:"电话",name:"电话"},
  {key:"渠道代理",name:"渠道代理"},
  {key:"转介绍",name:"转介绍"},
  {key:"其他",name:"其他"},
  {key:null,name:"全部"},
]

let CustomerStatus = [
  {key:"潜在客户",name:"潜在客户"},
  {key:"初步接触",name:"初步接触"},
  {key:"持续跟进",name:"持续跟进"},
  {key:"成交客户",name:"成交客户"},
  {key:"忠诚客户",name:"忠诚客户"},
  {key:"无效客户",name:"无效客户"},
  {key:"其他",name:"其他"},
  {key:null,name:"全部"},
]

@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class SMSrecord extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:[

      ],
      loading:false,
      handleEditVisible:false,
      details:'',
      params:{
        size:10,
        current:1
      }
    }
  }

  // ============ 初始化数据 ===============
  componentWillMount() {
  //  this.getDataList();
  }

  getDataList = () => {
    const {params} = this.state;
    this.setState({
      loading:true
    })
    getList(params).then(res=>{
      console.log(res.data.records)
      this.setState({
        loading:false
      })
      this.setState({
        data:setListData(res.data)
      })
    })
  }

  // 修改弹框
  handleEdit = (row) => {
    this.setState({
      handleEditVisible:true,
      details:row
    })
  }

  handleCancelEdit = (type) => {
    if(type === "getList"){
      this.getDataList();
    }
    this.setState({
      handleEditVisible:false
    })
  }


  // ============ 查询 ===============
  handleSearch = params => {
    const { startTime } = params;
    let payload = {
      ...params,
    };
    if (startTime) {
      payload = {
        ...params,
        startTime: startTime ? func.format(startTime[0], 'YYYY-MM-DD HH:mm:ss') : null,
        endTime: startTime ? func.format(startTime[1], 'YYYY-MM-DD HH:mm:ss') : null,
      };
    }
    if(payload.sourceType === "全部"){
      delete payload.sourceType
    }
    if(payload.intentionType === "全部"){
      delete payload.intentionType
    }
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

    return (
      <div className={"default_search_form"}>
        <Form.Item label="客户姓名">
          {getFieldDecorator('userName')(<Input placeholder="请输入客户姓名" />)}
        </Form.Item>
        <Form.Item label="来源">
          {getFieldDecorator('sourceType')(
          <Select 
          style={{ width: 120 }}
            placeholder={"请选择来源"}
          >
            {SOURCE.map(item=>{
              return (<Option value={item.name}>{item.name}</Option>)
            })}
          </Select>
          )}
        </Form.Item>
        <Form.Item label="意向类型">
          {getFieldDecorator('intentionType')(
          <Select 
          style={{ width: 120 }}
            placeholder={"请选择意向类型"}
          >
            {CustomerStatus.map(item=>{
              return (<Option value={item.name}>{item.name}</Option>)
            })}
          </Select>
          )}
        </Form.Item>

        {/* sourceType */}
        <div style={{ float: 'right' }}>
          <Button type="primary" htmlType="submit">
            <FormattedMessage id="button.search.name" />
          </Button>
        </div>
      </div>
    );
  };

  renderLeftButton = () => (
    <>
      <Button type="primary" icon="plus" onClick={()=>{
        router.push(`/system/timedTasks/add`);
      }}>任务</Button>
    </>
  );
  
 

  render() {
    const code = 'smsrecord';

    const {
      form,
    } = this.props;

    const {data,loading,handleEditVisible,details} = this.state;

    const columns = [
      {
        title: '任务编号',
        dataIndex: 'taskId',
        width: 150,
        ellipsis: true,
      },
      // {
      //   title: '姓名',
      //   dataIndex: 'userPhone',
      //   width: 150,
      //   ellipsis: true,
      // },
      // {
      //   title: '手机号',
      //   dataIndex: 'wechatId',
      //   width: 150,
      //   ellipsis: true,
      // },
      // {
      //   title: '操作人员',
      //   dataIndex: 'sourceType',
      //   width: 200,
      //   ellipsis: true,
      // },
      {
        title: '开始时间',
        dataIndex: 'noticeHours',
        width: 150,
        ellipsis: true,
      },
      {
        title: '执行次数',
        dataIndex: 'repeatNumber',
        width: 150,
        ellipsis: true,
      },
      {
        title: '任务状态',
        dataIndex: 'status',
        // width: 160,
        ellipsis: true,
      },
      
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 70,
        render: (res,row) => {
          return(
            <div>
              <a onClick={()=>this.handleEdit(row)}>修改</a>
              <Divider type="vertical" />
            </div>
          )
        },
      },
    ];

    return (
      <Panel>
        <Grid
          code={code}
          form={form}
          onSearch={this.handleSearch}
          onSelectRow={this.onSelectRow}
          // renderSearchForm={this.renderSearchForm}
          loading={loading}
          data={data}
          columns={columns}
          scroll={{ x: 1000 }}
          renderLeftButton={()=>this.renderLeftButton()}
        />
        {/* 详情 */}
        {handleEditVisible?(
          <Edit
            handleEditVisible={handleEditVisible}
            details={details}
            handleCancelEdit={this.handleCancelEdit}
          />
        ):""}
      </Panel>
    );
  }
}
export default SMSrecord;
