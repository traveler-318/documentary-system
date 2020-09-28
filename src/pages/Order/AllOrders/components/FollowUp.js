import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, Timeline, Select, Divider, Dropdown, Menu, Icon, } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';

import { ORDER_LIST } from '../../../../actions/order';
import func from '../../../../utils/Func';
import styles from '../edit.less';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class FollowUp extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:{},
      loading:false,
      params:{
        size:10,
        current:1
      },
    };
  }

  // ============ 初始化数据 ===============
  componentWillMount() {
    this.getList();
  }

  getList = () =>{
    this.setState({

    })
  }

  // 详情
  handleDetsils = (row) => {
   
  }

  // 删除
  handleDelect = (row) => {

  }

  getText = (key, type) => {
    let text = ""
    type.map(item=>{
      if(item.key === key){
        text = item.name
      }
    })
    return text
  }

  render() {

    const {
      form,
    } = this.props;

    const { 
      data, 
      loading, 
    } = this.state;

    return (
      <>
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
export default FollowUp;
