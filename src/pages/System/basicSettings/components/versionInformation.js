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
  Tag
} from 'antd';
import { getUserInfo, updateInfo,getTenantInfo } from '../../../../services/user';
import { getToken } from '../../../../utils/authority';

import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
// const GRADE = [
//   {name:"一级",key:1},
//   {name:"二级",key:2},
// ]
@Form.create()
class BaseView extends Component {
  state = {
    data: '',
    loading: false,
  };

  componentWillMount() {
    this.setTenantInfo();
  }

  setTenantInfo = () => {
    const { form } = this.props;
    getTenantInfo().then(resp => {
      console.log(resp)
      if (resp.code === 200) {
        if(resp.data.version === '0'){
          resp.data.versionColor = 'red';
          resp.data.version = '试用';
        }
        if(resp.data.version === '1'){
          resp.data.versionColor = 'green';
          resp.data.version = '标准';
        }
        if(resp.data.version === '2'){
          resp.data.versionColor = 'green';
          resp.data.version = '企业';
        }
        this.setState({
          data:resp.data
        });
      } else {
        message.error(resp.msg || '获取数据失败');
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const { data } = this.state;

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
    return (
        <div className={styles.basicConfiguration}>
          <Row gutter={24}>
              <Col span={12}>
                <FormItem {...formItemLayout} label={"授权版本"}>
                  <span>
                    <Tag color={data.versionColor}>
                      {data.version}
                    </Tag>
                  </span>
                </FormItem>
                <FormItem {...formItemLayout} label={'账号额度'}>
                    <span>{(data.accountNumber && data.accountNumber) > 0 ? data.accountNumber : '不限制'}</span>
                </FormItem>
                <FormItem {...formItemLayout} label={'授权时间'}>
                    <span>{data.createTime}</span>
                </FormItem>
                <FormItem {...formItemLayout} label={'到期时间'}>
                    <span>{data.expireTime}</span>
                </FormItem>
                <FormItem {...formItemLayout} label={'企业名称'}>
                    <span>{data. tenantName}</span>
                </FormItem>
                <FormItem {...formItemLayout} label={'公司ID'}>
                    <span>{data.tenantId}</span>
                </FormItem>
                <FormItem {...formItemLayout} label={'联系人'}>
                    <span>{data.linkman}</span>
                </FormItem>
                <FormItem {...formItemLayout} label={'联系电话'}>
                    <span>{data.contactNumber}</span>
                </FormItem>
              </Col>
          </Row>
        </div>
    );
  }
}

export default BaseView;
