import React, { PureComponent } from 'react';
import { Select } from 'antd';
import { getList as getSalesmanLists } from '../../../../services/newServices/sales';

class SalesSelect extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      disabled:false,
      salesmanList:[]
    };
  }

  componentWillMount() {
    this.setState({
      disabled:this.props.disabled || false
    })
    this.getSalesmanList()
  }

  // 获取业务员数据
  getSalesmanList = () => {
    getSalesmanLists({size:100,current:1}).then(res=>{
      this.setState({
        salesmanList:res.data.records
      })
    })
  }

  render() {
    const {
      disabled,
      salesmanList
    } = this.state;
    return (
      <Select placeholder={"请选择销售"} disabled={disabled}>
        {salesmanList.map(item=>{
          return (<Select.Option value={item.userAccount}>{item.userName}</Select.Option>)
        })}
      </Select>
    );
  }
}

export default SalesSelect;
