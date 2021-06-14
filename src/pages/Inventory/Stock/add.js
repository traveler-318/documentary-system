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
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.select.focus();
      }
    });
  };

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

  renderCell = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { children, dataIndex, record, title } = this.props;

    // payPanyName: "支付宝"
    // productName: "123"
    // productTypeName: "传统POS"
    return (
      <>
        {dataIndex === "productName" ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `${title} is required.`,
                },
              ],
              initialValue: record[dataIndex],
            })(<Select style={{width:"150px"}} placeholder="">
              {global.DataList.map((item,index) =>{
                return (<Option key={index || 0} value={item.id}>{item.payPanyName}</Option>)
              })}
            </Select>)}
          </Form.Item>
        ):""}
        {dataIndex === "stock" ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `${title} is required.`,
                },
              ],
              initialValue: record[dataIndex],
            })(<Input ref={node => (this.input = node)} />)}
          </Form.Item>
        ):""}
        {dataIndex === "snStart" ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `${title} is required.`,
                },
              ],
              initialValue: record[dataIndex],
            })(<Input ref={node => (this.input = node)} />)}
          </Form.Item>
        ):""}
        {dataIndex === "snEnd" ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `${title} is required.`,
                },
              ],
              initialValue: record[dataIndex],
            })(<Input ref={node => (this.input = node)} />)}
          </Form.Item>
        ):""}
        {dataIndex === "number" ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `${title} is required.`,
                },
              ],
              initialValue: record[dataIndex],
            })(<Input ref={node => (this.input = node)} />)}
          </Form.Item>
        ):""}

      </>
    )
  };

  render() {
    const {
      editable,
      children,
      title,
      ...restProps
    } = this.props;

    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{()=>this.renderCell()}</EditableContext.Consumer>
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
      params:{
        size:100,
        current:1
      },
      dataSource: [
        {
          key: '0',
          productName: 'Edward King 0',
          stock: '台',
          snStart: '0',
          snEnd:'0',
          number:'0',
          mode:1
        }
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
          editable: true,
        },
        {
          title: 'SN结束',
          dataIndex: 'snEnd',
          width: 150,
          editable: true,
        },
        {
          title: '生成数量',
          dataIndex: 'number',
          width: 100,
          editable: true,
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
    this.getDataList()
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
    getProductattributeList(params).then(res=>{
      global.DataList=res.data.records
    })
    this.forceUpdate();//页面重新渲染数据
  }

  onChange = value => {

  };


  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      productName: ``,
      stock: '台',
      snStart: '0',
      snEnd:'0',
      number:'0',
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
    const {stockVisible,handleStockVisibleCancel} = this.props;

    const {dataSource,columns }=this.state


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
      <Button type="primary" onClick={this.handleSubmit}>提交</Button>
    );
    return (
      <Modal
        title="新增"
        visible={stockVisible}
        width={1290}
        onCancel={handleStockVisibleCancel}
        footer={null}
        bodyStyle={{paddingTop:0}}
        maskClosable={false}
        style={{
          top:40
        }}
      >
        <div style={{ marginTop: 8,minHeight:"400px",background: "#fff"}}>
          <Button style={{ margin: 8}} type="primary" icon='plus' onClick={()=>this.handleAdd()}>新增产品</Button>
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

      </Modal>

    );
  }
}

export default FaceSheetAdd;
