import {
  Form,
  Table,
} from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class Transaction extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      transactionRecords:[]
    };
  }

  // 页面构建
  componentWillMount() {
    let d = this.props.detail.transactionRecords;
    let list = [];
    if(d && JSON.parse(d).list){
      list = JSON.parse(d).list
    }

    console.log(list)
    this.setState({
      transactionRecords:list
    })

  }


  // getTreeList = () => {
  //   productTreelist().then(res=>{
  //     this.setState({productList:res.data})
  //   })
  // }

  render() {

    const { transactionRecords } = this.state;
    const columns = [
      {
        title: 'SN',
        dataIndex: 'productCoding',
        key: 'productCoding',
      },
      {
        title: '商户号',
        dataIndex: 'merchants',
        key: 'merchants',
      },
      {
        title: '商户名称',
        dataIndex: 'merchantName',
        key: 'merchantName',
      },
      {
        title: '交易金额',
        dataIndex: 'amount',
        key: 'amount',
      },
      {
        title: '交易时间',
        dataIndex: 'tradingHour',
        key: 'tradingHour',
      }
    ];

    const data = [
      {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
      },
      {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
      },
      {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
      },
    ];

    return (
      <Table columns={columns} dataSource={transactionRecords} pagination={false}/>
    );
  }
}

export default Transaction;
