import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Form, Tabs, message, Input } from 'antd';
import Panel from '../../../../components/Panel';
import { getUserInfo } from '../../../../services/user';
import moment from 'moment';
import Grid from '../../../../components/Sword/Grid';

const FormItem = Form.Item;
const { TabPane } = Tabs;

@connect(({ post, loading }) => ({
  post,
  loading: loading.models.post,
}))
@Form.create()

class Voice extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading:false
    }
  }

  componentDidMount() {
    getUserInfo().then(resp => {
      if (resp.code === 200) {
        console.log(resp)
        this.setState({ remainingMoney: resp.data.remainingMoney});
      } else {
        message.error(resp.msg || '获取数据失败');
      }
    });
  }


  // ============ 查询表单 ===============
  renderSearchForm = onReset => {

  };

  render() {
    const code = 'Voice';
    const {
      form,
    } = this.props;

    const {data,loading} = this.state;

    const columns = [
      {
        title: '手机号',
        dataIndex: 'phoneNumber',
        width: 150,
        ellipsis: true,
      },
      {
        title: '通知类型',
        dataIndex: 'orderMarks',
        width: 150,
        render: (res) => {
          return(
            <>
              {res === '0' ?<span style={{color:"red"}}>未完成</span>:<span>已完成</span>}
            </>
          )
        },
      },
      {
        title: '订单号',
        dataIndex: 'smsCategory',
        width: 200,
        ellipsis: true,
      },
      {
        title: '发送时间',
        dataIndex: 'sendTime',
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
      <div>
        <Form.Item label="姓名">
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Table columns={columns} dataSource={data} />
      </div>

    );

  }
}
export default Voice;
