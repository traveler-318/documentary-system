import React, { PureComponent } from 'react';
import { connect } from 'dva';
import echarts from 'echarts'
import {
  Form,
  DatePicker,
  Icon,
  Table,
  Button,
} from 'antd';
import Panel from '../../../components/Panel';
import { FormattedMessage } from 'umi/locale';
import styles from './index.less';
import moment from 'moment';

const { RangePicker,MonthPicker } = DatePicker;

@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class Statistics extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      params:{
        size:10,
        current:1
      },
      data:{},
      pagination:{},
      xData:[2,5,1,9],
      yData:[3.1,3.2,3.2,3.4],
      loading: false
    };
  }

  // ============ 初始化数据 ===============
  componentWillMount() {
    setTimeout(() => {
      this.init()
    }, 200)
  }

  handleTableChange = (pagination) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    const {params}=this.state;
    params.current=pagination.current;
    this.getSmsList(params)
  };

  handleChange = (data,dateString) => {
   console.log(data,dateString);
    this.setState({
      xData:[12,15,11,19],
      yData:[4.1,4.2,4.2,4.4],
    },()=>{
      this.init()
    })
  };

  init = () => {
    const myChart = echarts.init(document.getElementById('echarts_main'));

    const { xData,yData } = this.state
    const option = {
      title: {
        text: '检测统计',
        textStyle: {
          fontSize: 16,
          fontStyle: 'normal',
          fontWeight: 'normal',
        },
        padding: [20,0,0,0]
      },
      // tooltip: {
      //   trigger: 'axis'
      // },
      grid: {
        left: '1%',
        right: '2%',
        bottom: '2%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: yData
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: xData,
        itemStyle : {
          normal : {
            color:'#6294F9',
            lineStyle:{
              color:'#6294F9'
            }
          }
        },
        type: 'line'
      }]
    };
    myChart.setOption(option);
    myChart.resize({ height: '400px' });
    myChart.on("click", this.pieConsole);
  }

  render() {
    const code = 'statistics';

    const {
      form,
    } = this.props;
    const { getFieldDecorator } = form;

    const formAllItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };
    const {loading,pagination,data} = this.state;

    const columns = [
      {
        title: '日期',
        dataIndex: 'userPhone',
        width: 150,
        ellipsis: true,
      },
      {
        title: '运营商类型',
        dataIndex: 'smsCategory',
        width: 150,
      },
      {
        title: '查询总量',
        dataIndex: 'outOrderNo',
        width: 200,
        ellipsis: true,
      },
      {
        title: '查询成功量',
        dataIndex: 'sendTime',
        width: 200,
      },
      {
        title: '正常状态',
        dataIndex: 'sendTime1',
        width: 100,
      },
      {
        title: '停机',
        dataIndex: 'sendTime2',
        width: 100,
      },
      {
        title: '空号',
        dataIndex: 'sendTime3',
        width: 100,
      },
    ];

    return (
      <>
        <div className={styles.statistics}>
          <span className={styles.title}>检测统计</span>
          <div className={styles.date}>
            <Icon type="filter" theme="filled" style={{paddingRight:10}} />
            <MonthPicker placeholder="选择月份" onChange={this.handleChange} />
          </div>
          <div style={{marginLeft:10}}>
            <div ref={this.echarts_main} id="echarts_main">

            </div>
          </div>
        </div>
        <div style={{marginTop:"20px"}} className={styles.statisticsList}>
          <div style={{height:'60px'}}>
            <Form.Item>
              {getFieldDecorator('createTime', {
              })(
                <RangePicker showTime size={"default"} />
              )}
            </Form.Item>
            <Button type="primary" onClick={()=>this.renderSearchForm()} style={{marginTop:'15px'}}>
              <FormattedMessage id="button.search.name" />
            </Button>
          </div>
          <Table columns={columns} loading={loading} dataSource={data.list} pagination={pagination} onChange={this.handleTableChange} />
        </div>
      </>
    );
  }
}
export default Statistics;
