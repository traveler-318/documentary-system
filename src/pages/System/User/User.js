import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Upload,
  Icon,
  Switch,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Tree, Divider,
} from 'antd';
import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';
import { USER_INIT, USER_LIST, USER_ROLE_GRANT, USER_UPDATE } from '../../../actions/user';
import { resetPassword,unbundling, binding } from '../../../services/user';
import { tenantMode } from '../../../defaultSettings';
import { getAccessToken, getToken } from '../../../utils/authority';
import { randomLetters, randomNumber, copyToClipboard } from '../../../utils/publicMethod';
import BindingQRCode from '../../Customer/Sales/components/bindingQRCode';

const FormItem = Form.Item;
const { TreeNode } = Tree;
const { Dragger } = Upload;
let timers = null;

@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user,
}))
@Form.create()
class User extends PureComponent {
  state = {
    visible: false,
    excelVisible: false,
    confirmLoading: false,
    selectedRows: [],
    checkedTreeKeys: [],
    params: {},
    deptId: 0,
    isCovered: 0,
    onReset: () => {},
    passwordVisible: false,
    newPassword:"",
    bindingQRCodeVisible:false,
    countDownTimer:30
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(USER_INIT());
  }

  onSelectRow = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  getSelectKeys = () => {
    const { selectedRows } = this.state;
    return selectedRows.map(row => row.id);
  };

  // ============ 查询 ===============
  handleSearch = params => {
    const { dispatch } = this.props;
    const { deptId } = this.state;
    let value = params;
    if (deptId > 0) {
      value = { ...params, deptId };
    }
    dispatch(USER_LIST(value));
    this.setState({ params });
  };

  // ============ 处理按钮点击回调事件 ===============
  handleBtnCallBack = payload => {
    const { btn, keys } = payload;
    if (btn.code === 'user_role') {
      if (keys.length === 0) {
        message.warn('请先选择一条数据!');
        return;
      }
      this.showModal();
      return;
    }
    if (btn.code === 'user_reset') {
      if (keys.length === 0) {
        message.warn('请先选择一条数据!');
        return;
      }
      this.setState({ 
        passwordVisible:true,
        newPassword:randomLetters()+randomNumber(),
        keys
      });
    }
  };

  // 修改密码
  changePassword = () =>{
    const {
      keys,
      newPassword,
      confirmLoading
    } = this.state;
    if(newPassword === ""){
      message.error('请输入新密码');
      return false;
    }
    if(confirmLoading){ return false; }
    this.setState({ confirmLoading:true });
    const _this = this;
    Modal.confirm({
      title: '修改密码',
      content: `确定将选择账号密码修改为${newPassword}?`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        const response = await resetPassword({ 
          userIds: keys, 
          password: newPassword,
        });
        _this.setState({ confirmLoading:false });
        if (response.success) {
          message.success(response.msg);
          _this.setState({ passwordVisible:false });
        } else {
          message.error(response.msg || '修改失败');
        }
      },
      onCancel() {
        _this.setState({ confirmLoading:false });
      },
    });
  }
  // 复制密码
  copyNewPassword = () => {
    copyToClipboard(this.state.newPassword);
  }

  handleGrant = () => {
    const { checkedTreeKeys } = this.state;
    const keys = this.getSelectKeys();

    this.setState({
      confirmLoading: true,
    });

    const { dispatch } = this.props;
    dispatch(
      USER_ROLE_GRANT({ userIds: keys, roleIds: checkedTreeKeys.checked }, () => {
        this.setState({
          visible: false,
          confirmLoading: false,
        });
        message.success('配置成功');
        this.setState({
          checkedTreeKeys: [],
        });
      })
    );
  };

  refreshTable = (checked,row,type) => {
    console.log(row,"row")
    const {dispatch} = this.props
    let params = {...row};
    params[type] = checked ? 1 : 0
    params.deptId = row.deptId
    dispatch(USER_UPDATE(params));
  }
  
  onChange = (checked,row,type) => {
    const refresh = (checked,row,type)=>this.refreshTable(checked,row,type);
    Modal.confirm({
      title: '修改确认',
      content: '是否要修改该状态??',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        refresh(checked,row,type)
      },
      onCancel() {},
    });
    
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () =>
    this.setState({
      visible: false,
    });

  onCheck = checkedTreeKeys => this.setState({ checkedTreeKeys });

  onSelect = checkedTreeKeys => {
    const { params } = this.state;
    const { dispatch } = this.props;
    const value = { ...params, deptId: checkedTreeKeys[0] };
    dispatch(USER_LIST(value));
    this.setState({ deptId: checkedTreeKeys[0] });
  };

  onClickReset = () => {
    const { onReset } = this.state;
    this.setState({ deptId: 0 });
    onReset();
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });

  // ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    this.setState({
      onReset,
    });

    return (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={6} sm={24}>
          <FormItem label="账号">
            {getFieldDecorator('account')(<Input placeholder="请输入账号" />)}
          </FormItem>
        </Col>
        <Col md={6} sm={24}>
          <FormItem label="姓名">
            {getFieldDecorator('realName')(<Input placeholder="请输入姓名" />)}
          </FormItem>
        </Col>
        <Col>
          <div style={{ float: 'right' }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.onClickReset}>
              重置
            </Button>
          </div>
        </Col>
      </Row>
    );
  };

  handleImport = () => {
    this.setState({
      excelVisible: true,
    });
  };

  handleExcelImport = () =>
    this.setState({
      excelVisible: false,
    });

  handleExcelCancel = () =>
    this.setState({
      excelVisible: false,
    });

  handleExport = () => {
    const { params } = this.state;
    Modal.confirm({
      title: '用户导出确认',
      content: '是否导出用户数据?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const account = params.account || '';
        const realName = params.realName || '';
        window.open(
          `/api/blade-user/export-user?Blade-Auth=${getAccessToken()}&account=${account}&realName=${realName}`
        );
      },
      onCancel() {},
    });
  };

  handleTemplate = () => {
    console.log(`http://121.37.251.134:9010/blade-user/export-template?Blade-Auth=${getAccessToken()}`)
    window.open(`http://121.37.251.134:9010/blade-user/export-template?Blade-Auth=${getAccessToken()}`)
  };

  onSwitchChange = checked => {
    this.setState({
      isCovered: checked ? 1 : 0,
    });
  };

  onUpload = info => {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} 数据导入成功!`);
      this.handleExcelCancel();
      this.onClickReset();
    } else if (status === 'error') {
      message.error(`${info.file.response.msg}`);
    }
  };

  handleBinding = (row,type) => {
    const { params } = this.state;
    const { dispatch } = this.props;
    if(type ==="0"){
      Modal.confirm({
        title: '提醒',
        content: '是否确认解绑?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          unbundling(row.account,row.openid).then(res=>{
            dispatch(USER_LIST(params));
            message.success(res.msg);
          })
        },
        onCancel() {},
      });
    }else {
      binding(row.account).then(res=>{
        console.log(res)
        const imgUrl = "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket="+res.data;
        this.setState({
          bindingQRCodeVisible:true,
          bindingQRCode:imgUrl
        })
        this.countDown();
      })
    }
  }

  countDown = () => {
    timers = setTimeout(()=>{
      let {countDownTimer} = this.state;
      countDownTimer = countDownTimer-1
      this.setState({
        countDownTimer:countDownTimer,
      },()=>{
        if(this.state.countDownTimer <= 0 || !this.state.bindingQRCode){
          this.setState({
            countDownTimer:30,
            bindingQRCode:false,
          })
          clearTimeout(timers)
        }else{
          this.countDown();
        }
      })
    },1000)
  };

  // =========关闭二维码弹窗========
  handleCancelBindingQRCode = () => {
    const { dispatch } = this.props;
    const { params } = this.state;
    dispatch(USER_LIST(params));
    this.setState({
      bindingQRCodeVisible:false,
      countDownTimer:30
    })
    dispatch(USER_LIST(params));
  }


  renderRightButton = () => (
    <div>
      <Button icon="vertical-align-bottom" onClick={this.handleImport}>
        导入
      </Button>
      <Button icon="vertical-align-top" onClick={this.handleExport} style={{ marginRight: 0 }}>
        导出
      </Button>
    </div>
  );

  render() {
    const code = 'user';

    const { 
      visible, 
      excelVisible, 
      confirmLoading, 
      checkedTreeKeys, 
      isCovered,
      passwordVisible,
      newPassword,
      bindingQRCodeVisible,bindingQRCode,countDownTimer
    } = this.state;

    const {
      form,
      loading,
      user: {
        data,
        init: { roleTree, deptTree },
      },
    } = this.props;

    console.log(data,"current")

    console.log(data,"data")
    const uploadProps = {
      name: 'file',
      headers: {
        'Blade-Auth': getToken(),
      },
      action: `/api/blade-user/import-user?isCovered=${isCovered}`,
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 16 },
      },
    };

    const formAllItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };

    const columns = [
      {
        title: '租户ID',
        dataIndex: 'tenantId',
        width:100,
      },
      {
        title: '登录账号',
        dataIndex: 'account',
        width:100,
      },
      {
        title: '用户姓名',
        dataIndex: 'name',
        width:120,
      },
      {
        title: '所属角色',
        dataIndex: 'roleName',
        width:120,
      },
      {
        title: '所属组织',
        dataIndex: 'organizationName',
        width:180,
      },
      {
        title: '职员工号',
        dataIndex: 'code',
        width:120,
      },
      {
        title: '手机号码',
        dataIndex: 'phone',
        width:120,
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        width:160,
      },
      // {
      //   title: '剩余金额',
      //   dataIndex: 'remainingMoney',
      //   width:100,
      // },
      // {
      //   title: '业务员数量',
      //   dataIndex: 'currentQuota',
      //   width:100,
      // },
      {
        title: '添加时间',
        dataIndex: 'createTime',
        width:160,
      },
      {
        title: '是否启用',
        dataIndex: 'status',
        width: 80,
        render: (key, row) => {
          return(
            <Switch checked={key===1?true:false} onChange={(e)=>{this.onChange(e, row,'status')}} />
          )
        },
      },
      {
        title: '公众号绑定',
        dataIndex: 'openid',
        width: 100,
        render: (res,row) => {
          return(
            <div>
              {
                res === '' ?
                  (<a onClick={()=>this.handleBinding(row,"1")}>绑定</a>)
                  :(<><a onClick={()=>this.handleBinding(row,"0")}>解绑</a></>)
              }
            </div>
          )
        },
      },
      // {
      //   title: '告警开关',
      //   dataIndex: 'alarmStatus',
      //   width: 80,
      //   render: (key, row) => {
      //     return(
      //       <Switch checked={key===1?true:false} onChange={(e)=>{this.onChange(e, row,'alarmStatus')}} />
      //     )
      //   },
      // },
      // {
      //   title: '二维码开关',
      //   dataIndex: 'qrcodeStatus',
      //   width: 100,
      //   render: (key, row) => {
      //     return(
      //       <Switch checked={key===1?true:false} onChange={(e)=>{this.onChange(e, row,'qrcodeStatus')}} />
      //     )
      //   },
      // },
      // {
      //   title: '物流查询开关',
      //   dataIndex: 'logisticsStatus',
      //   width: 110,
      //   render: (key, row) => {
      //     return(
      //       <Switch checked={key===1?true:false} onChange={(e)=>{this.onChange(e, row,'logisticsStatus')}} />
      //     )
      //   },
      // },
      // {
      //   title: '短信二维码开关',
      //   dataIndex: 'smsStatus',
      //   width: 120,
      //   render: (key, row) => {
      //     return(
      //       <Switch checked={key===1?true:false} onChange={(e)=>{this.onChange(e, row,'smsStatus')}} />
      //     )
      //   },
      // },
      // {
      //   title: '发货提醒开关',
      //   dataIndex: 'shipmentRemindStatus',
      //   width: 110,
      //   render: (key, row) => {
      //     return(
      //       <Switch checked={key===1?true:false} onChange={(e)=>{this.onChange(e, row, 'shipmentRemindStatus')}} />
      //     )
      //   },
      // },
    ];


    if (!tenantMode) {
      columns.splice(0, 1);
    }

    return (
      <Panel>
        <Row>
          <Col span={5}>
            <Card bordered={false} style={{ marginRight: '10px' }}>
              <Tree onSelect={this.onSelect}>{this.renderTreeNodes(deptTree)}</Tree>
            </Card>
          </Col>
          <Col span={19}>
            <Grid
              code={code}
              form={form}
              onSearch={this.handleSearch}
              onSelectRow={this.onSelectRow}
              renderSearchForm={this.renderSearchForm}
              // renderRightButton={this.renderRightButton}
              btnCallBack={this.handleBtnCallBack}
              loading={loading}
              data={data}
              columns={columns}
              scroll={{ x: 1000 }} 
            />
          </Col>
        </Row>
        <Modal
          title="修改密码"
          maskClosable={false}
          visible={passwordVisible}
          width={350}
          onOk={this.changePassword}
          confirmLoading={confirmLoading}
          onCancel={()=>{
            this.setState({
              passwordVisible:false,
            })
          }}
        >
          <Form style={{ marginTop: 8 }}>
            <FormItem {...formAllItemLayout} label="新密码">
              <Input 
                placeholder="请输入新密码"
                onChange={({ target: { value } }) => {
                  this.setState({
                    newPassword:value
                  })
                }}
                value={newPassword}
               />
               <Button type="primary" icon="copy" size="small" onClick={this.copyNewPassword}>
                点击复制密码
              </Button>
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title="权限配置"
          maskClosable={false}
          width={350}
          visible={visible}
          confirmLoading={confirmLoading}
          onOk={this.handleGrant}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
        >
          <Tree checkable checkStrictly checkedKeys={checkedTreeKeys} onCheck={this.onCheck}>
            {this.renderTreeNodes(roleTree)}
          </Tree>
        </Modal>
        <Modal
          title="用户数据导入"
          maskClosable={false}
          width={500}
          visible={excelVisible}
          confirmLoading={confirmLoading}
          onOk={this.handleExcelImport}
          onCancel={this.handleExcelCancel}
          okText="确认"
          cancelText="取消"
        >
          <Form style={{ marginTop: 8 }} hideRequiredMark>
            <FormItem {...formItemLayout} label="模板上传">
              <Dragger {...uploadProps} onChange={this.onUpload}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">将文件拖到此处，或点击上传</p>
                <p className="ant-upload-hint">请上传 .xls,.xlsx 格式的文件</p>
              </Dragger>
            </FormItem>
            <FormItem {...formItemLayout} label="数据覆盖">
              <Switch checkedChildren="是" unCheckedChildren="否" onChange={this.onSwitchChange} />
            </FormItem>
            <FormItem {...formItemLayout} label="模板下载">
              <Button type="primary" icon="download" size="small" onClick={this.handleTemplate}>
                点击下载
              </Button>
            </FormItem>
          </Form>
        </Modal>

        {/* 二维码 */}
        {bindingQRCodeVisible?(
          <BindingQRCode
            bindingQRCodeVisible={bindingQRCodeVisible}
            bindingQRCode={bindingQRCode}
            countDownTimer={countDownTimer}
            handleCancelBindingQRCode={this.handleCancelBindingQRCode}
          />
        ):""}

      </Panel>
    );
  }
}
export default User;
