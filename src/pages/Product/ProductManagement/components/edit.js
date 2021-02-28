import React, { PureComponent } from 'react';
import {
  Modal,
  Checkbox,
  Form,
  Input,
  Button,
  message,
  Radio,
  Table, Select, Tooltip, Icon,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { getCookie } from '../../../../utils/support';
import { getProductattributeUpdate, getPaypanyList, getProductcategoryList } from '../../../../services/newServices/product';
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
      payPanyName:"",
      productTypeName:"",
      handleImgVisible:false,
      Imglist:[]
    };
  }


  componentWillMount() {
    const {details} = this.props;

    this.getProductcategoryLists(details.payPanyId)

    getPaypanyList({
      size:100,
      current:1
    }).then(res=>{
      this.setState({
        paypanyList:res.data.records
      })
      const {details} = this.props;
      for(let i=0; i<res.data.records.length; i++){
        if(parseInt(details.payPanyId) === res.data.records[i].id){
          this.setState({
            payPanyName:res.data.records[i].payName,
          })
        }
      }

      
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
      const {details} = this.props;
      for(let i=0; i<res.data.records.length; i++){
        if(parseInt(details.productTypeId) === res.data.records[i].id){
          this.setState({
            productTypeName:res.data.records[i].productTypeName,
          })
        }
      }
      
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
    const {Imglist}=this.state;
    form.validateFieldsAndScroll((err, values) => {
      values.deptId = getCookie("dept_id");
      if (!err) {
        const {payPanyName,productTypeName} = this.state;
        const params = {
          ...values,
          payPanyName,
          productTypeName,
          deptId:getCookie("dept_id"),
          id:details.id,
          price:values.price ? Number(values.price) : null,
          settlePrice:values.settlePrice ? Number(values.settlePrice) : null,
          originalName:Imglist.originalName
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
    console.log(row)
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
    this.props.details.h5Background=row.link;
    this.setState({
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
      handleEditVisible,
      handleCancelEdit,
      details
    } = this.props;

    const {
      data,
      loading,
      paypanyList,
      handleImgVisible,
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
    console.log(details)

    return (
      <div>
        <Modal
          title="修改"
          visible={handleEditVisible}
          maskClosable={false}
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
          <div className={styles.add}>
            <Form style={{ marginTop: 8 }}>
              <FormItem {...formAllItemLayout} label="支付公司">
                {getFieldDecorator('payPanyId', {
                  initialValue: parseInt(details.payPanyId),
                  rules: [
                    {
                      required: true,
                      message: '请选择支付公司',
                    },
                  ],
                })(
                  <Select disabled placeholder="请选择支付公司" onChange={(key,row)=>{this.onChange(key,row,"payPanyId")}}>
                    {paypanyList.map((item)=>{
                      return (<Option key={item.id} value={item.id}>{item.payName}</Option>)
                    })}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formAllItemLayout} label="支付类型">
                {getFieldDecorator('productTypeId', {
                  initialValue: parseInt(details.productTypeId),
                  rules: [
                    {
                      required: true,
                      message: '请选择支付类型',
                    },
                  ],
                })(
                  <Select disabled placeholder="请选择支付类型" onChange={(key,row)=>{this.onChange(key,row,"productTypeId")}}>
                    {productcategoryList.map((item)=>{
                      return (<Option key={item.id} value={item.id}>{item.productTypeName}</Option>)
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
              <FormItem {...formAllItemLayout} label="页面标题">
                {getFieldDecorator('h5Title', {
                  initialValue: details.h5Title,
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
                  initialValue: details.h5Background,
                })(<Input disabled style={{width:"340px",marginRight:"10px"}} placeholder="详情图"/>)}
                <Button type="primary"  onClick={()=>{this.handleImg()}}>选择图片</Button>
                <Tooltip title={this.reactNode}><Icon type='question-circle-o' /></Tooltip>
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
              {/*<FormItem {...formAllItemLayout} label="结算价">*/}
                {/*{getFieldDecorator('settlePrice', {*/}
                  {/*initialValue: details.settlePrice,*/}
                  {/*rules: [*/}
                    {/*{*/}
                      {/*required: true,*/}
                      {/*validator:this.countChange,*/}
                    {/*},*/}
                  {/*],*/}
                {/*})(<Input placeholder="请输入结算价" />)}*/}
              {/*</FormItem>*/}
              {/*<FormItem {...formAllItemLayout} label="排序编号">*/}
                {/*{getFieldDecorator('sortNumber', {*/}
                  {/*initialValue: details.sortNumber,*/}
                  {/*rules: [*/}
                    {/*{*/}
                      {/*required: true,*/}
                      {/*validator:this.valinsPayChange*/}
                    {/*},*/}
                  {/*],*/}
                {/*})(<Input placeholder="请输入排序编号" />)}*/}
              {/*</FormItem>*/}
              <FormItem {...formAllItemLayout} label="一阶段">
                {getFieldDecorator('customOne', {
                  initialValue: details.customOne,
                })(<Input placeholder="请输入一阶段" disabled={details.customOne ==='0' || details.customOne ==='' ? false : true} />)}
              </FormItem>
              <FormItem {...formAllItemLayout} label="二阶段">
                {getFieldDecorator('customTwo', {
                  initialValue: details.customTwo,
                })(<Input placeholder="请输入二阶段" disabled={details.customTwo ==='0' || details.customTwo ==='' ? false : true} />)}
              </FormItem>
              <FormItem {...formAllItemLayout} label="三阶段">
                {getFieldDecorator('customThree', {
                  initialValue: details.customThree,
                })(<Input placeholder="请输入三阶段" disabled={details.customThree ==='0' || details.customThree ==='' ? false : true} />)}
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
