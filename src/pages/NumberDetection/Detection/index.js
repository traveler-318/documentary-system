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
  Input
} from 'antd';
import Panel from '../../../components/Panel';
import { FormattedMessage } from 'umi/locale';
import styles from './index.less';
import moment from 'moment';
import HistogramOutline from '../../../assets/detection/HistogramOutline.svg'
import zonghaoma from '../../../assets/detection/zonghaoma.svg'
import shihao from '../../../assets/detection/shihao.svg'
import konghao from '../../../assets/detection/konghao.svg'
import fengxianhao from '../../../assets/detection/fengxianhao.svg'

import Import from '../../../assets/detection/Import.svg'
import tips from '../../../assets/detection/tips.svg'

import result from '../../../assets/detection/result.svg'

const { RangePicker,MonthPicker } = DatePicker;
const { Search } = Input;
@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class Detection extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  // ============ 初始化数据 ===============
  componentWillMount() {

  }

  render() {
    const code = 'detection';

    const {
      form,
    } = this.props;
    const { getFieldDecorator } = form;

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
              placeholder="请上传文件进行检索"
              enterButton="浏览"
              size="large"
              onSearch={value => console.log(value)}
            />
            <div className={styles.searchTips}>
              <img src={tips}></img>
              提示：请按照模板格式进行导入，每行一个手机号码。<span>下载模板</span>
            </div>
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
                <Button type="danger" style={{marginRight:10}}>导入公海</Button>
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
      </>
    );
  }
}
export default Detection;
