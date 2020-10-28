import React, { PureComponent } from 'react';
import {
  Modal,
  Checkbox,
  Form,
  Input,
  Icon,
  Row,
  Col,
  Button,
  DatePicker,
  message,
  Switch,
  Upload,
  Select, Tooltip,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import { importText,exportOrder } from '../../../../services/newServices/order'
import { getAccessToken, getToken } from '../../../../utils/authority';
import { getList as getSalesmanLists } from '../../../../services/newServices/sales';
import { LOGISTICSCOMPANY } from '../data';
import styles  from '../index.less';
import { getCookie } from '../../../../utils/support';
import { getProductattributeAdd } from '../../../../services/newServices/product';


const FormItem = Form.Item;
const { Dragger } = Upload;
const { TextArea } = Input;
const { Option } = Select;

@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class Text extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      salesmanList:[],
    };
  }

  componentWillMount() {
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

  handleSubmit = e => {
    e.preventDefault();
    const {  form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      console.log(values)
      if (!err) {
        importText(values).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            this.props.handleTextCancel()
          }else {
            message.error(res.msg);
          }
        })
      }
    });
  };

  handlEeliminate = () => {
    this.props.form.resetFields();
  };

  onChange = (e) => {

  };


  render() {
    const {
      form: { getFieldDecorator },
      textVisible,
      confirmLoading,
      handleTextCancel
    } = this.props;

    const {salesmanList}=this.state;

    const formAllItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };

    return (
      <>
        <Modal
          title="文本导入"
          width={600}
          visible={textVisible}
          onCancel={handleTextCancel}
          footer={[
            <Button key="back" onClick={()=>this.handlEeliminate()}>
              清除
            </Button>,
            <Button type="primary" onClick={(e)=>this.handleSubmit(e,false)}>
              导入
            </Button>,
          ]}
        >
          <div className={styles.text}>
            <Form style={{ marginTop: 8 }}>
              <FormItem {...formAllItemLayout} label="归属销售">
                {getFieldDecorator('salesman', {
                  rules: [
                    {
                      required: true,
                      message: '请选择归属销售',
                    },
                  ],
                })(
                  <Select placeholder={"请选择归属销售"}>
                    {salesmanList.map(item=>{
                      return (<Option value={item.userAccount}>{item.userName}</Option>)
                    })}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formAllItemLayout} label="物流公司">
                {getFieldDecorator('logisticsCompany', {

                })(
                  <Select placeholder={"请选择物流公司"}>
                    {Object.keys(LOGISTICSCOMPANY).map(key=>{
                      return (<Option value={LOGISTICSCOMPANY[key]}>{LOGISTICSCOMPANY[key]}</Option>)
                    })}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formAllItemLayout} label="金额">
                {getFieldDecorator('payAmount', {

                })(
                  <Input
                    placeholder="请输入金额"
                  />
                )}
              </FormItem>
              <FormItem {...formAllItemLayout} label="文本信息">
                {getFieldDecorator('partText')(
                  <TextArea rows={8} placeholder="示例：张三,18000000011,北京市丰台区西瓜路32号,100,顺丰速运,SF10010" onChange={(e)=>this.onChange(e)} />
                )}
                <Tooltip 
                overlayStyle={{
                  width:"380px",
                  maxWidth:"380px"
                }}
                title='物流一致直接勾选,不一致则按照格式存放粘贴,金额一致就输入,不一致按照格式填写姓名,电话,地址,金额,物流名称,物流单号 如没有相关数据请留空即可（但是逗号需要保留）
                示例：1、张三,18000000011,北京市丰台区西瓜路32号,100,顺丰速运,SF10010&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                2、李四,18000000012,北京市丰台区西瓜路33号,,,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                物流公司名称需要和物流公司下选项里面的名字保持一致
                '
                ><Icon type='question-circle-o' /></Tooltip>
              </FormItem>
            </Form>
          </div>
        </Modal>
      </>
    );
  }
}

export default Text;
