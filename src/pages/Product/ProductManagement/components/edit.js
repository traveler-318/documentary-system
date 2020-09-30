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
import { getProductattributeUpdate, getPaypanyList, getProductcategoryList } from '../../../../services/newServices/product';
import {paymentCompany,} from '../../../Order/AllOrders/data.js';

const { Option } = Select;
const FormItem = Form.Item;
@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class Logistics extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:{
        sortNumber:0
      },
      params:{
        size:10,
        current:1
      },
      paypanyList:[],
      productcategoryList:[],
      payPanyId:"",
      productTypeId:"",
    };
  }


  componentWillMount() {
    const {details} = this.props;
    this.setState({
      payPanyId:details.payPanyId,
      productTypeId:details.productTypeId,
    })

    getPaypanyList({
      size:100,
      current:1
    }).then(res=>{
      this.setState({
        paypanyList:res.data.records
      })
    })

    getProductcategoryList({
      size:100,
      current:1
    }).then(res=>{
      this.setState({
        productcategoryList:res.data.records
      })
    })
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
    const {  form, details } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      values.deptId = getCookie("dept_id");
      if (!err) {
        const {payPanyId,productTypeId} = this.state;
        const params = {
          ...values,
          payPanyId,
          productTypeId,
          deptId:getCookie("dept_id"),
          id:details.id,
          price:values.price ? Number(values.price) : null,
          settlePrice:values.settlePrice ? Number(values.settlePrice) : null,
        };
        console.log(params)
        getProductattributeUpdate(params).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            router.push('/product/productManagement');
          }
        })
      }
    });
  };

  countChange = (rule, value, callback) => {
    var reg=/((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
    if(value != "" && value != null){
      if(!reg.test(value)){
        callback('请输入正确的金额格式');
      }else{
        return callback();
      }
    }else{
      return callback();
    }
  };

  onChange = (key,row,type) => {
    if(type === "payPanyId"){
      this.setState({
        payPanyId:row.key
      })
    }else{
      this.setState({
        productTypeId:row.key
      })
    }
    
    console.log(key,row)
  }

  render() {
    
    const {
      form: { getFieldDecorator },
      handleEditVisible,
      handleCancelEdit,
      details
    } = this.props;

    const {
      data,
      loading,
      paypanyList,
      productcategoryList,
    } = this.state;

    const formAllItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };

    return (
      <div>
        <Modal
          title="修改"
          visible={handleEditVisible}
          width={600}
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
              {getFieldDecorator('payPanyName', {
                initialValue: details.payPanyName,
                rules: [
                  {
                    required: true,
                    message: '请选择支付公司',
                  },
                ],
              })(
                <Select placeholder="请选择支付公司" onChange={(key,row)=>{this.onChange(key,row,"payPanyId")}}>
                  {paypanyList.map((item)=>{
                    return (<Option key={item.id} value={item.payName}>{item.payName}</Option>)
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formAllItemLayout} label="支付类型">
              {getFieldDecorator('productTypeName', {
                initialValue: details.productTypeName,
                rules: [
                  {
                    required: true,
                    message: '请选择支付类型',
                  },
                ],
              })(
                <Select placeholder="请选择支付类型" onChange={(key,row)=>{this.onChange(key,row,"productTypeId")}}>
                  {productcategoryList.map((item)=>{
                    return (<Option key={item.id} value={item.payPanyName}>{item.payPanyName}</Option>)
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formAllItemLayout} label="产品名称">
              {getFieldDecorator('productName', {
                initialValue: details.productName,
                rules: [
                  {
                    required: true,
                    message: '请输入产品名称',
                  },
                ],
              })(<Input placeholder="请输入产品名称" />)}
            </FormItem>
            
            <FormItem {...formAllItemLayout} label="价格">
              {getFieldDecorator('price', {
                initialValue: details.price,
                rules: [
                  {
                    required: true,
                    validator:this.countChange,
                  },
                ],
              })(<Input placeholder="请输入价格" />)}
            </FormItem>
            <FormItem {...formAllItemLayout} label="结算价">
              {getFieldDecorator('settlePrice', {
                initialValue: details.settlePrice,
                rules: [
                  {
                    required: true,
                    validator:this.countChange,
                  },
                ],
              })(<Input placeholder="请输入结算价" />)}
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
            <FormItem {...formAllItemLayout} label="自定义名称1">
              {getFieldDecorator('customOne', {
                initialValue: details.customOne,
              })(<Input placeholder="请输入自定义名称1" />)}
            </FormItem>
            <FormItem {...formAllItemLayout} label="自定义名称2">
              {getFieldDecorator('customTwo', {
                initialValue: details.customTwo,
              })(<Input placeholder="请输入自定义名称2" />)}
            </FormItem>
            <FormItem {...formAllItemLayout} label="自定义名称3">
              {getFieldDecorator('customThree', {
                initialValue: details.customThree,
              })(<Input placeholder="请输入自定义名称3" />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Logistics;
