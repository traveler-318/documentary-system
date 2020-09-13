import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, DatePicker, message, Radio, Select } from 'antd';
import { connect } from 'dva';
import moment from 'moment'
import Panel from '../../../components/Panel';
import func from '../../../utils/Func';
import { getCookie } from '../../../utils/support';
import { getSurfacesingleSubmit } from '../../../services/newServices/logistics';
import router from 'umi/router';
import { EXPRESS100DATA,TEMPID } from './data';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class SenderEdit extends PureComponent {

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
        getSurfacesingleSubmit(params).then(res=>{
          message.success('提交成功');
          router.push('/logistics/faceSheet');
        })
      }
    });
  };

  onChange = value => {
    let text = ""
    for(let i=0; i< EXPRESS100DATA.length; i++){
      if(value === EXPRESS100DATA[i].num){
        text = EXPRESS100DATA[i].name
      }
    }
    for(let j=0; j< TEMPID.length; j++){
      if(text === TEMPID[j].value){
        text = TEMPID[j].id
      }
    }
    const {data} = this.state;
    const datas = Object.assign({}, data, {
      tempid: text
    })
    this.setState({
      data:datas
    },()=>{

    });
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
      <Panel title="修改" back="/logistics/faceSheet" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="快递公司编码：">
                  {getFieldDecorator('kuaidicom', {
                    initialValue: data.kuaidicom,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(
                    <Select placeholder="" onSelect={value => this.onChange(value)}>
                      {EXPRESS100DATA.map((item,index)=>{
                        return (<Option key={index} value={item.num}>{item.name}</Option>)
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="模板ID：">
                  {getFieldDecorator('tempid', {
                    rules: [
                      {
                        required: true,
                      },
                    ],
                    initialValue: data.tempid,
                  })(
                    <Select placeholder="" disabled>
                      {TEMPID.map((item,index) =>{
                        return (<Option key={index} value={item.id}>{item.value}</Option>)
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="宽：">
                  {getFieldDecorator('width', {
                    rules: [
                      {
                        required: true,
                        message: '宽',
                      },
                    ],
                    initialValue: data.width,
                  })(<Input placeholder="宽" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="高：">
                  {getFieldDecorator('height', {
                    rules: [
                      {
                        required: true,
                        message: '高',
                      },
                    ],
                    initialValue: data.height,
                  })(<Input placeholder="高" />)}
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
