import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table ,Form,Tabs, message} from 'antd';
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

class StatisticalReport extends PureComponent {
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
    const code = 'StatisticalReport';
    const {
      form,
    } = this.props;

    const {data,loading} = this.state;

    const columns = [
      {
        title: '统计日期',
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
      {
        title: '充值时间',
        dataIndex: 'phoneNumber',
        width: 150,
        ellipsis: true,
      },
      {
        title: '充值方式',
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
        title: '充值用户',
        dataIndex: 'smsCategory',
        width: 200,
        ellipsis: true,
      },
    ];

    return (
      <Table columns={columns} dataSource={data} />
    );

  }
}
export default StatisticalReport;
