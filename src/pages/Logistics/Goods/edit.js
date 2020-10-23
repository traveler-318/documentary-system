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

@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class GoodsEdit extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:[],
    };
  }

  componentWillMount() {
    const { globalParameters } = this.props;

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
      if (!err) {
        const params = {
          ...values,
          id:data.id,
        };
        getGoodsSubmit(params).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            router.push('/logistics/goods');
          }else {
            message.error(res.msg);
          }
        })
      }
    });
  };

  countChange = (rule, value, callback) => {
    var reg=/^[1-9]\d*$/;
    if(value === "" || value === null){
      callback('请输入物品总数量');
    }else if(!reg.test(value)){
      callback(new Error('请输入正整数'));
    }else{
      return callback();
    }
  };

  weightChange = (rule, value, callback) => {
    let reg=/((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
    if(value === "" || value === undefined){
      callback('请输入物品总重量');
    }else if(!reg.test(value) || Number(value) <= 0){
      callback('请输入大于0的正整数或小数');
    }else{
      return callback();
    }
  };

  volumnChange = (rule, value, callback) => {
    let reg=/((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
    if(value === "" || value === undefined){
      callback('请输入物品总体积');
    }else if(!reg.test(value) || Number(value) <= 0){
      callback('请输入大于0的正整数或小数');
    }else{
      return callback();
    }
  };


  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {data} = this.state;
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
      <Panel title="修改" back="/logistics/goods" action={action}>
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
                    rules: [
                      {
                        validator:this.countChange,
                      },
                    ],
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
                        validator:this.weightChange,
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
                        validator:this.volumnChange,
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
