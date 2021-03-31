import React, { PureComponent } from 'react';
import { Modal, Form, Button, Select, message } from 'antd';
import { connect } from 'dva';
import { getList as getSalesmanLists } from '../../../../services/newServices/sales';
import { getCookie } from '../../../../utils/support';
import { getSameLevelUser,allotToDirector } from '../../../../services/order/customer';

const FormItem = Form.Item;

@connect(({ globalParameters}) => ({
    globalParameters,
}))
@Form.create()
class Distribution extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      listParam:{},
      sameLevelUser:[],
    };
  }


  componentWillMount() {
    const { globalParameters } = this.props;
    // 获取列表选中数据
    this.setState({
        listParam:globalParameters.listParam
    })
    this.sameLevelUser()
  }

  sameLevelUser = () => {
    getSameLevelUser().then(res=>{
      this.setState({
        sameLevelUser:res.data
      })
    })
  }

  handleSubmit = (e,sms_confirmation) => {
    e.preventDefault();
    const { form } = this.props;
    const { listParam } = this.state;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        this.setState({loading:true });

        let orderIds = listParam.map(item=>{
            return item.id
        })

        allotToDirector({
          orderIds,
          salesman:values.salesman
        }).then(res=>{
          this.setState({loading:false });
          if(res.code === 200){
            message.success(res.msg);
            this.props.handleCancelDistribution("getlist");
          }else {
            message.error(res.msg);
          }
        })
      }
    });
  };


  render() {
    const {
      form: { getFieldDecorator },
      DistributionVisible,
      handleCancelDistribution,
    } = this.props;

    const {
      loading,
      sameLevelUser
    } = this.state;

    const formAllItemLayout = {
      labelCol: {
        span: 7,
      },
      wrapperCol: {
        span: 17,
      },
    };

    return (
        <Modal
          title="分配主管"
          visible={DistributionVisible}
          maskClosable={false}
          width={400}
          onCancel={handleCancelDistribution}
          footer={[
            <Button key="back" onClick={handleCancelDistribution}>
              取消
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={(e)=>this.handleSubmit(e,false)}>
              确定
            </Button>,
          ]}
        >
            <Form style={{ marginTop: 8 }}>
                <FormItem {...formAllItemLayout} label="分配主管">
                  {getFieldDecorator('salesman', {
                      initialValue: null,
                      rules: [
                        {
                          required: true,
                          message: '请选择分配的主管',
                        },
                      ],
                    })(
                    <Select placeholder={"请选择分配的主管"}>
                    {sameLevelUser.map((item,index)=>{
                      return (<Option key={index} value={item.userId}>{item.name}</Option>)
                    })}
                  </Select>
                  )}
                </FormItem>
                {/* <FormItem {...formAllItemLayout} label="备注信息">
                  {getFieldDecorator('orderNote')(
                    <TextArea rows={4} />
                  )}
                </FormItem> */}
            </Form>
        </Modal>
    );
  }
}

export default Distribution;
