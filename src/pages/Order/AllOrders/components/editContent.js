import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, Icon , Select, DatePicker, Tabs, Cascader, Radio,Timeline,} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import Panel from '../../../../components/Panel';
import FormTitle from '../../../../components/FormTitle';
import styles from '../edit.less';
import { USER_INIT, USER_CHANGE_INIT, USER_SUBMIT } from '../../../../actions/user';
import func from '../../../../utils/Func';
import { getCookie } from '../../../../utils/support';
import { updateData, getRegion, getDetails } from '../../../../services/newServices/order';
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
    // this.getEditDetails()


    // // 获取详情数据
    // this.setState({
    //   detail:globalParameters.detailData
    // })
  }

  // getEditDetails = () => {
  //   const params={
  //     id:this.props.match.params.id
  //   }
  //   getDetails(params).then(res=>{
  //     console.log(res)
  //     this.setState({
  //       detail:res.data,
  //     })
  //   })
  // }

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
        <div style={{height:"200px"}} className={styles.main}>
          <ul>
            <li className={styles.color}>待审核</li>
            <li>已审核</li>
            <li>已发货</li>
            <li>在途中</li>
            <li>已签收</li>
            <li>跟进中</li>
            <li>已激活</li>
          </ul>
          <p><label>订单号：</label>21326564565</p>
          <p><label>订单时间：</label>2020-09-10</p>
          <p><label>订单时间：</label>2020-09-10</p>
          <p><span><label>快递：</label>顺丰</span><span><label>产品：</label>顺丰</span></p>
          <p><span><label>单号：</label>顺丰 </span><span><label>SN：</label>顺丰 </span></p>
        </div>
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
      </>
    );
  }
}

export default OrdersEditContent;
