import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Table,
  Button,
  Form,
  message,
} from 'antd';
import router from 'umi/router';
import { Resizable } from 'react-resizable';

import Panel from '../../components/Panel';
import Grid from '../../components/Sword/Grid';
import { setListData } from '../../utils/publicMethod';
import {
  orderMenuHead,
  orderMenuTemplate,
} from '../../services/newServices/order';
import {
  branchList
} from '../../services/branch';

import styles from './index.less';


@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class BranchOffice extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      // 反选数据
      selectedRowKeys:[],
      selectedRowKey:[],
      salesmanList:[],
      data:{},
      loading:false,
      params:{
        size:10,
        current:1,
        orderBy:false
      },
      tabKey:sessionStorage.executiveOrderTabKey ? sessionStorage.executiveOrderTabKey : '0',
      selectedRows:[],
      productList:[],
      // 导出
      exportVisible:false,
      // 转移客户
      TransferVisible:false,
      // 批量物流下单弹窗
      LogisticsConfigVisible:false,
      // 详情弹窗
      detailsVisible:false,
      // 日志弹窗
      journalVisible:false,
      journalList:{},
      // 短信弹窗
      SMSVisible:false,
      smsList:{},
      // 耗时检测弹窗
      timeConsumingVisible:false,
      timeConsumingList:{},
      // 语音弹窗
      VoiceVisible:false,
      voice:{},
      // 免押宝导入弹窗
      noDepositVisible:false,
      confirmLoading: false,
      // SN激活导入弹窗
      excelVisible:false,
      // 文本导入弹窗
      textVisible:false,
      // 订单导入弹窗
      OrderImportVisible:false,
      // 首次打印提示弹框
      LogisticsAlertVisible:false,
      tips:[],
      salesmangroup:[],
      countSice:0,
      plainOptions:[],
      checkedOptions:[],
      editPlainOptions: '', // 当前选择的字段列表，未保存
      editCheckedOptions: '', // 当前已选择字段，未保存
      isClickHandleSearch:'',// 设置字段后在未保存的情况下点击空白区域字段重置
      columns:[],
      updateConfirmTagVisible:false,
      voiceStatusVisible:false,
      confirmTagList:[],
      _listArr:[],
      organizationTree:[],

      branchList:[],//分公司数据
    };
  }

  // ============ 初始化数据 ===============
  componentWillMount() {

    this.getDataList();

  }


  getDataList = () => {
    const {params} = this.state;
    this.setState({
      loading:true,
    })
    branchList(params).then(res=>{
      console.log(res.data)
      this.setState({
        countSice:res.data.total,
        data:setListData(res.data),
        loading:false,
        selectedRowKeys:[]
      })
    })
  }


  // 修改数据
  handleEdit = (row) => {
    const { dispatch } = this.props;
    dispatch({
      type: `globalParameters/setDetailData`,
      payload: row,
    });
    router.push(`/order/executive/edit/${row.id}`);
  }

  renderRightButton = () => (
    <>
      <Button icon="ordered-list">排序</Button>
      <Button icon="unordered-list">列表</Button>
    </>
  );



  onSelectRow = (rows,keys) => {
    this.setState({
      selectedRows: rows,
      selectedRowKeys: keys,
    });
  };

  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

  render() {
    const code = 'allOrdersList';

    const {
      form,
    } = this.props;

    const {
      data,
      loading,
    } = this.state;

    const columns = [
      {
        title: '租户名称',
        dataIndex: 'tenantName',
        key: 'tenantName'
      },
      {
        title: '业务员个数',
        dataIndex: 'currentQuota',
        key: 'currentQuota',
      },
      {
        title: '数据授权',
        dataIndex: 'dataAuthorization',
        key: 'dataAuthorization',
      },
      {
        title: '账户余额',
        dataIndex: 'remainingMoney',
        key: 'remainingMoney',
      }
    ];


    console.log(data.list)
    return (
      <Panel>
        <div className={styles.ordersTabs}>
          <Grid
            code={code}
            form={form}
            loading={loading}
            data={data}
            columns={columns}
            scroll={{ x: 1000 }}
            counterElection={false}

            // multipleChoice={true}
          />
        </div>

      </Panel>
    );
  }
}
export default BranchOffice;
