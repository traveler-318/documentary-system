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

import { updateData } from '../../../../services/user';

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
   
    this.setState({
      labelColor: this.props.details.color
    })
  }

  valinsPayChange = (rule, value, callback) => {
    var reg=/((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
    if(!value || value === "" || value === null){
      callback('请输入正确的排序');
    }else 
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
    const {  form, type, details } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      console.log(type === "label" ? 0 : type === "grade" ?  1 : type === "state" ? 2 : "","values")
      if (!err) {
        const params = {
          ...values,
          color: this.state.labelColor,
          labelType: type === "label" ? 0 : type === "grade" ?  1 : type === "state" ? 2 : "",
          id:details.id
        };
        console.log(params)
        updateData(params).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            this.props.handleCancelEdit("getlist")
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
      handleEditVisible,
      handleCancelEdit,
      type,
      details
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
         title={type === "label" ? "修改标签" : type === "grade" ? "修改等级" : type === "state" ? "修改状态" : ""}
          maskClosable={false}
          visible={handleEditVisible}
          width={500}
          onCancel={handleCancelEdit}
          footer={[
            <Button key="back" onClick={handleCancelEdit}>
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
                initialValue: details.labelName,
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
