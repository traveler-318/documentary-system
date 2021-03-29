import React, { PureComponent } from 'react';
import { Form, Input, Card, Button, Select, message, DatePicker } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';

import Panel from '../../../components/Panel';
import FormTitle from '../../../components/FormTitle';
import styles from '../../../layouts/Sword.less';
import { getCookie } from '../../../utils/support';
import { subordinateSave } from '../../../services/authorized'
import moment from 'moment';
import func from '@/utils/Func';

const FormItem = Form.Item;
const { TextArea } = Input;

let backUrl = "/system/authorized";

@connect(({ user, loading }) => ({
  user,
  submitting: loading.effects['user/submit'],
}))
@Form.create()
class SystemAuthorizedAdd extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      saveData:{
        authorizationModule:null,	//授权模块 订单 其它 等等
        authorizationOperationType:null,	//下级往上授权类型 增删改查
        authorizationTenantId:null,//	授权租户id
        remark:null,//	备注
        timeoutTime:null,//授权到期时间
      },
      loading:false,
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
        values.deptId = getCookie("dept_id");
        values.tenantId = getCookie("tenantId");
        values.timeoutTime =func.format(values.timeoutTime)
        values = {...saveData,...values};
        console.log(values,"提交数据")
        subordinateSave(values).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            router.push(backUrl);
          }
        })
      }
    });
  };


  render() {
    const {
      form: { getFieldDecorator }
    } = this.props;


    const {
      loading,
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
          <Card title="创建授权" className={styles.card} bordered={false}>
            <FormTitle
              title="基础信息"
            />
            <FormItem {...formAllItemLayout} label="授权租户">
              {getFieldDecorator('authorizationTenantId', {
                rules: [
                  { required: true,  message: '请输入授权租户ID' },
                ],
              })(
                <Input placeholder={'请输入授权租户ID'} />
              )}
            </FormItem>
            {/*<FormItem {...formAllItemLayout} label="授权类型">*/}
            {/*  {getFieldDecorator('authorizationOperationType', {*/}
            {/*    rules: [*/}
            {/*      { required: true },*/}
            {/*    ],*/}
            {/*  })(*/}
            {/*    <Select placeholder={"请选择授权类型"}>*/}
            {/*      <Select.Option value={1}>增</Select.Option>*/}
            {/*      <Select.Option value={2}>删</Select.Option>*/}
            {/*      <Select.Option value={3}>改</Select.Option>*/}
            {/*      <Select.Option value={4}>查</Select.Option>*/}
            {/*    </Select>*/}
            {/*  )}*/}
            {/*</FormItem>*/}
            <FormItem {...formAllItemLayout} label="授权到期时间">
              {getFieldDecorator('timeoutTime', {
                rules: [
                  { required: true },
                ],
              })(
                <DatePicker
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                />
              )}
            </FormItem>

            <FormItem {...formAllItemLayout} label="备注信息">
              {getFieldDecorator('remark')(
                <TextArea rows={4} />
              )}
            </FormItem>

          </Card>

        </Form>
      </Panel>
    );
  }
}

export default SystemAuthorizedAdd;
