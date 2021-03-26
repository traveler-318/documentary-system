import React, { PureComponent } from 'react';
import { connect } from 'dva';
import echarts from 'echarts'
import {
  Form,
  DatePicker,
  Icon,
  Table,
  Button,
  Row,
  Col,
  Input, message, Upload, Radio, Modal, Spin,
} from 'antd';
import Panel from '../../../components/Panel';
import { FormattedMessage } from 'umi/locale';
import styles from './index.less';
import moment from 'moment';
import { getAccessToken, getToken } from '../../../utils/authority';
import HistogramOutline from '../../../assets/detection/HistogramOutline.svg'
import zonghaoma from '../../../assets/detection/zonghaoma.svg'
import shihao from '../../../assets/detection/shihao.svg'
import konghao from '../../../assets/detection/konghao.svg'
import fengxianhao from '../../../assets/detection/fengxianhao.svg'

import Import from '../../../assets/detection/Import.svg'
import tips from '../../../assets/detection/tips.svg'

import result from '../../../assets/detection/result.svg'
import axios from 'axios';
import {getPhone,importPhoneFile} from '../../../services/detection';
import { clientId, clientSecret } from '../../../defaultSettings';
import { Base64 } from 'js-base64';

const { RangePicker,MonthPicker } = DatePicker;
const { Search } = Input;
const { Dragger } = Upload;
@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class Detection extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      BatchTestingVisible:false,
      fileList:[],
      loading:false,
      phone:'-',
      status:'-',
      carrier:'-',
    };
  }

  // ============ 初始化数据 ===============
  componentWillMount() {

  }

  BatchTesting = () => {
    this.setState({
      BatchTestingVisible:true,
    })
  }

  handleCancelBatchTesting = () => {
    this.setState({
      BatchTestingVisible:false,
    })
  }

  handleSubmit = () => {
    // this.state.fileList[0];
    const params={
      file:this.state.fileList[0],
      type:0
    }
    this.setState({
      loading:true,
    })
    const formData = new FormData();
    formData.append('type', 0);
    formData.append('file', this.state.fileList[0]);
    axios({
      method: "post",
      url:`/api/phoneNumber/check/importPhoneFile`,
      data:formData,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "Authorization": `Basic ${Base64.encode(`${clientId}:${clientSecret}`)}`,
        "Blade-Auth": getToken(),
        "token": getToken(),
      },
      // 设置responseType对象格式为blob
      responseType: "blob"
    }).then(res => {
      console.log(res)
      if(!res.data.code){
        let data = res.data;
        let fileReader = new FileReader();
        fileReader.readAsText(data, 'utf-8');
        let _this = this
        fileReader.onload = function() {
          try {
            let jsonData = JSON.parse(this.result);  // 说明是普通对象数据，后台转换失败
            message.error(jsonData.data);
          }catch(err){
            _this.downLoadBlobFile(res)
            _this.setState({
              loading:false,
              BatchTestingVisible:false,
            })
          }
        };
      }else {
        message.error(res.data.msg);
        this.setState({
          loading:false,
        })
      }
    })
  }

  // 下载方法
  downLoadBlobFile = (res) =>{
    var elink = document.createElement('a');
    elink.download = '批量检测结果.xlsx';
    elink.style.display = 'none';
    var blob = new Blob([res.data]);
    elink.href = URL.createObjectURL(blob);
    document.body.appendChild(elink);
    elink.click();
    document.body.removeChild(elink);
  }

  getPhone = (value) => {
    console.log(value)
    getPhone(Number(value)).then(res=>{
      console.log(res)
      if(res.code === 200){
        this.setState({
          phone:res.data.phone,
          status:res.data.status,
          carrier:res.data.carrier,
        })
      }else {
        message.error(res.msg)
      }
    })
  }

  handleTemplate = () => {
    // console.log(`http://121.37.251.134:9010/order/order/exportOrderTemplate`)
    // window.location.href = `http://121.37.251.134:9010/order/order/exportOrderTemplate`
    // window.open(`http://121.37.251.134:9010/order/order/exportOrderTemplate?Blade-Auth=${getAccessToken()}`);
    window.open(`/api/phoneNumber/check/exportPhoneExcel?Blade-Auth=${getAccessToken()}`);
  };


  render() {
    const code = 'detection';

    const {
      form,
    } = this.props;
    const { getFieldDecorator } = form;

    const {BatchTestingVisible,fileList,phone,status,carrier,loading} = this.state;

    const propss = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };

    return (
      <>
        <div className={styles.TipsTop}>
          操作流程：① 点击"浏览"上传号码文件 ② 点击开始监测 ③ 等待结果生成，下载结果包
        </div>
        <div className={styles.contentBox}>
          <div className={styles.contentBox_title}>
            <img src={HistogramOutline}></img>
            <span className={styles.text}>今日统计</span>
          </div>
          <Row gutter={24} style={{paddingBottom:20}}>
            <Col className={styles.gutterRow} span={6}>
              <div className={styles.leftBox}>
                <img src={zonghaoma}></img>
              </div>
              <div className={styles.rightBox}>
                <p className={styles.numBer}>0</p>
                <p>今日监测总号码数</p>
              </div>
            </Col>
            <Col className={styles.gutterRow} span={6}>
            <div className={styles.leftBox}>
                <img src={shihao}></img>
              </div>
              <div className={styles.rightBox}>
                <p className={styles.numBer}>0</p>
                <p>今日监测实号数</p>
              </div>
            </Col>
            <Col className={styles.gutterRow} span={6}>
            <div className={styles.leftBox}>
                <img src={konghao}></img>
              </div>
              <div className={styles.rightBox}>
                <p className={styles.numBer}>0</p>
                <p>今日监测空号数</p>
              </div>
            </Col>
            <Col className={styles.gutterRow} span={6}>
            <div className={styles.leftBox}>
                <img src={fengxianhao}></img>
              </div>
              <div className={styles.rightBox}>
                <p className={styles.numBer}>0</p>
                <p>今日监测风险号数</p>
              </div>
            </Col>
          </Row>
        </div>

        <div className={styles.contentBox}>
          <div className={styles.contentBox_title}>
            <img src={Import}></img>
            <span className={styles.text}>导入号码</span>
          </div>
          <div className={styles.searchBox}>
            <Search
              placeholder="请输入要检测的号码"
              enterButton="检测"
              size="large"
              onSearch={value => this.getPhone(value)}
            />
            <Button className={styles.searchBtn} onClick={this.BatchTesting}>批量检测</Button>
            <div className={styles.searchTips}>
              <img src={tips}></img>
              提示：请按照模板格式进行导入，每行一个手机号码。<span onClick={this.handleTemplate}>下载模板</span>
            </div>
          </div>
          <p style={{color:"#3E3E3E",fontSize: 16,textAlign: 'center',paddingTop:15}}>
            手机号：<span style={{color:"#A1A1A1",marginRight:20}}>{phone}</span>
            状态：<span style={{color:"#A1A1A1",marginRight:20}}>{status}</span>
            运营商：<span style={{color:"#A1A1A1"}}>{carrier}</span>
          </p>
          <div className={styles.TipsTop}>
            <p>操作流程：</p>
            <p>单个检测：① 输入要检测的号码 ② 点击检测 ③ 查看下方结果</p>
            <p>批量检测：① 点击"批量检测"上传号码文件 ② 点击确定 ③ 等待结果生成，下载结果包</p>
          </div>
        </div>

        <div className={styles.contentBox}>
          <div className={styles.contentBox_title}>
            <img src={result}></img>
            <span className={styles.text}>监测结果</span>
            <span className={styles.titleRight}><Icon type="download" />全部下载</span>
          </div>
          <Row type="flex" justify="space-between">
            <Col className={styles.gutterRowBox} span={7}>
              <p className={styles.numBer}>0</p>
              <p>实号</p>
              <div>
                <Button type="danger" style={{marginRight:10}}>导入客户</Button>
                <Button type="primary">下载</Button>
              </div>
            </Col>
            <Col className={styles.gutterRowBox} span={7}>
              <p className={styles.numBer}>0</p>
              <p>空号</p>
              <div><Button type="primary">下载</Button></div>
            </Col>
            <Col className={styles.gutterRowBox} span={7}>
              <p className={styles.numBer}>0</p>
              <p>风险号</p>
              <div><Button type="primary">下载</Button></div>
            </Col>
          </Row>
          <div className={styles.TipsTop}>
            <p>监测结果说明：</p>
            <p>1、实号包：正常的活跃用户</p>
            <p>2、空号包：停机或空号</p>
            <p>3、风险包：长时间关机或未开通语音服务以及易投诉的用户</p>
            <p>4、错误包：号码错误</p>
          </div>
        </div>

        <Modal
          title="批量检测"
          visible={BatchTestingVisible}
          maskClosable={false}
          destroyOnClose
          width={400}
          onCancel={this.handleCancelBatchTesting}
          footer={[
            <Button key="back" onClick={this.handleCancelBatchTesting}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={()=>this.handleSubmit()}>
              确定
            </Button>,
          ]}
        >
          <Spin
            tip="检测中请稍等..."
            style={{botton:"-77px",right:"-10px",zIndex:1000,top:0}}
            spinning={loading}
          >
          <Form>
            <Form.Item>
              <Dragger
                {...propss}
                onChange={this.onUpload}
              >
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">将文件拖到此处，或点击上传</p>
                <p className="ant-upload-hint">请上传 .xls,.xlsx 格式的文件</p>
              </Dragger>
            </Form.Item>
          </Form>
          </Spin>
        </Modal>
      </>
    );
  }
}
export default Detection;
