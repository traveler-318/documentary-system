import React, { PureComponent } from 'react';
import { Modal, Form,  Button,message,Table } from 'antd';
import { connect } from 'dva';
import {getProductAgentlist,getProductAgentsave} from '../../../../services/newServices/product';
import moment from 'moment';


@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class ParentProduct extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      model:false,// 弹窗显示隐藏
      params:{
        size:10,
        current:1
      },
      total:0,
      productList:[],
      selectedRowKeys: [],
      selectedRows:[],
    };
  }

  componentWillMount() {
    const { visible } = this.props;
    // 获取详情数据
    this.setState({
      model:visible
    })
    this.getDataList();
  }

  getDataList = () => {
    const {params} = this.state;
    const { handleProductParams } = this.props;
    let json = {...params,...handleProductParams};
    getProductAgentlist(json).then(res=>{
      if(res.code  == 200){
        this.setState({
          productList:res.data.records,
          total:res.data.total
        })
      }else if(res.code  == 400){
        this.props.handleCancelProduct();
        // message.error(res.msg);
      }else {
        // message.error(res.msg);
      }
    })
  }

  onOk = () => {
    const json = this.state.selectedRows[0];
    getProductAgentsave(json).then(res=>{
      if(res.code  == 200){
        this.props.handleOkProduct();
      }else {
        message.error(res.msg);
      }
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = pagination;

    this.setState({
      params:{
        size:pager.pageSize,
        current:pager.current
      }
    },() => this.getDataList());
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {

    this.setState({
      selectedRowKeys:selectedRowKeys,
      selectedRows:selectedRows
    });
  };

  render() {
    const {handleCancelProduct} = this.props;

    const columns = [
      {
        title: '编号',
        dataIndex: '',
        width: 80,
        render: (res,rows,index) => {
          return(
            index+1
          )
        },
      },
      {
        title: '页面标题',
        dataIndex: 'h5Title',
        width: 200,
      },
      {
        title: '页面背景',
        dataIndex: 'h5Background',
        width: 100,
        render: (res,row) => {
          return(
            <div>
              {
                res === '' ?
                  (res)
                  :(<a onClick={()=>this.props.handleImg(row)}>查看</a>)
              }
            </div>
          )
        },
      },
      {
        title: '产品',
        dataIndex: 'productName',
        width: 200,
      },
      {
        title: '类型',
        dataIndex: 'productTypeName',
        width: 150,
      },
      {
        title: '支付公司',
        dataIndex: 'payPanyName',
        width: 120,
      },
      {
        title: '价格',
        dataIndex: 'price',
        width: 100,
      },
      // {
      //   title: '结算价',
      //   dataIndex: 'settlePrice',
      //   width: 150,
      // },
      {
        title: '自定义1',
        dataIndex: 'customOne',
        width: 120,
      },
      {
        title: '自定义2',
        dataIndex: 'customTwo',
        width: 120,
      },
      {
        title: '自定义3',
        dataIndex: 'customThree',
        width: 120,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
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
      }
    ];

    const {
      model,productList,selectedRowKeys,params,total
    } = this.state;

    const rowSelection = {
      type:'radio',
      selectedRowKeys,
      onChange: this.onSelectChange,
    };


    return (
        <Modal
          title="代理产品"
          visible={model}
          maskClosable={false}
          width='80%'
          onCancel={handleCancelProduct}
          footer={[
            <Button key="back" onClick={handleCancelProduct}>
              取消
            </Button>,
            <Button type="primary" onClick={()=>this.onOk()}>
              确定
            </Button>,
          ]}
        >
          <Table dataSource={productList} columns={columns} rowSelection={rowSelection} pagination={{
            current: params.current,
            pageSize: params.size,
            total: total }} onChange={this.handleTableChange}/>
        </Modal>
    );
  }
}

export default ParentProduct;
