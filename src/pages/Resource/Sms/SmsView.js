import React, { PureComponent } from 'react';
import router from 'umi/router';
import { Form, Card, Button } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import { SMS_DETAIL, SMS_INIT } from '../../../actions/sms';

const FormItem = Form.Item;

@connect(({ sms }) => ({
  sms,
}))
@Form.create()
class SmsView extends PureComponent {
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

  handleEdit = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    router.push(`/resource/sms/edit/${id}`);
  };

  render() {
    const {
      sms: { detail },
    } = this.props;

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
      <Button type="primary" onClick={this.handleEdit}>
        修改
      </Button>
    );

    return (
      <Panel title="查看" back="/resource/sms" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card className={styles.card} bordered={false}>
            <FormItem {...formItemLayout} label="分类">
              <span>{detail.categoryName}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="资源编号">
              <span>{detail.smsCode}</span>
            </FormItem>
            <FormItem {...formItemLayout} label={templateIdLabel}>
              <span>{detail.templateId}</span>
            </FormItem>
            <FormItem {...formItemLayout} label={accessKeyLabel}>
              <span>{detail.accessKey}</span>
            </FormItem>
            {secretKeyDisplay ? (
              <FormItem {...formItemLayout} label={secretKeyLabel}>
                <span>{detail.secretKey}</span>
              </FormItem>
            ) : null}
            {regionIdDisplay ? (
              <FormItem {...formItemLayout} label="regionId">
                <span>{detail.regionId}</span>
              </FormItem>
            ) : null}
            <FormItem {...formItemLayout} label="短信签名">
              <span>{detail.signName}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="备注">
              <span>{detail.remark}</span>
            </FormItem>
          </Card>
        </Form>
      </Panel>
    );
  }
}
export default SmsView;
