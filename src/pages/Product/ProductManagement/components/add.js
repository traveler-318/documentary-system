import React, { PureComponent } from 'react';
import {
  Modal,
  Checkbox,
  Form,
  Input,
  Button,
  message,
  Radio,
  Table, Select, Icon, Tooltip,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { getCookie } from '../../../../utils/support';
import { getProductattributeAdd, getPaypanyList, getProductcategoryList } from '../../../../services/newServices/product';
import {paymentCompany,} from '../../../Order/components/data.js';
import styles from '../add.less';
import H5Background from './h5Background'

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
      handleImgVisible:false,
      Imglist:[]
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
    const {Imglist}=this.state;
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
          originalName:Imglist.originalName
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
      }else if(value > 500){
        callback('金额不可大于500元');
      }else{
        return callback();
      }
    }else{
      return callback();
    }
  };

  // 图片弹框
  handleImg = () => {
    this.setState({
      handleImgVisible:true
    })
  }

  handleCancelImg = () => {
    this.setState({
      handleImgVisible:false
    })
  }

  handleClick = (row) => {
    console.log(row)
    this.setState({
      Img:row.link,
      Imglist:row
    })
  }

  reactNode = () => {
    return(
      <div>
        <p>1、建议图片宽度800-1000像素，高度不限</p>
        <p>2、建议上传前压缩图片尺寸，可提升图片加载速度</p>
        <p>3、点我去压缩：<a target="_blank" href="https://tinypng.com/">https://tinypng.com/</a></p>
      </div>
    )
  }

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
      handleImgVisible,
      productcategoryList,
      Img
    } = this.state;

    console.log(data)

    const formAllItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };
    const formAllItemLayout1 = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 19,
      },
    };

    return (
      <div>
        <Modal
          title="新增"
          visible={handleAddVisible}
          maskClosable={false}
          width={700}
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
          <div className={styles.add}>
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
              <FormItem {...formAllItemLayout} label="页面标题">
                {getFieldDecorator('h5Title', {
                  initialValue: data.h5Title,
                  rules: [
                    {
                      required: true,
                      message: '请输入页面标题',
                    },
                  ],
                })(<Input placeholder="请输入页面标题" />)}
                <Tooltip title='H5页面顶部标题，用户下单扫码的时候可以看到'><Icon type='question-circle-o' /></Tooltip>
              </FormItem>
              <FormItem {...formAllItemLayout} label="详情图">
                {getFieldDecorator('h5Background', {
                  initialValue: Img,
                })(<Input placeholder="请选择详情图" onClick={()=>{this.handleImg()}}/>)}
                <Tooltip title={this.reactNode}><Icon type='question-circle-o' /></Tooltip>
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
              <FormItem {...formAllItemLayout} label="一阶段">
                {getFieldDecorator('customOne', {
                  initialValue: data.customOne,
                })(<Input placeholder="请输入一阶段" />)}
              </FormItem>
              <FormItem {...formAllItemLayout} label="二阶段">
                {getFieldDecorator('customTwo', {
                  initialValue: data.customTwo,
                })(<Input placeholder="二阶段" />)}
              </FormItem>
              <FormItem {...formAllItemLayout} label="三阶段">
                {getFieldDecorator('customThree', {
                  initialValue: data.customThree,
                })(<Input placeholder="三阶段" />)}
              </FormItem>
            </Form>
          </div>
        </Modal>

        {/* 选择图片 */}
        {handleImgVisible?(
          <H5Background
            handleImgVisible={handleImgVisible}
            handleCancelImg={this.handleCancelImg}
            handleClick={this.handleClick}
          />
        ):""}
      </div>
    );
  }
}

export default Logistics;
