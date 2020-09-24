import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, Icon , Select, DatePicker, Tabs, Cascader, Radio,Timeline,} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import Panel from '../../../components/Panel';
import FormTitle from '../../../components/FormTitle';
import styles from './edit.less';
import { USER_INIT, USER_CHANGE_INIT, USER_SUBMIT } from '../../../actions/user';
import func from '../../../utils/Func';
import { tenantMode } from '../../../defaultSettings';
import { CITY } from '../../../utils/city';
import { getCookie } from '../../../utils/support';
import {updateData,getRegion} from '../../../services/newServices/order'
import {ORDERSTATUS} from './data.js';
import FormDetailsTitle from '../../../components/FormDetailsTitle';


const FormItem = Form.Item;
const { TextArea } = Input;
const { TabPane } = Tabs;

@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class OrdersAdd extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      detail:{},
      edit:true,
      data:{
        order:'10',
        followUp:'2',
        service0rder:'6',
        product:"9",
        ownership:"3"
      }
    };
  }


  componentWillMount() {
    const { globalParameters } = this.props;

    // 获取详情数据
    this.setState({
      detail:globalParameters.detailData
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { cityparam, detail } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values = {...values,...cityparam};
        values.id = detail.id
        updateData(values).then(res=>{
          message.success(res.msg);
          router.push('/order/allOrders');
        })
      }
    });
  };

  handleChange = value => {
  };

  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  }

  onChange = (value, selectedOptions) => {
    this.setState({
      cityparam:{
        province:value[0],
        city:value[1],
        area:value[2],
      }
    })
  };

  TextAreaChange = (e) => {
    console.log(e.target.value)
  };

  clickEdit = () => {
    this.setState({
      edit:false
    })
  };

  Preservation = () => {
    this.setState({
      edit:true
    })
  };

  callback = (key) => {

  };

  getText = (key) => {
    let text = ""
    ORDERSTATUS.map(item=>{
      if(item.key === key){
        text = item.name
      }
    })
    return text
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const {
      data,
      loading,
      detail,
      edit,
    } = this.state;
    console.log(detail)

    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const formAllItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };
    return (
      <Panel title="详情" back="/order/AllOrders">
        <Form style={{ marginTop: 8 }}>
          <Card bordered={false} className={styles.editContent}>
            <Row gutter={24} style={{ margin: 0 }}>
              <Col span={12} style={{ padding: 0 }} className={styles.leftContent}>
                <div className={styles.titleBtn}>
                  <Button type="primary" onClick={this.Preservation}>保存</Button>
                  <Button  icon="edit" onClick={this.clickEdit}>编辑</Button>
                  <Button  icon="delete">删除</Button>
                  <Button  icon="bell">提醒</Button>
                  <Button  icon="folder">归档</Button>
                </div>
                <div className={styles.editList} style={{ padding: '20px' }}>
                  <FormDetailsTitle title="客户信息" style={{ margin:'0'}} />
                  <FormItem {...formAllItemLayout} label="客户姓名">
                    {getFieldDecorator('userName', {
                      rules: [
                        {
                          message: '请输入客户姓名',
                        },
                      ],
                      initialValue: detail.userName,
                    })(<Input disabled={edit} placeholder="请输入客户姓名" />)}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="手机号">
                    {getFieldDecorator('userPhone', {
                      rules: [
                        {
                          message: '请输入手机号',
                        },
                        {
                          len: 11,
                          message: '请输入正确的手机号',
                        },
                      ],
                      initialValue: detail.userPhone,
                    })(<Input disabled={edit} placeholder="请输入手机号" />)}
                  </FormItem>

                  <FormItem {...formAllItemLayout} label="所在地区">
                    {getFieldDecorator('region', {
                      initialValue: [detail.province, detail.city, detail.area],
                    })(
                      <Cascader
                        defaultValue={[detail.province, detail.city, detail.area]}
                        options={CITY}
                        disabled={edit}
                        onChange={this.onChange}
                      />
                    )}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="收货地址">
                    {getFieldDecorator('userAddress', {
                      rules: [
                        {
                          message: '请输入收货地址',
                        },
                      ],
                      initialValue: detail.userAddress,
                    })(<Input disabled={edit} placeholder="请输入收货地址" />)}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="客戶状态">
                    {getFieldDecorator('userAddress', {
                      rules: [
                        {
                          message: '',
                        },
                      ],
                      initialValue: detail.userAddress,
                    })(<Input disabled={edit} placeholder="" />)}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="系统编号">
                    {getFieldDecorator('userAddress', {
                      rules: [
                        {
                          message: '',
                        },
                      ],
                      initialValue: detail.userAddress,
                    })(<Input disabled={edit} placeholder="" />)}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="订单状态">
                    {getFieldDecorator('confirmTag', {
                      rules: [
                        {
                          message: '',
                        },
                      ],
                      initialValue: this.getText(detail.confirmTag),
                    })(<Input disabled={edit} placeholder="" />)}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="客户来源">
                    {getFieldDecorator('salesman', {
                      rules: [
                        {
                          message: '',
                        },
                      ],
                      initialValue: detail.salesman,
                    })(<Input disabled={edit} placeholder="" />)}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="客户归属" className={styles.salesman}>
                    {getFieldDecorator('salesman', {
                      rules: [
                        {
                          message: '',
                        },
                      ],
                      initialValue: detail.salesman,
                    })(<Input disabled={edit} placeholder="" />)}
                  </FormItem>
                  <FormDetailsTitle title="其他信息" />
                  <FormItem {...formAllItemLayout} label="微信号">
                    {getFieldDecorator('userAddress', {
                      rules: [
                        {
                          message: '',
                        },
                      ],
                      initialValue: detail.userAddress,
                    })(<Input disabled={edit} placeholder="" />)}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="电子邮箱">
                    {getFieldDecorator('userAddress', {
                      rules: [
                        {
                          message: '',
                        },
                      ],
                      initialValue: detail.userAddress,
                    })(<Input disabled={edit} placeholder="请输入电子邮箱" />)}
                  </FormItem>
                </div>
              </Col>
              <Col span={12} style={{ padding: 0 }} className={styles.rightContent}>
                <div className={styles.titleBtn}>
                  <Button icon="plus">工单</Button>
                  <Button  icon="plus">产品</Button>
                  <Button  icon="plus">地址</Button>
                </div>
                <div className={styles.tabContent}>
                  <Tabs defaultActiveKey="1" onChange={this.callback}>
                    <TabPane tab="概况信息" key="1">
                      <div className={styles.timelineContent}>
                        <Timeline>
                          <Timeline.Item>
                            <p>赵小刚 跟进</p>
                            <p>电话无人接听</p>
                            <p>2020-09-19</p>
                          </Timeline.Item>
                          <Timeline.Item>
                            <p>赵小刚 新增客户</p>
                            <p>上门拜访了客服，客户对产品很满意</p>
                            <p>2020-09-19</p>
                          </Timeline.Item>
                          <Timeline.Item>
                            <p>赵小刚 跟进</p>
                            <p>电话无人接听</p>
                            <p>2020-09-19</p>
                          </Timeline.Item>
                          <Timeline.Item>
                            <p>赵小刚 新增客户</p>
                            <p>上门拜访了客服，客户对产品很满意</p>
                            <p>2020-09-19</p>
                          </Timeline.Item>
                        </Timeline>
                      </div>
                      <div className={styles.tabText}>
                        <TextArea rows={4} onChange={this.TextAreaChange} placeholder='请输入内容（Alt+Enter快速提交）' />
                        <div style={{float:"left"}}>
                          <Icon type="clock-circle" style={{margin:"0 10px 0 15px"}} />
                          计划提醒
                        </div>
                        <div style={{float:"right"}}>
                          <Button>清空</Button>
                          <Button type="primary">提交</Button>
                        </div>
                      </div>
                    </TabPane>
                    <TabPane tab={`订单记录(${data.order})`} key="2">
                      订单记录
                    </TabPane>
                    <TabPane tab={`跟进记录(${data.followUp})`} key="3">
                      <div className={styles.timelineContent}>
                        <Timeline>
                          <Timeline.Item>
                            <p>赵小刚 跟进</p>
                            <p>电话无人接听</p>
                            <p>2020-09-19</p>
                          </Timeline.Item>
                          <Timeline.Item>
                            <p>赵小刚 新增客户</p>
                            <p>上门拜访了客服，客户对产品很满意</p>
                            <p>2020-09-19</p>
                          </Timeline.Item>
                          <Timeline.Item>
                            <p>赵小刚 跟进</p>
                            <p>电话无人接听</p>
                            <p>2020-09-19</p>
                          </Timeline.Item>
                          <Timeline.Item>
                            <p>赵小刚 新增客户</p>
                            <p>上门拜访了客服，客户对产品很满意</p>
                            <p>2020-09-19</p>
                          </Timeline.Item>
                        </Timeline>
                      </div>
                      <div className={styles.tabText}>
                        <TextArea rows={4} onChange={this.TextAreaChange} placeholder='请输入内容（Alt+Enter快速提交）' />
                        <div style={{float:"left"}}>
                          <Icon type="clock-circle" style={{margin:"0 10px 0 15px"}} />
                          计划提醒
                        </div>
                        <div style={{float:"right"}}>
                          <Button>清空</Button>
                          <Button type="primary">提交</Button>
                        </div>
                      </div>
                    </TabPane>
                    <TabPane tab={`服务工单(${data.service0rder})`} key="4">
                      服务工单()
                    </TabPane>
                    <TabPane tab={`产品记录(${data.product})`} key="5">
                      产品记录()
                    </TabPane>
                    <TabPane tab={`归属记录(${data.ownership})`} key="6">
                      归属记录
                    </TabPane>
                    <TabPane tab="操作日志" key="7">
                      操作日志()
                    </TabPane>
                  </Tabs>
                </div>
              </Col>
            </Row>

          </Card>
        </Form>
      </Panel>
    );
  }
}

export default OrdersAdd;
