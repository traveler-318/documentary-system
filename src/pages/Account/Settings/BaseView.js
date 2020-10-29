import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import {
  Form,
  Input,
  Upload,
  Button,
  message,
  Icon,
  Card,
  Radio,
  Row,
  Col,
  Select,
} from 'antd';
import Panel from '../../../components/Panel';
import { getUserInfo, updateInfo } from '../../../services/user';
import { getToken } from '../../../utils/authority';

const FormItem = Form.Item;
const { TextArea } = Input;

// const GRADE = [
//   {name:"一级",key:1},
//   {name:"二级",key:2},
// ]

@Form.create()
class BaseView extends Component {
  state = {
    userId: '',
    avatar: '',
    loading: false,
  };

  componentDidMount() {
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { form } = this.props;
    getUserInfo().then(resp => {
      if (resp.success) {
        const userInfo = resp.data;
        Object.keys(form.getFieldsValue()).forEach(key => {
          const obj = {};
          obj[key] = userInfo[key];
          form.setFieldsValue(obj);
        });
        this.setState({ userId: userInfo.id, avatar: userInfo.avatar });
      } else {
        message.error(resp.msg || '获取数据失败');
      }
    });
  };

  beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      this.setState({ loading: false, avatar: info.file.response.data.link });
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { userId, avatar } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          id: userId,
          ...values,
          avatar,
        };
        updateInfo(params).then(resp => {
          if (resp.success) {
            message.success(resp.msg);
          } else {
            message.error(resp.msg || '提交失败');
          }
        });
      }
    });
  };

  // 验证整数
  checkInteger = (rule, value, callback) => {
    var re = /^[0-9]+$/ ;
    if (re.test(value)) {
      return callback();
    }
    callback('请输入正整数!');
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const { avatar, loading } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 12 },
      },
    };

    const uploadProp = {
      action: '/api/blade-resource/oss/endpoint/put-file',
      headers: {
        'Blade-Auth': getToken(),
      },
    };

    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传头像</div>
      </div>
    );

    const action = (
      <Button type="primary" onClick={this.handleSubmit}>
        提交
      </Button>
    );

    return (
      <Panel title="个人设置" back="/" action={action}>
        <Form style={{ marginTop: 8 }} hideRequiredMark>
          <Card title="基本信息" bordered={false}>
          <Row gutter={24}>
              <Col span={12}>
              <FormItem
                {...formItemLayout}
                label={"头像"}
              >
                {getFieldDecorator('avatar', {
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: "请上传头像",
                  //   },
                  // ],
                })(
                  <Upload
                    name="file"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleChange}
                    {...uploadProp}
                  >
                    {avatar ? (
                      <img src={avatar} alt="avatar" style={{ width: '100%' }} />
                    ) : (
                        uploadButton
                      )}
                  </Upload>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={"昵称"}
              >
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: "请输入您的昵称!",
                    },
                  ],
                })(<Input />)}
              </FormItem>
              {/* <FormItem
                {...formItemLayout}
                label={formatMessage({ id: 'app.settings.basic.realname' })}
              >
                {getFieldDecorator('realName', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'app.settings.basic.realname-message' }, {}),
                    },
                  ],
                })(<Input />)}
              </FormItem> */}
              <FormItem {...formItemLayout} label={"联系电话"}>
                {getFieldDecorator('phone', {
                  rules: [
                    {
                      required: true,
                      message: "请输入您的联系电话!",
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem {...formItemLayout} label={"邮箱"}>
                {getFieldDecorator('email', {
                  rules: [
                    {
                      required: true,
                      message: "请输入您的邮箱!",
                    },
                  ],
                })(<Input />)}
              </FormItem>
              {/* <FormItem {...formItemLayout} label={'所属领导'}>
                {getFieldDecorator('leadershipName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入所属领导',
                    },
                  ],
                })(<Input />)}
              </FormItem> */}

              <FormItem {...formItemLayout} label={'提示内容'}>
                {getFieldDecorator('promptContent', {
                  rules: [
                    {
                      required: true,
                      message: '请输入提示内容',
                    },
                  ],
                })(<Input />)}
              </FormItem>
              {/* <FormItem {...formItemLayout} label={'剩余金额'}>
                {getFieldDecorator('remainingMoney', {
                  rules: [{ validator: this.checkInteger }],
                })(<Input />)}
              </FormItem> */}
              <FormItem {...formItemLayout} label={'网关访问域名'}>
                {getFieldDecorator('serverAddress', {
                  rules: [
                    {
                      required: true,
                      message: '请输入网关访问域名',
                    },
                  ],
                })(<Input />)}
              </FormItem>
              {/* <FormItem {...formItemLayout} label={'系统级别'}>
                {getFieldDecorator('systemLevel', {
                  rules: [
                    {
                      required: true,
                      message: '请选择系统级别',
                    },
                  ],
                })(
                  <Select defaultValue={null} placeholder={"请选择系统级别"}>
                    {GRADE.map(item=>{
                      return (<Option value={item.id}>{item.name}</Option>)
                    })}
                  </Select>
                )}
              </FormItem> */}
              <FormItem {...formItemLayout} label={'短信签名'}>
                {getFieldDecorator('smsSignature')(
                  <Input />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={'投诉电话'}>
                {getFieldDecorator('aftersalesPhone')(
                  <Input />
                )}
              </FormItem>
              {/* <FormItem {...formItemLayout} label={'剩余业务员数量'}>
                {getFieldDecorator('currentQuota', {
                  rules: [{ validator: this.checkInteger }],
                })(
                  <Input />
                )}
              </FormItem> */}
              <FormItem {...formItemLayout} label={'有效期天数'}>
                {getFieldDecorator('periodValidity', {
                  rules: [{ validator: this.checkInteger }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={'备注'}>
                {getFieldDecorator('note')(
                  <TextArea rows={4} />
                )}
              </FormItem>
              </Col>

              {/* ------------------------------------------ */}

              <Col span={12} style={{marginTop:151}}>
                <FormItem {...formItemLayout} label={'帐号启用'}>
                  {getFieldDecorator('status')(
                    <Radio.Group>
                      <Radio key={1} value={1}>启用</Radio>
                      <Radio key={0} value={0}>禁用</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label={'系统告警'}>
                  {getFieldDecorator('alarmStatus')(
                    <Radio.Group>
                      <Radio key={1} value={1}>启用</Radio>
                      <Radio key={0} value={0}>禁用</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label={'二维码开关'}>
                  {getFieldDecorator('qrcodeStatus')(
                    <Radio.Group>
                      <Radio key={1} value={1}>启用</Radio>
                      <Radio key={0} value={0}>禁用</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label={'物流查询'}>
                  {getFieldDecorator('logisticsStatus')(
                    <Radio.Group>
                      <Radio key={1} value={1}>启用</Radio>
                      <Radio key={0} value={0}>禁用</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label={'提醒类型'}>
                  {getFieldDecorator('smsStatus')(
                    <Radio.Group>
                      <Radio key={0} value={0}>关闭</Radio>
                      <Radio key={1} value={1}>短信</Radio>
                      <Radio key={2} value={2}>短信+语音</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label={'发货提醒'}>
                  {getFieldDecorator('shipmentRemindStatus')(
                    <Radio.Group>
                      <Radio key={1} value={1}>启用</Radio>
                      <Radio key={0} value={0}>禁用</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label={'本地打印开关'}>
                  {getFieldDecorator('localPrintStatus')(
                    <Radio.Group>
                      <Radio key={1} value={1}>是</Radio>
                      <Radio key={0} value={0}>否</Radio>
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

export default BaseView;
