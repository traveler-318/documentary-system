import React, { PureComponent } from 'react';
import {
  Modal,
  Checkbox,
  Form,
  Input,
  Button,
  message,
  Radio,
  Table,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { getCookie } from '../../../../utils/support';
import {
  getSalesmangroup,
  getSalesmangroupSubmit,
  getModifyGroup,
  getDeleteGroup,
} from '../../../../services/newServices/sales';

const FormItem = Form.Item;
const { TextArea } = Input;


@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class Logistics extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      radios:'',
      data:[],
      params:{
        size:10,
        current:1
      },
      name:'',
      selectDataArrL:{},
    };
  }


  componentWillMount() {
    const { globalParameters } = this.props;
    console.log("!!!!!!")
    this.setState({
      selectDataArrL:globalParameters.detailData,
    })
    this.getDataList()
  }

  getDataList = () => {
    const {params} = this.state;
    getSalesmangroup(params).then(res=>{
      this.setState({
        data:res.data.records
      })
    })
  }

  handleChange = (rows) => {
    console.log(rows)
    this.setState({
      radios:rows.id,
      name:rows.groupName
    })
  };

  // ======确认==========

  handleSubmit = e => {
    e.preventDefault();
    const {  radios,selectDataArrL } = this.state;
    Modal.confirm({
      title: '修改确认',
      content: '是否确认修改分组?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        let list=[];
        for(let i=0; i<selectDataArrL.length; i++){
          let params={
            id:selectDataArrL[i].id,
            groupId:radios
          }
          list.push(params)
        }
        getModifyGroup(list).then(res=>{
          console.log(res)
          message.success('修改成功');
          router.push('/customer/sales');
        })
      },
      onCancel() {},
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      ModifyGroupVisible,
      handleCancelModifyGroup
    } = this.props;

    const {data,radios} = this.state;


    const columns=[
      {
        title: '',
        dataIndex: 'id',
        width: 50,
        render: (res,rows) => {
          return(
            <Radio checked={res===radios?true:false} onChange={() =>this.handleChange(rows)} value={res}></Radio>
          )
        },
      },{
        title: '分组名称',
        dataIndex: 'groupName',
        width: 200,
      },{
        title: '操作',
        key: 'operation',
        width: 150,
      },
    ]

    // confirmTag
    return (
      <div>
        <Modal
          title="分组列表"
          visible={ModifyGroupVisible}
          width={550}
          onCancel={handleCancelModifyGroup}
          maskClosable={false}
          footer={[
            <Button key="back" onClick={handleCancelModifyGroup}>
              取消
            </Button>,
            <Button key="primary" onClick={this.handleSubmit}>
              确定
            </Button>,
          ]}
        >
          <Table rowKey={(record, index) => `${index}`} dataSource={data} columns={columns} />
        </Modal>
      </div>
    );
  }
}

export default Logistics;
