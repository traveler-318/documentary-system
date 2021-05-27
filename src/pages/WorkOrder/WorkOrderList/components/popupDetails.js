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
import { getList, updateChatRecords,updateReaded,getUpToken } from '../../../../services/newServices/workOrder';
import {ORDERSTATUS} from './data';
import FormDetailsTitle from '../../../../components/FormDetailsTitle';
import { getToken } from '@/utils/authority';
import LogisticsDetails from './LogisticsDetails';
import BigImg from './ImgBig';
import * as qiniu from 'qiniu-js'
const FormItem = Form.Item;
const { TextArea } = Input;
const { Dragger } = Upload;
const { TabPane } = Tabs;

let config = {
  useCdnDomain: true,         // 表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
  region: qiniu.region.z2     // 上传域名区域（z1为华北）,当为 null 或 undefined 时，自动分析上传域名区域
};
let putExtra = {
  fname: "",          // 文件原文件名
  params: {},         // 放置自定义变量： 'x:name': 'sex'
  mimeType: null      // 限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
};


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
      tokenJson:{},
      url:'',
      visible:false,
      ImgBig:''
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
      this.updateReaded();
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

  updateReaded = () => {
    const { globalParameters } = this.props;
    const { detail} = this.state;
    const params={
      id:String(globalParameters.detailData.id),
      chatRecords:globalParameters.detailData.chatRecords
    }
    console.log(params)
    updateReaded(params).then(res=>{
      console.log(res.data)
      this.getDataList(detail.id)
    })
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

  handleSubmit =(url)=>{
    const { detail , describe,chatRecords} = this.state;
    const { globalParameters } = this.props;
    const params={
      "id": chatRecords[0].id,
      "chatRecords":JSON.stringify({
        "id":chatRecords[0].id,
        "creatime": moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        "context": describe,
        "pic_zoom_url": "",
        "pic_url": url,
        "read_status": 0,
        "identity": '1',
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

  UpToken=(name)=>{
    getUpToken(name).then(res=>{
      console.log(res)
      if(res.code === 200){
        this.setState({
          tokenJson:res.data
        })
      }else{
        message.error(res.message)
      }
    })
  }

  onUpload = info => {
    console.log(info)
    console.log(info.file);

    if (info.file.status === 'uploading') {
      console.log("1111")
      return;
    }
    if (info.file.status === 'done') {
      console.log(info.file)

      const _this=this;
      getUpToken(info.file.name).then(res=>{
        console.log(res)
        if(res.code === 200){
          /*
              file: File 对象，上传的文件
              key: 文件资源名
              token: 上传验证信息，前端通过接口请求后端获得
              config: object，其中的每一项都为可选
          */
          const observable = qiniu.upload(info.file.originFileObj, res.data.imgUrl, res.data.token, putExtra, config)
          const subscription = observable.subscribe({
            next: (result) => {
              // 接收上传进度信息，result是带有total字段的 Object
              // loaded: 已上传大小; size: 上传总信息; percent: 当前上传进度
              console.log(result);    // 形如：{total: {loaded: 1671168, size: 2249260, percent: 74.29856930723882}}
              // this.percent = result.total.percent.toFixed(0);
            },
            error: (errResult) => {
              // 上传错误后失败报错
              console.log(errResult)
              message.error('上传失败');
            },
            complete: (result) => {
              // 接收成功后返回的信息
              console.log(result);   // 形如：{hash: "Fp5_DtYW4gHiPEBiXIjVsZ1TtmPc", key: "%TStC006TEyVY5lLIBt7Eg.jpg"}
              if (result.key) {
                message.success('上传成功');
                _this.handleSubmit(result.key)
                // return false;
              }
            }
          }) // 上传开始
        }else{
          message.error(res.message)
        }
      })
    }
  }

  viewImgBig =(img)=>{
    this.setState({
      ImgBig:img,
      visible:true
    })

  }

  handleImgModal =()=>{
    this.setState({
      visible:false
    })
  }

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
      chatRecords,
      visible,
      ImgBig
    } = this.state;

    console.log(chatRecords )

    const formAllItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };
    const imgHttp = 'https://oss.gendanbao.com.cn/';

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
                        <div className={styles.creatime}>{chatRecords[0].create_time}</div>
                        <div className={`${styles.detailMesage}`}>
                          <div className={styles.userPhoto}>客户</div>
                          <div className={`${styles.message}`} style={{marginRight:'8px'}}>
                            <div>反馈类型：{globalParameters.detailData.complaintsDescribe}</div>
                            <div>反馈内容：{chatRecords.length>0 && chatRecords[0].context}</div>
                            <br/>
                            <div>联系方式</div>
                            <div>姓名：{detail.userName}</div>
                            <div>手机号：{detail.userPhone}</div>
                            <div className={styles.state}>{chatRecords[0].read_status === 0 ? '未读':'已读'}</div>
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
                                    {item.pic_url && (
                                      <img style={{width:'100%'}} src={imgHttp+item.pic_url} onClick={()=>this.viewImgBig(item.pic_url)} />
                                    )}
                                    <div className={styles.state}>{item.read_status === 0 ? '未读':'已读'}</div>
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
                                    {item.pic_url && (
                                      <img style={{width:'100%'}} src={imgHttp+item.pic_url} onClick={()=>this.viewImgBig(item.pic_url)} />
                                    )}
                                    <div className={styles.state}>{item.read_status === 0 ? '未读':'已读'}</div>
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
                        <div className={styles.img} style={{float:"left",cursor:"pointer",paddingTop:7}}>

                          <Dragger onChange={(e)=>this.onUpload(e)}>
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
                            onClick={()=>this.handleSubmit('')}
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

        {/* 查看图片 */}
        {visible?(
          <BigImg
            visible={visible}
            ImgBig={imgHttp+ImgBig}
            handleImgModal={this.handleImgModal}
          />
        ):""}


      </>

    );
  }
}

export default OrdersEdit;
