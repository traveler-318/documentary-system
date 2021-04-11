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

        if(
          (values.consignor && values.consignorPhone && values.deliveryAddress) || 
          (!values.consignor && !values.consignorPhone && !values.deliveryAddress)
          ){
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
        }else{
          if(!values.consignor){
            form.setFields({
              consignor: {
                value: values.consignor,
                errors: [new Error('请输入发货人')],
              },
            });
          }
          if(!values.consignorPhone){
            form.setFields({
              consignorPhone: {
                value: values.consignorPhone,
                errors: [new Error('请输入发货人电话')],
              },
            });
          }
          if(!values.deliveryAddress){
            form.setFields({
              deliveryAddress: {
                value: values.deliveryAddress,
                errors: [new Error('请输入发货地址')],
              },
            });
          }
        }
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
                })(<Input placeholder="请输入发货人" />)}
              </FormItem>
              <FormItem {...formAllItemLayout} label="发货人电话">
                {getFieldDecorator('consignorPhone', {
                  initialValue: details.consignorPhone,
                  rules: [
                    {
                      pattern: /^[\d+]{11,12}$/,
                      message: '请输入正确的电话'
                    },
                  ],
                })(<Input placeholder="请输入发货人电话" />)}
              </FormItem>
              <FormItem {...formAllItemLayout} label="发货地址">
                {getFieldDecorator('deliveryAddress', {
                  initialValue: details.deliveryAddress,
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
