import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Form, Tabs, message, Input, Col, Button, Radio  } from 'antd';
import moment from 'moment';
import {voiceList } from '../../../../services/newServices/recharge';
import { formatMessage, FormattedMessage } from 'umi/locale';
import styles from '../index.less';
import { getCookie } from '../../../../utils/support';

const FormItem = Form.Item;
const { TabPane } = Tabs;

@connect(({ post, loading }) => ({
  post,
  loading: loading.models.post,
}))
@Form.create()

class SMS extends PureComponent {
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
    this.getVoiceList(params)
  }

  getVoiceList= (params) => {
    this.setState({
      loading:true
    })
    voiceList(params).then(resp => {
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
      this.getVoiceList(values)
    })
  };


  getStatusCode = (key) => {
    let text = ""
    if(key === 200000 || key === '200000'){ text = "成功" }
    if(key === 200002 || key === '200002'){ text = "用户占线" }
    if(key === 200005 || key === '200005'){ text = "用户无法接通(拒绝)" }
    if(key === 200003 || key === '200003'){ text = "无答应" }
    if(key === 200010 || key === '200010'){ text = "关机" }
    if(key === 200011 || key === '200011'){ text = "停机" }
    if(key === 200007 || key === '200007'){ text = "用户无法接通(不在服务区)" }
    if(key === 200004 || key === '200004'){ text = "空号" }
    if(key === 200012 || key === '200012'){ text = "呼损" }
    if(key === 200130 || key === '200130'){ text = "其他(无法识别)" }
    return text;
  }

  getTollType = (key) => {
    let text = ""
    if(key === 'LOCAL'){ text = "市话" }
    if(key === 'PROVINCE'){ text = "省内长途" }
    if(key === 'DOMESTIC'){ text = "国内长途" }
    if(key === 'INTERNATIONAL'){ text = "国际长途" }
    return text;
  }




  render() {
    const code = 'SMS';
    const {
      form,
    } = this.props;
    const { getFieldDecorator } = form;

    const {data,loading,pagination} = this.state;

    const columns = [
      {
        title: '被叫手机号',
        dataIndex: 'callee',
        width: 120,
        ellipsis: true,
      },
      {
        title: '订单号',
        dataIndex: 'outOrderNo',
        width: 180,
        ellipsis: true,
      },
      {
        title: '通话类型',
        dataIndex: 'tollType',
        width: 150,
        render: (key)=>{
        return (
          <div>{this.getTollType(key)} </div>
        )
    }
      },
      {
        title: '呼叫状态',
        dataIndex: 'statusCode',
        width: 160,
        ellipsis: true,
        render: (key)=>{
          return (
            <div>{this.getStatusCode(key)} </div>
          )
        }
      },
      {
        title: '通话时长（秒）',
        dataIndex: 'duration',
        width: 100,
        ellipsis: true,
      },
      {
        title: '开始通话时间',
        dataIndex: 'startTime',
        width: 160,
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
        <Table columns={columns} loading={loading} dataSource={data.list} pagination={pagination} scroll={{ x: 1300 }} />
      </div>

    );

  }
}
export default SMS;
