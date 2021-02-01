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
  Alert
} from 'antd';
import { getLabel, addLabel, removeLabel, updateLabel } from '../../../services/user';
import { getToken } from '../../../utils/authority';

import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const EditableContext = React.createContext();

// const EditableRow = ({ form, index, ...props }) => (
//   <EditableContext.Provider value={form}>
//     <tr {...props} />
//   </EditableContext.Provider>
// );

// const EditableFormRow = Form.create()(EditableRow);

@Form.create()
class EditableCell extends Component {
  state = {
    data: '',
    editing: false,
    editingKey: '',
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
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;

    const {colorList} = this.state;

    if(dataIndex === 'color'){
      return (
        <td {...restProps}>
          {editing ? (
            <Form.Item style={{ margin: 0 }}>
              {getFieldDecorator(dataIndex, {
                rules: [
                  {
                    required: true,
                    message: `请选择颜色`,
                  },
                ],
                initialValue: record[dataIndex],
                // getValueFromEvent: (color)=>{
                //     console.log(color,"argsargsargs")
                //     this.save(record,color,'color')
                //     return color
                // }
              })(<Select>
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
            <div>
              <span style={{
                display:'inline-block',
                width:"10px",
                height:'10px',
                marginRight: 5,
                background:record[dataIndex],
                borderRadius: '50%'
              }}></span>
              {colorList.map(item=>{
                if(record[dataIndex] === item.color){
                  return item.title
                }
              })}
            </div>
          )}
        </td>
      );
    }else{
      return (
        <td {...restProps}>
          {editing ? (
            <Form.Item style={{ margin: 0 }}>
              {getFieldDecorator(dataIndex, {
                rules: [
                  {
                    required: true,
                    message: `请输入标签名称`,
                  },
                ],
                initialValue: record[dataIndex],
              })(this.getInput())}
            </Form.Item>
          ) : (
            children
          )}
        </td>
      );
    }
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data : [], editingKey: '' };
    this.columns = [
      {
        title: '标签',
        dataIndex: 'labelName',
        width: '45%',
        editable: true,
    },
    {
        title: '颜色',
        dataIndex: 'color',
        width: '30%',
        editable: true,
    },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record, index) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);

          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() => this.save(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    保存
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="是否取消您的修改？" onConfirm={() => this.cancel(record.key)}>
                <a>取消</a>
              </Popconfirm>
            </span>
          ) : (
            <>
              <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)} style={{ marginRight: 8 }}>
                修改
              </a>
              <Popconfirm style={{ marginRight: 8 }} title="确定删除吗?" onConfirm={() => this.removeLabelData(record.key)}>
                <a>删除</a>
              </Popconfirm>
              {
                index+1 === this.state.data.length ? (
                  <a style={{marginLeft:5}} onClick={this.handleAdd}>添加</a>
                ) :""
              }
              
            </>
          );
        },
      },
    ];
  }

  handleAdd = () => {
    const { data } = this.state;
    const newData = {
      // key: count,
      labelName: `标签 名称`,
      color: '#40A9FF',
      key:'xz'
    };
    // this.addLabellData({
    //   labelName: `标签 名称`,
    //   color: '#40A9FF',
    // })
    this.setState({
      data: [...data, newData],
      editingKey: 'xz'
      // count: count + 1,
    });
  };

  addLabellData = (param) =>{
    param.labelType = 0;
    addLabel([param]).then(res=>{
      this.getLabelList()
    })
  }

  removeLabelData = (id) =>{
    removeLabel(id).then(res=>{
      this.getLabelList()
    })
  }

  componentWillMount(){
    this.getLabelList()
  }

  getLabelList = () =>{
    getLabel({
      "current": 1,
      "size": 100,
    }).then(res=>{
      let _data = res.data.records.map(item=>{
        item.key = item.id
        return item
      })
      
      this.setState({
        data:_data,
        editingKey: ''
      })
    })
  }

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    const { data } = this.state;
    let _data = []
    data.map(item=>{
      if(item.key != 'xz'){
        _data.push(item)
      }
    })
    this.setState({ editingKey: '' , data: _data});
  };

  updateLabelDate = (param) => {
    updateLabel(param).then(res=>{
      if(res.code != 200){
        this.getLabelList();
        message.error(res.msg)
      }else{
        this.getLabelList();
        message.success(res.msg)
      }
    })
  }

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      const item = newData[index];
      
      // this.updateLabelDate(param);
      if(key != 'xz'){
        this.updateLabelDate({
          ...row,
          id:key,
          labelType:0
        });
      }else{
        this.addLabellData({
          ...row,
          labelType:0
        })
      }
      
        console.log(row,"itemitemitemitem")
      // if (index > -1) {
        

        // newData.splice(index, 1, {
        //   ...item,
        //   ...row,
        // });


        // this.setState({ data: newData, editingKey: '' });
      // } else {
        // newData.push(row);
        // this.setState({ data: newData, editingKey: '' });
      // }
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const {data} = this.state;

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <div style={{
          width: '500px',
          margin: '20px',
          float: 'left'
      }}>
        {data.length <=0 ? (<Button style={{marginBottom:10}} onClick={this.handleAdd}>新增标签</Button>):""}
        <EditableContext.Provider value={this.props.form}>
          <Table
            components={components}
            // bordered
            size="small"
            dataSource={data}
            columns={columns}
            rowClassName="editable-row"
            pagination={
              false
            //   {
            //   onChange: this.cancel,
            // }
          }
          />
        </EditableContext.Provider>
      </div>
    );
  }
}

// const EditableFormTable = Form.create()(EditableTable);

// ReactDOM.render(<EditableFormTable />, mountNode);


  const EditableFormTable = Form.create()(EditableTable);
  export default EditableFormTable;
//   ReactDOM.render(<EditableTable />, mountNode);