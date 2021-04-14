import React, { PureComponent } from 'react';
import { Select } from 'antd';
import { getList as getSalesmanLists } from '../../../../services/newServices/sales';

class SalesSelect extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      disabled:false,
      salesmanList:[],
      value:''
    };
  }

  componentWillMount() {
    this.setState({
      disabled:this.props.disabled || false
    })
    this.getSalesmanList()
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({
        value:value
      })
    }
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
      salesmanList,
      value
    } = this.state;

    return (
      <Select value={value} placeholder={"请选择销售"} disabled={disabled}>
        {salesmanList.map(item=>{
          return (<Select.Option value={item.userAccount}>{item.userName}</Select.Option>)
        })}
      </Select>
    );
  }

}
export default SalesSelect;
