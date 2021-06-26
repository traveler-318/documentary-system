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
  shipperList,
  shipperRemove,
  shipperUpdateDefaultStatus,
  cancelCourier
} from '../../../services/newServices/logistics';
import moment from 'moment';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class SenderList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data:[],
      loading:false,
      params:{
        size:10,
        current:1
      }
    };
  }
  // ============ 初始化数据 ===============

  componentWillMount() {
    // this.getDataList();
  }

  getDataList = () => {
    const {params} = this.state;
    this.setState({
      loading:true
    })
    shipperList(params).then(res=>{
      this.setState({
        loading:false
      })
      const data = res.data.records;
      // JSON.parse(row.addr_coding)
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
  handleClick = ( res) => {
    const params={
      ids: res.id
    }
    const refresh = this.getDataList;
    if(res.status === 1){
      message.error("当前为唯一默认选项 不允许删除");
    }else {
      Modal.confirm({
        title: '删除确认',
        content: '确定删除该条记录?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          shipperRemove(params).then(resp => {
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
    }
  };

  CancelOrder =(row)=>{
    const params={
      id:row.id
    }
    const refresh = this.getDataList;
    Modal.confirm({
      title: '取消下单',
      content: '确定取消下单?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        cancelCourier(params).then(resp => {
          message.success(resp.msg);
          refresh()
        });
      },
      onCancel() {},
    });

  }

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
        shipperUpdateDefaultStatus(params).then(resp=>{
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

  // 修改数据
  handleEdit = (row) => {
    const { dispatch } = this.props;
    dispatch({
      type: `globalParameters/setDetailData`,
      payload: row,
    });
    router.push('/logistics/shipper/edit');
  };

  renderLeftButton = () => (
    <>
      数据列表
    </>
  );

  renderRightButton = () => (
    <>
      <Button type="primary" icon="plus" onClick={()=>{router.push(`/logistics/shipper/add`);}}>添加</Button>
    </>
  );

  render() {
    const {
      form,
    } = this.props;
    const {data,loading} = this.state;
    const columns = [
      {
        title: '退货人姓名',
        dataIndex: 'name',
        width: 100,
      },
      {
        title: '退货人手机号',
        dataIndex: 'mobile',
        width: 150,
      },
      {
        title: '退货人地址',
        dataIndex: 'printAddr',
        width: 350,
        render: (res,key) => {
          let Areas =res + key.printAddr;
          return(
            Areas
          )
        },
        ellipsis: true,
      },
      {
        title: '退货人公司名称',
        dataIndex: 'company',
        width: 200,
        ellipsis: true,
      },
      {
        title: '下单时间',
        dataIndex: 'createTime',
        width: 150,
        render:(res)=>{
          return (
            moment(res).format('YYYY-MM-DD HH:mm:ss')
          )
        }
      },
      {
        title: '下单人',
        dataIndex: 'createBy',
        width: 100,
      },
      {
        title: '默认开关',
        dataIndex: 'status',
        width:100,
        render: (res,key) => {
          return(
            <Switch checked={res===1?true:false} onChange={() => this.onStatus(res,key)} />
          )
        },
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 200,
        render: (res,row) => {
          return(
            <div>
              <Divider type="vertical" />
              <a onClick={()=>this.handleEdit(row)}>编辑</a>
              <Divider type="vertical" />
              <a onClick={() => this.handleClick(res)}>删除</a>
              <Divider type="vertical" />
              <a onClick={() => this.CancelOrder(row)}>取消下单</a>
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
export default SenderList;
