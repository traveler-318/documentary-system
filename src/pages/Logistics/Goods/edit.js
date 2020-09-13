import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, DatePicker, message, Radio, Select } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import func from '../../../utils/Func';
import { getCookie } from '../../../utils/support';
import { getGoodsSubmit } from '../../../services/newServices/logistics';
import router from 'umi/router';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
class GoodsEdit extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:[],
    };
  }

  componentWillMount() {
    this.setState({
      data:JSON.parse(this.props.match.params.id)
    })
  }
// ============ 修改提交 ===============

  handleSubmit = e => {
    e.preventDefault();
    const {  form } = this.props;
    const {data} = this.state;
    form.validateFieldsAndScroll((err, values) => {
      values.deptId = getCookie("dept_id");
      if (!err) {
        const params = {
          ...values,
          id:data.id,
        };
        getGoodsSubmit(params).then(res=>{
          message.success('提交成功');
          router.push('/logistics/goods');
        })
      }
    });
  };


  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {data} = this.state;
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
      <Panel title="修改" back="/logistics/faceSheet" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" bordered={false}>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="物品信息：">
                  {getFieldDecorator('cargo',{
                    initialValue: data.cargo,
                  })(<Input placeholder="请输入物品信息" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="物品总数量：">
                  {getFieldDecorator('count',{
                    initialValue: data.count,
                  })(<Input placeholder="请输入物品总数量(正整数)" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="物品总总量：">
                  {getFieldDecorator('weight', {
                    rules: [
                      {
                        required: true,
                        message: '请输入物品总重量(重量单位kg)',
                      },
                    ],
                    initialValue: data.weight,
                  })(<Input placeholder="请输入物品总重量(重量单位kg)" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="物品总体积：">
                  {getFieldDecorator('volumn', {
                    rules: [
                      {
                        required: true,
                        message: '请输入物品总体积(体积单位CM*CM*CM)',
                      },
                    ],
                    initialValue: data.volumn,
                  })(<Input placeholder="请输入物品总体积(体积单位CM*CM*CM)" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="备注内容:">
                  {getFieldDecorator('remark',{
                    initialValue: data.remark,
                  })(<TextArea rows={4} placeholder="备注内容" />)}
                </FormItem>
              </Col>
            </Row>

          </Card>
        </Form>
      </Panel>
    );
  }
}

export default GoodsEdit;
