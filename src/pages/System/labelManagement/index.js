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

import Label from './labelList';
import Grade from './gradeList';
import State from './stateList';
import Source from './sourceList'

const FormItem = Form.Item;
const { TextArea } = Input;
const { TabPane } = Tabs;
// const GRADE = [
//   {name:"一级",key:1},
//   {name:"二级",key:2},
// ]
const topTabPane = [
  {name:"维护标签",key:'1'},
  {name:"客户等级",key:'2'},
  {name:"客户状态",key:'3'},
  {name:'数据来源',key:'4'}
]

// 发布客户状态

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


  onChangeTabsKey = (key) => {
    this.setState({
      TabsKey:key
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const { TabsKey } = this.state;


    return (
    //   <Panel>
        <Form style={{ marginTop: 8 }} hideRequiredMark>
          <div style={{background:"#ffffff"}}>
            <Tabs defaultActiveKey={TabsKey} onChange={this.onChangeTabsKey}>
              {
                topTabPane.map((item,i)=>{
                  return (
                    <TabPane tab={item.name} key={item.key} >
                      {
                        TabsKey === "1" && i==0 ? (
                            <Label/>
                        ) :TabsKey === "2"&& i==1 ? (
                          <Grade/>
                        ) :TabsKey === "3"&& i==2 ? (
                          <State/>
                        ) :TabsKey === "4"&& i==3 ? (
                          <Source/>
                        ) :""
                      }
                    </TabPane>
                  )
                })
              }
            </Tabs>
          </div>

        </Form>
    //   </Panel>
    );
  }
}

export default BaseView;
