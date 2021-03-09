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
import { getUserInfo, updateInfo } from '../../../services/user';
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
  {name:"个人配置",key:'1'},
  // {name:"版本信息",key:'6'},
  // {name:"安全配置",key:'2'},
  // {name:"功能配置",key:'3'},
  // {name:"售后配置",key:'4'},
  // {name:"退货配置",key:'5'},
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
    if(TabsKey === "1" || TabsKey === "3" || TabsKey === "4"){
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

    const action = (
      <Button type="primary" onClick={this.handleSubmit}>
        提交
      </Button>
    );

    return (
      <Panel title="个人设置" back="/" action={action}>
        <Form style={{ marginTop: 8 }} hideRequiredMark>
          <div style={{background:"#ffffff"}}>
          <BasicConfiguration
            ref={form => {
              this.BasicView = form;
            }}
          />
            {/* <Tabs defaultActiveKey={TabsKey} onChange={this.onChangeTabsKey}>
              {
                topTabPane.map(item=>{
                  return (
                    <TabPane tab={item.name} key={item.key}>
                      {
                        TabsKey === "1" ? (
                          <BasicConfiguration
                          ref={form => {
                            this.BasicView = form;
                          }}
                          />
                        ) :""
                      }
                      {
                        TabsKey === "2" ? (
                          <Empty 
                            style={{margin:"40px 8px"}}
                          />
                        ) :""
                      }
                      {
                        TabsKey === "3" ? (
                          <FunctionConfiguration
                          ref={form => {
                            this.BasicView = form;
                          }}
                          />
                        ) :""
                      }
                      {
                        TabsKey === "4" ? (
                          <AfterSalesConfiguration
                          ref={form => {
                            this.BasicView = form;
                          }}
                          />
                        ) :""
                      }
                      {
                        TabsKey === "5" ? (
                          <Empty 
                            style={{margin:"40px 8px"}}
                          />
                        ) :""
                      }
                      {
                        TabsKey === "6" ? (
                          <VersionInformation 
                            style={{margin:"40px 8px"}}
                          />
                        ) :""
                      }
                    </TabPane>
                  )
                })
              }
            </Tabs> */}
          </div>
          
        </Form>
      </Panel>
    );
  }
}

export default BaseView;
