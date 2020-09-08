import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, InputNumber, TreeSelect, Select } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import func from '../../../utils/Func';
import { LOGISTICS_INIT, LOGISTICS_SUBMIT } from '../../../actions/logistics';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ logistics, loading }) => ({
  logistics,
  submitting: loading.effects['logistics/submit'],
}))
@Form.create()
class RoleAdd extends PureComponent {

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(LOGISTICS_INIT());
  }

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch(LOGISTICS_SUBMIT(values));
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      logistics: {
        detail,
        //init: { tree },
      },
      submitting,
    } = this.props;

    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const action = (
      <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
        提交
      </Button>
    );

    return (
      <Panel title="新增" back="/logistics/authority" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="授权ID：">
                  {getFieldDecorator('partnerId', {
                    rules: [
                      {
                        required: true,
                        message: '请输入授权ID',
                      },
                    ],
                  })(<Input placeholder="请输入授权ID" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="授权key：">
                  {getFieldDecorator('partnerKey')(<Input placeholder="请输入授权key" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="快递员名称：">
                  {getFieldDecorator('checkMan', {
                    rules: [
                      {
                        required: true,
                        message: '请输入快递员名称',
                      },
                    ],
                  })(<Input placeholder="请输入快递员名称" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="当地网点名称:">
                  {getFieldDecorator('net', {
                    rules: [
                      {
                        required: true,
                        message: '请输入当地网点名称',
                      },
                    ],
                  })(<Input placeholder="请输入当地网点名称" />)}
                </FormItem>
              </Col>
            </Row>
          </Card>
        </Form>
      </Panel>
    );
  }
}

export default RoleAdd;
