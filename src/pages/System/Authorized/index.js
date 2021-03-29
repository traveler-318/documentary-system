import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Button, Divider,
  Form, Icon, Tree,
} from 'antd';

import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';
import { setListData } from '../../../utils/publicMethod';
import {
  subordinateList
} from '../../../services/authorized';
import { getCookie } from '../../../utils/support';
import SearchButton from '@/pages/BranchOrder/components/button';
import router from 'umi/router';

// import styles from './index.less';


@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class SystemAuthorized extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:{},
      loading:false,
      params:{
        size:10,
        current:1,
        orderBy:false
      },

      subordinateList:[],//分公司数据
    };
  }

  // ============ 初始化数据 ===============
  componentWillMount() {
    this.getDataList();
  }


  getDataList = () => {
    const {params} = this.state;
    params.deptId = getCookie("dept_id");
    params.tenantId = getCookie("tenantId");
    this.setState({
      loading:true,
    })
    subordinateList(params).then(res=>{
      if(res && res.code ==200){
        this.setState({
          countSice:res.data.total,
          data:setListData(res.data),
          loading:false,
          selectedRowKeys:[]
        })
      }

    })
  }

  // 左上批量操作按钮
  renderLeftButton = (tabKey) => {
      return (
        <Button type='primary' icon='plus' onClick={()=>{
          this.handleAdd()
        }}>创建授权</Button>
      )
  };
  handleAdd = () =>{
    router.push(`/system/authorized/add`);
  }

  render() {
    const code = 'SystemAuthorizedList';

    const {
      form,
    } = this.props;

    const {
      data,
      loading,
    } = this.state;

    const columns = [
      {
        title: '授权令牌',
        dataIndex: 'authorizationId',
        key: 'authorizationId'
      },
      {
        title: '租户名称',
        dataIndex: 'authorizationTenantName',
        key: 'authorizationTenantName',
      },
      {
        title: '授权类型',
        dataIndex: 'authorizationOperationType',
        key: 'authorizationOperationType',
        render: (key,row)=>{
          return (
            <div>
              {
                key === '1' ? "是":"否"
              }
            </div>
          )
        }
      },
      {
        title: '状态',
        dataIndex: 'authorizationStatus',
        key: 'authorizationStatus',
        render: (key,row)=>{
          return (
            <div>
              {
                key === '1' ? "启用":"禁用"
              }
            </div>
          )
        }
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
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 250,
        render: (text,row) => {
          return(
            <div>
              {/*<a onClick={()=>this.handleDetails(row)}>详情</a>*/}
              {/*<Divider type="vertical" />*/}
              {/*<a onClick={()=>this.handleJournal(row)}>日志</a>*/}
              {/*<Divider type="vertical" />*/}
              {/*<a onClick={()=>this.handleSMS(row)}>短信</a>*/}
            </div>
          )
        },
      }
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
            multipleChoice={true}
            renderLeftButton={()=>this.renderLeftButton()}

            // multipleChoice={true}
          />
        </div>

      </Panel>
    );
  }
}
export default SystemAuthorized;
