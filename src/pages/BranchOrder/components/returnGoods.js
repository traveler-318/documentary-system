import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  Button,
  Modal,
} from 'antd';
import { returngoods } from '@/services/branch';
import { message } from 'antd/lib/index';

const FormItem = Form.Item;
@Form.create()
class ReturnGoods extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {

  }

  okReturnGoods = () => {
    const { form,cancelReturnGoods } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        returngoods(values).then(res=>{
          if(res.success){
            message.success('退货成功');
          }else{
            message.error('未找到相关的设备号!');
          }
          cancelReturnGoods();
        })
      }

    })

  }

  render() {

    const { isViewReturnGoods,cancelReturnGoods ,form} = this.props;

    const { getFieldDecorator } = form;

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
        title="退货"
        visible={isViewReturnGoods}
        maskClosable={false}
        destroyOnClose
        width={400}
        onCancel={cancelReturnGoods}
        footer={[
          <Button key="back" onClick={cancelReturnGoods}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={this.okReturnGoods}>
            确定
          </Button>,
        ]}
      >
        <Form>
          <FormItem {...formAllItemLayout} label="SN">
            {getFieldDecorator('productCoding', {
              rules: [
                {
                  required: true,
                  message: '请输入SN',
                }
              ]
            })(<Input  placeholder="请输入SN" onPressEnter={this.okReturnGoods}/>)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default ReturnGoods;
