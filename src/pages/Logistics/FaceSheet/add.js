import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, Radio, TreeSelect, Select, DatePicker, message } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import func from '../../../utils/Func';
import { getCookie } from '../../../utils/support';
import { getSurfacesingleSave } from '../../../services/newServices/logistics';
import router from 'umi/router';
import { TEMPID ,EXPRESS100DATA } from './data.js';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class FaceSheetAdd extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:{
        width:76,
        height:130
      },
    };
  }

  componentWillMount() {

  }

  // ============ 提交 ===============

  handleSubmit = e => {
    e.preventDefault();
    const {  form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      values.deptId = getCookie("dept_id");
      console.log(values)
      if (!err) {
        const params = {
          ...values,
        };
        getSurfacesingleSave(params).then(res=>{
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
    this.setState({
      data:{
        tempids:text,
        width:76,
        height:130
      }
    },()=>{

      });
  };

  widthChange = (rule, value, callback) => {
    let reg=/^[1-9]\d*$/;
    if(value != "" && value != null){
      if(!reg.test(value) || value.length > 3){
        callback('请输入长度小于等于3位数的正整数');
      }else{
        return callback();
      }
    }
  };

  heightChange = (rule, value, callback) => {
    let reg=/^[1-9]\d*$/;
    if(value != "" && value != null){
      if(!reg.test(value) || value.length > 3){
        callback('请输入长度小于等于3位数的正整数');
      }else{
        return callback();
      }
    }
  };


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

    const {data}=this.state

    const action = (
      <Button type="primary" onClick={this.handleSubmit}>
        提交
      </Button>
    );

    return (
      <Panel title="新增" back="/logistics/faceSheet" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="快递公司编码：">
                  {getFieldDecorator('kuaidicom', {
                    rules: [
                      {
                        required: true,
                        message: '请选择快递公司编码',
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
                    initialValue: data.tempids,
                    rules: [
                      {
                        required: true,
                        message: '请输入模板ID',
                      },
                    ],
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
                        validator:this.widthChange,
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
                        validator:this.heightChange,
                      },
                    ],
                    initialValue: data.height,
                  })(<Input placeholder="高"/>)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem {...formItemLayout} label="打印设备码:">
                  {getFieldDecorator('siid')(<Input placeholder="打印设备码" />)}
                </FormItem>
              </Col>
            </Row>

          </Card>
        </Form>
      </Panel>
    );
  }
}

export default FaceSheetAdd;
