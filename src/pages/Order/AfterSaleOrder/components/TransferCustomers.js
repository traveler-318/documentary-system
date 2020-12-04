import React, { PureComponent } from 'react';
import { Modal, Checkbox, Form, Input, Card, Row, Col, Button, TreeSelect, Select, DatePicker, message, Cascader, Radio } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import { tenantMode } from '../../../../defaultSettings';
import { getCookie } from '../../../../utils/support';
import {equipment} from '../../../../services/newServices/order'
import {LOGISTICSCOMPANY} from '../data.js';
import { getList as getSalesmanLists } from '../../../../services/newServices/sales';

const FormItem = Form.Item;
const { TextArea } = Input;


@connect(({ globalParameters}) => ({
    globalParameters,
}))
@Form.create()
class TransferCustomers extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      listParam:{},
      salesmanList:[]
    };
  }


  componentWillMount() {
    const { globalParameters } = this.props;
    // 获取列表选中数据
    this.setState({
        listParam:globalParameters.listParam
    })

    this.getSalesmanList()
  }

  // 获取业务员数据
  getSalesmanList = () => {
    getSalesmanLists({size:100,current:1}).then(res=>{
      this.setState({
        salesmanList:res.data.records
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

        equipment({
          orderIds,
          salesman:values.salesman
        }).then(res=>{
          this.setState({loading:false });
          if(res.code === 200){
            message.success(res.msg);
            this.props.handleCancelTransfer("getlist");
          }
        })
      }
    });
  };


  render() {
    const {
      form: { getFieldDecorator },
      TransferVisible,
      handleCancelTransfer,
    } = this.props;

    const {
      loading,
      salesmanList
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
          title="转移客户"
          visible={TransferVisible}
          maskClosable={false}
          width={400}
          onCancel={handleCancelTransfer}
          footer={[
            <Button key="back" onClick={handleCancelTransfer}>
              取消
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={(e)=>this.handleSubmit(e,false)}>
              确定
            </Button>,
          ]}
        >
            <Form style={{ marginTop: 8 }}>
                <FormItem {...formAllItemLayout} label="接收销售">
                  {getFieldDecorator('salesman', {
                      initialValue: null,
                      rules: [
                        {
                          required: true,
                          message: '请选择接收销售',
                        },
                      ],
                    })(
                    <Select placeholder={"请选择接收销售"}>
                    {salesmanList.map(item=>{
                      return (<Option value={item.userName}>{item.userName}</Option>)
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

export default TransferCustomers;
