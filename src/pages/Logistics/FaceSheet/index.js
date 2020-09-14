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
  getSurfacesingleList,
  getSurfacesingleRemove,
  getSurfacesingleSubmit,
} from '../../../services/newServices/logistics';
import { TEMPID ,EXPRESS100DATA } from './data.js';
import styles from './index.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class FaceSheetList extends PureComponent {
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
    this.getDataList();
  }

  getDataList = () => {
    const {params} = this.state;
    this.setState({
      loading:true
    })
    getSurfacesingleList(params).then(res=>{
      this.setState({
        loading:false
      })

      const data = res.data.records;

      for(let i=0; i<data.length; i++){
        data[i].index = i+1;
        for(let j=0; j<EXPRESS100DATA.length; j++){
          if(EXPRESS100DATA[j].num === data[i].kuaidicom){
            data[i].kuaidicom_value = EXPRESS100DATA[j].name;
            break;
          }
        }
        for(let s=0; s< TEMPID.length; s++){
          if(data[i].tempid  === TEMPID[s].id){
            data[i].tempid_value = TEMPID[s].value
          }
        }
        data[i].online_value = data[i].online === '0' ? '离线' : '在线';
      }


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
        getSurfacesingleRemove(params).then(resp => {
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
        getSurfacesingleSubmit(params).then(resp=>{
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

    router.push('/logistics/faceSheet/edit');
  };

  renderLeftButton = () => (
    <>
      数据列表
    </>
  );

  renderRightButton = () => (
    <>
      <Button type="primary" icon="plus" onClick={()=>{router.push(`/logistics/faceSheet/add`);}}>添加</Button>
    </>
  );

  render() {
    const {
      form,
    } = this.props;
    const {data,loading} = this.state;
    const columns = [
      {
        title: '快递公司编码',
        dataIndex: 'kuaidicom_value',
        width: 200,
      },
      {
        title: '打印设备码',
        dataIndex: 'siid',
        width: 300,
      },
      {
        title: '快递模板ID',
        dataIndex: 'tempid_value',
        width: 200,
      },
      {
        title: '宽',
        dataIndex: 'width',
        width: 150,
      },
      {
        title: '高',
        dataIndex: 'height',
        width: 150,
      },
      {
        title: '打印设备名称',
        dataIndex: 'comment',
        width: 200,
      },
      {
        title: '打印设备状态',
        dataIndex: 'online_value',
        width: 200,
        render: (res) => {
          return(
            <div>
              <span className={styles.statue} style={res === '离线' ? {background:"#dcdfe6"}:{background:"#67C23A"}}></span>{res}
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
export default FaceSheetList;
