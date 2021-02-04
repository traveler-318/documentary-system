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
import { getLabelList,  removeLabel, } from '../../../services/user';
import Add from './components/add'
import Edit from './components/edit'


@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class PayBrandList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data:{ },
      loading:false,
      selectedRowKeys:[],
      params:{
        size:100,
        current:1,
        labelType:1
      },
      handleAddVisible:false,
      handleEditVisible:false,
      details:''
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
    getLabelList(params).then(res=>{
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

  // ============ 删除 ===============

  handleClick = ( row) => {
    const refresh = this.getDataList;
    Modal.confirm({
      title: '删除确认',
      content: '确定删除该条记录?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        removeLabel(row.id,1).then(resp => {
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

  // 新增弹框
  handleAdd = () => {
    this.setState({
      handleAddVisible:true
    })
  }

  handleCancelAdd = (type) => {
      if(type === 'getlist'){
        this.getDataList();
      }
    this.setState({
      handleAddVisible:false
    })
  }

  // 修改弹框
  handleEdit = (row) => {
    this.setState({
      handleEditVisible:true,
      details:row
    })
  }

  handleCancelEdit = (type) => {
    if(type === 'getlist'){
        this.getDataList();
      }
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
      selectedRowKeys,handleAddVisible,handleEditVisible,details,data,loading} = this.state;

    const columns = [
      {
        title: '排序',
        dataIndex: 'sortNumber',
        render: (res,rows,index) => {
          return(
            index+1
          )
        },
      },
      {
        title: '等级',
        dataIndex: 'labelName',
        width: 300,
      },
      {
        title: '颜色',
        dataIndex: 'color',
        width: 300,
        render: (res,row) => {
            return(
              <div>
                <span style={{
                    display:'inline-block',
                    width:"10px",
                    height:'10px',
                    marginRight: 5,
                    background:res,
                    borderRadius: '50%'
                }}></span>
              </div>
            )
          },
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 180,
        render: (res,row) => {
          return(
            <div>
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
            type={"grade"}
          />
        ):""}
        {/* 修改 */}
        {handleEditVisible?(
          <Edit
            handleEditVisible={handleEditVisible}
            details={details}
            handleCancelEdit={this.handleCancelEdit}
            type={"grade"}
          />
        ):""}
      </Panel>
    );
  }
}
export default PayBrandList;
