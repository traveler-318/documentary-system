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
  Empty
} from 'antd';
import { connect } from 'dva';
import styles from './edit.less';
import moment from 'moment';
import router from 'umi/router';
import { getCookie } from '../../../../utils/support';
import { logisticsQuery } from '../../../../services/newServices/order';
import { getLogisticsQuery } from './data';


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
      //  logisticsNumber:details.logisticsNumber,
       userPhone:details.userPhone,
      //  outOrderNo:details.outOrderNo,
       logisticsType:type
    };

    if(details.logisticsStatus){
      params.outOrderNo = details.outOrderNo;
      // params.logistics_number = "";
    }else{
      params.logisticsNumber = details.logisticsNumber;
      params.outOrderNo = "";
    }
    console.log(params)
    logisticsQuery(params).then(res=>{
      if(res.code == 200){
        let _dataList = []
        if(JSON.parse(res.data).result != ""){
          if(params.outOrderNo === ""){
            // _dataList = JSON.parse(res.data).result.list
            if(JSON.stringify(JSON.parse(res.data).result) != "{}"){
              _dataList = JSON.parse(res.data).result.list
            }
          }else{
            console.log(JSON.parse(res.data).result,"123321")
            if(JSON.stringify(JSON.parse(res.data).result) != "{}"){
              _dataList = JSON.parse(JSON.parse(res.data).result.list)
            }
          }
        }else{
          message.error(JSON.parse(res.data).msg);
        }
        console.log(_dataList,"_dataList")
        
         this.setState({
           data:_dataList
         })
      }else{
        message.error(res.msg);
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
      console.log(data,"datadatadata")
    // confirmTag
    return (
      <div>
        <Modal
          title="物流详情"
          visible={logisticsDetailsVisible}
          maskClosable={false}
          width={550}
          onCancel={handleLogisticsDetails}
          footer={null}
        >
          <div className={styles.logisticsTime}>
            {data.length <= 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <Timeline>
              {data.map((item)=>{
                return (
                  <Timeline.Item>
                    <p>{item.time}</p>
                    <p>{item.content}</p>
                  </Timeline.Item>
                )
              })}
              </Timeline>
            )}
          </div>
        </Modal>
      </div>
    );
  }
}

export default LogisticsDetails;
