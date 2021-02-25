import {
  Button, Cascader, DatePicker, Form, Input, message, Modal, Select,
  Table,
} from 'antd';
import React, { PureComponent } from 'react';
import {updateData} from '../../../../services/order/ordermaintenance'
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class UpdateStatus extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      detail:{},
      customs:[]
    };
  }

  // 页面构建
  componentWillMount() {

    const { globalParameters } = this.props;
    const propData = globalParameters.detailData;
    this.setState({
      detail:propData
    })
  }
  handleSubmit = () => {
    const { form } = this.props;
    const { detail} = this.state;
    form.validateFieldsAndScroll((err, values) => {
      values.id = detail.id;
      if (!err) {
        updateData(values).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            this.props.handleCancel()
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

    const clientStatus = this.props.clientStatus;

    return (
      <Modal
        title="标签变更"
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
          <FormItem {...formAllItemLayout} label="标签">
            {getFieldDecorator('clientStatus', {
              initialValue:detail.clientStatus,
            })(
              <Select placeholder={"请选择阶段"} >
                {clientStatus.map(item=>{
                  return (<Select.Option value={item.id+''}>{item.labelName}</Select.Option>)
                })}
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default UpdateStatus;
