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
import { Resizable } from 'react-resizable';
import router from 'umi/router';
import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';
import {
  getProductattributeList,
  getProductattributeRemove,
  getProductattributeUpdate
} from '../../../services/newServices/product';
import Add from './components/add'
import Edit from './components/edit'
import EditAddress from './components/editAddress'
import moment from 'moment';
import Img from './components/Img'
import ParentProduct from './components/parentProduct'
import AuthorizedCompanyPage from './components/companyPage'
import styles from './index.less';


const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const ResizeableTitle = props => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};



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
      columns: [
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
          title: '页面标题',
          dataIndex: 'h5Title',
          width: 200,
        },
        {
          title: '页面背景',
          dataIndex: 'h5Background',
          width: 100,
          render: (res,row) => {
            return(
              <div>
                {
                  res === '' ?
                    (res)
                    :(<a onClick={()=>this.handleImg(row)}>查看</a>)
                }
              </div>
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
        // {
        //   title: '结算价',
        //   dataIndex: 'settlePrice',
        //   width: 150,
        // },
        // {
        //   title: '自定义1',
        //   dataIndex: 'customOne',
        //   width: 150,
        // },
        // {
        //   title: '自定义2',
        //   dataIndex: 'customTwo',
        //   width: 150,
        // },
        // {
        //   title: '自定义3',
        //   dataIndex: 'customThree',
        //   width: 150,
        // },
        // {
        //   title: '允许代理',
        //   dataIndex: 'openAuthorization',
        //   width: 120,
        //   render: (key,row)=>{
        //     return (
        //       <Switch checkedChildren="是" unCheckedChildren="否" checked={key === 1} onChange={(checked)=>this.authorizationChange(checked,row)}/>
        //     )
        //   }
        // },
        // {
        //   title: '代理产品',
        //   dataIndex: 'agentProducts',
        //   width: 120,
        //   render: (key,row)=>{
        //     return (
        //       <div>
        //         {
        //           key === 1 ? "是":"否"
        //         }
        //       </div>
        //     )
        //   }
        // },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 200,
          render: (res) => {
            return(
              <div>
                {
                  res === '' ?
                    (res)
                    :(moment(res).format('YYYY-MM-DD HH:mm:ss'))
                }
              </div>
            )
          },
        },
        {
          title: '操作',
          key: 'operation',
          fixed: 'right',
          width: 80,
          render: (res,row) => {
            return(
              <div>
                {/* <Divider type="vertical" /> */}
                {row.agentProducts == 1 ?<a onClick={()=>this.handleEditAddress(row)}>修改地址</a>:(
                  <a onClick={()=>this.handleEdit(row)}>修改</a>
                )}

                {/* <Divider type="vertical" />
                <a onClick={()=>this.handleClick(row)}>删除</a> */}
              </div>
            )
          },
        },
      ],
      params:{
        size:10,
        current:1
      },
      groupingList:[],
      handleAddVisible:false,
      details:{},
      handleEditVisible:false,
      handleEditAddressVisible:false,
      handleImgDetailsVisible:false,

      isCompany:false,//是否打开代理公司
      handleProductVisible:false,//代理产品
      handleProductParams:{},
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

  authorizationChange(checked,row){
    row.openAuthorization = checked? 1:0;
    getProductattributeUpdate({
      id:row.id,
      openAuthorization:checked? 1:0
    }).then(res=>{
      if(res.code === 200){
        message.success(res.msg);
        this.getDataList()
      }
    })
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

  handleEditAddress = (row) => {
    this.setState({
      handleEditAddressVisible:true,
      details:row
    })
  }

  handleCancelEditAddress = () => {
    this.setState({
      handleEditAddressVisible:false
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

  //打开代理公司
  openCompany =() =>{
    this.setState({
      isCompany:true
    })
  }

  cancelCompany = () =>{
    this.setState({
      isCompany:false
    })
  }

  //打开产品代理弹框
  openProduct = (json) => {
    console.log(json)
    this.setState({
      handleProductVisible:true,
      handleProductParams:{
        authorizationTenantId: json.authorizationTenantId,
        authorizationProductidId:json.authorizationProductidId
      }
    })
  }
  cancelProduct = () =>{
    this.setState({
      handleProductVisible:false
    })
  }
  handleOkProduct = () =>{
    this.cancelCompany();
    this.cancelProduct();
    this.getDataList()
  }

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
          <Button onClick={()=>this.openCompany()}>代理产品</Button>
          <Button type="primary" onClick={()=>this.handleAdd()}>添加</Button>
        </div>
    )
  };

  // 图片弹框
  handleImg = (row) => {
    console.log(row)
    this.setState({
      handleImgDetailsVisible:true,
      ImgDetails:row.h5Background
    })
  }

  handleCancelImgDetails = () => {
    this.setState({
      handleImgDetailsVisible:false
    })
  }

  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

  components = {
    header: {
      cell: ResizeableTitle,
    },
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
      handleEditAddressVisible,
      handleImgDetailsVisible,
      handleProductVisible,
      handleProductParams,
      details,
      ImgDetails,
      isCompany,
      handleCancelEdit
    } = this.state;


    const columns = this.state.columns.map((col, index) => ({
      ...col,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));

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
          tblProps={
            {components:this.components}
          }
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
        {/* 修改地址 */}
        {handleEditAddressVisible?(
          <EditAddress
            handleEditVisible={handleEditAddressVisible}
            details={details}
            handleCancelEdit={this.handleCancelEditAddress}
          />
        ):""}

        {/* 查看图片 */}
        {handleImgDetailsVisible?(
          <Img
            handleImgDetailsVisible={handleImgDetailsVisible}
            ImgDetails={ImgDetails}
            handleCancelImgDetails={this.handleCancelImgDetails}
          />
        ):""}

        {handleProductVisible?(
          <ParentProduct visible={handleProductVisible}
                         handleProductParams={handleProductParams}
                         handleCancelProduct={this.cancelProduct}
                         handleOkProduct={this.handleOkProduct}
                         handleImg={(row)=>this.handleImg(row)}/>
        ):''}

        {isCompany ? (<AuthorizedCompanyPage isVisible={isCompany} handleCancelCompany={this.cancelCompany} handleOkCompany={this.openProduct}/>):''}
      </Panel>
    );
  }
}
export default ProductManagement;
