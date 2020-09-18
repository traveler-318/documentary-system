import React, { PureComponent } from 'react';
import {
  Modal,
  Checkbox,
  Form,
  Input,
  Card,
  Row,
  Col,
  Button,
  TreeSelect,
  Select,
  DatePicker,
  message,
  Cascader,
  Radio,
  Timeline,
  Table, Divider,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import { tenantMode } from '../../../../defaultSettings';
import { getCookie } from '../../../../utils/support';
import { updateLogistics, logisticsRemind } from '../../../../services/newServices/order'
import { getDeliverySave } from '../../../../services/newServices/logistics';

const FormItem = Form.Item;
const { TextArea } = Input;


@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class Logistics extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      // 添加分组弹窗
      groupAddVisible:false,
      data:[
        {
          key:1,
          name:"测试2组"
        },{
          key:2,
          name:"测试3组"
        }
      ],
    };
  }


  componentWillMount() {
    const { globalParameters } = this.props;
  }

  handleChange = value => {
    console.log("1111")
  };

  // ======添加分组弹窗==========

  groupAdd = () =>{
    this.setState({
      groupAddVisible:true,
    })
  }

  // ======关闭弹窗==========

  handleCancelGroupAdd = () =>{
    this.setState({
      groupAddVisible:false,
    })
  }

  // ======确认==========

  handleSubmit = e => {
    e.preventDefault();
    const {  form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      console.log(values)
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      handleGroupingVisible,
      handleCancelGrouping,
    } = this.props;

    const {data,groupAddVisible} = this.state;

    const formAllItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };

    const columns=[
      {
        title: '',
        dataIndex: 'key',
        width: 50,
      },{
        title: '分组名称',
        dataIndex: 'name',
        width: 200,
      },{
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 150,
        render: (res,row) => {
          return(
            <div>
              <a onClick={()=>this.handleEdit(row)}>删除</a>
            </div>
          )
        },
      },
    ]

    // confirmTag
    return (
      <div>
        <Modal
          title="分组列表"
          visible={handleGroupingVisible}
          width={550}
          onCancel={handleCancelGrouping}
          footer={[
            <Button key="back" onClick={handleCancelGrouping}>
              取消
            </Button>,
          ]}
        >
          <div style={{height:'50px'}}>
            <Button style={{float: "right"}} type="primary" onClick={this.groupAdd}>
              添加
            </Button>
          </div>
          <Table rowKey={(record, index) => `${index}`} dataSource={data} columns={columns} />
        </Modal>
        <Modal
          title="添加分组"
          visible={groupAddVisible}
          width={550}
          onCancel={this.handleCancelGroupAdd}
          footer={[
            <Button key="back" onClick={this.handleCancelGroupAdd}>
              取消
            </Button>,
            <Button key="primary" onClick={this.handleSubmit}>
              确认
            </Button>,
          ]}
        >
          <Form style={{ marginTop: 8 }}>
            <FormItem {...formAllItemLayout} label="分组名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入分组名称',
                  },
                ],
              })(<Input placeholder="请输入分组名称" />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Logistics;
