import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import {
  Form,
  Input,
  Upload,
  Button,
  message,
  Icon,
  Card,
  Radio,
  Row,
  Col,
  Select,
  Tabs,
  Empty
} from 'antd';
import Panel from '../../../components/Panel';
import { getUserInfo, propertyUpdate, updateInfo } from '../../../services/user';
import { getToken } from '../../../utils/authority';

import BasicConfiguration from './components/basicConfiguration';
import AfterSalesConfiguration from './components/afterSalesConfiguration';
import FunctionConfiguration from './components/functionConfiguration';
import ReturnConfiguration from './components/returnConfiguration';
import SecurityConfiguration from './components/securityConfiguration';
import VersionInformation from './components/versionInformation';

const FormItem = Form.Item;
const { TextArea } = Input;
const { TabPane } = Tabs;
// const GRADE = [
//   {name:"一级",key:1},
//   {name:"二级",key:2},
// ]
const topTabPane = [
  {name:"基本配置",key:'1'},
  // {name:"安全配置",key:'2'},
  {name:"功能配置",key:'3'},
  {name:"售后配置",key:'4'},
  {name:"退货配置",key:'5'},
  {name:"版本信息",key:'6'},
]


@Form.create()
class BaseView extends Component {

  
  constructor(props) {
    super(props);
    // this.myRef = React.createRef();
    this.state = {
      TabsKey:"1"
    };
  }

  

  componentDidMount() {
    
  }

  handleSubmit = () => {
    const {TabsKey} = this.state;
    console.log(TabsKey)
    if(TabsKey === "1" || TabsKey === "4"){
      this.BasicView.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log(values,"values")
          const params = {
            ...values,
          };
          updateInfo(params).then(resp => {
            if (resp.success) {
              message.success(resp.msg);
            } else {
              message.error(resp.msg || '提交失败');
            }
          });
        }
      });
    }else if(TabsKey === "3"){
      this.BasicView.validateFieldsAndScroll((err, values) => {
        if (!err) {

          if(values.daysOverdue < 10){
            if(values.daysOverdue != 0){
              return message.error('此时间段距离签收时间比较短,用户激活时间比较紧迫,建议时间调整为 10-60天')
            }
          }
          if(values.transferNumber < 7){
            if(values.transferNumber != 0){
              return message.error('此时间段距离签收时间比较短,用户进入下一个客户周期,建议时间调整为 7-90天')
            }
          }

          const property ={
            daysOverdue:values.daysOverdue,
            transferNumber:values.transferNumber,
            authenticationStatus:values.authenticationStatus,
            domainAddress:values.domainAddress,
            wechatBrowserStatus:values.wechatBrowserStatus,
            localPrintStatus:values.localPrintStatus,
            agentDeliveryStatus:values.agentDeliveryStatus,
            deptId:values.deptId
          }
          propertyUpdate(property).then(resp => {
            if (resp.success) {
              // message.success(resp.msg);
            } else {
              // message.error(resp.msg || '提交失败');
            }
          });
          const params = {
            ...values,
          };
          updateInfo(params).then(resp => {
            if (resp.success) {
              message.success(resp.msg);
            } else {
              message.error(resp.msg || '提交失败');
            }
          });
        }
      })
    }
  }

  onChangeTabsKey = (key) => {
    console.log(key,"TabsKey")
    this.setState({
      TabsKey:key
    })
  }
  
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const { TabsKey } = this.state;
    console.log(TabsKey,"TabsKeys")

    const action = (
      <Button type="primary" onClick={this.handleSubmit}>
        提交
      </Button>
    );
    return (
      <Panel title="基本设置" back="/" action={action}>
        <Form style={{ marginTop: 8 }} hideRequiredMark>
          <div style={{background:"#ffffff"}}>
            <Tabs defaultActiveKey={TabsKey} onChange={this.onChangeTabsKey}>
              {
                topTabPane.map(item=>{
                  return (
                    <TabPane tab={item.name} key={item.key}>
                      {
                        (TabsKey === item.key && TabsKey === '1') ? (
                          <BasicConfiguration
                          TabsKey={TabsKey}
                          ref={form => {
                            this.BasicView = form;
                          }}
                          />
                        ) : 
                        (TabsKey === item.key && TabsKey === '2') ? (
                          <Empty 
                            style={{margin:"40px 8px"}}
                          />
                        ) : 
                        (TabsKey === item.key && TabsKey === '3') ? (
                          <FunctionConfiguration
                          TabsKey={TabsKey}
                          ref={form => {
                            this.BasicView = form;
                          }}
                          />
                        ) : 
                        (TabsKey === item.key && TabsKey === '4') ? (
                          <AfterSalesConfiguration
                          TabsKey={TabsKey}
                          ref={form => {
                            this.BasicView = form;
                          }}
                          />
                        ) : 
                        (TabsKey === item.key && TabsKey === '5') ? (
                          <Empty 
                            style={{margin:"40px 8px"}}
                          />
                        ) : 
                        (TabsKey === item.key && TabsKey === '6') ? (
                          <VersionInformation 
                          TabsKey={TabsKey}
                            style={{margin:"40px 8px"}}
                          />
                        ) : ""
                      }
                    </TabPane>
                  )
                })
              }
            </Tabs>
          </div>
          
        </Form>
      </Panel>
    );
  }
}

export default BaseView;
