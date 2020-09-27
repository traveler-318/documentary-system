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
import { getProductcategoryUpdate,getPaypanyList } from '../../../../services/newServices/product';
import {productType,} from '../../../Order/AllOrders/data.js';

const { Option } = Select;
const FormItem = Form.Item;
@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class ProductTypeEdit extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:[],
      sortNumber:0,
      params:{
        size:100,
        current:1
      },
      details:'',
    };
  }


  componentWillMount() {
    const { details } = this.props;
    this.setState({
      details:details,
      payPanyId:details.payPanyId
    })
    this.getDataList()
  }

  getDataList = () => {
    const {params} = this.state;
    this.setState({
      loading:true
    })
    getPaypanyList(params).then(res=>{
      this.setState({
        loading:false
      })
      this.setState({
        data:res.data.records,
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
    const {  details , payPanyId } = this.state;
    console.log(details)
    form.validateFieldsAndScroll((err, values) => {
      values.deptId = getCookie("dept_id");
      // values.payPanyId = details.payPanyId;
      if (!err) {
        const params = {
          ...values,
          id:details.id,
          payPanyId
        };
        console.log(params)
        getProductcategoryUpdate(params).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            router.push('/product/productType');
          }
        })
      }
    });
  };

  onChange = (e,row) => {
    const {  details } = this.state;
    this.setState({
      payPanyId:row.key
    })
  };

  render() {
    const {
      form: { getFieldDecorator },
      handleEditVisible,
      handleCancelEdit
      } = this.props;

    const {data,loading,sortNumber,details} = this.state;

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
            <FormItem {...formAllItemLayout} label="产品类别">
              {getFieldDecorator('productTypeName', {
                initialValue: details.productTypeName,
                rules: [
                  {
                    required: true,
                    message: '请选择产品类别名称',
                  },
                ],
              })(
                <Select placeholder="请选择产品类别名称">
                  {productType.map((item)=>{
                    return (<Option key={item.key} value={item.name}>{item.name}</Option>)
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formAllItemLayout} label="支付公司">
              {getFieldDecorator('payPanyName', {
                initialValue: details.payPanyName,
                rules: [
                  {
                    required: true,
                    message: '请输入支付公司',
                  },
                ],
              })(
                <Select placeholder="请选择支付公司" onSelect={this.onChange}>
                  {data.map((item)=>{
                    return (<Option key={item.id} value={item.payName}>{item.payName}</Option>)
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

export default ProductTypeEdit;
