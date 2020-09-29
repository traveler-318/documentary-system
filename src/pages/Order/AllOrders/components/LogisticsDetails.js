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
  Table
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
      // 添加分组弹窗
      groupAddVisible:false,
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
       deptId:details.deptId,
       logisticsCompany:details.logisticsCompany,
       outOrderNo:details.outOrderNo,
       logisticsType:type
      };
    console.log(params)
    logisticsQuery(params).then(res=>{
      console.log(res)
     // this.setState({
     //   data:res.data.records
     // })
   })
  }

  // ======确认==========

  handleSubmit = e => {
    e.preventDefault();
    const {  form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      values.deptId = getCookie("dept_id");
      if (!err) {
        const params = {
          ...values,
        };
        console.log(params)
        getSalesmangroupSubmit(params).then(res=>{
          message.success('提交成功');
          this.setState({
            groupAddVisible:false,
          })
          this.getDataList()
        })
      }
    });
  };


  render() {
    const {
      form: { getFieldDecorator },
      logisticsDetailsVisible,
      handleLogisticsDetails,
      } = this.props;

    const {data,groupAddVisible} = this.state;

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

        </Modal>
      </div>
    );
  }
}

export default LogisticsDetails;
