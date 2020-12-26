import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Form, Tabs, message, Input, Col, Button, Radio, DatePicker } from 'antd';
import moment from 'moment';
import {logisticsPrintList } from '../../../../services/newServices/recharge';
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

class Printing extends PureComponent {
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
    this.getLogisticsPrintList(params)
  }

  getLogisticsPrintList= (params) => {
    this.setState({
      loading:true
    })
    logisticsPrintList(params).then(resp => {
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
      this.getLogisticsPrintList(values)
    })
  };

  render() {
    const code = 'Printing';
    const {
      form,
    } = this.props;
    const { getFieldDecorator } = form;

    const {data,loading,pagination} = this.state;

    const columns = [
      {
        title: '手机号',
        dataIndex: 'userPhone',
        width: 150,
        ellipsis: true,
      },
      {
        title: '订单号',
        dataIndex: 'outOrderNo',
        width: 200,
        ellipsis: true,
      },
      {
        title: '类型',
        dataIndex: 'type',
        width: 150,
      },
      {
        title: '消费时间',
        dataIndex: 'createTime',
        width: 200,
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
export default Printing;
