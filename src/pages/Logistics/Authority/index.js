import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, Row, Select, DatePicker, Divider, Dropdown, Menu, Icon ,Switch} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';
import { LOGISTICS_INIT, LOGISTICS_LIST } from '../../../actions/logistics';
import func from '../../../utils/Func';
import {getList} from '../../../services/newServices/logistics';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@Form.create()
class AuthorityList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data:[],

    };
  }
  // ============ 初始化数据 ===============
  componentWillMount() {
    getList().then(res=>{
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
  // ============ 查询 ===============
  handleSearch = params => {

  };

  // ============ 查询表单 ===============
  renderSearchForm = onReset => {

  };

  renderLeftButton = () => (
    <>
      数据列表
    </>
  );

  renderRightButton = () => (
    <>
      <Button type="primary" icon="plus" onClick={()=>{router.push(`/logistics/authority/add`);}}>添加</Button>
    </>
  );

  render() {
    const code = 'authorityList';
    const {
      form,
    } = this.props;

    const {data} = this.state;

    function onChange(checked) {
      console.log(`switch to ${checked}`);
    }
    const columns = [
      {
        title: '授权ID',
        dataIndex: 'partnerId',
        width: 200,
      },
      {
        title: '授权key',
        dataIndex: 'partnerKey',
        width: 250,
      },
      {
        title: '快递员名称',
        dataIndex: 'checkMan',
        width: 250,
      },
      {
        title: '当地网点名称',
        dataIndex: 'net',
        width: 350,
      },
      {
        title: '默认开关',
        dataIndex: 'status',
        width: 150,
        render: () => {
          return(
            <div>
              <Switch defaultChecked onChange={onChange} />
            </div>
          )
        },
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 300,
        render: () => {
          return(
            <div>
              <Divider type="vertical" />
              <a>编辑</a>
              <Divider type="vertical" />
              <Divider type="vertical" />
              <a>删除</a>
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
          renderSearchForm={this.renderSearchForm}
          data={data}
          columns={columns}
          scroll={{ x: 1000 }}
          renderLeftButton={this.renderLeftButton}
          renderRightButton={this.renderRightButton}
        />
      </Panel>
    );
  }
}
export default AuthorityList;
