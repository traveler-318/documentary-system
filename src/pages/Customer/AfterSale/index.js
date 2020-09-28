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
import { setListData } from '../../../utils/publicMethod';
import { 
    getList,
    deleteData
} from '../../../services/newServices/afterSale';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class AfterSale extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data:{},
      loading:false,
      params:{
        size:10,
        current:1
      },
      groupingList:[]
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
        data:setListData(res.data)
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

  handleDelete= ( id) => {
    const refresh = this.refreshTable;
    Modal.confirm({
      title: '删除确认',
      content: '确定删除选中记录?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        deleteData({
          ids:row.id
        }).then(res=>{
          message.success(res.msg);
          refresh();
        })
      },
      onCancel() {},
    });
  };

  // 修改数据
  handleEdit = (row) => {
    const { dispatch } = this.props;
    dispatch({
      type: `globalParameters/setDetailData`,
      payload: row,
    });
    router.push('/customer/AfterSale/edit');
  };

  renderLeftButton = () => (
    <>
      <Button type="primary" onClick={()=>{router.push(`/customer/AfterSale/add`);}}>添加</Button>
    </>
  );

  render() {
    const {
      form,
    } = this.props;

    const {
      data,
      loading
    } = this.state;

    const columns = [
      {
        title: '售后名称',
        dataIndex: 'userName',
        width: 100,
      },
      {
        title: '手机号',
        dataIndex: 'userPhone',
        width: 150,
      },
      {
        title: '负责销售',
        dataIndex: 'userPhone',
        width: 150,
      },
      {
        title: '售后工单',
        dataIndex: 'userPhone',
        width: 150,
      },
      {
        title: '待处理',
        dataIndex: 'userPhone',
        width: 150,
      },
      {
        title: '已完成',
        dataIndex: 'userPhone',
        width: 150,
      },
      {
        title: '已作废',
        dataIndex: 'userPhone',
        width: 150,
      },
      {
        title: '修改时间',
        dataIndex: 'createTime',
        width: 200,
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 150,
        render: (res,row) => {
          return(
            <div>
              <Divider type="vertical" />
              <a onClick={()=>this.handleDelete(row)}>编辑</a>
              <Divider type="vertical" />
              <a onClick={()=>this.handleAggregateCode(row)}>删除</a>
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
        //   onSelectRow={this.onSelectRow}
          loading={loading}
          columns={columns}
          scroll={{ x: 1000 }}
          renderLeftButton={this.renderLeftButton}
        />
      </Panel>
    );
  }
}
export default AfterSale;
