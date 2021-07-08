import React, { PureComponent } from 'react';
import { Modal, Icon, Tooltip, Row, Col, Button, message, Tag } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import styles from './index.less';
import { getMobileDetail } from '../../../services/newServices/order'

@connect(({ globalParameters}) => ({
    globalParameters,
}))
class Assessment extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      details:{}
    };
  }

  componentWillMount() {
      this.getDetails();
  }

  getDetails = () => {
    getMobileDetail({
        orderId:this.props.AssessmentDetails.id
    }).then(res=>{
        if(res.code === 200){
            this.setState({
                details:res.data
            })
        }
        console.log(res,"getMobileDetail")
    })
  }

  getRiskControlResults = () => {
      if(this.state.details.riskControlResults){
        console.log(this.state.details.riskControlResults)
        let riskControlResults = this.state.details.riskControlResults.split('\n');
        console.log(riskControlResults)
        return(
            <>
                {riskControlResults.map(item=>{
                    return <div>{item}</div>
                })}
            </>
        )
      }else{
          return ''
      }
  }

  render() {
    const {
      AssessmentVisible,
      handleCancelAssessment,
      AssessmentDetails
    } = this.props;

    const {
      loading,
      details
    } = this.state;

    return (
        <>
          <Modal
            title="风险评估"
            visible={AssessmentVisible}
            maskClosable={false}
            width={430}
            onCancel={handleCancelAssessment}
            footer={[
              <Button key="back" onClick={handleCancelAssessment}>
                取消
              </Button>,
            ]}
          >
            <div className={styles.rowList}>
                <Row gutter={24}>
                    <Col span={6}>IP地址:</Col><Col span={18}>{details.afterIp || '暂无'}</Col>
                    <Col span={6}>IP归属:</Col><Col span={18}>
                    {details.provinceName}{details.cityName}
                    {
                        (!details.provinceName && !details.cityName) ? '暂无' : ''
                    }
                    </Col>
                    <Col span={6}>收获地址:</Col><Col span={18}>{AssessmentDetails.userAddress}</Col>
                    <Col span={6}>风险评估:</Col><Col span={18}>
                    {/* {details.riskControlDescribe || '无'} */}
                    {
                        details.riskControlLevel == 0 ?(<Tag color="green">通过</Tag>):
                        details.riskControlLevel == 1 ?(<Tag color="gold">人工</Tag>):
                        details.riskControlLevel == 2 ?(<Tag color="red">风险</Tag>):
                        details.riskControlLevel == 3 ?(<Tag>老黑</Tag>):
                        details.riskControlLevel == 4 ?(<Tag>网黑</Tag>): '无'
                     }
                        <Tooltip placement="right" title={this.getRiskControlResults}>
                            <Icon style={{marginLeft:10}} type='question-circle-o' />
                        </Tooltip>
                    </Col>
                </Row>
            </div>
            <div className={styles.rowList}>
              <Row gutter={24}>
                <Col span={6}>终端类型:</Col><Col span={18}>{details.accessDeviceType || '暂无'}</Col>
                <Col span={6}>终端型号:</Col>
                <Col span={18}>
                    {details.mobileName ? (
                        <>
                            <a target="view_window" href={`https://www.baidu.com/s?ie=UTF-8&wd=${details.mobileName}`}>{details.mobileName}</a>
                            <Tooltip placement="right" title='点击型号搜索终端价格'>
                                <Icon style={{marginLeft:10}} type='question-circle-o' />
                            </Tooltip>
                        </>
                    ) :'暂无'}
                    
                </Col>
                <Col span={6}>网络类型:</Col><Col span={18}>{details.networkType || '暂无'}</Col>
              </Row>
            </div>
            <div className={styles.rowList}>
              <Row gutter={24}>
                <Col span={6}>浏览器信息</Col>
                <Col span={18}>
                    <Tooltip placement="right" title='通过浏览器和系统评估用户操作能力'>
                        <Icon type='question-circle-o' />
                    </Tooltip>
                </Col>
                <Col span={6}>浏览器:</Col><Col span={18}>{details.browserInternetType || '暂无'}</Col>
                <Col span={6}>版本号:</Col><Col span={18}>
                    {(details.browserVersion === "null" || !details.browserVersion) ? '暂无' : details.browserVersion}
                </Col>
                <Col span={6}>操作系统:</Col><Col span={18}>{details.operatingSystemName || '暂无'}</Col>
              </Row>
            </div>
          </Modal>
        </>
    );
  }
}

export default Assessment;
