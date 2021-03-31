import React, { PureComponent } from 'react';
import { Form, Input, Card, Button, Select, message, DatePicker } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';

import Panel from '../../components/Panel';
import FormTitle from '../../components/FormTitle';
import styles from '../../layouts/Sword.less';
import { getCookie } from '../../utils/support';
import { superiorSave } from '../../services/authorized';

const FormItem = Form.Item;
const { TextArea } = Input;

let backUrl = '/branchManage/authorized';

@connect(({ user, loading }) => ({
  user,
  submitting: loading.effects['user/submit'],
}))
@Form.create()
class AuthorizedAdd extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      saveData: {
        authorizationId: null,	//AccessKey ID
        authorizationToken: null,	//AccessKey Secret
      },
      loading: false,
    };
  }


  componentWillMount() {

  }

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { saveData } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          loading:true
        })
        values.deptId = getCookie('dept_id');
        values.tenantId = getCookie('tenantId');
        values = { ...saveData, ...values };
        console.log(values, '提交数据');
        superiorSave(values).then(res => {
          if (res.code === 200) {
            message.success(res.msg);
            router.push(backUrl);
          }else{
            this.setState({
              loading:false
            })
          }
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;


    const {
      loading
    } = this.state;

    const formAllItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };

    const action = (
      <Button type="primary" onClick={this.handleSubmit} loading={loading}>
        提交
      </Button>
    );

    return (
      <Panel title="新增" back={`${backUrl}?type=details`} action={action}>
        <Form style={{ marginTop: 8 }}>
          <div></div>
          <Card title="添加授权" className={styles.card} bordered={false}>
            <FormTitle
              title="基础信息"
            />
            <FormItem {...formAllItemLayout} label="AccessKey">
              {getFieldDecorator('authorizationId', {
                rules: [
                  { required: true, message: '请输入AccessKey' },
                ],
              })(
                <Input placeholder={'请输入AccessKey'}/>,
              )}
            </FormItem>
            <FormItem {...formAllItemLayout} label="Key Secret">
              {getFieldDecorator('authorizationToken', {
                rules: [
                  { required: true, message: '请输入Key Secret' },
                ],
              })(
                <Input placeholder={'请输入Key Secret'}/>,
              )}
            </FormItem>

            {/*<FormItem {...formAllItemLayout} label="备注信息">*/}
            {/*  {getFieldDecorator('remark')(*/}
            {/*    <TextArea rows={4}/>,*/}
            {/*  )}*/}
            {/*</FormItem>*/}

          </Card>

        </Form>


      </Panel>
    );
  }
}

export default AuthorizedAdd;
