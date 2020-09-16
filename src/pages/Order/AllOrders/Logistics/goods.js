import React, { PureComponent  } from 'react';
import { connect } from 'dva';
import {
  Button,
  Form,
  Table,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import { getGoodsList } from '../../../../services/newServices/logistics';

@connect(({ globalParameters }) => ({
  globalParameters,
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
      selectedRowKey:['21']
    };
  }
  // ============ 初始化数据 ===============

  componentWillMount() {
    const { LogisticsConfigList } = this.props;
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


  render() {
    const {
      form,
    } = this.props;

    const {data,selectedRowKey,loading} = this.state;


    const columns = [
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
    const rowSelection = {
      type: "radio",
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys);
      },
      getCheckboxProps: (record) => ({
        defaultChecked:selectedRowKey.includes(`${record.id}`)
      }),
    };
    return (
      <div>
        <Table rowSelection={rowSelection} loading={loading} rowKey={(record, index) => `${index}`} dataSource={data.list} columns={columns} />
      </div>

    );
  }
}
export default Goods;
