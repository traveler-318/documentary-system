import React, { PureComponent } from 'react';
import { Modal, Checkbox, Form, Input, Icon , Row, Col, Button, DatePicker, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import { tenantMode } from '../../../../defaultSettings';
import { getCookie } from '../../../../utils/support';
import { updateLogistics, logisticsRemind } from '../../../../services/newServices/order'
import { exportData } from '../data.js';
import { ORDERSOURCE } from '../data';
import styles from '../index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;

@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class Export extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      // 导出
      exportFileVisible:false,
      detail:{},
      rangeList:[
        {"value":"今日",code:1},
        {"value":"昨日",code:2},
        {"value":"本周",code:3},
        {"value":"本月",code:4},
        {"value":"自定义",code:5},
      ],
      seleteTimeRange:1,
      exportDataList:exportData(),
      isIndeterminate:true,
      checkedList:[],
      downloadExcelParam:{
        startTime:moment().format('YYYY-MM-DD')+" 00:00:00",
        endTime: moment().format('YYYY-MM-DD')+" 23:59:59"
      },
      startTime:'',
      endTime:''
    };
  }

  componentWillMount() {
    const { globalParameters } = this.props;
    // 获取详情数据
    this.setState({
      detail:globalParameters.detailData
    })
  }



  verification = (value) =>{
    if(value === null || value === undefined || value === "" || value === NaN || JSON.stringify(value) === "{}" || JSON.stringify(value) === "[]"){
      return true
    }
    return false
  }

  // 下一步
  dataExport = () => {
    const {downloadExcelParam,checkedList}=this.state;
    console.log(checkedList)
    const oneMonth =31*24*3600*1000
    if((new Date(downloadExcelParam.endTime).getTime()-new Date(downloadExcelParam.startTime).getTime()) > oneMonth){
      message.error('导出时间范围不可超过31天');
      return false;
    }else if(this.verification(checkedList)){
      message.error('请选择导出字段');
      return false;
    }

    this.setState({
      exportFileVisible:true
    })
  };

  handleCancelExportFile = () =>{
    this.setState({
      exportFileVisible:false
    })
  }


  handleChange = value => {
  };

  handleCheckAllChange = e => {
    console.log(e.target.checked)
    const {exportDataList}=this.state
    this.setState({
      isIndeterminate:false,
      checkedList: e.target.checked ? exportDataList : [],
    })
  };

  changeTimeRange = (item) => {
    console.log(item.code)
    const {exportDataList}=this.state
    console.log(moment().startOf('month').format('YYYY-MM-DD') +" 00:00:00")
    console.log(moment().endOf('month').format('YYYY-MM-DD')+" 23:59:59")
    this.setState({
      seleteTimeRange:item.code
    })
    const downloadExcelParam={};
    // 本日
    if(item.code === 1){
      downloadExcelParam.startTime = moment().format('YYYY-MM-DD')+" 00:00:00";
      downloadExcelParam.endTime = moment().format('YYYY-MM-DD')+" 23:59:59";
      this.setState({
        downloadExcelParam:downloadExcelParam
      })
    }else if(item.code === 2){
      // 昨日
      downloadExcelParam.startTime = moment(new Date()-24*60*60*1000).format('YYYY-MM-DD')+" 00:00:00";
      downloadExcelParam.endTime = moment(new Date()-24*60*60*1000).format('YYYY-MM-DD')+" 23:59:59";
      this.setState({
        downloadExcelParam:downloadExcelParam
      })
    }else if(item.code === 3){
      // 本周
      downloadExcelParam.startTime = moment().startOf('week').format('YYYY-MM-DD') +" 00:00:00";
      downloadExcelParam.endTime = moment().endOf('week').format('YYYY-MM-DD')+" 23:59:59";
      this.setState({
        downloadExcelParam:downloadExcelParam
      })
    }else if(item.code === 4){
      // 本月
      downloadExcelParam.startTime = moment().startOf('month').format('YYYY-MM-DD') +" 00:00:00";
      downloadExcelParam.endTime = moment().endOf('month').format('YYYY-MM-DD') +" 00:00:00";
      this.setState({
        downloadExcelParam:downloadExcelParam
      })
    }else if(item.code === 5){

    }
  };

  onOk = (value) => {
    const downloadExcelParam={};
    downloadExcelParam.startTime = moment(value[0]).format('YYYY-MM-DD HH:mm');
    downloadExcelParam.endTime = moment(value[1]).format('YYYY-MM-DD HH:mm');
    this.setState({
      downloadExcelParam:downloadExcelParam
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      exportVisible,
      handleCancelExport,
    } = this.props;

    const {
      loading,
      rangeList,
      seleteTimeRange,
      exportDataList,
      exportFileVisible,
      checkedList,
      indeterminate,
      downloadExcelParam,
    } = this.state;

    console.log(downloadExcelParam)

    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    return (
      <>
        <Modal
          title="数据导出"
          visible={exportVisible}
          width={760}
          onCancel={handleCancelExport}
          footer={[
            <Button key="back" onClick={handleCancelExport}>
              取消
            </Button>,
            <Button type="primary" onClick={()=>this.dataExport()}>
              下一步
            </Button>,
          ]}
        >
          <div style={{padding:30}}>
            <Row gutter={24}>
              <Col span={4}>导出范围：</Col>
              <Col span={20}>
                {rangeList.map((item,index)=>{
                  return (<span onClick={()=>this.changeTimeRange(item)} className={(index === 0 && seleteTimeRange === item.code) ? `${styles.range_item} ${styles.range_left_btn} ${styles.range_selete}` :
                    ((index+1) === rangeList.length && seleteTimeRange === item.code) ? `${styles.range_item} ${styles.range_right_btn} ${styles.range_selete}` :
                      (seleteTimeRange === item.code) ? `${styles.range_item} ${styles.range_selete}` :
                        index === 0 ? `${styles.range_item} ${styles.range_left_btn}` :
                          (index+1) === rangeList.length ? `${styles.range_item} ${styles.range_right_btn}` :
                            `${styles.range_item}`} >{item.value}</span>)
                })}
                {
                  seleteTimeRange === 5 ?
                    (<RangePicker
                      showTime={{
                        hideDisabledOptions: true,
                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                      }}
                      format="YYYY-MM-DD HH:mm:ss"
                      onOk={this.onOk}
                    />)
                    :""
                }
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={4}>导出字段：</Col>
              <Col span={20}>
                <Checkbox indeterminate={indeterminate} onChange={this.handleCheckAllChange}>全部选择</Checkbox>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={4}></Col>
              <Col span={20}>
                {
                  exportDataList.map((item) => (
                    <div className={styles.export_fields_item}>
                      <Checkbox
                        indeterminate={indeterminate}
                        onChange={this.handleCheckAllChange}
                      >
                        {item.value}
                      </Checkbox>
                      <CheckboxGroup options={item} value={checkedList}/>
                    </div>
                  ))}

              </Col>
            </Row>
          </div>
        </Modal>

        <Modal
          title="安全验证"
          visible={exportFileVisible}
          width={360}
          onCancel={()=>this.handleCancelExportFile}
          footer={[
            <Button key="back" onClick={()=>this.handleCancelExportFile}>
              取消
            </Button>,
            <Button type="primary" onClick={()=>this.dataExport()}>
              导出
            </Button>,
          ]}
        >
          <Input
            disabled
            prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
          />
          <Input style={{width:'188px',float:'left'}}
            placeholder='验证码'
            prefix={<Icon type="safety-certificate" style={{ color: 'rgba(0,0,0,.25)' }} />}
          />
          <Button>获取验证码</Button>
        </Modal>
      </>


    );
  }
}

export default Export;
