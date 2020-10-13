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
  getProductattributeList,
  getProductattributeRemove,
} from '../../../services/newServices/product';
import Add from './components/add'
import Edit from './components/edit'

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class ProductManagement extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data:{ },
      loading:false,
      selectDataArrL:[],
      selectedRowKeys:[],
      params:{
        size:10,
        current:1
      },
      groupingList:[],
      handleAddVisible:false,
      details:{},
      handleEditVisible:false
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
    getProductattributeList(params).then(res=>{
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

  handleClick = ( row) => {
    const params={
      ids: row.id
    }
    const refresh = this.getDataList;
    Modal.confirm({
      title: '删除确认',
      content: '确定删除该条记录?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        getProductattributeRemove(params).then(resp => {
          if (resp.success) {
            message.success(resp.msg);
            refresh()
          } else {
            message.error(resp.msg || '删除失败');
          }
        });
      },
      onCancel() {

      },
    });
  };


  // 修改弹框
  handleEdit = (row) => {
    this.setState({
      handleEditVisible:true,
      details:row
    })
  }

  handleCancelEdit = () => {
    this.setState({
      handleEditVisible:false
    })
  }

  onSelectRow = (rows,key) => {
    console.log(rows,"rows")
    this.setState({
      selectDataArrL: rows,
      selectedRowKeys: key
    });
    const { dispatch } = this.props;
    dispatch({
      type: `globalParameters/setDetailData`,
      payload: rows,
    });
  };

 // 新增弹框
  handleAdd = () => {
    this.setState({
      handleAddVisible:true
    })
  }

  handleCancelAdd = () => {
    this.setState({
      handleAddVisible:false
    })
  }

  renderLeftButton = () => (
    <>
      数据列表
    </>
  );

  renderRightButton = () => {
    return(
      <div>
        <Button type="primary" onClick={()=>this.handleAdd()}>添加</Button>
      </div>
    )
  };

  render() {
    const {
      form,
    } = this.props;

    const {
      selectedRowKeys,
      handleAddVisible,
      data,
      loading,
      handleEditVisible,
      details,
      handleCancelEdit
    } = this.state;

    const columns = [
      {
        title: '编号',
        dataIndex: '',
        width: 100,
        render: (res,rows,index) => {
          return(
            index+1
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
        width: 200,
      },
      {
        title: '支付公司',
        dataIndex: 'payPanyName',
        width: 300,
      },
      {
        title: '价格',
        dataIndex: 'price',
        width: 150,
      },
      {
        title: '结算价',
        dataIndex: 'settlePrice',
        width: 150,
      },
      {
        title: '自定义1',
        dataIndex: 'customOne',
        width: 150,
      },
      {
        title: '自定义2',
        dataIndex: 'customTwo',
        width: 150,
      },
      {
        title: '自定义3',
        dataIndex: 'customThree',
        width: 150,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 160,
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 300,
        render: (res,row) => {
          return(
            <div>
              <Divider type="vertical" />
              <a onClick={()=>this.handleEdit(row)}>修改</a>
              <Divider type="vertical" />
              <a onClick={()=>this.handleClick(row)}>删除</a>
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
          onSelectRow={this.onSelectRow}
          loading={loading}
          columns={columns}
          scroll={{ x: 1000 }}
          renderLeftButton={this.renderLeftButton}
          renderRightButton={this.renderRightButton}
          selectedKey={selectedRowKeys}
        />
        {/* 新增 */}
        {handleAddVisible?(
          <Add
            handleAddVisible={handleAddVisible}
            handleCancelAdd={this.handleCancelAdd}
          />
        ):""}
        {/* 修改 */}
        {handleEditVisible?(
          <Edit
            handleEditVisible={handleEditVisible}
            details={details}
            handleCancelEdit={this.handleCancelEdit}
          />
        ):""}
      </Panel>
    );
  }
}
export default ProductManagement;
