import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import router from 'umi/router';
import { Form, Input, Button, Select, Row, Col, Popover, Progress } from 'antd';
import styles from './Register.less';
import { getCaptchaImage } from '.././../services/user';
import { setCaptchaKey } from '../../utils/authority';

// import Login from '../../components/Login';
// const { Captcha } = Login;

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="validation.password.strength.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="validation.password.strength.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="validation.password.strength.short" />
    </div>
  ),
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};
let SOURCE = [
  {key:"1",name:"网站"},
  {key:"2",name:"广告"},
  {key:"3",name:"微信"},
  {key:"4",name:"电话"},
  {key:"5",name:"渠道代理"},
  {key:"6",name:"转介绍"},
  {key:"7",name:"其他"},
]

@connect(({ register, loading }) => ({
  register,
  submitting: loading.effects['register/submit'],
}))
@Form.create()
class Register extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    prefix: '86',
    // 默认白色背景
    image: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    checkNick:false
  };

  componentDidUpdate() {
    const { form, register } = this.props;
    const account = form.getFieldValue('mail');
    if (register.status === 'ok') {
      router.push({
        pathname: '/user/register-result',
        state: {
          account,
        },
      });
    }
  }

  componentWillMount() {
    this.refreshCaptcha();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = () => {
    const { form, dispatch } = this.props;
    // const userPhone = form.getFieldValue('userPhone');
    // const code = form.getFieldValue('code');
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        console.log(values,"values")
        let count = 59;
        this.setState({ count });
        this.interval = setInterval(() => {
          count -= 1;
          this.setState({ count });
          if (count === 0) {
            clearInterval(this.interval);
          }
        }, 1000);
      }
    });

    
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    this.setState({
      checkNick: e.target.checked,
    },()=>{
      form.validateFields({ force: true }, (err, values) => {
        if (!err) {
          const { prefix } = this.state;
          console.log(values,"values")
          // dispatch({
          //   type: 'register/submit',
          //   payload: {
          //     ...values,
          //     prefix,
          //   },
          // });
        }
      });
    })
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(formatMessage({ id: 'validation.password.twice' }));
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {
      this.setState({
        help: formatMessage({ id: 'validation.password.required' }),
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  changePrefix = value => {
    this.setState({
      prefix: value,
    });
  };

  refreshCaptcha = () => {
    // 获取验证码
    getCaptchaImage().then(resp => {
      if (resp.key) {
        this.setState({ image: resp.image });
        setCaptchaKey(resp.key);
      }
    });
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count, prefix, help, visible, image } = this.state;
    return (
      <div className={styles.main}>
        
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('userName', {
              rules: [
                {
                  required: true,
                  message: "请输入您的姓名",
                },
              ],
            })(
              <Input size="large" placeholder={"请输入您的姓名"} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('wechatId', {
              rules: [
                {
                  required: true,
                  message: "请输入您的微信账号",
                },
              ],
            })(
              <Input
                size="large"
                // type="password"
                placeholder={"请输入您的微信账号"}
              />
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('sourceType', {
              rules: [
                {
                  required: true,
                  message: "请选择来源",
                },
              ],
            })(
              <Select size="large" placeholder={"请选择来源"}>
                {SOURCE.map(item=>{
                  return (<Option value={item.key}>{item.name}</Option>)
                })}
              </Select>
            )}
          </FormItem>

          <FormItem>
            <InputGroup compact>
              <Select
                size="large"
                value={prefix}
                onChange={this.changePrefix}
                style={{ width: '20%' }}
              >
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
              </Select>
              {getFieldDecorator('userPhone', {
                rules: [
                  {
                    required: true,
                    message: "请输入您的手机号",
                  },
                  {
                    pattern: /^\d{11}$/,
                    message: "请输入11位手机号",
                  },
                ],
              })(
                <Input
                  size="large"
                  style={{ width: '80%' }}
                  placeholder={"请输入您的手机号"}
                />
              )}
            </InputGroup>
          </FormItem>
          {/* <Captcha name="code" mode="image" /> */}
          <FormItem>
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator("code", {
                  rules: [
                    {
                      required: true,
                      message: "请输入图形验证码",
                    },
                  ],
                })(
                  <Input
                    // {...customprops}
                    size="large"
                    placeholder={`请输入图形验证码`}
                  />
                )}
              </Col>
              <Col span={8}>
                <img
                  alt="captcha"
                  src={image}
                  className={styles.getImgCaptcha}
                  onClick={this.refreshCaptcha}
                />
              </Col>
            </Row>
          </FormItem>

          <FormItem>
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('captcha', {
                  rules: [
                    {
                      required: this.state.checkNick,
                      message: "请输入短信验证码",
                    },
                    {
                      pattern: /^\d{6}$/,
                      message: "请输入6位短信验证码",
                    },
                  ],
                })(
                  <Input
                    size="large"
                    placeholder={"请输入短信验证码"}
                  />
                )}
              </Col>
              <Col span={8}>
                <Button
                  size="large"
                  disabled={count}
                  className={styles.getCaptcha}
                  onClick={this.onGetCaptcha}
                >
                  {count
                    ? `${count} s`
                    : `发送验证码`}
                </Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              <FormattedMessage id="app.register.register" />
            </Button>
            {/* <Link className={styles.login} to="/User/Login">
              <FormattedMessage id="app.register.sign-in" />
            </Link> */}
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Register;
