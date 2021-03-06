import {
  Button, Cascader, DatePicker, Form, Input, message, Modal, Select,
  Table,
} from 'antd';
import React, { PureComponent } from 'react';
import {getProductDetail,processupdate} from '../../../services/order/ordermaintenance'
import { connect } from 'dva';
import { UPDATEORDERSTATU,UPDATEORDERSTATU2 } from './data.js';

const FormItem = Form.Item;

@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class Update extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      detail:{},
      customs:[],
      isUpdate:true,
      message:''
    };
  }

  // 页面构建
  componentWillMount() {

    const { globalParameters } = this.props;
    const propData = globalParameters.detailData;
    this.setState({
      detail:propData
    })
    this.queryDetail(propData.productId);
  }

  queryDetail(id){
    // id = 19;//需删除
    getProductDetail({
      id:id
    }).then(res=>{
      if(res.success){
        let d = res.data;
        if(d.tasksMark === "0"){
          this.setState({
            customs:UPDATEORDERSTATU2
          })
        }else{
          this.setState({
            customs:UPDATEORDERSTATU
          })
        }
      }
    })
  }
  handleSubmit = () => {
    const { form } = this.props;
    const { detail} = this.state;
    form.validateFieldsAndScroll((err, values) => {
      values.id = detail.id;
      values.clientLevel = values.clientLevel || 0;
      if (!err) {
        processupdate(values).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            this.props.handleSuccess()
          }else {
            message.error(res.msg);
          }
        })
      }
    });
  };

  render() {

    const {
      form: { getFieldDecorator }
    } = this.props;
    const {
      detail,customs
    } = this.state;

    const formAllItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };

    return (
      <Modal
        title="阶段变更"
        visible={this.props.isUpdate}
        maskClosable={false}
        destroyOnClose
        width={500}
        onCancel={this.props.handleCancel}
        footer={[
          <Button key="back" onClick={this.props.handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={this.handleSubmit}>
            确定
          </Button>,
        ]}
      >
          <Form>
            <FormItem {...formAllItemLayout} label="阶段">
              {getFieldDecorator('clientLevel', {
                initialValue:detail.clientLevel,
              })(
                <Select placeholder={"请选择阶段"}>
                  {/*<Select.Option value={'0'} disabled={true}>待维护</Select.Option>*/}
                  {customs.map((item,i)=>{
                    return (<Select.Option value={item.key}>{item.name}</Select.Option>)
                  })}
                </Select>
              )}
            </FormItem>
          </Form>

      </Modal>
    );
  }
}

export default Update;
