import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, DatePicker, message, Radio, Select, Cascader } from 'antd';
import { connect } from 'dva';
import moment from 'moment'
import Panel from '../../../components/Panel';
import func from '../../../utils/Func';
import { getCookie } from '../../../utils/support';
import { getDeliverySubmit } from '../../../services/newServices/logistics';
import router from 'umi/router';
import styles from '../../../layouts/Sword.less';
import { getCityData } from '@/utils/authority';
const FormItem = Form.Item;
const { Option } = Select;

@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class SenderEdit extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:[],
      cityData:[]
    };
  }

  componentWillMount() {
    const { globalParameters } = this.props;
    getCityData().then(res=>{
      this.setState({
        cityData:res
      })
    })
    // 获取详情数据
    this.setState({
      data:globalParameters.detailData
    })
  }
// ============ 修改提交 ===============

  handleSubmit = e => {
    e.preventDefault();
    const {  form } = this.props;
    const {data} = this.state;
    form.validateFieldsAndScroll((err, values) => {
      values.deptId = getCookie("dept_id");
      values.addrCoding=JSON.stringify(values.addrCoding);
      const { cityparam } = this.state;

      const params = {
        ...values,
        id:data.id,
      };
      if(!cityparam){
        params.administrativeAreas=data.administrativeAreas
      }else {
        params.administrativeAreas=cityparam.name
      }
      if (!err) {
        getDeliverySubmit(params).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            router.push('/logistics/sender');
          }else {
            message.error(res.msg);
          }
        })
      }
    });
  };

  onChange = (value, selectedOptions) => {

    this.setState({
      cityparam:{
        province:value[0],
        city:value[1],
        area:value[2],
        name:`${selectedOptions[0].text}${selectedOptions[1].text}${selectedOptions[2].text}`
      }
    })
  };

  validatePhone = (rule, value, callback) => {
    if (!(/^1[3456789]\d{9}$/.test(value))) {
      callback(new Error('请输入正确的手机号格式'));
    }else{
      callback();
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {data,cityData} = this.state;
    console.log(data)
    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const action = (
      <Button type="primary" onClick={this.handleSubmit}>
        提交
      </Button>
    );

    return (
      <Panel title="修改" back="/logistics/sender" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="寄件人姓名：">
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: '寄件人姓名',
                      },
                    ],
                    initialValue: data.name,
                  })(<Input placeholder="寄件人姓名" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="寄件人手机号：">
                  {getFieldDecorator('mobile', {
                    rules: [
                      { required: true, validator: this.validatePhone },
                    ],
                    initialValue: data.mobile,
                  })(<Input placeholder="寄件人手机号" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="寄件人所在地区：">
                  {getFieldDecorator('addrCoding', {
                    rules: [
                      {
                        required: true,
                        message: '寄件人所在地区',
                      },
                    ],
                    initialValue: JSON.parse(data.addrCoding),
                  })(
                    <Cascader
                      fieldNames={{ label: 'text'}}
                      options={cityData}
                      onChange={this.onChange}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="寄件人详细地址：">
                  {getFieldDecorator('printAddr', {
                    rules: [
                      {
                        required: true,
                        message: '寄件人详细地址',
                      },
                    ],
                    initialValue: data.printAddr,
                  })(<Input placeholder="寄件人详细地址" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="寄件人公司名称:">
                  {getFieldDecorator('company',{
                    initialValue: data.company,
                  })(<Input placeholder="寄件人公司名称" />)}
                </FormItem>
              </Col>
            </Row>

          </Card>
        </Form>
      </Panel>
    );
  }
}

export default SenderEdit;
