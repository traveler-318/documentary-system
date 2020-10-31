import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Tag, Badge, Form, Input, Row, Select, DatePicker, Divider, Dropdown, Menu, Icon, Modal, message, Tabs, Radio } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import { Resizable } from 'react-resizable';
import moment from 'moment';
import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';
import func from '../../../utils/Func';
import {
  getList,
} from '../../../services/newServices/smsRecord';
import Edit from './components/edit'


const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { SubMenu } = Menu;

let modal;


@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class SMSrecord extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:[

      ],
      loading:false,
      handleEditVisible:false,
      details:'',
      params:{
        size:10,
        current:1
      }
    }
  }

  // ============ 初始化数据 ===============
  componentWillMount() {
   this.getDataList()
  }

  getDataList = () => {
    const {params} = this.state;
    this.setState({
      loading:true
    })
    getList(params).then(res=>{
      console.log(res.data.records)
      this.setState({
        loading:false
      })
      this.setState({
        data:{
          list:res.data.records,
          pagination:{
            current: res.data.current,
            pageSize: res.data.size,
            total: res.data.total
          }
        }
      })
    })
  }

  // 修改弹框
  handleEdit = (row) => {
    this.setState({
      handleEditVisible:true,
      details:row
    })
  }

  handleCancelEdit = () => {
    this.setState({
      handleEditVisible:false
    })
  }


  // ============ 查询 ===============
  handleSearch = params => {
    const { startTime } = params;
    let payload = {
      ...params,
    };
    if (startTime) {
      payload = {
        ...params,
        startTime: startTime ? func.format(startTime[0], 'YYYY-MM-DD hh:mm:ss') : null,
        endTime: startTime ? func.format(startTime[1], 'YYYY-MM-DD hh:mm:ss') : null,
      };
    }
    this.setState({
      params:payload
    },()=>{
      this.getDataList();
    })
  };

  // ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const {
      form,
    } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div className={"default_search_form"}>
        <Form.Item label="时间范围">
          {getFieldDecorator('startTime', {
                initialValue: null,
              })(
                <RangePicker showTime size={"default"} />
              )}
        </Form.Item>
        <Form.Item label="手机号">
          {getFieldDecorator('phoneNumber')(<Input placeholder="请输入手机号" />)}
        </Form.Item>
        <div style={{ float: 'right' }}>
          <Button type="primary" htmlType="submit">
            <FormattedMessage id="button.search.name" />
          </Button>
        </div>
      </div>
    );
  };

  renderLeftButton = () => (
    <>
      
    </>
  );
  
 

  render() {
    const code = 'smsrecord';

    const {
      form,
    } = this.props;

    const {data,loading,handleEditVisible,details} = this.state;

    const columns = [
      {
        title: '反馈状态码',
        dataIndex: 'errCode',
        width: 150,
        ellipsis: true,
      },
      {
        title: '反馈发送结果',
        dataIndex: 'errMsg',
        width: 150,
        ellipsis: true,
      },
      {
        title: '用户手机号',
        dataIndex: 'phoneNumber',
        width: 150,
        ellipsis: true,
      },
      {
        title: '发送时间',
        dataIndex: 'sendTime',
        width: 200,
        render: (res) => {
          return(
            <div>
              {
                res === '' ?
                  (res)
                  :(moment(res).format('YYYY-MM-DD HH:mm:ss'))
              }
            </div>
          )
        },
      },
      {
        title: '发送类型',
        dataIndex: 'smsCategory',
        width: 200,
        ellipsis: true,
      },
      {
        title: '发送图片验证码',
        dataIndex: 'submitCode',
        width: 100,
        ellipsis: true,
      },
      {
        title: '发送状态',
        dataIndex: 'success',
        width: 100,
        render: (res) => {
          return(
            <span>{res == 'true' ?"成功":"失败"}</span>
          
          )
        },
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 150,
        render: (res,row) => {
          return(
            <div>
              <Divider type="vertical" />
              <a onClick={()=>this.handleEdit(row)}>详情</a>
            </div>
          )
        },
      },
    ];

    return (
      <Panel>
        <Grid
          code={code}
          form={form}
          onSearch={this.handleSearch}
          onSelectRow={this.onSelectRow}
          renderSearchForm={this.renderSearchForm}
          loading={loading}
          data={data}
          columns={columns}
          scroll={{ x: 1000 }}
          renderLeftButton={()=>this.renderLeftButton()}
        />
        {/* 详情 */}
        {handleEditVisible?(
          <Edit
            handleEditVisible={handleEditVisible}
            details={details}
            handleCancelEdit={this.handleCancelEdit}
          />
        ):""}
      </Panel>
    );
  }
}
export default SMSrecord;
