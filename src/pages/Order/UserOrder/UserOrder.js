import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, Row } from 'antd';
import Panel from '../../../components/Panel';
import { USERORDER_LIST } from '../../../actions/userOrder';
import Grid from '../../../components/Sword/Grid';

const FormItem = Form.Item;

@connect(({ userOrder, loading }) => ({   
  userOrder,
  loading: loading.models.userOrder,
}))
@Form.create()
class UserOrder extends PureComponent {
  // ============ 查询 ===============
  handleSearch = params => {
    const { dispatch } = this.props;
    dispatch(USERORDER_LIST(params));
  };

  // ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={6} sm={24}>
          <FormItem label="查询名称">
            {getFieldDecorator('name')(<Input placeholder="查询名称" />)}
          </FormItem>
        </Col>
        <Col>
          <div style={{ float: 'right' }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={onReset}>
              重置
            </Button>
          </div>
        </Col>
      </Row>
    );
  };

  render() {
    const code = 'userOrder';

    const {
      form,
      loading,
      userOrder: { data },
    } = this.props;

    const columns = [
      {
        title: '客户姓名',
        dataIndex: 'userName',
      },
      {
        title: '手机号码',
        dataIndex: 'userPhone',
      },
      {
        title: '手机状态',
        dataIndex: 'smsState',
      },
      {
        title: '客户地址',
        dataIndex: 'userAddress',
      },
      {
        title: '客户备份地址',
        dataIndex: 'backupAddress',
      },
      {
        title: '商户的资金授权订单号',
        dataIndex: 'outOrderNo',
      },
      {
        title: '当前订单对应的备注信息',
        dataIndex: 'orderNote',
      },
      {
        title: '本次操作冻结的金额，单位为：元（人民币），精确到小数点后两位',
        dataIndex: 'payAmount',
      },
      {
        title: '剩余冻结金额',
        dataIndex: 'restAmount',
      },
      {
        title: '扣款金额',
        dataIndex: 'paidAmount',
      },
      {
        title: '业务员姓名',
        dataIndex: 'salesman',
      },
      {
        title: '归属账号名下--代理账号',
        dataIndex: 'belongingId',
      },
      {
        title: '归属名称--代理名称',
        dataIndex: 'belongingName',
      },
      {
        title: '设备品牌',
        dataIndex: 'equipmentBrand',
      },
      {
        title: '设备序列号',
        dataIndex: 'deviceSerialNumber',
      },
      {
        title: '物流公司',
        dataIndex: 'logisticsCompany',
      },
      {
        title: '物流单号',
        dataIndex: 'logisticsNumber',
      },
      {
        title: '物流更新时间',
        dataIndex: 'logisticsTime',
      },
      {
        title: '物流签收时间',
        dataIndex: 'logisticsSigntime',
      },
      {
        title: '物流当前状态',
        dataIndex: 'logisticsStatus',
      },
      {
        title: '任务id-md5',
        dataIndex: 'taskId',
      },
      {
        title: '物流打印时间=提供给复时间计算',
        dataIndex: 'taskCreateTime',
      },
      {
        title: '履约状态:0->未履约；1:留空 2->已履约 3 履约失败',
        dataIndex: 'performanceStatus',
      },
      {
        title: '授权时间',
        dataIndex: 'authorizationTime',
      },
      {
        title: '解冻时间-最后一次解冻时间  否则就是一次性解冻',
        dataIndex: 'thawTime',
      },
      {
        title: '扣款时间',
        dataIndex: 'processingTime',
      },
      {
        title: '授信通道类型 1 支付宝 2微信 3免费通道 4 后台录入',
        dataIndex: 'channelType',
      },
      {
        title: '授权类型 芝麻 资金 微信分 现金',
        dataIndex: 'authorizationType',
      },
      {
        title: '归属于oem的id',
        dataIndex: 'oemId',
      },
      {
        title: '当前数据归属于的通道id 主键列表的',
        dataIndex: 'channelId',
      },
      {
        title: '来自于那个设备通道 微信 支付宝 浏览器',
        dataIndex: 'channelIdentification',
      },
      {
        title: 'ip地址',
        dataIndex: 'ipAddress',
      },
      {
        title: '微信用户的openid',
        dataIndex: 'openid',
      },
      {
        title: '确认标志:0->已确认:1',
        dataIndex: 'confirmTag',
      },
      {
        title: '省',
        dataIndex: 'province',
      },
      {
        title: '市',
        dataIndex: 'city',
      },
      {
        title: '区',
        dataIndex: 'area',
      },
      {
        title: '县',
        dataIndex: 'county',
      },
    ];

    return (
      <Panel>
        <Grid
          code={code}
          form={form}
          onSearch={this.handleSearch}
          renderSearchForm={this.renderSearchForm}
          loading={loading}
          data={data}
          columns={columns}
        />
      </Panel>
    );
  }
}
export default UserOrder;
