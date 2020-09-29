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
import { getSalesmangroup,getSalesmangroupSubmit,getDeleteGroup } from '../../../../services/newServices/sales';

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

    //this.getDataList()
  }

  //getDataList = () => {
  //  const {params} = this.state;
  //  getSalesmangroup(params).then(res=>{
  //    this.setState({
  //      data:res.data.records
  //    })
  //  })
  //}

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
