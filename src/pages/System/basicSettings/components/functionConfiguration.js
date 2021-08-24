import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import {
  Form,
  Input,
  Upload,
  Button,
  message,
  Icon,
  Card,
  Radio,
  Row,
  Col,
  Select, Tooltip,
} from 'antd';
import { getUserInfo, updateInfo ,propertyUpdate,getSalesmanInfo} from '../../../../services/user';
import { getToken } from '../../../../utils/authority';

import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
// const GRADE = [
//   {name:"一级",key:1},
//   {name:"二级",key:2},
// ]
@Form.create()
class BaseView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      avatar: '',
      loading: false,
      details: {}
    };
  }

  componentWillMount() {
    this.setBaseInfo();

  }

  setBaseInfo = () => {
    const { form } = this.props;
    getUserInfo().then(resp => {
      if (resp.success) {
        const userInfo = resp.data;
        this.setState({ userId: userInfo.id, avatar: userInfo.avatar });
        this.salesmanInfo(userInfo);
      } else {
        message.error(resp.msg || '获取数据失败');
      }
    });
  };

  salesmanInfo = (userInfo) => {
    getSalesmanInfo().then(resp => {
      const { form } = this.props;

      const _data = {...resp.data,...userInfo}
      Object.keys(form.getFieldsValue()).forEach(key => {
        const obj = {};
        obj[key] = _data[key];
        form.setFieldsValue(obj);
      });
      this.setState({
        details:resp.data
      })
    });
  };

  beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      this.setState({ loading: false, avatar: info.file.response.data.link });
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { userId, avatar } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const property={
          id: userId,
          daysOverdue:values.daysOverdue,
          transferNumber:values.transferNumber,
          authenticationStatus:values.authenticationStatus
        }
        propertyUpdate(property).then(resp => {
          if (resp.success) {
            // message.success(resp.msg);
          } else {
            // message.error(resp.msg || '提交失败');
          }
        });
        const params = {
          id: userId,
          ...values,
          avatar,
        };
        updateInfo(params).then(resp => {
          if (resp.success) {
            message.success(resp.msg);
          } else {
            message.error(resp.msg || '提交失败');
          }
        });
      }
    });
  };

  // 验证整数
  checkInteger = (rule, value, callback) => {
    var re = /^[0-9]+$/ ;
    if (re.test(value)) {
      return callback();
    }
    callback('请输入正整数!');
  }

  reactNode = () => {
    return(
      <div>
        <p>1、当开启供应商发货后，并且有配置发货地址后，供应商将会看到你所克隆供应商的产品所产生的订单用于集中发货（其他自行配置的产品或者非当前上级供应商的则无法看到您的订单）</p>
        <p>2、当开启供应商发货后，并且未配置发货地址后，供应商将无法看到你所克隆供应商的产品所产生的订单</p>
      </div>
    )
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const { avatar, loading ,details} = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 12 },
      },
    };


    const uploadProp = {
      action: '/api/blade-resource/oss/endpoint/put-file',
      headers: {
        'Blade-Auth': getToken(),
      },
    };

    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传头像</div>
      </div>
    );

    return (
        <div className={styles.basicConfiguration}>
          <Row gutter={24}>
              <Col span={12}>
              {/*<FormItem {...formItemLayout} label={'有效期天数'}>*/}
                {/*{getFieldDecorator('periodValidity', {*/}
                  {/*rules: [{ validator: this.checkInteger }],*/}
                {/*})(*/}
                  {/*<Input />*/}
                {/*)}*/}
              {/*</FormItem>*/}
                <FormItem {...formItemLayout} label={'过期天数'}>
                  {getFieldDecorator('daysOverdue', {
                    // initialValue: details.daysOverdue,
                    rules: [{ validator: this.checkInteger }],
                  })(<Input placeholder="0:不开启,大于0启动任务扫描 " />)}
                  <Tooltip
                    title="用户在快递签收后，销售也有在跟进，超过*天的订单还未激活，就自动流转到已过期。"
                  ><Icon type='question-circle-o' style={{position: 'absolute',right: '-23px',top: '3px'}} /></Tooltip>
                </FormItem>
                <FormItem {...formItemLayout} label={'维护天数'}>
                  {getFieldDecorator('transferNumber', {
                    initialValue: details.transferNumber,
                    rules: [{ validator: this.checkInteger }],
                  })(
                    <Input placeholder="0:不开启,大于0启动任务扫描 " />
                  )}
                  <Tooltip
                    title="用户订单激活后，超过*天，订单就自动流转到待维护，等待后续继续跟进刷卡等其他状态。"
                  ><Icon type='question-circle-o' style={{position: 'absolute',right: '-23px',top: '3px'}} /></Tooltip>
                </FormItem>
                <FormItem {...formItemLayout} label={'网关域名'}>
                  {getFieldDecorator('domainAddress', {
                    initialValue: details.domainAddress,
                  })(<Input />)}
                </FormItem>

                <FormItem {...formItemLayout} label={'打印机类型'}>
                  {getFieldDecorator('localPrintStatus')(
                    <Radio.Group>
                      <Radio key={1} value={1}>图片打印</Radio>
                      <Radio key={2} value={2}>html打印</Radio>
                      <Radio key={3} value={3}>云打印</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label={'下单验证'}>
                  {getFieldDecorator('authenticationStatus', {
                    initialValue: details.authenticationStatus,
                  })(
                    <Radio.Group>
                      <Radio key={2} value={2}>本机+短信</Radio>
                      <Radio key={1} value={1}>短信</Radio>
                      <Radio key={0} value={0}>无</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label={'浏览器跳转'}>
                  {getFieldDecorator('wechatBrowserStatus', {
                    initialValue: details.wechatBrowserStatus,
                  })(
                    <Radio.Group>
                      <Radio key={1} value={1}>是</Radio>
                      <Radio key={0} value={0}>否</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem style={{display:"none"}}>
                  {getFieldDecorator('id')(
                    <Input />
                  )}
                </FormItem>
              </Col>

              {/* ------------------------------------------ */}

              <Col span={12}>
                <FormItem {...formItemLayout} label={'供应商发货'}>
                  {getFieldDecorator('agentDeliveryStatus')(
                    <Radio.Group>
                      <Radio key={1} value={1}>是</Radio>
                      <Radio key={0} value={0}>否</Radio>
                    </Radio.Group>
                  )}
                  <Tooltip
                    title={this.reactNode}
                  ><Icon type='question-circle-o' style={{position: 'absolute',right: '-23px',top: '3px'}} /></Tooltip>
                </FormItem>
                <FormItem {...formItemLayout} label={'系统告警'}>
                  {getFieldDecorator('alarmStatus')(
                    <Radio.Group>
                      <Radio key={1} value={1}>启用</Radio>
                      <Radio key={0} value={0}>禁用</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label={'二维码开关'}>
                  {getFieldDecorator('qrcodeStatus')(
                    <Radio.Group>
                      <Radio key={1} value={1}>启用</Radio>
                      <Radio key={0} value={0}>禁用</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label={'物流查询'}>
                  {getFieldDecorator('logisticsStatus')(
                    <Radio.Group>
                      <Radio key={1} value={1}>启用</Radio>
                      <Radio key={0} value={0}>禁用</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label={'提醒类型'}>
                  {getFieldDecorator('smsStatus')(
                    <Radio.Group>
                      <Radio key={2} value={2}>短信+语音</Radio>
                      <Radio key={1} value={1}>短信</Radio>
                      <Radio key={0} value={0}>关闭</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label={'发货提醒'}>
                  {getFieldDecorator('shipmentRemindStatus')(
                    <Radio.Group>
                      <Radio key={1} value={1}>启用</Radio>
                      <Radio key={0} value={0}>禁用</Radio>
                    </Radio.Group>
                  )}
                </FormItem>



              <FormItem style={{display:"none"}}>
                  {getFieldDecorator('id')(
                    <Input />
                  )}
                </FormItem>
                <FormItem style={{display:"none"}}>
                  {getFieldDecorator('deptId')(
                    <Input />
                  )}
                </FormItem>

              </Col>
          </Row>
        </div>
    );
  }
}

export default BaseView;
