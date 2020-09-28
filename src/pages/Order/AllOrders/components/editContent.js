import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, Icon , Select, DatePicker, Tabs, Cascader, Radio,Timeline,} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import Panel from '../../../../components/Panel';
import FormTitle from '../../../../components/FormTitle';
import styles from '../edit.less';
import { USER_INIT, USER_CHANGE_INIT, USER_SUBMIT } from '../../../../actions/user';
import func from '../../../utils/Func';
import { getCookie } from '../../../../utils/support';
import {updateData,getRegion} from '../../../../services/newServices/order'
import OrderList from './OrderList'


const FormItem = Form.Item;
const { TextArea } = Input;
const { TabPane } = Tabs;

@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class OrdersEditContent extends PureComponent {

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

    return (
      <>
        <div className={styles.titleBtn}>
          {/* <Button icon="plus">工单</Button>
                  <Button  icon="plus">产品</Button>
                  <Button  icon="plus">地址</Button> */}
        </div>
        <div className={styles.tabContent}>
          <Tabs defaultActiveKey="1" onChange={this.callback}>
            <TabPane tab="概况" key="1">
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
            <TabPane tab={`订单(${data.order})`} key="2">
              <OrderList />
            </TabPane>
            <TabPane tab={`跟进(${data.followUp})`} key="3">
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
            {/* <TabPane tab={`服务(${data.service0rder})`} key="4">
                      服务工单()
                    </TabPane>
                    <TabPane tab={`产品(${data.product})`} key="5">
                      产品记录()
                    </TabPane>
                    <TabPane tab={`归属(${data.ownership})`} key="6">
                      归属记录
                    </TabPane>
                    <TabPane tab="操作" key="7">
                      操作日志()
                    </TabPane> */}
          </Tabs>
        </div>
      </>
    );
  }
}

export default OrdersEditContent;
