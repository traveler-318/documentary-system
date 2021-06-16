import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, Radio, Cascader, Select, DatePicker, message } from 'antd';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import { getCookie } from '../../../utils/support';

import { shipperSave } from '../../../services/newServices/logistics';
import router from 'umi/router';
import { productTreelist } from '../../../services/newServices/order';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class SenderAdd extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:{

      },
      productId:null,
      productList:[],
      cityparam:{}
    };
  }

  componentWillMount() {
    this.getTreeList();
  }
  getTreeList = () => {
    productTreelist().then(res=>{
      this.setState({productList:res.data})
    })
  }
  // ============ 提交 ===============

  handleSubmit = e => {
    e.preventDefault();
    const {  form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      values.deptId = getCookie("dept_id");
      values.productId = this.state.productId;
      delete values.productType;
      if (!err) {
        const params = {
          ...values
        };
        shipperSave(params).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            router.push('/logistics/shipper');
          }
        })
      }
    });
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

    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const {data,productList}=this.state

    const action = (
      <Button type="primary" onClick={this.handleSubmit}>
        提交
      </Button>
    );

    return (
      <Panel title="新增" back="/logistics/shipper" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="退货人姓名：">
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: '退货人姓名',
                      },
                    ],
                  })(<Input placeholder="退货人姓名" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="退货人手机号：">
                  {getFieldDecorator('mobile', {
                    rules: [
                      { required: true, validator: this.validatePhone },
                    ],
                  })(<Input placeholder="退货人手机号" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="退货人详细地址：">
                  {getFieldDecorator('printAddr', {
                    rules: [
                      {
                        required: true,
                        message: '退货人详细地址',
                      },
                    ],
                  })(<Input placeholder="退货人详细地址" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="退货人公司名称:">
                  {getFieldDecorator('company')(<Input placeholder="退货人公司名称" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="产品分类">
                  {getFieldDecorator('productType', {
                    initialValue: null,
                    rules: [
                      {
                        required: true,
                        message: '请选择产品分类',
                      },
                    ],
                  })(
                    <Cascader
                      options={productList}
                      fieldNames={{ label: 'value',value: "id"}}
                      onChange={(value, selectedOptions)=>{
                        this.setState({
                          productId :selectedOptions[2].id
                        })
                      }}
                    ></Cascader>
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

export default SenderAdd;
