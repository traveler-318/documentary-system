import React, { PureComponent } from 'react';
import { Modal, Checkbox, Form, Input, Card, Row, Col, Button, TreeSelect, Select, DatePicker, message, Cascader, Radio } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import { tenantMode } from '../../../defaultSettings';
import { getCookie } from '../../../utils/support';
import { synSmsCertification, synbinding } from '../../../services/newServices/order'
import SecurityVerification from './securityVerification'

const FormItem = Form.Item;
const { TextArea } = Input;


@connect(({ globalParameters}) => ({
    globalParameters,
}))
@Form.create()
class Equipment extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      verificationVisible:false,
      param:{}
    };
  }

  componentWillMount() {
      
  }
  nextStep = (e) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          verificationVisible:true,
          param:values
        })
      }
    });
  };

  handleCancelVerification = (type) => {
    this.setState({
      verificationVisible:false,
    })
    if(type === "success"){
      this.props.handleCancelNoDeposit();
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
      noDepositVisible,
      handleCancelNoDeposit,
    } = this.props;

    const {
      loading,
      verificationVisible,
      param
    } = this.state;

    const formAllItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };
    return (
        <>
          <Modal
            title="免押宝导入数据"
            visible={noDepositVisible}
            width={430}
            onCancel={handleCancelNoDeposit}
            footer={[
              <Button key="back" onClick={handleCancelNoDeposit}>
                取消
              </Button>,
              <Button key="submit" type="primary" loading={loading} onClick={(e)=>this.nextStep(e)}>
                下一步
              </Button>,
            ]}
          >
              <Form style={{ marginTop: 8 }}>
                  <FormItem {...formAllItemLayout} label="账号">
                    {getFieldDecorator('synAccount', {
                      rules: [
                        {
                          required: true,
                          message: '请输入免押宝账号',
                        },
                      ],
                    })(<Input placeholder="请输入免押宝账号" />)}
                  </FormItem>
                  <FormItem {...formAllItemLayout} label="密码">
                    {getFieldDecorator('synPassword', {
                      rules: [
                        {
                          required: true,
                          message: '请输入免押宝密码',
                        },
                      ],
                    })(<Input placeholder="请输入免押宝密码" />)}
                  </FormItem>
              </Form>
          </Modal>
          {verificationVisible?(
            <SecurityVerification
              verificationVisible={verificationVisible}
              handleCancelVerification={this.handleCancelVerification}
              param={param}
            />
          ):""}
        </>
    );
  }
}

export default Equipment;
