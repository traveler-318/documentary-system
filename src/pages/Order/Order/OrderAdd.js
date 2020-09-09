import React, { PureComponent } from 'react';
import { Form, Input, Card, Button } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import { ORDER_SUBMIT } from '../../../actions/order';

const FormItem = Form.Item;

@connect(({ loading }) => ({
  submitting: loading.effects['order/submit'],
}))
@Form.create()
class OrderAdd extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch(ORDER_SUBMIT(values));
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
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
      <Panel title="新增" back="/order/order" action={action}>
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
              })(<Input placeholder="请输入县" />)}
            </FormItem>
          </Card>
        </Form>
      </Panel>
    );
  }
}

export default OrderAdd;
