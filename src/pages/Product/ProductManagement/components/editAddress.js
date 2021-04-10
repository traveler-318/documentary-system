import React, { PureComponent } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  message,
} from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { getCookie } from '../../../../utils/support';
import { getProductattributeUpdate, } from '../../../../services/newServices/product';
import styles from '../add.less';

const FormItem = Form.Item;
@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class EditAddress extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:{
        sortNumber:0
      },
    };
  }


  componentWillMount() {
    const {details} = this.props;

  }

  // ======确认==========

  handleSubmit = e => {
    e.preventDefault();
    const {  form, details } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      values.deptId = getCookie("dept_id");
      if (!err) {
        const params = {
          ...values,
          deptId:getCookie("dept_id"),
          id:details.id,
        };
        console.log(params)
        getProductattributeUpdate(params).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            router.push('/product/productManagement');
          }
        })
      }
    });
  };

  render() {

    const {
      form: { getFieldDecorator },
      handleEditVisible,
      handleCancelEdit,
      details
    } = this.props;

    const {
      loading
    } = this.state;

    const formAllItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };
    console.log(details)

    return (
      <div>
        <Modal
          title="修改"
          visible={handleEditVisible}
          maskClosable={false}
          width={600}
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
          <div className={styles.add}>
            <Form style={{ marginTop: 8 }}>
              <FormItem {...formAllItemLayout} label="发货人">
                {getFieldDecorator('consignor', {
                  initialValue: details.consignor,
                  rules: [
                    {
                      required: true,
                      message: '请输入发货人',
                    },
                  ],
                })(<Input placeholder="请输入发货人" />)}
              </FormItem>
              <FormItem {...formAllItemLayout} label="发货人电话">
                {getFieldDecorator('consignorPhone', {
                  initialValue: details.consignorPhone,
                  rules: [
                    {
                      required: true,
                      message: '请输入发货人电话',
                    },
                    {
                      pattern: /^[\d+]{6,13}$/,
                      message: '请输入正确的电话'
                    }
                    // ,
                    // {
                    //   pattern: /^1(3[0-9]|4[01456879]|5[0-3,5-9]|6[2567]|7[0-8]|8[0-9]|9[0-3,5-9])\d{8}$/,
                    //   message: '请输入正确的手机号'
                    // }
                  ],
                })(<Input placeholder="请输入发货人电话" />)}
              </FormItem>
              <FormItem {...formAllItemLayout} label="发货地址">
                {getFieldDecorator('deliveryAddress', {
                  initialValue: details.deliveryAddress,
                  rules: [
                    {
                      required: true,
                      message: '请输入发货地址',
                    },
                  ],
                })(<Input placeholder="请输入发货地址" />)}
              </FormItem>

            </Form>
          </div>

        </Modal>
      </div>
    );
  }
}

export default EditAddress;
