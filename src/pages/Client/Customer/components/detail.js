import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  Modal,
  Select,
  message,
  Cascader,
  DatePicker,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from './edit.less';
import { CITY } from '../../../../utils/city';
import {
  localPrinting,
  logisticsRepeatPrint,
} from '../../../../services/newServices/order';
import FormDetailsTitle from '../../../../components/FormDetailsTitle';
import { CLIENTTYPE } from '@/pages/Client/Customer/data';
import SalesSelect from '@/pages/Client/Customer/components/salesSelect';

const FormItem = Form.Item;
const { TextArea } = Input;


@connect(({ globalParameters}) => ({
  globalParameters,
}))
class CustomerDetail extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      detail:{},
      data:{
        order:'10',
        followUp:'2',
        service0rder:'6',
        product:"9",
        ownership:"3"
      },
      ids:'',
      selectedOptions:"",
      primary:'primary',
      primary1:'',
      repeatLoading:false,
      payPanyId:null,
      productTypeId:null,
      productId:null,
      detailsId:null,

      clientLevels:[],//客户级别数组
      clientStatus:[],//客户等级数组
    };
  }

  componentWillMount() {
    const { globalParameters } = this.props;
    console.log(globalParameters)
    const propData = globalParameters.detailData;
    // 获取详情数据
    this.setState({
      detailsId:propData.detail.id,
      clientLevels:propData.clientLevels,
      clientStatus:propData.clientStatus
    },()=>{
    });

  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { detail } = this.props;
    this.setState({
      detail:detail
    })
  }

  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  }

  onChange = (value, selectedOptions) => {
    let text = ""
    for(let i=0; i<selectedOptions.length; i++){
      text += selectedOptions[i].label
    }
    this.setState({
      cityparam:{
        province:value[0],
        city:value[1],
        area:value[2],
      },
      selectedOptions:text
    })
  };

  getText = (key, type) => {
    let text = ""
    type.map(item=>{
      if(item.key === key){
        text = item.name
      }
    })
    return text
  }

  validatePhone = (rule, value, callback) => {
    if (!(/^1[3456789]\d{9}$/.test(value))) {
      callback(new Error('请输入正确的手机号格式'));
    }else{
      callback();
    }
  }

  render() {
    const {
      getFieldDecorator,
      edit
    } = this.props;

    const {
      detail,
      clientStatus,
      clientLevels
    } = this.state;
    const formAllItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    return (
        <div className={styles.editList} style={{ padding: '20px' }}>
          <FormDetailsTitle title="客户信息" style={{ margin:'0'}} />
          <Form span={24}>
            <FormItem {...formAllItemLayout} label="客户编号">
              {getFieldDecorator('clientName', {
                initialValue: detail.clientName,
              })(<Input disabled={true} />)}
            </FormItem>
            <FormItem {...formAllItemLayout} label="联系人">
              {getFieldDecorator('clientName', {
                rules: [
                  { message: '请输入客户姓名' },
                ],
                initialValue: detail.clientName,
              })(<Input disabled={edit} placeholder="请输入客户姓名" />)}
            </FormItem>
            <FormItem {...formAllItemLayout} label="手机号">
              {getFieldDecorator('clientPhone', {
                rules: [
                  { required: true, validator: this.validatePhone },
                ],
                initialValue: detail.clientPhone,
              })(<Input disabled={edit} placeholder="" />)}
            </FormItem>
            <FormItem {...formAllItemLayout} label="手机号2">
              {getFieldDecorator('clientPhone', {
                initialValue: detail.clientPhone,
              })(<Input disabled={edit} placeholder="" />)}
            </FormItem>
            <FormItem {...formAllItemLayout} label="微信号">
              {getFieldDecorator('clientPhone', {
                initialValue: detail.clientPhone,
              })(<Input disabled={edit} placeholder="" />)}
            </FormItem>

            <FormItem {...formAllItemLayout} label="所在地区">
              {getFieldDecorator('region', {
                initialValue: [detail.province, detail.city, detail.area],
              })(
                <Cascader
                  options={CITY}
                  disabled={edit}
                  onChange={this.onChange}
                />
              )}
            </FormItem>
            <FormItem {...formAllItemLayout} label="收货地址">
              {getFieldDecorator('clientAddress', {
                initialValue: detail.clientAddress,
              })(<Input title={detail.clientAddress} disabled={edit} placeholder="请输入详细地址" />)}
            </FormItem>
            <FormItem {...formAllItemLayout} label="客户负责人" className={styles.salesman}>
              {getFieldDecorator('salesman', {
                initialValue: detail.salesman,
              })(<SalesSelect disabled={true}/>)}
            </FormItem>

            <FormDetailsTitle title="商务信息" />
            <FormItem {...formAllItemLayout} label="客户等级">
              {getFieldDecorator('clientLevel', {
                initialValue: detail.clientLevel
              })(
                <Select disabled={edit}>
                  {clientLevels.map(d => (
                    <Select.Option key={d.id} value={d.id+''}>
                      {d.labelName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formAllItemLayout} label="客户来源">
              {getFieldDecorator('clientType',{
                initialValue: detail.clientType+'',
                rules: [
                  { required: true, message: '请选择客户来源' },
                ],
              })(
                <Select disabled={edit}>
                  {CLIENTTYPE.map(d => (
                    <Select.Option key={d.key} value={d.key+''}>
                      {d.val}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formAllItemLayout} label="客户状态">
              {getFieldDecorator('clientStatus',{
                initialValue: detail.clientStatus
              })(
                <Select disabled={edit}>
                  {clientStatus.map(d => (
                    <Select.Option key={d.id} value={d.id+''}>
                      {d.labelName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formAllItemLayout} label="创建人">
              {getFieldDecorator('createUser', {
                initialValue: detail.createUser,
              })(<Input disabled={true} placeholder="" />)}
            </FormItem>
            <FormItem {...formAllItemLayout} label="系统编号">
              {getFieldDecorator('clientPhone', {
                initialValue: detail.clientPhone,
              })(<Input disabled={true} placeholder="" />)}
            </FormItem>

            <FormItem {...formAllItemLayout} label="创建时间">
              {getFieldDecorator('createTime', {
                initialValue: moment(detail.createTime),
              })(<DatePicker
                disabled={true}
                style={{ width: '100%' }}
              />)}
            </FormItem>
            <FormItem {...formAllItemLayout} label="更新时间">
              {getFieldDecorator('updateTime', {
                initialValue: moment(detail.updateTime),
              })(<DatePicker
                disabled={true}
                style={{ width: '100%' }}
              />)}
            </FormItem>
            <FormItem {...formAllItemLayout} label="最后跟进时间">
              {getFieldDecorator('nextFollowTime', {
                initialValue: moment(detail.nextFollowTime),
              })(<DatePicker
                disabled={detail.nextFollowTime ? true : edit}
                style={{ width: '100%' }}
                format="YYYY-MM-DD HH:mm:ss"
              />)}
            </FormItem>
            {/*<FormItem {...formAllItemLayout} label="备注">*/}
            {/*  {getFieldDecorator('note', {*/}
            {/*    initialValue: detail.note,*/}
            {/*  })(<TextArea rows={4} disabled={edit} placeholder="请输入备注信息" />)}*/}
            {/*</FormItem>*/}
          </Form>
        </div>
    );
  }
}

export default CustomerDetail;
