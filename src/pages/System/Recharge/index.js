import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, List, Form, Input, Row, Tabs, Card, message, Tooltip, Icon } from 'antd';
import Panel from '../../../components/Panel';
import styles from './index.less';
import SmsRecharge from './SmsRecharge';
import SalesmanRecharge from './SalesmanRecharge';
const { TabPane } = Tabs;

@connect(({ post, loading }) => ({
  post,
  loading: loading.models.post,
}))
@Form.create()

class Recharge extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    }
  }


  render() {
   
    return (
      <Panel>
        <Tabs type="card">
          <TabPane tab='短信充值' key="1" className={styles.tab} style={{paddingTop:"20px"}}>
            <SmsRecharge />
          </TabPane>
          {/* <TabPane tab='业务员充值' key="2" className={styles.SalesmanRecharge} style={{paddingTop:"20px"}}>
            <SalesmanRecharge/>
          </TabPane> */}
        </Tabs>
      </Panel>
    );
  }
}
export default Recharge;
