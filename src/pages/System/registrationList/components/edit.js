import React, { PureComponent } from 'react';
import {
  Modal,
  Checkbox,
  Form,
  Input,
  Button,
  message,
  Radio,
  Table, Select, Tooltip, Icon,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { getCookie } from '../../../../utils/support';
import {
  registerUpdate,
} from '../../../../services/user';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

let SOURCE = [
  {key:"1",name:"网站"},
  {key:"2",name:"广告"},
  {key:"3",name:"微信"},
  {key:"4",name:"电话"},
  {key:"5",name:"渠道代理"},
  {key:"6",name:"转介绍"},
  {key:"7",name:"其他"},
]

let TYPE = [
  {key:"1",name:"已联系"},
  {key:"2",name:"已付款"},
  {key:"3",name:"待付款"},
  {key:"4",name:"无效"},
]

let CustomerStatus = [
  {key:"1",name:"潜在客户"},
  {key:"2",name:"初步接触"},
  {key:"3",name:"持续跟进"},
  {key:"4",name:"成交客户"},
  {key:"5",name:"忠诚客户"},
  {key:"6",name:"无效客户"},
  {key:"7",name:"其他"},
]



@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class SMSrecord extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {
    
  }

  handleOK = () => {
    const { form } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        values.id = this.props.details.id;
        console.log(values,"values");
        registerUpdate(values).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            this.props.handleCancelEdit("getList");
          }else{
            message.error(res.msg);
          }
        })
      }
    });
    
  }


  render() {

    const {
      form: { getFieldDecorator },
      handleEditVisible,
      handleCancelEdit,
      details
    } = this.props;

    const formAllItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    console.log(details)

    return (
      <div>
        <Modal
          title="修改"
          visible={handleEditVisible}
          width={600}
          onCancel={handleCancelEdit}
          footer={[
            <Button key="back" onClick={handleCancelEdit}>
              取消
            </Button>,
            <Button key="back" type="primary" onClick={this.handleOK}>
              确定
            </Button>
          ]}
        >
          <div>
            <Form style={{ marginTop: 8 }}>
              
              <FormItem {...formAllItemLayout} label="客户来源">
                {getFieldDecorator('sourceType', {
                  initialValue: details.sourceType,
                  rules: [
                    {
                      required: true,
                      message: "请选择来源",
                    },
                  ],
                })(
                  <Select 
                    placeholder={"请选择来源"}
                  >
                    {SOURCE.map(item=>{
                      return (<Option value={item.name}>{item.name}</Option>)
                    })}
                  </Select>
                )}
              </FormItem>

              <FormItem {...formAllItemLayout} label="意向类型">
                {getFieldDecorator('intentionType', {
                  initialValue: details.intentionType || "潜在客户",
                  rules: [
                    {
                      required: true,
                      message: "请选择意向类型",
                    },
                  ],
                })(
                  <Select 
                    placeholder={"请选择意向类型"}
                  >
                    {CustomerStatus.map(item=>{
                      return (<Option value={item.name}>{item.name}</Option>)
                    })}
                  </Select>
                )}
              </FormItem>

              <FormItem {...formAllItemLayout} label="备注">
                {getFieldDecorator('note', {
                  initialValue: details.note,
                })(<TextArea placeholder=""  rows={4} />)}
              </FormItem>
            </Form>
          </div>

        </Modal>
      </div>
    );
  }
}

export default SMSrecord;
