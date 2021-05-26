import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  Card,
  Row,
  Modal,
  Col,
  Button,
  Icon,
  Select,
  message,
  Tabs,
  Cascader,
  Radio,
  Timeline,
  Tooltip,
  Descriptions, Upload,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from './edit.less';
import { getDetails, productTreelist } from '../../../../services/newServices/order';
import { getList, updateChatRecords } from '../../../../services/newServices/workOrder';
import {ORDERSTATUS} from './data';
import FormDetailsTitle from '../../../../components/FormDetailsTitle';
import { getToken } from '@/utils/authority';
import LogisticsDetails from './LogisticsDetails';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Dragger } = Upload;
const { TabPane } = Tabs;


@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class OrdersEdit extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      detail:{},
      orderType:[],
      logisticsDetailsVisible:false,
      chatRecords:[],
      describe:"",
    };
  }

  componentWillMount() {
    const { globalParameters } = this.props;
    console.log(globalParameters.detailData)
    // 获取详情数据
    this.setState({
      detailsId:globalParameters.detailData.id,
      details:globalParameters.detailData,
      chatRecords:eval('(' + globalParameters.detailData.chatRecords + ')')
    },()=>{
      this.getTreeList();
      this.getEditDetails();
    });

    let _type = ORDERSTATUS.map(item=>{
      let _item = {...item}
      if(Number(item.key) <= Number(globalParameters.detailData.workOrderStatus)){
        _item.className = "clolor"
      }else{
        _item.className = ""
      }
      console.log(_item)
      return _item
    })

    this.setState({
      orderType:_type
    })



  }

  getTreeList = () => {
    productTreelist().then(res=>{
      this.setState({productList:res.data})
    })
  }


  changeDetails = (id) => {
    // 获取详情数据
    this.setState({
      detailsId:id,
    },()=>{
      this.getEditDetails();
    });
  }

  getEditDetails = () => {
    const params={
      id:this.state.detailsId
    }
    getDetails(params).then(res=>{
      this.setState({
        detail:res.data,
        payPanyId:res.data.payPanyId || '0',
        productTypeId:res.data.productTypeId || '0',
        productId:res.data.productId || '0',
      })
    })
  }

  // 物流详情窗口
  handleDetails = () => {
    const { dispatch } = this.props;
    const {detail} = this.state;
    dispatch({
      type: `globalParameters/setDetailData`,
      payload: detail,
    });
    this.setState({
      logisticsDetailsVisible:true
    })
  };

  handleLogisticsDetails = () => {
    this.setState({
      logisticsDetailsVisible:false
    })
  };

  handleSubmit =()=>{
    const { detail , describe,chatRecords } = this.state;
    const { globalParameters } = this.props;
    const params={
      "id": chatRecords[0].id,
      "chatRecords":JSON.stringify({
        "id":chatRecords[0].id,
        "creatime": moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        "context": describe,
        "pic_zoom_url": "",
        "pic_url": "",
        "read_status": 0,
        "identity": 1,
        "complaints_type":globalParameters.detailData.complaintsType
      })
    }
    console.log(params)
    updateChatRecords(params).then(res=>{
      console.log(res)
      this.getDataList(detail.id)
      this.setState({
        describe:''
      })
    })


  }

  handleEmpty =()=>{
    this.setState({
      describe:''
    })
  }


  getDataList = (id) => {
    const params={
      size:10,
      current:1,
      id:id
    }
    getList(params).then(res=>{
      console.log(res.data)
      this.setState({
        chatRecords:eval('(' + res.data.records[0].chatRecords + ')')
      })
    })
  }

  TextAreaChange = (e) => {
    this.setState({
      describe:e.target.value
    })
  };

  render() {
    const {
      form: { getFieldDecorator },
      globalParameters
    } = this.props;
    const {
      detail,
      describe,
      logisticsDetailsVisible,
      productList,
      orderType,
      chatRecords
    } = this.state;

    console.log(orderType )

    const formAllItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };
    const uploadProps = {
      name: 'file',
      headers: {
        'Blade-Auth': getToken(),
      },
      action: '/api/blade-resource/oss/endpoint/put-file-attach',
    };

    return (
      <>
        <Modal
          title="详情"
          visible={this.props.detailsVisible}
          width={1290}
          onCancel={this.props.handleCancelDetails}
          footer={null}
          bodyStyle={{paddingTop:0}}
          maskClosable={false}
          style={{
            top:40
          }}
        >
          <Form style={{ marginTop: 8 }}>
            <Card bordered={false} className={styles.editContent}>
              <Row gutter={24} style={{ margin: 0 }}>
                <Col span={8} style={{ padding: 0 }} className={styles.leftContent}>
                  <div className={styles.editList} style={{ padding: '20px' }}>
                    <FormDetailsTitle title="客户信息" style={{ margin:'0'}} />
                    <Form span={24}>
                      <FormItem {...formAllItemLayout} label="客户姓名">
                        {getFieldDecorator('userName', {
                          rules: [
                            {
                              message: '请输入客户姓名',
                            },
                          ],
                          initialValue: detail.userName,
                        })(<Input disabled={true} placeholder="请输入客户姓名" />)}
                      </FormItem>
                      <FormItem {...formAllItemLayout} label="手机号">
                        {getFieldDecorator('userPhone', {
                          initialValue: detail.userPhone,
                        })(<Input disabled={true} placeholder="" />)}
                      </FormItem>
                      <FormItem {...formAllItemLayout} label="收货地址">
                        {getFieldDecorator('userAddress', {
                          rules: [
                            {
                              message: '请输入收货地址',
                            },
                          ],
                          initialValue: detail.userAddress,
                        })(<Input title={detail.userAddress} disabled={true} placeholder="请输入收货地址" />)}
                      </FormItem>
                      <FormItem {...formAllItemLayout} label="客户归属" style={{borderBottom:'1px solid #ccc' ,marginBottom:'20px'}}>
                        {getFieldDecorator('salesmanName', {
                          rules: [
                            {
                              message: '',
                            },
                          ],
                          initialValue: detail.salesmanName,
                        })(<Input disabled placeholder="" />)}
                      </FormItem>

                      <FormDetailsTitle title="订单信息"/>
                      <FormItem {...formAllItemLayout} label="订单号">
                        {getFieldDecorator('outOrderNo', {
                          initialValue: detail.payAmount,
                        })(<Input disabled placeholder="" />)}
                      </FormItem>
                      <FormItem {...formAllItemLayout} label="订单时间">
                        {getFieldDecorator('createTime', {
                          initialValue: detail.createTime,
                        })(<Input disabled placeholder="" />)}
                      </FormItem>
                      <FormItem {...formAllItemLayout} label="快递公司">
                        {getFieldDecorator('logisticsCompany', {
                          initialValue: detail.logisticsCompany,
                        })(
                          <Input disabled placeholder="" />
                        )}
                      </FormItem>
                      <FormItem {...formAllItemLayout} label="快递单号" className={styles.salesman}>
                        {getFieldDecorator('logisticsNumber', {
                          initialValue: detail.logisticsNumber,
                        })(<Input
                          disabled  />)}
                      </FormItem>
                      <FormItem {...formAllItemLayout} label="产品类型">
                        {getFieldDecorator('productType', {
                          initialValue: detail.productType?[detail.payPanyId,detail.productTypeId,Number(detail.productId)]:null,
                        })(
                          <Cascader
                            disabled
                            options={productList}
                            fieldNames={{ label: 'value',value:'id'}}
                          />
                        )}
                      </FormItem>
                      <FormItem {...formAllItemLayout} label="SN" style={{borderBottom:'1px solid #ccc'}}>
                        {getFieldDecorator('productCoding', {
                          initialValue: detail.productCoding,
                        })(<Input disabled placeholder="" />)}
                      </FormItem>
                    </Form>
                  </div>
                </Col>
                <Col span={16} style={{ padding: 0 }} className={styles.rightContent}>
                  <div className={styles.main}>
                    <ul>
                      {orderType.map(item=>{
                        return (
                          <>
                            {
                              item.key === null ? "":(<li className={item.className ? styles.color : styles.defaultColor}>{item.name}</li>)
                            }
                          </>
                        )
                      })}
                    </ul>
                    <p><label>快递：</label>{detail.logisticsCompany}<span style={{float:'right'}}>类型：售后类型</span></p>
                    <p><label>单号：</label>{detail.logisticsNumber}
                      {
                        detail.logisticsNumber ?
                          (<Button key="primary" onClick={()=>this.handleDetails()} style={{border: "0",background: "none"}}>查看物流信息</Button>)
                          :""
                      }
                    </p>
                  </div>
                  <div className={styles.tabContent}>
                    <div className={styles.timelineContent}>
                      <div className={styles.detailItem}>
                        <div className={styles.creatime}>{chatRecords[0].creatime}</div>
                        <div className={`${styles.detailMesage}`}>
                          <div className={styles.userPhoto}>客户</div>
                          <div className={`${styles.message}`} style={{marginRight:'8px'}}>
                            <div>反馈类型：{globalParameters.detailData.complaintsDescribe}</div>
                            <div>反馈内容：{chatRecords.length>0 && chatRecords[0].context}</div>
                            <br/>
                            <div>联系方式</div>
                            <div>姓名：{detail.userName}</div>
                            <div>手机号：{detail.userPhone}</div>
                          </div>
                        </div>
                      </div>
                      {
                        chatRecords.map((item,i)=>{
                          return i==0 ? '': item.identity == 0 ?
                            (
                              <div className={styles.detailItem}>
                                <div className={styles.creatime}>{item.creatime}</div>
                                <div className={`${styles.detailMesage}`}>
                                  <div className={styles.userPhoto}>客户</div>
                                  <div className={`${styles.message}`} style={{marginRight:'8px'}}>
                                    {item.context}
                                  </div>
                                </div>
                              </div>
                            ):(
                              <div className={styles.detailItem}>
                                <div className={styles.creatime}>{item.creatime}</div>
                                <div className={`${styles.detailMesage} ${styles.detailMessage1}`}>
                                  <div className={styles.userPhoto}>我</div>
                                  <div className={`${styles.message} ${styles.message1}`} style={{marginRight:'8px'}}>
                                    {item.context}
                                  </div>
                                </div>
                              </div>
                            )
                        })
                      }

                    </div>
                    <div className={styles.tabText}>
                    <TextArea
                      rows={2}
                      value={describe}
                      onChange={this.TextAreaChange}
                      style={{height: '90px'}}
                      placeholder='请输入内容'
                    />
                      <div>
                        <div style={{float:"left",cursor:"pointer",paddingTop:7}}>

                          <Dragger {...uploadProps} onChange={this.onUpload}>
                            <Icon
                              type="picture"
                              style={{margin:"0 10px 0 15px"}}
                            />
                          </Dragger>
                        </div>
                        <div
                          style={{float:"left",cursor:"pointer",paddingTop:7}}
                        >
                        </div>
                        <div style={{float:"right"}}>
                          <Button
                            onClick={this.handleEmpty}
                          >清空</Button>
                          <Button
                            type="primary"
                            onClick={this.handleSubmit}
                          >发送</Button>
                        </div>
                      </div>
                    </div>
                  </div>

                </Col>
              </Row>
            </Card>
          </Form>
        </Modal>
        {/* 物流详情 */}
        {logisticsDetailsVisible?(
          <LogisticsDetails
            logisticsDetailsVisible={logisticsDetailsVisible}
            handleLogisticsDetails={this.handleLogisticsDetails}
          />
        ):""}
      </>

    );
  }
}

export default OrdersEdit;
