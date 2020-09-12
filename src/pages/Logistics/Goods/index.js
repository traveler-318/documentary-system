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
import {
  getSubmit,
  getGoodsList,
  getGoodsRemove,
  getGoodsSubmit,
} from '../../../services/newServices/logistics';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@Form.create()
class GoodsList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data:[],
      loading:false
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
    getGoodsList(params).then(res=>{
      this.setState({
        loading:false
      })
      const data = res.data.records;
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

  // ============ 查询 ===============
  handleSearch = params => {

  };

  // ============ 查询表单 ===============

  renderSearchForm = onReset => {

  };

  // ============ 删除 ===============
  handleClick = ( id) => {
    console.log(id)
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
        getGoodsRemove(params).then(resp => {
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

  // ============ 修改默认开关 =========
  onStatus = (value,key) => {
    const refresh = this.getDataList;
    const data= value === 0 ? 1 : 0;
    const params = {
      id:key.id,
      status:data
    };
    Modal.confirm({
      title: '修改确认',
      content: '是否要修改该状态??',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        getGoodsSubmit(params).then(resp=>{
          if (resp.success) {
            message.success(resp.msg);
            refresh()
          } else {
            message.error(resp.msg || '修改失败');
          }
        })
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
      <Button type="primary" icon="plus" onClick={()=>{router.push(`/logistics/goods/add`);}}>添加</Button>
    </>
  );

  render() {
    const {
      form,
    } = this.props;
    const {data,loading} = this.state;
    const columns = [
      {
        title: '物品名称',
        dataIndex: 'cargo',
        width: 200,
      },
      {
        title: '物品总数量',
        dataIndex: 'count',
        width: 300,
      },
      {
        title: '物品总重量',
        dataIndex: 'weight',
        width: 200,
      },
      {
        title: '物品总体积',
        dataIndex: 'volumn',
        width: 150,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 150,
      },
      {
        title: '默认开关',
        dataIndex: 'status',
        width: 150,
        render: (res,key) => {
          return(
            <div>
              { res === 0 ? <Switch onClick={() => this.onStatus(res,key)} />
                : <Switch defaultChecked onClick={() => this.onStatus(res,key)} />}
            </div>
          )
        },
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 200,
        render: (res) => {
          const thisData =  JSON.stringify(res);
          return(
            <div>
              <Divider type="vertical" />
              <a onClick={()=>{router.push(`/logistics/goods/edit/${thisData}`);}}>编辑</a>
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
export default GoodsList;
