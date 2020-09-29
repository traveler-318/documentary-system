/**
 * Created by Lenovo on 2020/9/28.
 */
import React, { PureComponent } from 'react';
import {
  Modal,
  Checkbox,
  Form,
  Input,
  Button,
  message,
  Radio,
  Timeline,
  Table,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { getCookie } from '../../../../utils/support';
import { logisticsQuery } from '../../../../services/newServices/order';
import { getLogisticsQuery } from '../data';


const FormItem = Form.Item;
const { TextArea } = Input;


@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class LogisticsDetails extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:[],
      params:{
        size:10,
        current:1
      },
    };
  }


  componentWillMount() {
    const { globalParameters } = this.props;
    this.getDataList()
  }

  getDataList = () => {
    const { globalParameters } = this.props;
    const details = globalParameters.detailData;
    const LogisticsQ = getLogisticsQuery().result;
    let type=''
    for(let key in LogisticsQ){
      if(LogisticsQ[key] === details.logisticsCompany){
        type = key;
      }
    }
     const params={
       logisticsNumber:details.logisticsNumber,
       userPhone:details.userPhone,
       outOrderNo:details.outOrderNo,
       logisticsType:type
      };
    console.log(params)
    logisticsQuery(params).then(res=>{
      if(res.code === 401){
        message.success(res.msg);
      }
      if(res.code === 200){
        const list=JSON.parse(res.data);
         this.setState({
           data:list.result.list
         })

      }
   })
  }

  render() {
    const {
      form: { getFieldDecorator },
      logisticsDetailsVisible,
      handleLogisticsDetails,
      } = this.props;

    const {data} = this.state;

    // confirmTag
    return (
      <div>
        <Modal
          title="物流详情"
          visible={logisticsDetailsVisible}
          width={550}
          onCancel={handleLogisticsDetails}
          footer={[

          ]}
        >
          <div>
            <Timeline>
              {data.map((item)=>{
                return (
                  <Timeline.Item>
                    <p>{item.time}</p>
                    <p>{item.status}</p>
                  </Timeline.Item>
                )
              })}
            </Timeline>
          </div>
        </Modal>
      </div>
    );
  }
}

export default LogisticsDetails;
