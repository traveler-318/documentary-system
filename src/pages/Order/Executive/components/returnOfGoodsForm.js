import React, { PureComponent } from 'react';
import {
  Modal,
  Form,
  Button, Card, Row, Col, Input, Cascader, Select, DatePicker, message,Radio,TimePicker
} from 'antd';
import { connect } from 'dva';
import styles from '@/layouts/Sword.less';
import { ORDERSOURCE, ORDERTYPE } from '@/pages/Order/OrderList/data';
import moment from 'moment';
import {
  returnOfGoodsCapacity,
  returnOfGoodsSave,
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
      startTime:new Date(+new Date() +8*3600*1000).toISOString().split("T")[1].split(".")[0]//获取当前时间
    };
  }

  componentWillMount() {
    this.getCapacityDataInfo();
  }

  getCapacityDataInfo =(v) =>{
    let {returnOfGoodsDataList} = this.props;
    let json = {
      orderId:returnOfGoodsDataList[0].id,
      productId:returnOfGoodsDataList[0].productId
    };
    if(v){
      json.sendManPrintAddr = v;
    }
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
      values.pickupStartTime = moment(values.pickupStartTime).format('HH:mm')
      values.pickupEndTime = moment(values.pickupEndTime).format('HH:mm')
      const params = {
        ...values,
        orderId:returnOfGoodsDataList[0].id
      };
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
    form.setFieldsValue({
      com: ''
    });
    this.setState({
      payment: e.target.value,
    });
  };

  disabledHours = ()=>{
    const { form } = this.props;
    let dayType = form.getFieldValue('dayType');
    let hours=[];
    if(dayType == '今天'){
      let time = this.state.startTime;
      let timeArr = time.split(":");
      for(var i=0;i<parseInt(timeArr[0]);i++){
        hours.push(i)
      }
    }
    return hours;
  };
  //限制分钟
  disabledMinutes = (selectedHour)=>{
      const { form } = this.props;
      let dayType = form.getFieldValue('dayType');
      let minutes =[];
      if(dayType == '今天'){
        let {startTime} = this.state;
        let timeArr  =startTime.split(":");
        if(selectedHour == parseInt(timeArr[0])){
          for(let i=0;i<parseInt(timeArr[1]);i++){
            minutes.push(i);
          }
        }
      }
      return minutes;
  };

  render() {
    const {
      form: { getFieldDecorator },
      visible,
      confirmLoading,
      handleCancel
    } = this.props;

    const {loading,capacitys,payment} = this.state;

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
              保存
            </Button>,
            <Button type="primary" onClick={handleCancel}>
              取消下单
            </Button>
          ]}
        >
          <Form style={{ marginTop: 8 }} onSubmit={this.handleSubmit}>

                  <FormItem {...formAllItemLayout} label="姓名">
                    {getFieldDecorator('recManName', {
                    })(<Input placeholder="请输入姓名" />)}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="手机号">
                    {getFieldDecorator('recManMobile', {
                      rules: [
                        { validator: this.validatePhone },
                      ],
                    })(<Input placeholder="请输入手机号" />)}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="寄件地址">
                    {getFieldDecorator('sendManPrintAddr', {
                    })(<Input placeholder="请输入寄件地址" onBlur={(e)=>this.getCapacityDataInfo(e.target.value)}/>)}
                  </FormItem>
                  <div style={{color:'#ccc',padding:'0px 0px 10px 60px'}}>用户退货地址不是收货地址,以上可以更改</div>
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
                          if(payment == '2' && item.type == 2){
                          }else{
                            return (<Select.Option value={item.com}>{item.value}</Select.Option>)
                          }
                        })}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="预约日期">
                    {getFieldDecorator('dayType', {
                      rules: [
                        {
                          required: true,
                          message: '请选择预约日期',
                        },
                      ],
                    })(

                      <Select placeholder={"请选择预约日期"}
                              onChange={() => {
                                  const { form } = this.props;
                                  form.setFieldsValue({
                                    pickupStartTime: '',
                                    pickupEndTime:''
                                  });
                              }}>
                        <Select.Option value='今天'>今天</Select.Option>
                        <Select.Option value='明天'>明天</Select.Option>
                        <Select.Option value='后天'>后天</Select.Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="预约时间">
                    <FormItem
                      style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                      {getFieldDecorator('pickupStartTime', {
                        rules: [
                          {
                            required: true,
                            message: '请选择预约时间',
                          },
                        ],
                      })(
                        <TimePicker  format='HH:mm'
                                     disabledHours = {this.disabledHours}
                                     disabledMinutes = {this.disabledMinutes}/>
                      )}
                    </FormItem>
                    <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>

                    <FormItem
                      style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                      {getFieldDecorator('pickupEndTime', {
                        rules: [
                          {
                            required: true,
                            message: '请选择预约时间',
                          },
                        ],
                      })(
                        <TimePicker  format='HH:mm'
                                     disabledHours = {this.disabledHours}
                                     disabledMinutes = {this.disabledMinutes}/>
                      )}
                    </FormItem>
                  </FormItem>
                  {/*<FormItem {...formAllItemLayout} label="所在地区">*/}
                  {/*  {getFieldDecorator('region', {*/}
                  {/*  })(*/}
                  {/*    <Cascader*/}
                  {/*      options={CITY}*/}
                  {/*      onChange={this.onChange}*/}
                  {/*    />*/}
                  {/*  )}*/}
                  {/*</FormItem>*/}
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
                      </Radio.Group>
                    )}
                  </FormItem>

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
