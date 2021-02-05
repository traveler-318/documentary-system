import {
  Table
} from 'antd';
import React, { PureComponent } from 'react';

class Transaction extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // 页面构建
  componentWillMount() {

  }

  // getTreeList = () => {
  //   productTreelist().then(res=>{
  //     this.setState({productList:res.data})
  //   })
  // }

  render() {

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
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
      <Table columns={columns} dataSource={data} pagination={false}/>
    );
  }
}

export default Transaction;
