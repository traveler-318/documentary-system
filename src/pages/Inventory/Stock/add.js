import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  Card,
  Row,
  Col,
  Button,
  Radio,
  TreeSelect,
  Select,
  DatePicker,
  message,
  Modal,
  Table, Divider,
} from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import func from '../../../utils/Func';
import { getCookie } from '../../../utils/support';
import { getSurfacesingleSave } from '../../../services/newServices/logistics';
import router from 'umi/router';
import { getProductattributeList } from '../../../services/newServices/product';

const FormItem = Form.Item;
const { Option } = Select;

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);
@Form.create()

class EditableCell extends React.Component {
  state = {
    editing: false,
    data:{
      list:[
        {
          name:'1',
        },{
          name:'2',
        }
      ]
    },
    params:{
      size:100,
      current:1
    },
  };

  componentWillMount() {
    this.getDataList()
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.select.focus();
      }
    });
  };

  // 获取产品列表
  getDataList = () => {
    const {params} = this.state;
    getProductattributeList(params).then(res=>{
      this.setState({
        data:{
          list:res.data.records,
        }
      })
    })
  }

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const {data}=this.state
    return (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Select placeholder="">
          {data.list.map((item,index) =>{
            return (<Option key={index || 0} value={item.name}>{item.name}</Option>)
          })}
        </Select>)}
      </Form.Item>
    )
  };

  render() {
    const {
      editable,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

class FaceSheetAdd extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:{
        list:[
          {
            name:'1',
          },{
            name:'2',
          }
        ]
      },
      params:{
        size:100,
        current:1
      },
      pagination:{},
      loading:false,
      addProduct:false,
      handleAdd:false,
      dataSource: [
        {
          key: '0',
          productName: 'Edward King 0',
          stock: '32',
          snStart: '1',
          snEnd:'2',
          number:'20',
          mode:1
        },{
          key: '1',
          productName: 'Edward King 0',
          stock: '32',
          snStart: '1',
          snEnd:'2',
          number:'20',
          mode:2
        },
      ],
      count: 2,
      columns:[
        {
          title: '商品名称',
          dataIndex: 'productName',
          width: 150,
          editable: true,
        },
        {
          title: '库存单位',
          dataIndex: 'stock',
          width: 100,
          editable: true,
        },
        {
          title: 'SN开始',
          dataIndex: 'snStart',
          width: 150,
        },
        {
          title: 'SN结束',
          dataIndex: 'snEnd',
          width: 150,
        },
        {
          title: '生成数量',
          dataIndex: 'number',
          width: 100,
        },
        {
          title: '生成方式',
          dataIndex: 'mode',
          width: 150,
          render: (res) => {
            return (
              <Radio.Group onChange={this.onChange} value={res}>
                <Radio value={1}>生成</Radio>
                <Radio value={2}>导入</Radio>
              </Radio.Group>
            )
          }
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
                <a>导入SN</a>
                <Divider type="vertical" />
                <a>删除</a>
              </div>
            )
          },
        },
      ]
    };
  }

  componentWillMount() {

  }

  // ============ 提交 ===============

  handleSubmit = e => {
    e.preventDefault();
    const {  form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      values.deptId = getCookie("dept_id");
      console.log(values)
      if (!err) {
        const params = {
          ...values,
        };
        getSurfacesingleSave(params).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            router.push('/logistics/faceSheet');
          }else {
            message.error(res.msg);
          }
        })
      }
    });
  };

  // 获取产品列表
  getDataList = () => {
    const {params} = this.state;
    this.setState({
      loading:true
    })
    getProductattributeList(params).then(res=>{
      this.setState({
        data:{
          list:res.data.records,
        },
        pagination:{
          current: res.data.current,
          pageSize: res.data.size,
          total: res.data.total
        },
        loading:false,
        selectedRowKeys: [],
        selectedRows: [],
      })
    })
  }

  onChange = value => {

  };

  // handleAdd =()=>{
  //   this.getDataList()
  //   this.setState({
  //     addProduct:true
  //   })
  // }

  handleCancelWarehouse = () => {
    this.setState({
      addProduct:false
    })
  };


  handleCancelProduct = () => {
    this.setState({
      handleAdd:false
    })
  };

  handleProduct =()=>{
    const {selectedRows}=this.state;

    if(selectedRows.length > 1 ){
      message.error("只能选择一个产品")
      return false;
    }
    this.setState({
      handleAdd:true
    })


  }

  onSelectChange =(selectedRowKeys,selectedRows) =>{
    this.setState({
      selectedRowKeys:selectedRowKeys,
      selectedRows:selectedRows
    });
  }


  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      productName: `Edward King ${count}`,
      stock: '32',
      snStart: '1',
      snEnd:'2',
      number:'20',
      mode:1
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  };


  render() {
    // const {
    //   form: { getFieldDecorator },
    // } = this.props;

    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };

    const {data,addProduct,selectedRowKeys,handleAdd,selectedRows,dataSource,columns }=this.state

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const colu = columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });

    const action = (
      <Button type="primary" onClick={this.handleSubmit}>
        提交
      </Button>
    );

    // const columns = [
    //   {
    //     title: '商品名称',
    //     dataIndex: 'productName',
    //     width: 200,
    //   },
    //   {
    //     title: '库存单位',
    //     dataIndex: 'productTypeName',
    //     width: 200,
    //   },
    //   {
    //     title: 'SN开始',
    //     dataIndex: 'payPanyName',
    //     width: 300,
    //   },
    //   {
    //     title: 'SN结束',
    //     dataIndex: 'payPanyName',
    //     width: 300,
    //   },
    //   {
    //     title: '生成数量',
    //     dataIndex: 'payPanyName',
    //     width: 300,
    //   },
    //   {
    //     title: '生成方式',
    //     dataIndex: 'payPanyName',
    //     width: 300,
    //   },
    //   {
    //     title: '操作',
    //     key: 'operation',
    //     fixed: 'right',
    //     width: 200,
    //     render: (res,row) => {
    //       return(
    //         <div>
    //           <Divider type="vertical" />
    //           <a>导入SN</a>
    //           <Divider type="vertical" />
    //           <a>删除</a>
    //         </div>
    //       )
    //     },
    //   },
    // ]

    const columns1 = [
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
    ]

    return (
      <Panel title="新增" back="/inventory/stock" action={action}>
        <div style={{ marginTop: 8,minHeight:"400px",background: "#fff"}}>
          <Button style={{ margin: 8}} type="primary" icon='plus' onClick={()=>this.handleAdd()}>选择产品</Button>
          {/*<Table columns={columns} dataSource={selectedRows} pagination={false} />*/}
          <Table
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={dataSource}
            columns={colu}
            pagination={false}
            style={{ margin: 20}}
          />
        </div>


        <Modal
          title="选择产品"
          visible={addProduct}
          maskClosable={false}
          destroyOnClose
          width={600}
          onCancel={this.handleCancelWarehouse}
          footer={[
            <Button key="back" onClick={this.handleCancelWarehouse}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={()=>this.handleProduct()}>
              下一步
            </Button>,
          ]}
        >
          <Table columns={columns1} rowSelection={rowSelection} dataSource={data.list} pagination={false}/>
        </Modal>

{/*
        <Modal
          title="选择产品"
          visible={handleAdd}
          maskClosable={false}
          destroyOnClose
          width={500}
          onCancel={this.handleCancelProduct}
          footer={[
            <Button key="back" onClick={this.handleCancelWarehouse}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={()=>this.handleProduct()}>
              确定
            </Button>,
          ]}
        >
          <Form>
            <FormItem {...formItemLayout} label="库存单位：">
              {getFieldDecorator('stock', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input placeholder="库存单位" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="SN开始：">
              {getFieldDecorator('snStart', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input placeholder="SN开始" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="SN结束：">
              {getFieldDecorator('snEnd', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input placeholder="SN结束" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="生成数量：">
              {getFieldDecorator('number', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input placeholder="生成数量" />)}
            </FormItem>
          </Form>
        </Modal>
*/}

      </Panel>
    );
  }
}

export default FaceSheetAdd;
