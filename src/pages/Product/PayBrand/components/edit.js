import React, { PureComponent } from 'react';
import {
  Modal,
  Checkbox,
  Form,
  Input,
  Button,
  message,
  Radio,
  Table, Select,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { getCookie } from '../../../../utils/support';
import { getPaypanyUpdate } from '../../../../services/newServices/product';
import {paymentCompany,} from '../../../Order/AllOrders/data.js';

const { Option } = Select;
const FormItem = Form.Item;
@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class productEdit extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:{
        sortNumber:0
      }
    };
  }


  componentWillMount() {
    const { details } = this.props;
  }

  valinsPayChange = (rule, value, callback) => {
    var reg=/((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
    if(value != "" && value != null){
      if(!reg.test(value)){
        callback('请输入正确的排序');
      }else{
        return callback();
      }
    }else{
      return callback();
    }
  };

  // ======确认==========

  handleSubmit = e => {
    e.preventDefault();
    const {  form,details } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          ...values,
          id:details.id,
          deptId:details.deptId,
        };
        console.log(params)
        getPaypanyUpdate(params).then(res=>{
          message.success('修改成功');
          router.push('/product/payBrand');
        })
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      handleEditVisible,
      handleCancelEdit,
      details,
    } = this.props;

    const {data,loading} = this.state;

    const formAllItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };

    // confirmTag
    return (
      <div>
        <Modal
          title="修改"
          visible={handleEditVisible}
          width={500}
          onCancel={handleCancelEdit}
          footer={[
            <Button key="back" onClick={handleCancelEdit}>
              取消
            </Button>,
            <Button type="primary" loading={loading} onClick={(e)=>this.handleSubmit(e,false)}>
              确定
            </Button>,
          ]}
        >
          <Form style={{ marginTop: 8 }}>
            <FormItem {...formAllItemLayout} label="支付公司">
              {getFieldDecorator('payName', {
                initialValue: details.payName,
              })(
                <Select placeholder="">
                  {paymentCompany.map((item)=>{
                    return (<Option key={item.name} value={item.name}>{item.name}</Option>)
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formAllItemLayout} label="排序编号">
              {getFieldDecorator('sortNumber', {
                initialValue: details.sortNumber,
                rules: [
                  {
                    required: true,
                    validator:this.valinsPayChange
                  },
                ],
              })(<Input placeholder="请输入排序编号" />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default productEdit;
