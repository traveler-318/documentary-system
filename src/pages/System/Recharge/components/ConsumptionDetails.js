import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Form, Tabs, message, Input, Col, Button, Radio, DatePicker } from 'antd';
import moment from 'moment';
import {statisticsformtaskList } from '../../../../services/newServices/recharge';
import { formatMessage, FormattedMessage } from 'umi/locale';
import styles from '../index.less';
import { getCookie } from '../../../../utils/support';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
@connect(({ post, loading }) => ({
  post,
  loading: loading.models.post,
}))
@Form.create()

class ConsumptionDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      params:{
        size:10,
        current:1,
        formType:1
      },
      data:{},
      pagination:{},
      value:1
    }
  }

  componentWillMount() {
    const {params}=this.state;
    this.getStatisticsformtaskList(params)
  }

  getStatisticsformtaskList= (params) => {
    this.setState({
      loading:true
    })
    statisticsformtaskList(params).then(resp => {
      this.setState({
        data:{
          list:resp.data.records
        },
        pagination:{
          current: resp.data.current,
          pageSize: resp.data.size,
          total: resp.data.total
        },
        loading: false
      })

    });
  }


  // ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const { form } = this.props;
    const {value}=this.state;
    form.validateFieldsAndScroll((err, values) => {
      values.deptId = getCookie("dept_id");
      values.formType = value;
      values.current = 1;
      values.size = 10;
      this.getStatisticsformtaskList(values)
    })
  };

  handleTableChange = (pagination) => {
    const pager = { ...this.state.pagination };
    const {value}=this.state;
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    const {params}=this.state;
    params.current=pagination.current;
    params.formType = value;
    this.getStatisticsformtaskList(params)
  };

  RadioChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    const code = 'ConsumptionDetails';
    const {
      form,
    } = this.props;
    const { getFieldDecorator } = form;

    const {loading,pagination,data,value} = this.state;

    const columns = [
      {
        title: '统计日期',
        dataIndex: 'statisticsTime',
        width: 120,
        ellipsis: true,
      },
      {
        title: '短信发送总量',
        children:[
          {
            title:'首页短信领取',
            dataIndex: 'homePageSms',
            width: 120,
          },{
            title:'跟单宝系统注册',
            dataIndex: 'gdSysRegister',
            width: 130,
          },{
            title:'系统导出数据',
            dataIndex: 'sysExport',
            width: 120,
          },{
            title:'免费通道下单',
            dataIndex: 'freeChannelOrderSuccess',
            width: 120,
          },{
            title:'免押宝数据同步',
            dataIndex: 'mianyaSysDataSync',
            width: 130,
          },{
            title:'余额不足提醒',
            dataIndex: 'remainingMoneyNotOfTask',
            width: 130,
          },{
            title:'物流通知',
            dataIndex: 'logisticsNotice',
            width: 120,
          },{
            title:'逾期提醒',
            dataIndex: 'lateRemind',
            width: 120,
          },{
            title:'逾期定时提醒',
            dataIndex: 'lateRemindOfTask',
            width: 120,
          },{
            title:'签收发送',
            dataIndex: 'signAutoSend',
            width: 120,
          },
        ]
      },
      {
        title: '语音总量',
        dataIndex: 'voiceSum',
        width: 100,
        ellipsis: true,
      },
      {
        title: '物流',
        children:[
          {
            title:'物流订阅',
            dataIndex: 'subscriptSum',
            width: 120,
          },{
            title:'打印面单',
            dataIndex: 'printSum',
            width: 120,
          },
        ]
      },
      {
        title: '消费金额(元)',
        dataIndex: 'totalPrice',
        width: 130,
        ellipsis: true,
      },

    ];

    return (
      <div style={{margin:"20px"}} className={styles.sms}>
        <div className={"default_search_form"}>
          <Form.Item label="时间">
            <Radio.Group onChange={this.RadioChange} value={value}>
              <Radio value={0}>按日</Radio>
              <Radio value={1}>按月</Radio>
            </Radio.Group>
          </Form.Item>
          <Button type="primary" onClick={()=>this.renderSearchForm()}>
            <FormattedMessage id="button.search.name" />
          </Button>
        </div>
        <Table columns={columns} loading={loading} dataSource={data.list} pagination={pagination} onChange={this.handleTableChange} scroll={{ x: 1600}} />
      </div>

    );

  }
}
export default ConsumptionDetails;
