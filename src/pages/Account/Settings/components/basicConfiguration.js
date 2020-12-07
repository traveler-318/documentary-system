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
  Divider,
  Modal
} from 'antd';
import { getUserInfo, updateInfo, unbundling, binding, testOpenid } from '../../../../services/user';
import { getToken } from '../../../../utils/authority';
import BindingQRCode from './bindingQRCode'
import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
let timers = null;
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
    countDownTimer: 30,
    bindingQRCode: false,
    imgUrl:"",
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
        this.setState({ 
          userId: userInfo.id, 
          avatar: userInfo.avatar, 
          openid: userInfo.openid,
          userAccount: userInfo.account
         });
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

  validatePhone = (rule, value, callback) => {
    if (!(/^\d+$|^\d+[.]?\d+$/.test(value))) {
      callback(new Error('请输入正确的手机号格式'));
    }else{
      callback();
    }
  }

  handleBinding = (type) =>{
    if(type === "0"){
      Modal.confirm({
        title: '提示',
        content: `是否确认解绑?`,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          const {openid, userAccount} = this.state;
          unbundling(userAccount,openid).then(response=>{
            if(response.code != 200){
              return message.error(response.msg)
            }
            message.success(response.msg)
            this.setBaseInfo();
          }).catch(res=>{
          })
        },
        onCancel() {
          
        },
      });
    }else{
      // 绑定
      binding(this.state.userId).then(response=>{
        console.log(response)
        if(response.code != 200){
          return message.error(response.msg)
        }
        this.setState({
          bindingQRCode:true,
          imgUrl:"https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket="+response.data
        })

        this.countDown();
      }).catch(res=>{
      })
    }
  }

  countDown = () => {
    timers = setTimeout(()=>{
      let {countDownTimer} = this.state;
      countDownTimer = countDownTimer-1
      this.setState({
        countDownTimer:countDownTimer,
      },()=>{
        if(this.state.countDownTimer <= 0 || !this.state.bindingQRCode){
          this.setBaseInfo();
          this.setState({
            countDownTimer:30,
            bindingQRCode:false,
          })
          clearTimeout(timers)
        }else{
          this.countDown();
        }
      })
    },1000)
  };

  handleCancelQRCode = () => {
    this.setState({
      bindingQRCode:false,
    })
  }

  handleTest(){
    if(this.state.openid === ""){
      return message.error('请点击绑定按钮进行二维码绑定操作!如已绑定请点击刷新页面后点击测试消息发送!')
    }
    testOpenid(this.state.openid).then(response=>{
      if(response.code === 200){
        message.success(response.msg)
      }else{
        message.error(response.msg)
      }
    })
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const { avatar, loading, bindingQRCode, countDownTimer, imgUrl, openid } = this.state;

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
    

    return (
        <div className={styles.basicConfiguration}>
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
                  label={"姓名"}
                >
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: "请输入您的姓名!",
                      },
                    ],
                  })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label={"联系电话"}>
                  {getFieldDecorator('phone', {
                    rules: [
                      { required: true, validator: this.validatePhone },
                    ],
                  })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label={"电子邮箱"}>
                  {getFieldDecorator('email', {
                    rules: [
                      {
                        required: true,
                        message: "请输入您的电子邮箱!",
                      },
                    ],
                  })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label={"微信绑定"}>
                  
                  {(openid && openid != '' && openid != null) ? 
                    (<>
                      <a onClick={()=>this.handleBinding('0')}>解绑</a>
                      <Divider type="vertical" />
                    </>):""
                  }
                  {(openid === '' || openid === null || !openid) ? 
                    (<>
                      <a onClick={()=>this.handleBinding('1')}>绑定</a>
                      <Divider type="vertical" />
                    </>):""
                  }
                  {(openid && openid != '' && openid != null) ? 
                    (<a onClick={()=>this.handleTest()}>测试</a>):""
                  }
                </FormItem>
                <FormItem style={{display:"none"}}>
                  {getFieldDecorator('id')(
                    <Input />
                  )}
                </FormItem>
              </Col>
          </Row>
          {
            bindingQRCode?(
              <BindingQRCode
                bindingQRCode={bindingQRCode}
                countDownTimer={countDownTimer}
                imgUrl={imgUrl}
                handleCancelQRCode={this.handleCancelQRCode}
              />
            ):""
          }
          
        </div>
    );
  }
}

export default BaseView;
