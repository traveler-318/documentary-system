import React, { PureComponent } from 'react';
import { Form, Input, Card, Button, Radio } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import { SMS_DETAIL, SMS_INIT, SMS_SUBMIT } from '../../../actions/sms';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@connect(({ sms, loading }) => ({
  sms,
  submitting: loading.effects['sms/submit'],
}))
@Form.create()
class SmsEdit extends PureComponent {
  state = {
    categoryValue: '1',
  };

  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(SMS_INIT());
    dispatch(SMS_DETAIL(id)).then(() => {
      const {
        sms: { detail },
      } = this.props;
      this.setState({
        categoryValue: String(detail.category),
      });
    });
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
        dispatch(SMS_SUBMIT(params));
      }
    });
  };

  onChange = e => {
    this.setState({
      categoryValue: e.target.value,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      sms: { detail, init },
      submitting,
    } = this.props;

    const { category } = init;

    const { categoryValue } = this.state;

    let templateIdLabel = '资源编号';
    let accessKeyLabel = 'accessKey';
    let secretKeyLabel = 'secretKey';
    let secretKeyDisplay = true;
    let regionIdDisplay = false;

    if (categoryValue === '1') {
      templateIdLabel = '模板内容';
      accessKeyLabel = 'apiKey';
      secretKeyDisplay = false;
    } else if (categoryValue === '3') {
      regionIdDisplay = true;
    } else if (categoryValue === '4') {
      accessKeyLabel = 'appId';
      secretKeyLabel = 'appKey';
    }

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
      <Panel title="修改" back="/resource/sms" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card className={styles.card} bordered={false}>
            <FormItem {...formItemLayout} label="分类">
              {getFieldDecorator('category', {
                rules: [
                  {
                    required: true,
                    message: '请输入分类',
                  },
                ],
                initialValue: String(detail.category),
              })(
                <RadioGroup name="category">
                  {category.map(d => (
                    <Radio key={d.dictKey} value={d.dictKey} onChange={this.onChange}>
                      {d.dictValue}
                    </Radio>
                  ))}
                </RadioGroup>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="资源编号">
              {getFieldDecorator('smsCode', {
                rules: [
                  {
                    required: true,
                    message: '请输入资源编号',
                  },
                ],
                initialValue: detail.smsCode,
              })(<Input placeholder="请输入资源编号" />)}
            </FormItem>
            <FormItem {...formItemLayout} label={templateIdLabel}>
              {getFieldDecorator('templateId', {
                rules: [
                  {
                    required: true,
                    message: `请输入${templateIdLabel}`,
                  },
                ],
                initialValue: detail.templateId,
              })(<Input placeholder={`请输入${templateIdLabel}`} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={accessKeyLabel}>
              {getFieldDecorator('accessKey', {
                rules: [
                  {
                    required: true,
                    message: `请输入${accessKeyLabel}`,
                  },
                ],
                initialValue: detail.accessKey,
              })(<Input placeholder={`请输入${accessKeyLabel}`} />)}
            </FormItem>
            {secretKeyDisplay ? (
              <FormItem {...formItemLayout} label={secretKeyLabel}>
                {getFieldDecorator('secretKey', {
                  rules: [
                    {
                      required: true,
                      message: `请输入${secretKeyLabel}`,
                    },
                  ],
                  initialValue: detail.secretKey,
                })(<Input placeholder={`请输入${secretKeyLabel}`} />)}
              </FormItem>
            ) : null}
            {regionIdDisplay ? (
              <FormItem {...formItemLayout} label="regionId">
                {getFieldDecorator('regionId', {
                  rules: [
                    {
                      required: true,
                      message: '请输入regionId',
                    },
                  ],
                  initialValue: detail.regionId,
                })(<Input placeholder="请输入regionId" />)}
              </FormItem>
            ) : null}
            <FormItem {...formItemLayout} label="短信签名">
              {getFieldDecorator('signName', {
                rules: [
                  {
                    required: true,
                    message: '请输入短信签名',
                  },
                ],
                initialValue: detail.signName,
              })(<Input placeholder="请输入短信签名" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator('remark', {
                initialValue: detail.remark,
              })(<Input placeholder="请输入备注" />)}
            </FormItem>
          </Card>
        </Form>
      </Panel>
    );
  }
}

export default SmsEdit;
