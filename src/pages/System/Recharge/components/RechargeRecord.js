import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table ,Form,Tabs, message} from 'antd';
import Panel from '../../../../components/Panel';
import { getUserInfo } from '../../../../services/user';
import moment from 'moment';
import Grid from '../../../../components/Sword/Grid';
import { topUpRecordList } from '../../../../services/newServices/recharge';

const FormItem = Form.Item;
const { TabPane } = Tabs;

@connect(({ post, loading }) => ({
  post,
  loading: loading.models.post,
}))
@Form.create()

class RechargeRecord extends PureComponent {
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
    this.topUpRecordList(params)
  }

  topUpRecordList= (params) => {
    this.setState({
      loading:true
    })
    topUpRecordList(params).then(resp => {
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

  };

  render() {
    const code = 'RechargeRecord';
    const {
      form,
    } = this.props;

    const {data,loading,pagination} = this.state;

    const columns = [
      {
        title: '充值时间',
        dataIndex: 'payTime',
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
        title: '充值金额',
        dataIndex: 'paymentAmount',
        width: 150,
        ellipsis: true,
      },
      {
        title: '充值方式',
        dataIndex: 'payWay',
        width: 150,
      },
      {
        title: '支付帐号',
        dataIndex: 'payAccount',
        width: 200,
        ellipsis: true,
      },
      // {
      //   title: '充值用户',
      //   dataIndex: 'payAccount',
      //   width: 200,
      //   ellipsis: true,
      // },
    ];

    return (
      <Table columns={columns} dataSource={data.list} pagination={pagination} />
    );

  }
}
export default RechargeRecord;
