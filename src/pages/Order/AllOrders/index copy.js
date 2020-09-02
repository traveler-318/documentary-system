import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, Row, Table, Alert, Divider, Select , DatePicker } from 'antd';
import Panel from '../../../components/Panel';
import styles from './index.less'
import {getSalesmanList} from '../../../services/newServices/order'

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

import {ORDERSTATUS, ORDERTYPPE} from './data.js'

@connect(({ menu, loading }) => ({
  menu,
  loading: loading.models.menu,
}))
@Form.create()
class AllOrdersList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
          selectedRowKeys:[],
          salesmanList:[
            {name:"业务员1",id:"1"}
          ]
        };
      }

    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };

    onReset=()=>{

    }

    componentDidMount (){
      // getSalesmanList().then(res=>{

      // })
    }

  render() {

    let dataSource = [
        {
            name:"姓名",
            name0:"姓名",
            name1:"姓名",
            name2:"姓名",
            name3:"姓名",
            name4:"姓名",
            name5:"姓名",
            name6:"姓名",
            name7:"姓名",
            name8:"姓名",
            name9:"姓名",
            name10:"姓名",
            name11:"姓名",
            name12:"姓名"
        }
    ]
    
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '手机号',
        dataIndex: 'name12',
        width: 200,
      },
      {
        title: '收货地址',
        dataIndex: 'name11',
        width: 200,
      },
      {
        title: '产品分类',
        dataIndex: 'name10',
        width: 200,
      },
      {
        title: '产品型号',
        dataIndex: 'name9',
        width: 200,
      },
      {
        title: '序列号',
        dataIndex: 'name8',
        width: 200,
      },
      {
        title: '订单状态',
        dataIndex: 'name7',
        width: 200,
      },
      {
        title: '订单类型',
        dataIndex: 'name6',
        width: 200,
      },
      {
        title: '订单来源',
        dataIndex: 'name5',
        width: 200,
      },
      {
        title: '销售',
        dataIndex: 'name4',
        width: 200,
      },
      {
        title: '快递公司',
        dataIndex: 'name3',
        width: 200,
      },
      {
        title: '快递单号',
        dataIndex: 'name2',
        width: 200,
      },
      {
        title: '下单时间',
        dataIndex: 'name1',
        width: 200,
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 300,
        render: () => {
            return(
                <div>
                    <a>审核</a>
                    <Divider type="vertical" />
                    <a>跟进</a>
                    <Divider type="vertical" />
                    <a>编辑</a>
                    <Divider type="vertical" />
                    <a>置顶</a>
                    <Divider type="vertical" />
                    <a>归档</a>
                    <Divider type="vertical" />
                    <a>删除</a>
                </div>
            )
        },
      },
    ];

    const { selectedRowKeys, salesmanList } = this.state;

    const rowSelection = {
        selectedRowKeys,
        onChange: this.onSelectChange,
    };

    const {
        form: { getFieldDecorator },
      } = this.props;

    return (
      <Panel>
        <div className={styles.default_table_serch_box}>
            <Form layout="inline">
              <Form.Item label="关键词">
                {getFieldDecorator('name')(<Input placeholder="请输入关键词" />)}
              </Form.Item>
              <Form.Item label="订单状态">
                {getFieldDecorator('code')(
                  <Select defaultValue={null} style={{ width: 120 }}>
                    {ORDERSTATUS.map(item=>{
                      return (<Option value={item.key}>{item.name}</Option>)
                    })}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="订单类型">
                  {getFieldDecorator('code')(
                    <Select defaultValue={null} style={{ width: 120 }}>
                      {ORDERTYPPE.map(item=>{
                        return (<Option value={item.key}>{item.name}</Option>)
                      })}
                    </Select>
                  )}
              </Form.Item>
              <Form.Item label="销售">
                {getFieldDecorator('code')(
                    <Select defaultValue={null} style={{ width: 120 }}>
                      {salesmanList.map(item=>{
                        return (<Option value={item.id}>{item.name}</Option>)
                      })}
                    </Select>
                  )}
              </Form.Item>
              <Form.Item label="最后跟进">
                <RangePicker size={"default"} />
              </Form.Item>
            </Form>
            
            <div style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit">
              查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.onReset}>
              重置
              </Button>
          </div>
          </div>
        
        
        <div className={styles.default_operation_box}>
        <Button type="primary" icon="plus" size="small">添加</Button>
        <Divider type="vertical" />
        <Button icon="download" size="small">导入</Button>
        <Divider type="vertical" />
        <Button icon="upload" size="small">导出</Button>

        <Divider type="vertical" />
        <Button icon="menu-unfold" size="small">批量审核</Button>
        <Divider type="vertical" />
        <Button icon="appstore" size="small">批量发货</Button>
        <Divider type="vertical" />
        <Button icon="bell" size="small">批量提醒</Button>
        <Divider type="vertical" />
        <Button icon="loading-3-quarters" size="small">转移客户</Button>

        <Divider type="vertical" />
        <Button icon="highlight" size="small">批量编辑</Button>
        <Divider type="vertical" />
        <Button icon="delete" size="small">批量删除</Button>

        <Divider type="vertical" />
        <Button icon="ordered-list" size="small">排序</Button>
        <Divider type="vertical" />
        <Button icon="unordered-list" size="small">列表</Button>
        </div>
        <div className={styles.default_table_box}>
          <Table 
            columns={columns} 
            scroll={{ x: 1000 }} 
            dataSource={dataSource}
            rowSelection={rowSelection}
            bordered
           />
        </div>
      </Panel>
    );
  }
}
export default AllOrdersList;
