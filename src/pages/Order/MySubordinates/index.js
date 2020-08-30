import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, Row, Table, Alert, Divider, Select  } from 'antd';
import Panel from '../../../components/Panel';
import styles from './index.less'
const FormItem = Form.Item;

@connect(({ menu, loading }) => ({
  menu,
  loading: loading.models.menu,
}))
@Form.create()
class MySubordinatesList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
          selectedRowKeys:[],
          orderStatus:[
            {name:"全部",key:null},
            {name:"待审核",key:1},
            {name:"已审核",key:2},
            {name:"已发货",key:3},
            {name:"在途中",key:4},
            {name:"已签收",key:5},
            {name:"跟进中",key:6},
            {name:"已激活",key:7}
          ]
        };
      }

    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };

    onReset=()=>{

    }

  render() {
    // const code = 'menu';

    // const {
    //   form,
    //   loading,
    //   menu: { data },
    // } = this.props;

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

    const { selectedRowKeys, orderStatus } = this.state;

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
                {getFieldDecorator('code')(
                  <Select defaultValue="lucy" style={{ width: 120 }}>
                    {orderStatus.map(item=>{
                      return (<Option value="jack">Jack</Option>)
                    })}
                  </Select>
                )}
            </Form.Item>
            <Form.Item label="订单状态">
                {getFieldDecorator('name')(<Input placeholder="请输入菜单名称" />)}
            </Form.Item>
            <Form.Item label="订单类型">
                {getFieldDecorator('name')(<Input placeholder="请输入菜单名称" />)}
            </Form.Item>
            <Form.Item label="销售">
                {getFieldDecorator('name')(<Input placeholder="请输入菜单名称" />)}
            </Form.Item>
            <Form.Item label="最后跟进">
                {getFieldDecorator('name')(<Input placeholder="请输入菜单名称" />)}
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
        <div className={styles.default_table_box}>
            <div>

            </div>
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
export default MySubordinatesList;
