import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Button,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  Divider,
  Icon,
  Radio,
  Modal,
  message,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';
import {
  warehouseList,
  warehouseSave
} from '../../../services/newServices/inventory';
import { getCookie } from '../../../utils/support';
import Add from './add';

const FormItem = Form.Item;
const { TextArea } = Input;
@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class WarehouseList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data:[],
      loading:false,
      params:{
        size:10,
        current:1
      },
      warehouseStatus:[
        {
          id:0,
          name:'禁用'
        },{
          id:1,
          name:'启用'
        }
      ],
      warehouseVisible:false
    };
  }
  // ============ 初始化数据 ===============

  componentWillMount() {

  }

  getDataList = () => {
    const {params} = this.state;
    this.setState({
      loading:true
    })
    warehouseList(params).then(res=>{
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
    this.setState({
      params
    },()=>{
      this.getDataList();
    })
  };

  handleSubmit = e => {
    e.preventDefault();
    const {  form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      values.deptId = getCookie("dept_id");
      if (!err) {
        const params = {
          ...values
        };
        warehouseSave(params).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
          }
        })
      }
    });
  };

  // ============ 查询表单 ===============

  renderSearchForm = onReset => {
    const {
      form,
    } = this.props;
    const { getFieldDecorator } = form;
    const {warehouseStatus}=this.state
    return (
      <div className={"default_search_form"}>
        <Form.Item label="仓库名称">
          {getFieldDecorator('platformReplyStatus', {
          })(
            <Input placeholder="请输入仓库名称" />
          )}
        </Form.Item>
        <Form.Item label="仓库状态">
          {getFieldDecorator('complaintsType', {
          })(
            <Select placeholder={"请选择仓库状态"} style={{ width: 200 }}>
              {warehouseStatus.map((item,index)=>{
                return (<Option key={index} value={item.id}>{item.name}</Option>)
              })}
            </Select>
          )}
        </Form.Item>
        <div style={{ float: 'right',height:'32px' }}>
          <Button type="primary" htmlType="submit">
            <FormattedMessage id="button.search.name" />
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={()=>{
            // this.getSalesman();
            onReset()
          }}>
            <FormattedMessage id="button.reset.name" />
          </Button>
        </div>
      </div>
    );
  };

  // ============ 新增弹框 ===============
  handleClick = () => {
    this.setState({
      warehouseVisible:true
    })
  };

  handleCancelWarehouse = () => {
    this.setState({
      warehouseVisible:false
    })
  };


  // 修改数据
  handleEdit = (row) => {

  };

  renderLeftButton = () => (
    <>
      <Button type="primary" icon='plus' onClick={()=>{this.handleClick()}}>添加</Button>
    </>
  );

  renderRightButton = () => (
    <>

    </>
  );

  render() {
    const {
      form,
    } = this.props;

    const { getFieldDecorator } = form;

    const formAllItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };
    const {data,loading,warehouseVisible} = this.state;
    const columns = [
      {
        title: '仓库名称',
        dataIndex: 'warehouseName',
        width: 250,
      },
      {
        title: '仓库位置',
        dataIndex: 'warehousePosition',
        width: 200,
      },
      {
        title: '创建人',
        dataIndex: 'createBy',
        width: 150,
        ellipsis: true,
      },
      {
        title: '状态',
        dataIndex: 'warehouseStauts',
        width: 200,
        ellipsis: true,
        render: (res) => {
          let status=''
          if(res === 0){
            status="禁用"
          }
          if(res === 1){
            status="启用"
          }
          return(
            status
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
              <a>停用</a>
              <Divider type="vertical" />
              <a>删除</a>
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

        {/* 新增 */}
        {warehouseVisible?(
          <Add
            warehouseVisible={warehouseVisible}
            handleCancelWarehouse={this.handleCancelWarehouse}
          />
        ):""}
      </Panel>
    );
  }
}
export default WarehouseList;
