import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, Radio, TreeSelect, Select, DatePicker, message } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import func from '../../../utils/Func';

import { getAddList } from '../../../services/newServices/logistics';
import router from 'umi/router';
import { STATUS,NETSELECT } from './data.js';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@Form.create()
class LogisticsAdd extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:[],
    };
  }

  componentWillMount() {

  }

  handleSubmit = e => {
    e.preventDefault();
    const {  form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          ...values,
          deptId:"1123598813738675201",
          // createTime: values.createTime.format('YYYY-MM-DD hh:mm:ss'),
        };
        getAddList(params).then(res=>{
          message.success('提交成功');
          router.push('/logistics/authority');
        })
      }
    });
  };


  render() {
    const {
      form: { getFieldDecorator },
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
      <Button type="primary" onClick={this.handleSubmit}>
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
                        message: '授权ID',
                      },
                    ],
                  })(<Input placeholder="授权ID" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="授权key:">
                  {getFieldDecorator('partnerKey')(<Input placeholder="授权key" />)}
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
                    initialValue: null,
                  })(
                    <Select placeholder="请输入当地网点名称">
                      {NETSELECT.map(item=>{
                        return (<Option key={item.key} value={item.name}>{item.name}</Option>)
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="默认开关：">
                  {getFieldDecorator('status')(
                    <Radio.Group>
                      {STATUS.map(item=>{
                        return (
                          <Radio key={item.key} value={item.key}>{item.name}</Radio>
                        )
                      })}
                    </Radio.Group>
                    )}
                </FormItem>
              </Col>
            </Row>

          </Card>
        </Form>
      </Panel>
    );
  }
}

export default LogisticsAdd;
