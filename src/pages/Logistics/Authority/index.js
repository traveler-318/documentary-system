import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  DatePicker,
  Divider,
  Dropdown,
  Menu,
  Icon,
  Switch,
  Modal,
  message,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';

import {getList,getRemove} from '../../../services/newServices/logistics';


const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@Form.create()
class AuthorityList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data:{},
      loading:false,
      params:{
        size:10,
        current:1
      }
    };
  }
  // ============ 初始化数据 ===============

  componentWillMount() {
    this.getDataList();
  }

  getDataList = () => {
    const {params} = this.state;
    this.setState({
      loading:true
    })
    getList(params).then(res=>{
      this.setState({
        loading:false
      })
      this.setState({
        data:{
          list:res.data.records,
          pagination:{
            current: res.data.current,
            pageSize: res.data.size,
            total: res.data.total
          }
        }
      })
    })
  }

  // ============ 查询 ===============
  handleSearch = params => {
    this.setState({
      params
    },()=>{
      this.getDataList();
    })
  };

  // ============ 查询表单 ===============

  renderSearchForm = onReset => {

  };

  // ============ 删除 ===============

  handleClick = ( id) => {
    const params={
      ids: id
    }
    const refresh = this.getDataList;
    Modal.confirm({
      title: '删除确认',
      content: '确定删除该条记录?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        getRemove(params).then(resp => {
          if (resp.success) {
            message.success(resp.msg);
            refresh()
          } else {
            message.error(resp.msg || '删除失败');
          }
        });
      },
      onCancel() {},
    });
  };



  renderLeftButton = () => (
    <>
      数据列表
    </>
  );

  renderRightButton = () => (
    <>
      <Button type="primary" icon="plus" onClick={()=>{router.push(`/logistics/authority/add`);}}>添加</Button>
    </>
  );

  render() {
    const {
      form,
    } = this.props;

    const {data,loading} = this.state;

    const columns = [
      {
        title: '授权ID',
        dataIndex: 'partnerId',
        width: 200,
      },
      {
        title: '授权key',
        dataIndex: 'partnerKey',
        width: 250,
      },
      {
        title: '快递员名称',
        dataIndex: 'checkMan',
        width: 250,
      },
      {
        title: '当地网点名称',
        dataIndex: 'net',
        width: 350,
      },
      {
        title: '默认开关',
        dataIndex: 'status',
        width: 150,
        render: (res) => {
          return(
            <div>
              { res === 0 ? <Switch />
                : <Switch defaultChecked />}
            </div>
          )
        },
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 300,
        render: (res) => {
          const thisData =  JSON.stringify(res);
          return(
            <div>
              <Divider type="vertical" />
              <a onClick={()=>{router.push(`/logistics/authority/edit/${thisData}`);}}>编辑</a>
              <Divider type="vertical" />
              <a onClick={() => this.handleClick(res.id)}>删除</a>
            </div>
          )
        },
      },
    ];
    return (
      <Panel>
        <Grid
          form={form}
          onSearch={this.handleSearch}
          renderSearchForm={this.renderSearchForm}
          data={data}
          loading={loading}
          columns={columns}
          scroll={{ x: 1000 }}
          renderLeftButton={this.renderLeftButton}
          renderRightButton={this.renderRightButton}
        />
      </Panel>
    );
  }
}
export default AuthorityList;
