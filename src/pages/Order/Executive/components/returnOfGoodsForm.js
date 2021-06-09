import React, { PureComponent } from 'react';
import {
  Modal,
  Form,
  Button, Card, Row, Col, Input, Cascader, Select, DatePicker, message,Radio
} from 'antd';
import { connect } from 'dva';
import styles from '@/layouts/Sword.less';
import { ORDERSOURCE, ORDERTYPE } from '@/pages/Order/OrderList/data';
import moment from 'moment';
import {
  returnOfGoodsCapacity, returnOfGoodsList,
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
      capacitys:[]
    };
  }

  componentWillMount() {
    this.getCapacityDataInfo();
  }

  getCapacityDataInfo =() =>{
    let {returnOfGoodsList} = this.props;
    returnOfGoodsCapacity({
      id:returnOfGoodsList[0].id
    }).then(res=>{
      this.setState({capacitys:res.data})
    })
  }
  handleClick = ()=>{

  }

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const params = {
        ...values,
      };
      returnOfGoodsSave(params).then(resp => {
        if (resp.success) {
          message.success(resp.msg);
          form.resetFields();
        } else {
          message.error(resp.msg || '提交失败');
        }
      });
    });
  };

  validatePhone = (rule, value, callback) => {
    if (!(/^1[3456789]\d{9}$/.test(value))) {
      callback(new Error('请输入正确的手机号格式'));
    }else{
      callback();
    }
  }


  render() {
    const {
      form: { getFieldDecorator },
      visible,
      confirmLoading,
      handleCancel
    } = this.props;

    const {loading,capacitys} = this.state;

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
          title="退货管理"
          width={550}
          visible={visible}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          maskClosable={false}
          loading={loading}
        >
          <Form style={{ marginTop: 8 }} onSubmit={this.handleSubmit}>
            <Card title="创建客户" className={styles.card} bordered={false}>
              <Row gutter={24}>
                <Col span={12}>
                  <FormItem {...formAllItemLayout} label="姓名">
                    {getFieldDecorator('recManName', {
                      rules: [
                        {
                          required: true,
                          message: '请输入姓名',
                        },
                      ],
                    })(<Input placeholder="请输入姓名" />)}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="手机号">
                    {getFieldDecorator('recManMobile', {
                      rules: [
                        { required: true, validator: this.validatePhone },
                      ],
                    })(<Input placeholder="请输入手机号" />)}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="寄件地址">
                    {getFieldDecorator('sendManPrintAddr', {
                      rules: [
                        {
                          required: true,
                          message: '请输入寄件地址',
                        },
                      ],
                    })(<Input placeholder="请输入寄件地址" />)}
                  </FormItem>

                  <FormItem {...formAllItemLayout} label="快递公司">
                    {getFieldDecorator('com', {
                    })(
                      <Select placeholder={"请选择快递公司"}>
                        {capacitys.map(item=>{
                          return (<Select.Option value={item.com}>{item.value}</Select.Option>)
                        })}
                      </Select>
                    )}
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
                </Col>
                <Col span={12}>
                  <FormItem {...formAllItemLayout} label="付款方式">
                    {getFieldDecorator('payment', {
                      initialValue: 'SHIPPER',
                      rules: [
                        {
                          required: true,
                          message: '请选择订单来源',
                        },
                      ],
                    })(
                      <Radio.Group >
                        <Radio value='SHIPPER'>寄付</Radio>
                        <Radio value='CONSIGNEE'>到付</Radio>
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
                  <FormItem >
                    <Button onClick={handleCancel}>
                      取消
                    </Button>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                      保存
                    </Button>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                      取消下单
                    </Button>
                  </FormItem>
                </Col>
              </Row>

            </Card>

          </Form>
        </Modal>

      </>
    );
  }
}

export default ReturnOfGoodsForm;
