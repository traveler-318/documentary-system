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

import { importText,exportOrder } from '../../../services/newServices/order'
import { getAccessToken, getToken } from '../../../utils/authority';
import { getList as getSalesmanLists } from '../../../services/newServices/sales';
import { LOGISTICSCOMPANY } from './data';
import styles  from './index.less';
import { getCookie } from '../../../utils/support';
import { getProductattributeAdd } from '../../../services/newServices/product';


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
      createTime:'',
      loading: false,
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
    const {  createTime } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      values.createTime=createTime
      if (!err) {
        importText(values).then(res=>{
          this.setState({
            loading:false,
          })
          if(res.code === 200){
            message.success(res.msg);
            this.props.handleTextCancel()
          }else {
            message.error(res.msg);
          }
        })
      }else{
        this.setState({
            loading:false,
          })
      }
    });
  };

  onChange = (value, dateString) => {
    this.setState({
      createTime:dateString
    })
  }

  onOk = (value) => {
    this.setState({
      createTime:moment(value).format('YYYY-MM-DD HH:mm:ss')
    })
  }

  handlEeliminate = () => {
    this.props.form.resetFields();
  };

  onChange = (e) => {

  };

  reactNode = () => {
    return(
      <div>
        <p>物流一致直接勾选,不一致则按照格式存放粘贴,金额一致就输入,不一致按照格式填写姓名,电话,地址,金额,物流名称,物流单号,SN设备号,创建时间 如没有相关数据请留空即可(但是逗号需要保留)</p>
        <p>示例：1、张三,18000000011,北京市丰台区西瓜路32号,100,顺丰速运,SF10010,0010ABC,2019-10-11 11:01:18</p>
        <p>2、李四,18000000012,北京市丰台区西瓜路33号,,,,,</p>
        <p>物流公司名称需要和物流公司下选项里面的名字保持一致</p>
      </div>
    )
  }

  render() {
    const {
      form: { getFieldDecorator },
      textVisible,
      confirmLoading,
      handleTextCancel
    } = this.props;

    const {salesmanList,loading}=this.state;

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
          loading={loading}
          maskClosable={false}
          footer={[
            <Button key="back" onClick={()=>this.handlEeliminate()}>
              清除
            </Button>,
            <Button type="primary" onClick={(e)=>{
              if(loading){
                return false;
              }
              this.setState({
                loading:true,
              })
              this.handleSubmit(e,false)
            }}>
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
              <FormItem {...formAllItemLayout} label="创建时间">
                {getFieldDecorator('createTime', {

                })(
                  <DatePicker
                    showTime={{ format: 'HH:mm:ss' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择提醒时间"
                    onChange={this.onChange}
                    onOk={this.onOk}
                  />
                )}
                <Tooltip
                  title="订单统一创建时间"
                ><Icon type='question-circle-o' style={{top:"2px"}} /></Tooltip>
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
                  <TextArea rows={8} placeholder="示例：张三,18000000011,北京市丰台区西瓜路32号,100,顺丰速运,SF10010,0010ABC,2019-10-11 11:01:18 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 姓名,电话,地址,金额,物流名称,物流单号,SN设备号,创建时间 如没有相关数据请留空即可(但是逗号需要保留)" onChange={(e)=>this.onChange(e)} />
                )}
                <Tooltip 
                  overlayStyle={{
                    width:"380px",
                    maxWidth:"380px"
                  }}
                  title={this.reactNode}
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
