import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import ReactDOM from 'react-dom'
import {
  Form,
  Input,
  Upload,
  Button,
  message,
  Icon,
  Card,
  Radio,
  Row,
  Col,
  Select,
  Tag,
  Table, 
  Popconfirm,
} from 'antd';
import { getUserInfo, updateInfo,getTenantInfo } from '../../../services/user';
import { getToken } from '../../../utils/authority';

import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

@Form.create()
class EditableCell extends Component {
  state = {
    data: '',
    editing: true,
    colorList:[
        {
            title:'浅蓝',
            color:"#40A9FF",
        },
        {
            title:'湖蓝',
            color:"#36CFC9",
        },
        {
            title:'绿色',
            color:"#73D13D",
        },
        {
            title:'黄色',
            color:"#FBD444",
        },
        {
            title:'红色',
            color:"#FF4D4F",
        },
        {
            title:'紫色',
            color:"#9254DE",
        },
        {
            title:'蓝色',
            color:"#2F54EB",
        },
        {
            title:'橙色',
            color:"#FA8C16",
        },
    ]
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      console.log(record,values,this.state.dataSource,"数据")
    //   this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing, colorList } = this.state;

console.log(children, dataIndex, record, title ,"record")
    if(dataIndex === 'age'){
        return editing ? (
            <Form.Item style={{ margin: 0 }}>
              {form.getFieldDecorator(dataIndex, {
                rules: [
                  {
                    required: true,
                    message: `请选择颜色`,
                  },
                ],
                initialValue: record[dataIndex],
                getValueFromEvent: (args)=>{
                    console.log(args,"argsargsargs")
                    
                    setTimeout(()=>{
                        this.save({
                            currentTarget:{
                                id:dataIndex
                            }
                        })
                    },1000)
                    return args
                }
              })(<Select 
                    // onChange={this.save}
                >
                  {
                    colorList.map(item=>{
                        return(
                            <Option value={item.color}>
                                <span style={{
                                    display:'inline-block',
                                    width:"10px",
                                    height:'10px',
                                    marginRight: 5,
                                    background:item.color,
                                    borderRadius: '50%'
                                }}></span>
                                {item.title}
                            </Option>
                        )
                    })
                  }
                  
              </Select>)}
            </Form.Item>
          ) : (
            <div
              className="editable-cell-value-wrap"
              style={{ paddingRight: 24 }}
              onClick={this.toggleEdit}
            >
              {children}
            </div>
          );
    }else{
        return editing ? (
            <Form.Item style={{ margin: 0 }}>
              {form.getFieldDecorator(dataIndex, {
                rules: [
                  {
                    required: true,
                    message: `请输入标签名称`,
                  },
                ],
                initialValue: record[dataIndex],
              })(<Input 
                  ref={node => (this.input = node)} 
                  onPressEnter={this.save} 
                  onBlur={this.save}
              />)}
            </Form.Item>
          ) : (
            <div
              className="editable-cell-value-wrap"
              style={{ paddingRight: 24 }}
              onClick={this.toggleEdit}
            >
              {children}
            </div>
          );
    }

    
  };

  render() {
    const {
        editable,
        dataIndex,
        title,
        record,
        index,
        handleSave,
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
// export default BaseView;


class EditableTable extends React.Component {
    constructor(props) {
      super(props);
      this.columns = [
        {
            title: '等级',
            dataIndex: 'name',
            width: '40%',
            editable: true,
        },
        {
            title: '颜色',
            dataIndex: 'age',
            width: '40%',
            editable: true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record, index) =>{
                console.log(this.state.dataSource,index)
                if(this.state.dataSource.length < 1){
                    return null
                }
                if(index+1 === this.state.dataSource.length){
                    return (
                        <a onClick={this.handleAdd}>添加</a>
                    )
                }else{
                    return (
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                            <a>删除</a>
                        </Popconfirm>
                    )
                }
            }
        },
      ];
  
      this.state = {
        dataSource: [
          {
            key: '0',
            name: 'Edward King 0',
            age: '#36CFC9',
            address: 'London, Park Lane no. 0',
          },
          {
            key: '1',
            name: 'Edward King 1',
            age: '#36CFC9',
            address: 'London, Park Lane no. 1',
          },
        ],
        count: 2,
      };
    }

    componentWillMount(){}
  
    handleDelete = key => {
      const dataSource = [...this.state.dataSource];
      this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
    };
  
    handleAdd = () => {
      const { count, dataSource } = this.state;
      const newData = {
        key: count,
        name: `标签 ${count}`,
        age: '#40A9FF',
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
      console.log(newData,"newData")
      this.setState({ dataSource: newData });
    };
  
    render() {
      const { dataSource } = this.state;
      const components = {
        body: {
          row: EditableFormRow,
          cell: EditableCell,
        },
      };
      const columns = this.columns.map(col => {
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
      return (
        <div style={{
            width: '500px',
            margin: '20px',
            float: 'left'
        }}>
            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                // bordered
                size="small"
                dataSource={dataSource}
                columns={columns}
                pagination={false}
            />
        </div>
      );
    }
  }
  const EditableFormTable = Form.create()(EditableTable);
  export default EditableFormTable;
//   ReactDOM.render(<EditableTable />, mountNode);