import React, { PureComponent } from 'react';
import { Form, Input, Card, Button } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import { ORDER_DETAIL, ORDER_SUBMIT } from '../../../actions/order';

const FormItem = Form.Item;

@connect(({ order, loading }) => ({
  order,
  submitting: loading.effects['order/submit'],
}))
@Form.create()
class OrderEdit extends PureComponent {
  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(ORDER_DETAIL(id));
  }

  handleSubmit = e => {
    e.preventDefault();
    const {
      dispatch,
      match: {
        params: { id },
      },
      form,
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          id,
          ...values,
        };
        console.log(params);
        dispatch(ORDER_SUBMIT(params));
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      order: { detail },
      submitting,
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const action = (
      <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
        提交
      </Button>
    );

    return (
      <Panel title="修改" back="/order/order" action={action}>
        <Form hideRequiredMark style={{ marginTop: 8 }}>
          <Card className={styles.card} bordered={false}>
            <FormItem {...formItemLayout} label="客户姓名">
              {getFieldDecorator('userName', {
                rules: [
                  {
                    required: true,
                    message: '请输入客户姓名',
                  },
                ],
                initialValue: detail.userName,
              })(<Input placeholder="请输入客户姓名" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="手机号码">
              {getFieldDecorator('userPhone', {
                rules: [
                  {
                    required: true,
                    message: '请输入手机号码',
                  },
                ],
                initialValue: detail.userPhone,
              })(<Input placeholder="请输入手机号码" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="手机状态">
              {getFieldDecorator('smsState', {
                rules: [
                  {
                    required: true,
                    message: '请输入手机状态',
                  },
                ],
                initialValue: detail.smsState,
              })(<Input placeholder="请输入手机状态" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="客户地址">
              {getFieldDecorator('userAddress', {
                rules: [
                  {
                    required: true,
                    message: '请输入客户地址',
                  },
                ],
                initialValue: detail.userAddress,
              })(<Input placeholder="请输入客户地址" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="客户备份地址">
              {getFieldDecorator('backupAddress', {
                rules: [
                  {
                    required: true,
                    message: '请输入客户备份地址',
                  },
                ],
                initialValue: detail.backupAddress,
              })(<Input placeholder="请输入客户备份地址" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="商户的资金授权订单号">
              {getFieldDecorator('outOrderNo', {
                rules: [
                  {
                    required: true,
                    message: '请输入商户的资金授权订单号',
                  },
                ],
                initialValue: detail.outOrderNo,
              })(<Input placeholder="请输入商户的资金授权订单号" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="当前订单对应的备注信息">
              {getFieldDecorator('orderNote', {
                rules: [
                  {
                    required: true,
                    message: '请输入当前订单对应的备注信息',
                  },
                ],
                initialValue: detail.orderNote,
              })(<Input placeholder="请输入当前订单对应的备注信息" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="本次操作冻结的金额，单位为：元（人民币），精确到小数点后两位">
              {getFieldDecorator('payAmount', {
                rules: [
                  {
                    required: true,
                    message: '请输入本次操作冻结的金额，单位为：元（人民币），精确到小数点后两位',
                  },
                ],
                initialValue: detail.payAmount,
              })(<Input placeholder="请输入本次操作冻结的金额，单位为：元（人民币），精确到小数点后两位" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="剩余冻结金额">
              {getFieldDecorator('restAmount', {
                rules: [
                  {
                    required: true,
                    message: '请输入剩余冻结金额',
                  },
                ],
                initialValue: detail.restAmount,
              })(<Input placeholder="请输入剩余冻结金额" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="扣款金额">
              {getFieldDecorator('paidAmount', {
                rules: [
                  {
                    required: true,
                    message: '请输入扣款金额',
                  },
                ],
                initialValue: detail.paidAmount,
              })(<Input placeholder="请输入扣款金额" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="业务员姓名">
              {getFieldDecorator('salesman', {
                rules: [
                  {
                    required: true,
                    message: '请输入业务员姓名',
                  },
                ],
                initialValue: detail.salesman,
              })(<Input placeholder="请输入业务员姓名" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="归属账号名下--代理账号">
              {getFieldDecorator('belongingId', {
                rules: [
                  {
                    required: true,
                    message: '请输入归属账号名下--代理账号',
                  },
                ],
                initialValue: detail.belongingId,
              })(<Input placeholder="请输入归属账号名下--代理账号" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="归属名称--代理名称">
              {getFieldDecorator('belongingName', {
                rules: [
                  {
                    required: true,
                    message: '请输入归属名称--代理名称',
                  },
                ],
                initialValue: detail.belongingName,
              })(<Input placeholder="请输入归属名称--代理名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="设备品牌">
              {getFieldDecorator('equipmentBrand', {
                rules: [
                  {
                    required: true,
                    message: '请输入设备品牌',
                  },
                ],
                initialValue: detail.equipmentBrand,
              })(<Input placeholder="请输入设备品牌" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="设备序列号">
              {getFieldDecorator('deviceSerialNumber', {
                rules: [
                  {
                    required: true,
                    message: '请输入设备序列号',
                  },
                ],
                initialValue: detail.deviceSerialNumber,
              })(<Input placeholder="请输入设备序列号" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="物流公司">
              {getFieldDecorator('logisticsCompany', {
                rules: [
                  {
                    required: true,
                    message: '请输入物流公司',
                  },
                ],
                initialValue: detail.logisticsCompany,
              })(<Input placeholder="请输入物流公司" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="物流单号">
              {getFieldDecorator('logisticsNumber', {
                rules: [
                  {
                    required: true,
                    message: '请输入物流单号',
                  },
                ],
                initialValue: detail.logisticsNumber,
              })(<Input placeholder="请输入物流单号" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="物流更新时间">
              {getFieldDecorator('logisticsTime', {
                rules: [
                  {
                    required: true,
                    message: '请输入物流更新时间',
                  },
                ],
                initialValue: detail.logisticsTime,
              })(<Input placeholder="请输入物流更新时间" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="物流签收时间">
              {getFieldDecorator('logisticsSigntime', {
                rules: [
                  {
                    required: true,
                    message: '请输入物流签收时间',
                  },
                ],
                initialValue: detail.logisticsSigntime,
              })(<Input placeholder="请输入物流签收时间" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="物流当前状态">
              {getFieldDecorator('logisticsStatus', {
                rules: [
                  {
                    required: true,
                    message: '请输入物流当前状态',
                  },
                ],
                initialValue: detail.logisticsStatus,
              })(<Input placeholder="请输入物流当前状态" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="任务id-md5">
              {getFieldDecorator('taskId', {
                rules: [
                  {
                    required: true,
                    message: '请输入任务id-md5',
                  },
                ],
                initialValue: detail.taskId,
              })(<Input placeholder="请输入任务id-md5" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="物流打印时间=提供给复时间计算">
              {getFieldDecorator('taskCreateTime', {
                rules: [
                  {
                    required: true,
                    message: '请输入物流打印时间=提供给复时间计算',
                  },
                ],
                initialValue: detail.taskCreateTime,
              })(<Input placeholder="请输入物流打印时间=提供给复时间计算" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="履约状态:0->未履约；1:留空 2->已履约 3 履约失败">
              {getFieldDecorator('performanceStatus', {
                rules: [
                  {
                    required: true,
                    message: '请输入履约状态:0->未履约；1:留空 2->已履约 3 履约失败',
                  },
                ],
                initialValue: detail.performanceStatus,
              })(<Input placeholder="请输入履约状态:0->未履约；1:留空 2->已履约 3 履约失败" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="授权时间">
              {getFieldDecorator('authorizationTime', {
                rules: [
                  {
                    required: true,
                    message: '请输入授权时间',
                  },
                ],
                initialValue: detail.authorizationTime,
              })(<Input placeholder="请输入授权时间" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="解冻时间-最后一次解冻时间  否则就是一次性解冻">
              {getFieldDecorator('thawTime', {
                rules: [
                  {
                    required: true,
                    message: '请输入解冻时间-最后一次解冻时间  否则就是一次性解冻',
                  },
                ],
                initialValue: detail.thawTime,
              })(<Input placeholder="请输入解冻时间-最后一次解冻时间  否则就是一次性解冻" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="扣款时间">
              {getFieldDecorator('processingTime', {
                rules: [
                  {
                    required: true,
                    message: '请输入扣款时间',
                  },
                ],
                initialValue: detail.processingTime,
              })(<Input placeholder="请输入扣款时间" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="授信通道类型 1 支付宝 2微信 3免费通道 4 后台录入">
              {getFieldDecorator('channelType', {
                rules: [
                  {
                    required: true,
                    message: '请输入授信通道类型 1 支付宝 2微信 3免费通道 4 后台录入',
                  },
                ],
                initialValue: detail.channelType,
              })(<Input placeholder="请输入授信通道类型 1 支付宝 2微信 3免费通道 4 后台录入" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="授权类型 芝麻 资金 微信分 现金">
              {getFieldDecorator('authorizationType', {
                rules: [
                  {
                    required: true,
                    message: '请输入授权类型 芝麻 资金 微信分 现金',
                  },
                ],
                initialValue: detail.authorizationType,
              })(<Input placeholder="请输入授权类型 芝麻 资金 微信分 现金" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="归属于oem的id">
              {getFieldDecorator('oemId', {
                rules: [
                  {
                    required: true,
                    message: '请输入归属于oem的id',
                  },
                ],
                initialValue: detail.oemId,
              })(<Input placeholder="请输入归属于oem的id" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="当前数据归属于的通道id 主键列表的">
              {getFieldDecorator('channelId', {
                rules: [
                  {
                    required: true,
                    message: '请输入当前数据归属于的通道id 主键列表的',
                  },
                ],
                initialValue: detail.channelId,
              })(<Input placeholder="请输入当前数据归属于的通道id 主键列表的" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="来自于那个设备通道 微信 支付宝 浏览器">
              {getFieldDecorator('channelIdentification', {
                rules: [
                  {
                    required: true,
                    message: '请输入来自于那个设备通道 微信 支付宝 浏览器',
                  },
                ],
                initialValue: detail.channelIdentification,
              })(<Input placeholder="请输入来自于那个设备通道 微信 支付宝 浏览器" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="ip地址">
              {getFieldDecorator('ipAddress', {
                rules: [
                  {
                    required: true,
                    message: '请输入ip地址',
                  },
                ],
                initialValue: detail.ipAddress,
              })(<Input placeholder="请输入ip地址" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="微信用户的openid">
              {getFieldDecorator('openid', {
                rules: [
                  {
                    required: true,
                    message: '请输入微信用户的openid',
                  },
                ],
                initialValue: detail.openid,
              })(<Input placeholder="请输入微信用户的openid" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="确认标志:0->已确认:1">
              {getFieldDecorator('confirmTag', {
                rules: [
                  {
                    required: true,
                    message: '请输入确认标志:0->已确认:1',
                  },
                ],
                initialValue: detail.confirmTag,
              })(<Input placeholder="请输入确认标志:0->已确认:1" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="省">
              {getFieldDecorator('province', {
                rules: [
                  {
                    required: true,
                    message: '请输入省',
                  },
                ],
                initialValue: detail.province,
              })(<Input placeholder="请输入省" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="市">
              {getFieldDecorator('city', {
                rules: [
                  {
                    required: true,
                    message: '请输入市',
                  },
                ],
                initialValue: detail.city,
              })(<Input placeholder="请输入市" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="区">
              {getFieldDecorator('area', {
                rules: [
                  {
                    required: true,
                    message: '请输入区',
                  },
                ],
                initialValue: detail.area,
              })(<Input placeholder="请输入区" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="县">
              {getFieldDecorator('county', {
                rules: [
                  {
                    required: true,
                    message: '请输入县',
                  },
                ],
                initialValue: detail.county,
              })(<Input placeholder="请输入县" />)}
            </FormItem>
          </Card>
        </Form>
      </Panel>
    );
  }
}

export default OrderEdit;
