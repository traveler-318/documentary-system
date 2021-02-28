import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form} from 'antd';

import Grid from '../../../../components/Sword/Grid';
import { clientOperationRecord } from '@/services/order/customer';


@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class Ownership extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      detail:{},
      data:{},
      loading:false,
    };
  }

  // ============ 初始化数据 ===============
  componentWillMount() {
    const { detail } = this.props;
    this.setState({
      detail:detail
    })
  }

  getList = (p) =>{
    console.log(p,"查询参数")
    const { detail } = this.state;
    const params={
      clientId:detail.id,
      deptId:detail.deptId,
      tenantId:detail.tenantId,
      type:0,
      size:p.size,
      current:p.current
    }
    clientOperationRecord(params).then(res=>{
      const data = res.data.records;
      this.setState({
        data:{
          list:data,
          pagination:{
            total:res.data.total,
            current:res.data.current,
            pageSize:res.data.size,
          }
        }
      })
    })
  }

  getText = (key, type) => {
    let text = ""
    type.map(item=>{
      if(item.key === key){
        text = item.name
      }
    })
    return text
  }

  render() {

    const {
      form,
    } = this.props;

    const {
      data,
      loading,
    } = this.state;

    const columns = [

      {
        title: '归属人',
        dataIndex: 'salesman',
        ellipsis: true,
      },
      {
        title: '状态',
        dataIndex: 'status',
        ellipsis: true,
        render: (key)=>{
          return (
            <div>{key == 1?'已过期':'进行中'} </div>
          )
        }
      },
      {
        title: '操作时间',
        dataIndex: 'createTime',
        ellipsis: true,
      }
    ];

    return (
      <Grid
        form={form}
        data={data}
        loading={loading}
        columns={columns}
        multipleChoice={true}
        onSearch={this.getList}
      />
    );
  }
}
export default Ownership;
