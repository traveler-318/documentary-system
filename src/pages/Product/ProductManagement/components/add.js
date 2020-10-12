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
import { getProductattributeAdd, getPaypanyList, getProductcategoryList } from '../../../../services/newServices/product';
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
      productcategoryList:[]
    };
  }


  componentWillMount() {


    getPaypanyList({
      size:100,
      current:1
    }).then(res=>{
      this.setState({
        paypanyList:res.data.records
      })
    })

    
  }

  getProductcategoryLists = (key) => {
    getProductcategoryList({
      size:100,
      current:1,
      payPanyId:key
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
    const {  form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      values.deptId = getCookie("dept_id");
      if (!err) {
        const {payPanyId,productTypeName} = this.state;
        const params = {
          ...values,
          payPanyId,
          productTypeName,
          deptId:getCookie("dept_id"),
          price:values.price ? Number(values.price) : null,
          settlePrice:values.settlePrice ? Number(values.settlePrice) : null,
        };
        console.log(params)
        getProductattributeAdd(params).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            router.push('/product/productManagement');
          }
        })
      }
    });
  };

  onChange = (key,row,type) => {
    if(type === "payPanyId"){
      this.setState({
        payPanyId:row.key
      })
      this.getProductcategoryLists(row.key);
      const {  form } = this.props;
      form.setFieldsValue({ productTypeId : "" } )
      
    }else{
      this.setState({
        productTypeName:row.props.children
      })
    }
    
    console.log(key,row)
  }

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

  render() {
    const {
      form: { getFieldDecorator },
      handleAddVisible,
      handleCancelAdd,
    } = this.props;

    const {
      data,
      loading,
      paypanyList,
      productcategoryList
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
          title="新增"
          visible={handleAddVisible}
          width={600}
          onCancel={handleCancelAdd}
          footer={[
            <Button key="back" onClick={handleCancelAdd}>
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
                initialValue: data.payPanyName,
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
              {getFieldDecorator('productTypeId', {
                initialValue: data.productTypeId,
                rules: [
                  {
                    required: true,
                    message: '请选择支付类型',
                  },
                ],
              })(
                <Select placeholder="请选择支付类型" onChange={(key,row)=>{this.onChange(key,row,"productTypeId")}}>
                  {productcategoryList.map((item)=>{
                    return (<Option key={item.id} value={item.id}>{item.productTypeName}</Option>)
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formAllItemLayout} label="产品名称">
              {getFieldDecorator('productName', {
                initialValue: data.productName,
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
                initialValue: data.price,
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
                initialValue: data.settlePrice,
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
                initialValue: data.sortNumber,
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
                initialValue: data.customOne,
              })(<Input placeholder="请输入自定义名称1" />)}
            </FormItem>
            <FormItem {...formAllItemLayout} label="自定义名称2">
              {getFieldDecorator('customTwo', {
                initialValue: data.customTwo,
              })(<Input placeholder="请输入自定义名称2" />)}
            </FormItem>
            <FormItem {...formAllItemLayout} label="自定义名称3">
              {getFieldDecorator('customThree', {
                initialValue: data.customThree,
              })(<Input placeholder="请输入自定义名称3" />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Logistics;
