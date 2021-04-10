import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Button, Divider,
  Form, Icon, message, Modal, Tree,
} from 'antd';

import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';
import Authorization from './authorization';
import { setListData } from '../../../utils/publicMethod';
import {
  subordinateList,subordinateRemove,switchverification,lookkey
} from '../../../services/authorized';
import { getCookie } from '../../../utils/support';
import router from 'umi/router';
import SystemAuthorizedVerification from './SystemAuthorizedVerification';
import { remove } from '@/services/region';

let ViewData = {};
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
      isTipVisible:false,//密匙提示框显示、隐藏
      authorizaDataInfo:{},//密匙提示内容
      isVerification:false,//验证码窗口
      verificationType:1,//验证框类型 开关:1  查看:2
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
  //创建授权
  handleAdd = () =>{
    router.push(`/authority/authorized/add`);
  }

  //查看secrent
  handleViewSecret =(row) =>{
    ViewData = row;
    this.setState({
      isVerification:true,
      verificationType:2
    })
  }
  //短信验证通过
  verificationSuccess = (json) =>{
    const {verificationType} = this.state;
    this.setState({
      isVerification:false,
    })
    if(verificationType == 2){
      const params={
        id:ViewData.id,
        smsCode:json.code,
        phone:json.phone,
        sendType:verificationType
      }
      lookkey(params).then(res=>{
        if(res && res.code ==200){
          this.setState({
            isTipVisible:true,
            authorizaDataInfo:res.data
          })
        }
      })
    }else{
      switchverification({
        id: ViewData.id,
        authorizationStatus:ViewData.states,
        smsCode:json.code,
        phone:json.phone,
        sendType:verificationType
      }).then(res=>{
        if (res && res.code == 200) {
          this.getDataList();
        }
      });
    }
  }

  handleCancelVerification =() => {
    this.setState({
      isVerification:false
    })
  }
  //启用禁用
  handleChangeStatus = (row) => {
    let status = row.authorizationStatus == 1 ? 2 :1;
    const text = status == 2 ? '禁用':'启用';

    const _this = this;
    Modal.confirm({
      title: '配置'+text+'确认',
      content: '是否将改配置'+text+'?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        ViewData = row;
        ViewData.states = status
        _this.setState({
          isVerification:true,
          verificationType:1
        })
      },
      onCancel() {},
    });
  }

  cancelAuthorization(){
    this.setState({
      isTipVisible:false
    })
  }

  //删除
  handleDelete = (row) => {
    const id = row.id;
    Modal.confirm({
      title: '删除确认',
      content: '确定删除该条记录?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        subordinateRemove({ ids: id }).then(resp => {
          if (resp.success) {
            message.success(resp.msg);
          } else {
            message.error(resp.msg || '删除失败');
          }
        });
      },
      onCancel() {},
    });
  };

  render() {
    const code = 'SystemAuthorizedList';

    const {
      form,
    } = this.props;

    const {
      data,
      loading,
      isTipVisible,
      isVerification,
      authorizaDataInfo,
      verificationType
    } = this.state;

    const columns = [
      // {
      //   title: '授权类型',
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
        title: '被授权公司ID',
        dataIndex: 'authorizationTenantId',
        key: 'authorizationTenantId',
      },
      {
        title: '被授权公司',
        dataIndex: 'authorizationTenantName',
        key: 'authorizationTenantName',
      },
      {
        title: '到期时间',
        dataIndex: 'timeoutTime',
        key: 'timeoutTime',
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
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 200,
        render: (text,row) => {
          return(
            <div>
              <a onClick={()=>this.handleViewSecret(row)}>查看secret</a>
              <Divider type="vertical" />
              <a onClick={()=>this.handleChangeStatus(row)}>{row.authorizationStatus == '1' ? '禁用':'启用'}</a>
              <Divider type="vertical" />
              <a onClick={()=>this.handleDelete(row)}>删除</a>
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
        {isTipVisible &&
        (<Authorization authorizaDataInfo={authorizaDataInfo} handleCancel={this.cancelAuthorization}/>
        )}
        {isVerification && (
          <SystemAuthorizedVerification isVerification={isVerification} sendType={verificationType} handleVerification = {this.verificationSuccess}
                                        handleCancelVerification={this.handleCancelVerification}/>
        )}
      </Panel>
    );
  }
}
export default SystemAuthorized;
