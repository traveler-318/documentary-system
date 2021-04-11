import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Button,
  Form, message,
  Tag,
} from 'antd';

import Panel from '../../components/Panel';
import Grid from '../../components/Sword/Grid';
import { setListData } from '../../utils/publicMethod';
import { superiorlist, superiorupdate } from '../../services/authorized';
import AuthorizedProductPage from './productPage';
import { getCookie } from '../../utils/support';
import router from 'umi/router';

// import styles from './index.less';


@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class Authorized extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      loading: false,
      params: {
        size: 10,
        current: 1,
        orderBy: false,
      },
      selectedRows: [],//列表选择数组
      selectedRowKeys:[],//列表选择ID数组
      superiorlist: [],//分公司数据
      isOpenProduct: false,//是否打开产品列表
    };
  }

  // ============ 初始化数据 ===============
  componentWillMount() {
    this.getDataList();
  }


  getDataList = () => {
    const { params } = this.state;
    this.setState({
      loading: true,
    });
    params.deptId = getCookie('dept_id');
    params.tenantId = getCookie('tenantId');
    superiorlist(params).then(res => {
      if (res.code == 200) {
        this.setState({
          countSice: res.data.total,
          data: setListData(res.data),
          loading: false,
          selectedRowKeys: [],
        });
      }

    });
  };

  onSelectRow = (rows, keys) => {
    this.setState({
      selectedRows: rows,
      selectedRowKeys:keys
    });
  };

  // 左上批量操作按钮
  renderLeftButton = (tabKey) => {
    return (
      <>
        <Button type='primary' icon='plus' onClick={() => {
          this.handleAdd();
        }}>添加</Button>
        <Button icon='edit' onClick={() => {
          this.licensedProducts();
        }}>授权产品</Button>
      </>
    );
  };
  //添加
  handleAdd = () => {
    router.push(`/branchManage/authorized/add`);
  };

  //授权产品
  licensedProducts = () => {
    const { selectedRows } = this.state;

    if (selectedRows.length != 1) {
      return message.info('请选择一条数据');
    }

    this.setState({
      isOpenProduct: true,
    });
  };

  //确定授权产品
  handleOkProduct = (ids,callback) => {
    const { selectedRows } = this.state;
    superiorupdate({
      id: selectedRows[0].id,
      authorizationProductidId: ids.join(','),
    }).then(res => {
      if (res && res.code == 200) {
        message.info(res.msg);
        this.handleCancelProduct();
        this.setState({
          selectedRows:[],
          selectedRowKeys:[]
        })
        this.getDataList();
      }
      callback();
    });
  };

  //关闭授权产品
  handleCancelProduct = () => {
    this.setState({
      isOpenProduct: false,
    });
  };

  //查询详情
  handleDetails = () => {

  };

  render() {
    const code = 'AuthorizedList';

    const {
      form,
    } = this.props;

    const {
      data,
      loading,
      isOpenProduct,
      selectedRows,
      selectedRowKeys
    } = this.state;

    const columns = [
      {
        title: '公司ID',
        dataIndex: 'tenantId',
        key: 'tenantId',
      },
      {
        title: '机构名称',
        dataIndex: 'tenantName',
        key: 'tenantName',
      },
      // {
      //   title: '机构类型',
      //   dataIndex: 'authorizationOperationType',
      //   key: 'authorizationOperationType',
      //   render: (key,row)=>{
      //     return (
      //       <div>
      //         {
      //           key === '1' ? "是":"否"
      //         }
      //       </div>
      //     )
      //   }
      // },
      {
        title: '授权状态',
        dataIndex: 'authorizationStatus',
        key: 'authorizationStatus',
        render: (key, row) => {
          return key === 1 ? (<Tag color="green">已授权</Tag>) : <Tag color="orange">未授权</Tag>;
        },
      },
      {
        title: '到期时间',
        dataIndex: 'timeoutTime',
        key: 'timeoutTime',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      // {
      //   title: '操作',
      //   key: 'operation',
      //   fixed: 'right',
      //   width: 250,
      //   render: (text, row) => {
      //     return (
      //       <div>
      //         <a onClick={() => this.handleDetails(row)}>查看</a>
      //         {/*<Divider type="vertical" />*/}
      //         {/*<a onClick={()=>this.handleJournal(row)}>日志</a>*/}
      //         {/*<Divider type="vertical" />*/}
      //         {/*<a onClick={()=>this.handleSMS(row)}>短信</a>*/}
      //       </div>
      //     );
      //   },
      // },
    ];

    return (
      <Panel>
        <div>
          <Grid
            code={code}
            form={form}
            loading={loading}
            data={data}
            columns={columns}
            scroll={{ x: 1000 }}
            counterElection={false}
            selectedKey={selectedRowKeys}
            onSelectRow={this.onSelectRow}
            renderLeftButton={() => this.renderLeftButton()}
          />
        </div>

        {isOpenProduct ? <AuthorizedProductPage isVisible={isOpenProduct} selectedRows={selectedRows[0].authorizationProductidId.split(",")} handleOkProduct={this.handleOkProduct}
                                                handleCancelProduct={this.handleCancelProduct}/> : ''}
      </Panel>
    );
  }
}

export default Authorized;
