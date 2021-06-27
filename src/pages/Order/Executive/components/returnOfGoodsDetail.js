import React, { PureComponent } from 'react';
import {
  Modal,
  Form,
  Input,
} from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { TextArea } = Input;
@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class ReturnOfGoodsDetail extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentWillMount() {

  }

  render() {
    const {
      form: { getFieldDecorator },
      visible,
      confirmLoading,
      datailDataInfo,
      handleCancel
    } = this.props;

    const {loading} = this.state;

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
          title="退货详情"
          width={550}
          visible={visible}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          maskClosable={false}
          loading={loading}
          footer={null}
        >
          <Form style={{ marginTop: 8 }} onSubmit={this.handleSubmit}>
            <FormItem {...formAllItemLayout} label="收货名字">
              {datailDataInfo.recManName}
            </FormItem>
            <FormItem {...formAllItemLayout} label="收货电话">
              {datailDataInfo.recManMobile}
            </FormItem>
            <FormItem {...formAllItemLayout} label="收货地址">
              {datailDataInfo.recManPrintAddr}
            </FormItem>
            <FormItem {...formAllItemLayout} label="付款类型">
              {datailDataInfo.paymentMode == 1 ?'寄付':datailDataInfo.paymentMode == 2 ?'到付':'平台结算'}
            </FormItem>
            <FormItem {...formAllItemLayout} label="发货地址">
              {datailDataInfo.sendManPrintAddr}
            </FormItem>
            <FormItem {...formAllItemLayout} label="发货日期">
              {datailDataInfo.dayType}
            </FormItem>
            <FormItem {...formAllItemLayout} label="发货时间">
              {datailDataInfo.pickupStartTime +' - '+ datailDataInfo.pickupEndTime}
            </FormItem>
            <FormItem {...formAllItemLayout} label="发货重量">
              {datailDataInfo.weight}
            </FormItem>
            <FormItem {...formAllItemLayout} label="下单备注">
              {datailDataInfo.remark}
            </FormItem>
          </Form>
        </Modal>

      </>
    );
  }
}

export default ReturnOfGoodsDetail;
