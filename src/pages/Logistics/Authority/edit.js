import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, DatePicker, message, Radio } from 'antd';
import { connect } from 'dva';
import moment from 'moment'
import Panel from '../../../components/Panel';
import func from '../../../utils/Func';
import { getCookie } from '../../../utils/support';
import { getSubmit } from '../../../services/newServices/logistics';
import router from 'umi/router';
import { STATUS } from './data.js';
import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
class LogisticsAdd extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:[],
    };
  }

  componentWillMount() {

    this.setState({
      data:JSON.parse(this.props.match.params.id)
    })

  }

  handleSubmit = e => {
    e.preventDefault();
    const {  form } = this.props;
    const {data} = this.state;
    form.validateFieldsAndScroll((err, values) => {
      values.deptId = getCookie("dept_id");
      if (!err) {
        const params = {
          ...values,
          id:data.id,
        };
        getSubmit(params).then(res=>{
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
    const {data} = this.state;

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
      <Panel title="修改" back="/logistics/authority" action={action}>
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
                    initialValue: data.partnerId,
                  })(<Input placeholder="授权ID" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="授权key:">
                  {getFieldDecorator('partnerKey',{
                    initialValue: data.partnerKey,
                  })(<Input placeholder="授权key" />)}
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
                    initialValue: data.checkMan,
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
                    initialValue: data.net,
                  })(<Input placeholder="请输入当地网点名称" />)}
                </FormItem>
              </Col>
            </Row>
{/*
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="默认开关：">
                  {getFieldDecorator('status',{
                    initialValue: data.status,
                  })(
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
*/}
          </Card>
        </Form>
      </Panel>
    );
  }
}

export default LogisticsAdd;
