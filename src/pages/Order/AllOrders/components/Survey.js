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
class Survey extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      edit:true,
      data:{
        order:'10',
        followUp:'2',
        service0rder:'6',
        product:"9",
        ownership:"3"
      },
      describe:"",
      orderType:[
        {"name":"待审核",key:0},
        {"name":"已审核",key:1},
        {"name":"已发货",key:2},
        {"name":"在途中",key:3},
        {"name":"已签收",key:4},
        {"name":"跟进中",key:5},
        {"name":"已激活",key:6},
        {"name":"已退回",key:7},
      ],
      followRecords:[]
    };
  }

  componentWillMount() {
    const { orderType } = this.state;
    const { detail } = this.props;
    this.setState({
      detail,
      followRecords:detail.followRecords
    })
    let _type = orderType.map(item=>{
      let _item = {...item}
      if(item.key <= detail.confirmTag){
        _item.className = "clolor"
      }
    })

    this.setState({
      orderType:_type
    })
    
  }

  TextAreaChange = (e) => {
      this.setState({
        describe:e.target.value
      })
  };

  handleSubmit = () => {
    const { detail , describe, followRecords } = this.state;
    let param = {
      userName:detail.userName,
      describe
    }

    followRecords.unshift(param);

    let _param = {
      ...detail,
      followRecords
    }

    console.log(_param,"_param")

    updateData().then(res=>{

    })
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
      describe,
      followRecords,
      orderType
    } = this.state;
    console.log(detail)

    return (
      <>
        <div style={{height:"200px"}} className={styles.main}>
          <ul>
            {orderType.map(item=>{
              return (
                <li className={item.className ? styles.color : ""}>{item.name}</li>
              )
            })}
          </ul>
          <p><label>订单号：</label>{detail.outOrderNo}</p>
          <p><label>订单时间：</label>{detail.createTime}</p>
          <p> </p>
          <p><span><label>快递：</label>{detail.logisticsCompany}</span><span><label>产品：</label>{detail.productType}</span></p>
          <p><span><label>单号：</label>{detail.logisticsNumber}</span><span><label>SN：</label>{detail.productCoding}</span></p>
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
          <TextArea 
            rows={4} 
            value={describe}
            onChange={this.TextAreaChange} 
            placeholder='请输入内容（Alt+Enter快速提交）' 
          />
          <div style={{float:"left"}}>
            <Icon type="clock-circle" style={{margin:"0 10px 0 15px"}} />
            计划提醒
          </div>
          <div style={{float:"right"}}>
            <Button>清空</Button>
            <Button 
              type="primary"
              onClick={this.handleSubmit}
            >提交</Button>
          </div>
        </div>
      </>
    );
  }
}

export default Survey;
