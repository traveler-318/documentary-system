import React, { PureComponent } from 'react';
import { Form, Input, Card, Button, Select, message, DatePicker } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';

import Panel from '../../../components/Panel';
import FormTitle from '../../../components/FormTitle';
import Authorization from './authorization';
import styles from '../../../layouts/Sword.less';
import { getCookie } from '../../../utils/support';
import { subordinateSave } from '../../../services/authorized';
import moment from 'moment';
import func from '@/utils/Func';

const FormItem = Form.Item;
const { TextArea } = Input;

let backUrl = '/authority/authorized';

@connect(({ user, loading }) => ({
  user,
  submitting: loading.effects['user/submit'],
}))
@Form.create()
class SystemAuthorizedAdd extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      saveData: {
        authorizationModule: null,	//授权模块 订单 其它 等等
        authorizationOperationType: null,	//下级往上授权类型 增删改查
        authorizationTenantId: null,//	授权租户id
        authorizationTenantName:null,
        remark: null,//	备注
        timeoutTime: moment('2099-12-31 00:00:00', 'YYYY-MM-DD HH:mm:ss'),//授权到期时间
      },
      loading: false,
      isTipVisible: false,//密匙提示框显示、隐藏
      authorizaDataInfo:{},//密匙提示内容
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
        values.timeoutTime = func.format(values.timeoutTime);
        values = { ...saveData, ...values };
        console.log(values, '提交数据');
        subordinateSave(values).then(res => {
          if (res.code === 200) {
            this.setState({
              loading:false,
              isTipVisible: true,//密匙提示框显示、隐藏
              authorizaDataInfo:res.data,//密匙提示内容
            })
            // message.success(res.msg);
          }else{
            this.setState({
              loading:false
            })
          }
        });
      }
    });
  };

  disabledDate(current) {
    return current && current < moment().endOf('day');
  }

  cancelAuthorization(){
    router.push(backUrl);
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;


    const {
      loading, isTipVisible,authorizaDataInfo,saveData
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
            <FormItem {...formAllItemLayout} label="授权公司ID">
              {getFieldDecorator('authorizationTenantId', {
                rules: [
                  { required: true, message: '请输入授权公司ID' },
                ],
              })(
                <Input placeholder={'请输入授权公司ID'}/>,
              )}
            </FormItem>
            <FormItem {...formAllItemLayout} label="授权公司名称">
              {getFieldDecorator('authorizationTenantName', {
                rules: [
                  { required: true, message: '请输入授权公司名称' },
                ],
              })(
                <Input placeholder={'请输入授权公司名称'}/>,
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
                initialValue: moment(saveData.timeoutTime, 'YYYY-MM-DD HH:mm:ss'),
              })(
                <DatePicker
                  style={{ width: '100%' }}
                  disabledDate={this.disabledDate}
                  format="YYYY-MM-DD HH:mm:ss"
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                />,
              )}
            </FormItem>

            <FormItem {...formAllItemLayout} label="备注信息">
              {getFieldDecorator('remark')(
                <TextArea rows={4}/>,
              )}
            </FormItem>

          </Card>

        </Form>
        {isTipVisible &&
        (<Authorization authorizaDataInfo={authorizaDataInfo} handleCancel={this.cancelAuthorization}/>
        )}

      </Panel>
    );
  }
}

export default SystemAuthorizedAdd;
