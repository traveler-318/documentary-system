import React, { PureComponent } from 'react';
import router from 'umi/router';
import { Form, Card, Button } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import { USERORDER_DETAIL } from '../../../actions/userorder';

const FormItem = Form.Item;

@connect(({ userOrder }) => ({
  userOrder,
}))
@Form.create()
class UserOrderView extends PureComponent {
  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(USERORDER_DETAIL(id));
  }

  handleEdit = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    router.push(`/order/userOrder/edit/${id}`);
  };

  render() {
    const {
      userOrder: { detail },
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
      <Button type="primary" onClick={this.handleEdit}>
        修改
      </Button>
    );

    return (
      <Panel title="查看" back="/order/userOrder" action={action}>
        <Form hideRequiredMark style={{ marginTop: 8 }}>
          <Card className={styles.card} bordered={false}>
            <FormItem {...formItemLayout} label="客户姓名">
              <span>{detail.userName}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="手机号码">
              <span>{detail.userPhone}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="手机状态">
              <span>{detail.smsState}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="客户地址">
              <span>{detail.userAddress}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="客户备份地址">
              <span>{detail.backupAddress}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="商户的资金授权订单号">
              <span>{detail.outOrderNo}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="当前订单对应的备注信息">
              <span>{detail.orderNote}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="本次操作冻结的金额，单位为：元（人民币），精确到小数点后两位">
              <span>{detail.payAmount}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="剩余冻结金额">
              <span>{detail.restAmount}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="扣款金额">
              <span>{detail.paidAmount}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="业务员姓名">
              <span>{detail.salesman}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="归属账号名下--代理账号">
              <span>{detail.belongingId}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="归属名称--代理名称">
              <span>{detail.belongingName}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="设备品牌">
              <span>{detail.equipmentBrand}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="设备序列号">
              <span>{detail.deviceSerialNumber}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="物流公司">
              <span>{detail.logisticsCompany}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="物流单号">
              <span>{detail.logisticsNumber}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="物流更新时间">
              <span>{detail.logisticsTime}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="物流签收时间">
              <span>{detail.logisticsSigntime}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="物流当前状态">
              <span>{detail.logisticsStatus}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="任务id-md5">
              <span>{detail.taskId}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="物流打印时间=提供给复时间计算">
              <span>{detail.taskCreateTime}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="履约状态:0->未履约；1:留空 2->已履约 3 履约失败">
              <span>{detail.performanceStatus}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="授权时间">
              <span>{detail.authorizationTime}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="解冻时间-最后一次解冻时间  否则就是一次性解冻">
              <span>{detail.thawTime}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="扣款时间">
              <span>{detail.processingTime}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="授信通道类型 1 支付宝 2微信 3免费通道 4 后台录入">
              <span>{detail.channelType}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="授权类型 芝麻 资金 微信分 现金">
              <span>{detail.authorizationType}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="归属于oem的id">
              <span>{detail.oemId}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="当前数据归属于的通道id 主键列表的">
              <span>{detail.channelId}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="来自于那个设备通道 微信 支付宝 浏览器">
              <span>{detail.channelIdentification}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="ip地址">
              <span>{detail.ipAddress}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="微信用户的openid">
              <span>{detail.openid}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="确认标志:0->已确认:1">
              <span>{detail.confirmTag}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="省">
              <span>{detail.province}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="市">
              <span>{detail.city}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="区">
              <span>{detail.area}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="县">
              <span>{detail.county}</span>
            </FormItem>
          </Card>
        </Form>
      </Panel>
    );
  }
}
export default UserOrderView;
