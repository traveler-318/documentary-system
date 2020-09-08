import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, Row, Select, DatePicker, Divider, Dropdown, Menu, Icon } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';
import { ORDER_LIST } from '../../../actions/order';
import func from '../../../utils/Func';
import {ORDERSTATUS, ORDERTYPPE} from './data.js'

import {getList} from '../../../services/newServices/order'

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(({ notice, loading }) => ({
  notice,
  loading: loading.models.notice,
}))
@Form.create()
class AllOrdersList extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys:[],
      salesmanList:[
        {name:"业务员1",id:"1"}
      ],
      data:{},
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
    const {params} = this.state
    getList(params).then(res=>{
      this.setState({
        data:{
          list:res.data.records,
          pagination:{
            total:res.data.total,
            current:res.data.current,
            pageSize:res.data.size,
          }
        }
      })
    })
  }

  // ============ 查询 ===============
  handleSearch = params => {
    const { dispatch } = this.props;

    const { dateRange } = params;
    let payload = {
      ...params,
    };
    if (dateRange) {
      payload = {
        ...params,
        releaseTime_datege: dateRange ? func.format(dateRange[0], 'YYYY-MM-DD hh:mm:ss') : null,
        releaseTime_datelt: dateRange ? func.format(dateRange[1], 'YYYY-MM-DD hh:mm:ss') : null,
      };
      payload.dateRange = null;
    }
    
    dispatch(ORDER_LIST(payload));
  };

  // ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const {
      form,
      notice: {
        init: { category },
      },
    } = this.props;
    const { getFieldDecorator } = form;

    const { selectedRowKeys, salesmanList } = this.state;

    return (
      <div className={"default_search_form"}>
        <Form.Item label="关键词">
            {getFieldDecorator('name')(<Input placeholder="请输入关键词" />)}
          </Form.Item>
          <Form.Item label="订单状态">
            {getFieldDecorator('code')(
              <Select defaultValue={1} placeholder={"请选择订单状态"} style={{ width: 120 }}>
                {ORDERSTATUS.map(item=>{
                  return (<Option value={item.key}>{item.name}</Option>)
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="订单类型">
                  {getFieldDecorator('code1')(
                    <Select defaultValue={null} placeholder={"请选择订单类型"} style={{ width: 120 }}>
                      {ORDERTYPPE.map(item=>{
                        return (<Option value={item.key}>{item.name}</Option>)
                      })}
                    </Select>
                  )}
              </Form.Item>
              <Form.Item label="销售">
                {getFieldDecorator('code2')(
                    <Select defaultValue={null} placeholder={"请选择销售"} style={{ width: 120 }}>
                      {salesmanList.map(item=>{
                        return (<Option value={item.id}>{item.name}</Option>)
                      })}
                    </Select>
                  )}
              </Form.Item>
              <Form.Item label="最后跟进">
            <RangePicker size={"default"} />
          </Form.Item>
          <div style={{ float: 'right' }}>
            <Button type="primary" htmlType="submit">
              <FormattedMessage id="button.search.name" />
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={onReset}>
              <FormattedMessage id="button.reset.name" />
            </Button>
          </div>
      </div>
    );
  };
  moreMenu = () => (
    <Menu onClick={this.handleMenuClick}>
      <Menu.Item key="1">
        <Icon type="menu-unfold" />
        批量审核
      </Menu.Item>
      <Menu.Item key="2">
        <Icon type="appstore" />
        批量发货
      </Menu.Item>
      <Menu.Item key="3">
        <Icon type="bell" />
        批量提醒
      </Menu.Item>
      <Menu.Item key="1">
        <Icon type="loading-3-quarters" />
        转移客户
      </Menu.Item>
      <Menu.Item key="2">
        <Icon type="highlight" />
        批量编辑
      </Menu.Item>
      <Menu.Item key="3">
        <Icon type="delete" />
        批量删除
      </Menu.Item>
    </Menu>
  );

  handleMenuClick = (e) => {
    message.info('Click on menu item.');
    console.log('click', e);
  }

  renderLeftButton = () => (
    <>
      <Button type="primary" icon="plus" onClick={()=>{
        router.push(`/order/AllOrders/add`);
      }}>添加</Button>
      <Button icon="download">导入</Button>
      <Button icon="upload">导出</Button>
      <Dropdown overlay={this.moreMenu()}>
        <Button>
          更多 <Icon type="down" />
        </Button>
      </Dropdown>
    </>
  );

  renderRightButton = () => (
    <>
      <Button icon="ordered-list">排序</Button>
      <Button icon="unordered-list">列表</Button>
    </>
  );

  render() {
    const code = 'allOrdersList';

    const {
      form,
      loading,
      // notice: { data },
    } = this.props;

    const {data} = this.state;

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

    return (
      <Panel>
        <Grid
          code={code}
          form={form}
          onSearch={this.handleSearch}
          renderSearchForm={this.renderSearchForm}
          loading={loading}
          data={data}
          columns={columns}
          scroll={{ x: 1000 }} 
          renderLeftButton={this.renderLeftButton}
          renderRightButton={this.renderRightButton}
        />
      </Panel>
    );
  }
}
export default AllOrdersList;
