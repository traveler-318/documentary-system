import React, { PureComponent  } from 'react';
import { connect } from 'dva';
import {
  Button,
  Form,
  Table,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import { getAdditionalList } from '../../../../services/newServices/logistics';

@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class Additional extends PureComponent {
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
    getAdditionalList(params).then(res=>{
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
        title: '支付方式',
        dataIndex: 'payType',
        width: 150,
        render: (res) => {
          let payType;
          if (res === 'SHIPPER') {
            payType ='寄方付';
          } else if(res === 'CONSIGNEE'){
            payType ='到付';
          }else if(res === 'MONTHLY'){
            payType ='月结';
          }else {
            payType ='第三方支付';
          }
          return(
            payType
          )
        },
      },
      {
        title: '快递类型',
        dataIndex: 'expType',
        width: 150,
      },
      {
        title: '保价额度(元)',
        dataIndex: 'valinsPay',
        width: 150,
      },
      {
        title: '待收货款额度(元)',
        dataIndex: 'collection',
        width: 150,
      },
      {
        title: '系统标识',
        dataIndex: 'code',
        width: 150,
      },
      {
        title: '是否需要子单',
        dataIndex: 'needChild',
        width: 150,
        render: (res) => {
          return(
            <div>
              { res === 0 ? '不需要': '需要'}
            </div>
          )
        },
      },
      {
        title: '是否需要回单',
        dataIndex: 'needBack',
        width: 150,
        render: (res) => {
          return(
            <div>
              { res === 0 ? '不需要': '需要'}
            </div>
          )
        },
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
export default Additional;
