import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Form, Tabs, message, Input, Col, Button, Radio, DatePicker } from 'antd';
import moment from 'moment';
import {smsList } from '../../../../services/newServices/recharge';
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
        current:1
      },
      data:{}
    }
  }

  componentWillMount() {
    const {params}=this.state;
    this.getSmsList(params)
  }

  getSmsList= (params) => {
    this.setState({
      loading:true
    })
    smsList(params).then(resp => {
      console.log(resp)
      this.setState({
        data:{
          list:resp.data.records,
          pagination:{
            current: resp.data.current,
            pageSize: resp.data.size,
            total: resp.data.total
          }
        },
        loading: false
      })
    });
  }


  // ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      console.log(values)
      values.deptId = getCookie("dept_id");
      this.getSmsList(values)
    })
  };

  render() {
    const code = 'ConsumptionDetails';
    const {
      form,
    } = this.props;
    const { getFieldDecorator } = form;

    const {data,loading,pagination} = this.state;

    const columns = [
      {
        title: '统计日期',
        dataIndex: 'userPhone',
        width: 150,
        ellipsis: true,
      },
      {
        title: '短信发送总量',
        children:[
          {
            title:'验证码',
            dataIndex: 'smsCategory',
            width: 100,
          },{
            title:'下单提醒',
            dataIndex: 'smsCategory',
            width: 100,
          },{
            title:'发货提醒',
            dataIndex: 'smsCategory',
            width: 100,
          },{
            title:'签收提醒',
            dataIndex: 'smsCategory',
            width: 100,
          },{
            title:'激活提醒',
            dataIndex: 'smsCategory',
            width: 100,
          },
        ]
      },
      {
        title: '语音总量',
        dataIndex: 'outOrderNo',
        width: 200,
        ellipsis: true,
      },
      {
        title: '物流',
        children:[
          {
            title:'物流订阅',
            dataIndex: 'sendTime',
            width: 150,
          },{
            title:'打印免单',
            dataIndex: 'sendTime',
            width: 150,
          },
        ]
      },
    ];

    return (
      <div style={{margin:"20px"}} className={styles.sms}>
        <div className={"default_search_form"}>
          <Form.Item label="订单号">
            {getFieldDecorator('outOrderNo',{
            })(<Input placeholder="请输入订单号" />)}
          </Form.Item>
          <Form.Item label="手机号">
            {getFieldDecorator('userPhone',{
            })(<Input placeholder="请输入手机号" />)}
          </Form.Item>
          {/*<Form.Item label="发送时间">*/}
            {/*{getFieldDecorator('sendTime', {*/}
            {/*})(*/}
              {/*<RangePicker showTime size={"default"} />*/}
            {/*)}*/}
          {/*</Form.Item>*/}
          <div style={{ float: 'right' }}>
            <Button type="primary" onClick={()=>{
              this.renderSearchForm()
            }}>
              <FormattedMessage id="button.search.name" />
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={()=>{
              onReset()
            }}>
              <FormattedMessage id="button.reset.name" />
            </Button>
          </div>
        </div>
        <Table columns={columns} loading={loading} dataSource={data.list} pagination={pagination} />
      </div>

    );

  }
}
export default ConsumptionDetails;
