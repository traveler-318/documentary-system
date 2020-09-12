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
  getAdditionalList,
  getGoodsRemove,
  getGoodsSubmit,
} from '../../../services/newServices/logistics';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@Form.create()
class AdditionalList extends PureComponent {
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
    getAdditionalList(params).then(res=>{
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
      <Button type="primary" icon="plus" onClick={()=>{router.push(`/logistics/additional/add`);}}>添加</Button>
    </>
  );

  render() {
    const {
      form,
    } = this.props;
    const {data,loading} = this.state;
    let payType;
    if (data.payType == 'SHIPPER') {
      payType ='寄方付';
    } else if(data.payType == 'CONSIGNEE'){
      payType ='到付';
    }else if(data.payType == 'MONTHLY'){
      payType ='月结';
    }else {
      payType ='第三方支付';
    }

    const columns = [
      {
        title: '支付方式',
        dataIndex: 'payType',
        width: 150,
        render: (res) => {
          return(
            payType
          )
        },
      },
      {
        title: '快递类型',
        dataIndex: 'expType',
        width: 150,
      },
      {
        title: '保价额度(元)',
        dataIndex: 'valinsPay',
        width: 150,
      },
      {
        title: '待收货款额度(元)',
        dataIndex: 'collection',
        width: 150,
      },
      {
        title: '系统标识',
        dataIndex: 'code',
        width: 150,
      },
      {
        title: '是否需要子单',
        dataIndex: 'needChild',
        width: 150,
        render: (res) => {
          return(
            <div>
              { res === 0 ? '不需要': '需要'}
            </div>
          )
        },
      },
      {
        title: '是否需要回单',
        dataIndex: 'needBack',
        width: 150,
        render: (res) => {
          return(
            <div>
              { res === 0 ? '不需要': '需要'}
            </div>
          )
        },
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
        width: 150,
        render: (res) => {
          const thisData =  JSON.stringify(res);
          return(
            <div>
              <Divider type="vertical" />
              <a onClick={()=>{router.push(`/logistics/additional/edit/${thisData}`);}}>编辑</a>
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
export default AdditionalList;
