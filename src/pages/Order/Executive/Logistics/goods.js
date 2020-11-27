import React, { PureComponent  } from 'react';
import { connect } from 'dva';
import {
  Button,
  Form, Radio,
  Table,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import { getGoodsList } from '../../../../services/newServices/logistics';

@connect(({ logisticsParameters }) => ({
  logisticsParameters,
}))
@Form.create()
class Goods extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data:{},
      loading:false,
      params:{
        size:10,
        current:1
      },
      goodsId:''
    };
  }
  // ============ 初始化数据 ===============

  componentWillMount() {
    const { LogisticsConfigList } = this.props;
    this.setState({
      goodsId:LogisticsConfigList.id,
    })
    this.getDataList()
  }

  getDataList = () => {
    const {params} = this.state;
    this.setState({
      loading:true
    })
    getGoodsList(params).then(res=>{
      this.setState({
        loading:false
      })
      const data = res.data.records;
      // JSON.parse(row.addr_coding)
      this.setState({
        data:{
          list:data,
          pagination:{
            current: res.data.current,
            pageSize: res.data.size,
            total: res.data.total
          }
        }
      })
    })
  }

  onChange = (rows) => {
    this.setState({
      goodsId: rows.id,
    });
    const { dispatch } = this.props;
    dispatch({
      type: `logisticsParameters/setListId`,
      payload: rows,
    });
  };

  render() {
    const {
      form,
    } = this.props;

    const {data,goodsId,loading} = this.state;


    const columns = [
      {
        title: '',
        dataIndex: 'id',
        width: 200,
        render: (res,rows) => {
          return(
            <Radio checked={res===goodsId?true:false} onChange={() =>this.onChange(rows)} value={res}></Radio>
          )
        },
      },
      {
        title: '物品名称',
        dataIndex: 'cargo',
        width: 200,
      },
      {
        title: '物品总数量',
        dataIndex: 'count',
        width: 300,
      },
      {
        title: '物品总重量',
        dataIndex: 'weight',
        width: 200,
      },
      {
        title: '物品总体积',
        dataIndex: 'volumn',
        width: 150,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 150,
      },
    ];
    return (
      <div>
        <Table loading={loading} rowKey={(record, index) => `${index}`} dataSource={data.list} columns={columns} />
      </div>

    );
  }
}
export default Goods;
