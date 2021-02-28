import React, { PureComponent } from 'react';
import {
  Modal,
  Checkbox,
  Form,
  Input,
  Button,
  message,
  Radio,
  Table, Select,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
// import { getCookie } from '../../../../utils/support';
// import { getAddSave } from '../../../../services/newServices/product';
// import {paymentCompany,} from '../../../Order/components/data.js';
// 
import { addData } from '../../../../services/user';

const { Option } = Select;
const FormItem = Form.Item;
@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class PayBrandAdd extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:{},
      params:{
        size:10,
        current:1
      },
      labelColor: "#40A9FF",
      colorList:[
        {
            title:'浅蓝',
            color:"#40A9FF",
        },
        {
            title:'湖蓝',
            color:"#36CFC9",
        },
        {
            title:'绿色',
            color:"#73D13D",
        },
        {
            title:'黄色',
            color:"#FBD444",
        },
        {
            title:'红色',
            color:"#FF4D4F",
        },
        {
            title:'紫色',
            color:"#9254DE",
        },
        {
            title:'蓝色',
            color:"#2F54EB",
        },
        {
            title:'橙色',
            color:"#FA8C16",
        },
    ]
    };
  }


  componentWillMount() {

  }

  valinsPayChange = (rule, value, callback) => {
    var reg=/((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
    if(value != "" && value != null){
      if(!reg.test(value)){
        callback('请输入正确的排序');
      }else{
        return callback();
      }
    }else{
      return callback();
    }
  };

  // ======确认==========

  handleSubmit = e => {
    e.preventDefault();
    const {  form, type } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      console.log(values,"values")
      if (!err) {
        const params = {
          ...values,
          color: this.state.labelColor,
          labelType: type === "label" ? 0 : type === "grade" ? 1 : type === "state" ? 2 : "",
        };
        console.log(params)
        addData([params]).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            this.props.handleCancelAdd("getlist")
          }
        })
      }
    });
  };

  changeColor = (e) => {
    this.setState({
      labelColor:e.color
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      handleAddVisible,
      handleCancelAdd,
      type
    } = this.props;

    const {
      data,
      loading,
      colorList,
      labelColor
    } = this.state;

    const formAllItemLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 19,
      },
    };

    return (
      <div>
        <Modal
          title={type === "label" ? "新增标签" : type === "grade" ? "新增等级" : type === "state" ? "新增状态" : ""}
          maskClosable={false}
          visible={handleAddVisible}
          width={500}
          onCancel={handleCancelAdd}
          footer={[
            <Button key="back" onClick={handleCancelAdd}>
              取消
            </Button>,
            <Button type="primary" loading={loading} onClick={(e)=>this.handleSubmit(e,false)}>
              确定
            </Button>,
          ]}
        >
          <Form style={{ marginTop: 8 }}>
            <FormItem {...formAllItemLayout} label="标签名称">
              {getFieldDecorator('labelName', {
                rules: [
                  {
                    required: true,
                    message: '请输入标签名称',
                  },
                ],
              })(<Input style={{paddingLeft: 30, borderColor:labelColor}} placeholder="请输入标签名称" />)}
              <span style={{
                display:'inline-block',
                width:"20px",
                height:'20px',
                background:labelColor,
                borderRadius: '50%',
                position: 'absolute',
                left: 6,
                top: 0
              }}></span>
            </FormItem>
            <FormItem {...formAllItemLayout} label="标签颜色">
              {getFieldDecorator('color', {
              })(<div>
                {colorList.map(item=>{
                  return (
                    <span style={{
                      display:'inline-block',
                      width:"20px",
                      height:'20px',
                      marginRight: 8,
                      background:item.color,
                      borderRadius: '50%',
                      float: 'left',
                      marginTop: 10,
                      cursor: 'pointer'
                    }}
                      onClick={()=>{this.changeColor(item)}}
                    ></span>
                  )
                })}
              </div>)}
            </FormItem>
            <FormItem {...formAllItemLayout} label="标签排序">
              {getFieldDecorator('sortNumber', {
                initialValue: details.sortNumber,
                rules: [
                  {
                    required: true,
                    validator:this.valinsPayChange
                  },
                ],
              })(<Input placeholder="请输入标签排序" />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default PayBrandAdd;
