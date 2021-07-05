import React, { PureComponent } from 'react';
import {
  Modal,
  Form,
  Button, Card, Row, Col, Input, Cascader, Select, DatePicker, message, Radio, TimePicker, Checkbox,
} from 'antd';
import { connect } from 'dva';
import styles from '@/layouts/Sword.less';
import { ORDERSOURCE, ORDERTYPE } from '@/pages/Order/OrderList/data';
import moment from 'moment';
import {
  returnOfGoodsCapacity,
  returnOfGoodsSave,
  realDetails, addressParsing,
} from '../../../../services/newServices/order';

const FormItem = Form.Item;
const { TextArea } = Input;
@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class ReturnOfGoodsForm extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      capacitys:[],
      payment:null,
      dateVals:[
        { value: '今天', label: '今天' },
        { value: '明天', label: '明天' },
        { value: '后天', label: '后天' }
      ],
      dataTimeVals:[
        { name:1,value: '08:00-08:30', label: '08:00 - 08:30' },
        { name:2,value: '08:30-09:00', label: '08:30 - 09:00' },
        { name:3,value: '09:00-09:30', label: '09:00 - 09:30' },
        { name:4,value: '09:30-10:00', label: '09:30 - 10:00' },
        { name:5,value: '10:00-10:30', label: '10:00 - 10:30' },
        { name:6,value: '10:30-11:00', label: '10:30 - 11:00' },
        { name:6,value: '11:00-11:30', label: '11:00 - 11:30' },
        { name:7,value: '11:30-12:00', label: '11:30 - 12:00' },
        { name:8,value: '12:00-12:30', label: '12:00 - 12:30' },
        { name:9,value: '12:30-13:00', label: '12:30 - 13:00' },
        { name:10,value: '13:00-13:30', label: '13:00 - 13:30' },
        { name:11,value: '13:30-14:00', label: '13:30 - 14:00' },
        { name:12,value: '14:00-14:30', label: '14:00 - 14:30' },
        { name:13,value: '14:30-15:00', label: '14:30 - 15:00' },
        { name:14,value: '15:00-15:30', label: '15:00 - 15:30' },
        { name:15,value: '15:30-16:00', label: '15:30 - 16:00' },
        { name:16,value: '16:00-16:30', label: '16:00 - 16:30' },
        { name:17,value: '16:30-17:00', label: '16:30 - 17:00' },
        { name:18,value: '17:00-17:30', label: '17:00 - 17:30' },
        { name:19,value: '17:30-18:00', label: '17:30 - 18:00' },
        { name:20,value: '18:00-18:30', label: '18:00 - 18:30' },
        { name:21,value: '18:30-19:00', label: '18:30 - 19:00' },
      ],
      dateOptions:[],
      realDetail:{},//获取默认姓名、手机等
      isUpdate:true,
      textAAreaValue:'',
      capacityType:'1',
      // dayTime:new Date(+new Date() +8*3600*1000).toISOString().split("T")[1].split(".")[0],//获取当前时间
      // startTime:null,
    };
  }

  componentWillMount() {
    this.getCapacityDataInfo();
    this.getRealDetails();

    //计算时间范围
    let {dateVals,dataTimeVals} = this.state;
    let s = dateVals.map(item=>{
      // if(item.value =='今天'){
      //   let d = new Date();
      //   let h = moment(d).format('HH');
      //   let ds =dataTimeVals.filter(v => v.name>h)
      //   item.children = ds;
      // }else{
      //   item.children = dataTimeVals;
      // }
      item.children = dataTimeVals;
      return item;
    });

    this.setState({
      dateOptions:s
    });
  }

  getRealDetails = ()=>{
    let {returnOfGoodsDataList} = this.props;
    realDetails({
      id:returnOfGoodsDataList[0].id
    }).then(res=>{
      if(res.code==200){
        this.setState({
          realDetail:res.data,
          textAAreaValue:res.data.userAddress
        })
      }else{
        message.error(res.msg);
      }
    })
  }

  getCapacityDataInfo =(v) =>{
    let {returnOfGoodsDataList} = this.props;
    const {capacityType}=this.state
    let json = {
      orderId:returnOfGoodsDataList[0].id,
      productId:returnOfGoodsDataList[0].productId,
      capacityType:capacityType
    };
    if(v){
      json.sendManPrintAddr = v;
    }
    this.setState({textAAreaValue:v})
    returnOfGoodsCapacity(json).then(res=>{
      if(res.code==200){
        const { form } = this.props;
        form.setFieldsValue({
          com: ''
        });
        this.setState({capacitys:res.data})
      }else{
        message.error(res.msg);
      }
    })
  }
  handleClick = ()=>{

  }

  handleSubmit = e => {
    const {
      handleCancel
    } = this.props;
    e.preventDefault();
    const { form,returnOfGoodsDataList } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      let d = values.date;
      const params = {
        ...values,
        orderId:returnOfGoodsDataList[0].id
      };
      params.dayType = d[0];
      let ds = d[1].split('-');
      params.pickupStartTime = ds[0];
      params.pickupEndTime = ds[1];
      delete params.date;

      console.log(params)
      returnOfGoodsSave(params).then(resp => {
        if (resp.success) {
          message.success(resp.msg);
          form.resetFields();
          handleCancel();
        } else {
          message.error(resp.msg || '提交失败');
        }
      });
    });
  };

  validatePhone = (rule, value, callback) => {
    if (value && !(/^1[3456789]\d{9}$/.test(value))) {
      callback(new Error('请输入正确的手机号格式'));
    }else{
      callback();
    }
  }

  onChange = e => {
    const { form } = this.props;
    this.setState({
      capacityType:e.target.value,
      capacitys:[]
    })
    let {returnOfGoodsDataList} = this.props;
    if(e.target.value === '1'){
      let json = {
        orderId:returnOfGoodsDataList[0].id,
        productId:returnOfGoodsDataList[0].productId,
        capacityType:1
      };
      returnOfGoodsCapacity(json).then(res=>{
        if(res.code ===200){
          const { form } = this.props;
          form.setFieldsValue({
            com: ''
          });
          this.setState({capacitys:res.data})
        }else{
          message.error(res.msg);
        }
      })
    }if(e.target.value === '2'){
      let json = {
        orderId:returnOfGoodsDataList[0].id,
        productId:returnOfGoodsDataList[0].productId,
        capacityType:2
      };
      returnOfGoodsCapacity(json).then(res=>{
        if(res.code ===200){
          const { form } = this.props;
          form.setFieldsValue({
            com: ''
          });
          this.setState({capacitys:res.data})
        }else{
          message.error(res.msg);
        }
      })
    }else if(e.target.value === '3'){
      let json = {
        orderId:returnOfGoodsDataList[0].id,
        productId:returnOfGoodsDataList[0].productId,
        capacityType:3
      };
      returnOfGoodsCapacity(json).then(res=>{
        if(res.code ===200){
          const { form } = this.props;
          form.setFieldsValue({
            com: ''
          });
          this.setState({capacitys:res.data})
        }else{
          message.error(res.msg);
        }
      })
    }

    form.setFieldsValue({
      com: ''
    });
    this.setState({
      payment: e.target.value,
    });
  };

  changeIsUpdate = (e) =>{
      this.setState({
        isUpdate:!e.target.checked
      })
  }

  addressParsing =()=>{
    const { form } = this.props;
    const {textAAreaValue}=this.state;
    const _this=this;
    addressParsing({text:textAAreaValue}).then(res=>{
      console.log(res.data)
      if(res.code === 200){
        if(res.data.province === null || res.data.province === undefined){
          res.data.province=''
        }
        if(res.data.city === null || res.data.city === undefined){
          res.data.city=''
        }
        if(res.data.county === null || res.data.county === undefined){
          res.data.county=''
        }
        if(res.data.town === null || res.data.town === undefined){
          res.data.town=''
        }
        if(res.data.detail === null || res.data.detail === undefined){
          res.data.detail=''
        }
        form.setFieldsValue({
          sendManPrintAddr:res.data.province+res.data.city+res.data.county+res.data.town+res.data.detail,
        });
        const userAddress=res.data.province+res.data.city+res.data.county+res.data.town+res.data.detail
        _this.getCapacityDataInfo(userAddress)
      }
    })

  }


  // disabledHours = ()=>{
  //   const { form } = this.props;
  //   let dayType = form.getFieldValue('dayType');
  //   let hours=[];
  //   if(dayType == '今天'){
  //     let time = this.state.dayTime;
  //     let timeArr = time.split(":");
  //     for(var i=0;i<parseInt(timeArr[0]);i++){
  //       hours.push(i)
  //     }
  //   }
  //   return hours;
  // };
  // //限制分钟
  // disabledMinutes = (selectedHour)=>{
  //     const { form } = this.props;
  //     let dayType = form.getFieldValue('dayType');
  //     let minutes =[];
  //     if(dayType == '今天'){
  //       let time = this.state.dayTime;
  //       let timeArr  =time.split(":");
  //       if(selectedHour == parseInt(timeArr[0])){
  //         for(let i=0;i<parseInt(timeArr[1]);i++){
  //           minutes.push(i);
  //         }
  //       }
  //     }
  //     return minutes;
  // };
  //
  // changeTime =(time, timeString) => {
  //   let {_d} = {...time};
  //   console.log(_d.setTime(_d.getTime() + 30 + 60000))
  //   console.log(timeString)
  //   this.setState({
  //     startTime: timeString,
  //     startData:_d.setTime(_d.getTime() + 30 + 60000)
  //   });
  // };
  // getDisabledHours =()=> {
  //   const { form } = this.props;
  //   let dayType = form.getFieldValue('dayType');
  //   let hours = []
  //   let time = this.state.startTime
  //   if(dayType == '今天' && !time) {
  //     time = this.state.dayTime;
  //   }
  //   console.log(moment(this.state.startData).format('HH:mm'))
  //   if(time){
  //     let timeArr = time.split(':')
  //     for (var i = 0; i < parseInt(timeArr[0]); i++) {
  //       hours.push(i)
  //     }
  //   }
  //   return hours
  // };
  // getDisabledMinutes =(selectedHour)=> {
  //   const { form } = this.props;
  //   let dayType = form.getFieldValue('dayType');
  //   let time = this.state.startTime
  //   if(dayType == '今天' && !time) {
  //     time = this.state.dayTime;
  //   }
  //   let minutes = []
  //   if(time) {
  //     let timeArr = time.split(':')
  //     if (selectedHour == parseInt(timeArr[0])) {
  //       for (var i = 0; i < parseInt(timeArr[1]); i++) {
  //         minutes.push(i)
  //       }
  //     }
  //   }
  //   return minutes
  // }

  render() {
    const {
      form: { getFieldDecorator },
      visible,
      confirmLoading,
      handleCancel
    } = this.props;

    const {loading,capacitys,payment,dateOptions,isUpdate,realDetail} = this.state;


    const formAllItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };

    return (
      <>
        <Modal
          title="退货"
          width={550}
          visible={visible}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          maskClosable={false}
          loading={loading}
          footer={[
            <Button onClick={handleCancel}>
              取消
            </Button>,
            <Button type="primary" onClick={this.handleSubmit}>
              立即下单
            </Button>
          ]}
        >
          <Form style={{ marginTop: 8 }} onSubmit={this.handleSubmit}>

                  <FormItem {...formAllItemLayout} label="姓名">
                    {getFieldDecorator('recManName', {
                      initialValue: realDetail.userName || '',
                    })(<Input disabled={isUpdate} placeholder="请输入姓名" />)}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="手机号">
                    {getFieldDecorator('recManMobile', {
                      initialValue: realDetail.userPhone || '',
                      rules: [
                        { validator: this.validatePhone },
                      ],
                    })(<Input disabled={isUpdate} placeholder="请输入手机号" />)}
                  </FormItem>
                  <FormItem {...formAllItemLayout} style={{marginBottom: "0"}} label="寄件地址">
                    {getFieldDecorator('sendManPrintAddr', {
                      initialValue: realDetail.userAddress || '',
                    })(
                        <Input disabled={isUpdate} placeholder="请输入寄件地址" onBlur={(e)=>this.getCapacityDataInfo(e.target.value)} />
                    )}
                  </FormItem>
                  {!isUpdate ? (<p style={{textAlign: "right",width:'100%'}}><span onClick={()=>this.addressParsing()} style={{cursor: "pointer"}}>地址优化</span></p>):(<p style={{marginBottom: "20px"}}></p>)}
                  <FormItem {...formAllItemLayout} label="地址修改">
                    <Checkbox onChange={this.changeIsUpdate}></Checkbox>
                  </FormItem>
                  {/*<div style={{color:'#ccc',padding:'0px 0px 10px 60px'}}>用户退货地址不是收货地址,以上可以更改</div>*/}
                  <FormItem {...formAllItemLayout} label="付款方式">
                    {getFieldDecorator('paymentMode', {
                      initialValue: '1',
                      rules: [
                        {
                          required: true,
                          message: '请选择付款方式',
                        },
                      ],
                    })(
                      <Radio.Group onChange={this.onChange}>
                        <Radio value='1'>寄付</Radio>
                        <Radio value='2'>到付</Radio>
                        <Radio value='3'>平台结算</Radio>
                      </Radio.Group>
                    )}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="快递公司">
                    {getFieldDecorator('com', {
                      rules: [
                        {
                          required: true,
                          message: '请选择快递公司',
                        },
                      ],
                    })(
                      <Select placeholder={"请选择快递公司"}>
                        <Select.Option value=''>请选择</Select.Option>
                        {capacitys.map(item=>{
                          return (<Select.Option value={item.com}>{item.value}</Select.Option>)
                          // if(payment === '2' && item.type === "2"){
                          // }else{
                          //   return (<Select.Option value={item.com+item.type}>{item.value}</Select.Option>)
                          // }
                        })}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="预约时间">
                    {getFieldDecorator('date', {
                      rules: [
                        {
                          required: true,
                          message: '请选择预约时间',
                        },
                      ],
                    })(
                      <Cascader
                        options={dateOptions}
                      ></Cascader>
                    )}
                  </FormItem>
                  {/*<FormItem {...formAllItemLayout} label="预约时间">*/}
                    {/*<FormItem*/}
                      {/*style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>*/}
                      {/*{getFieldDecorator('pickupStartTime', {*/}
                        {/*rules: [*/}
                          {/*{*/}
                            {/*required: true,*/}
                            {/*message: '请选择预约时间',*/}
                          {/*},*/}
                        {/*],*/}
                      {/*})(*/}
                        {/*<TimePicker  format='HH:mm'*/}
                                     {/*disabledHours = {this.disabledHours}*/}
                                     {/*disabledMinutes = {this.disabledMinutes}*/}
                                     {/*onChange={this.changeTime} />*/}
                      {/*)}*/}
                    {/*</FormItem>*/}
                    {/*<span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>*/}

                    {/*<FormItem*/}
                      {/*style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>*/}
                      {/*{getFieldDecorator('pickupEndTime', {*/}
                        {/*rules: [*/}
                          {/*{*/}
                            {/*required: true,*/}
                            {/*message: '请选择预约时间',*/}
                          {/*},*/}
                        {/*],*/}
                      {/*})(*/}
                        {/*<TimePicker  format='HH:mm'*/}
                                     {/*disabledHours = {this.getDisabledHours}*/}
                                     {/*disabledMinutes = {this.getDisabledMinutes}/>*/}
                      {/*)}*/}
                    {/*</FormItem>*/}
                  {/*</FormItem>*/}
                  {/*<FormItem {...formAllItemLayout} label="所在地区">*/}
                  {/*  {getFieldDecorator('region', {*/}
                  {/*  })(*/}
                  {/*    <Cascader*/}
                  {/*      options={CITY}*/}
                  {/*      onChange={this.onChange}*/}
                  {/*    />*/}
                  {/*  )}*/}
                  {/*</FormItem>*/}


                  {/*<FormItem {...formAllItemLayout} label="退货原因">*/}
                  {/*  {getFieldDecorator('productType', {*/}
                  {/*    initialValue: null,*/}
                  {/*  })(*/}

                  {/*  )}*/}
                  {/*</FormItem>*/}

                  <FormItem {...formAllItemLayout} label="退货备注">
                    {getFieldDecorator('remark')(
                      <TextArea rows={4} />
                    )}
                  </FormItem>
          </Form>
        </Modal>

      </>
    );
  }
}

export default ReturnOfGoodsForm;
