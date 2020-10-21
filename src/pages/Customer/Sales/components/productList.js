import React, { PureComponent } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Tag, 
  message,
  Table,
  Radio
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import { tenantMode } from '../../../../defaultSettings';
import { getCookie } from '../../../../utils/support';
import { getCodeUrl } from '../../../../services/newServices/sales';
import {
    getProductattributeList,
} from '../../../../services/newServices/product';
import { setListData } from '../../../../utils/publicMethod';
import QRCode  from 'qrcode.react';


const FormItem = Form.Item;
const { TextArea } = Input;


@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class ProductList extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      codeUrl:'',
      data:{},
      value:'',
      dataSource:[],
      id_payaccount:""
    };
  }

  componentWillMount() {
    this.getUrl();
    this.getProductList();
  }

  componentWillReceiveProps = () => {
    this.getProductList();
  }

  getProductList = () => {
    getProductattributeList({
        size:10,
        current:1
    }).then(res=>{
        // this.setState({
        //   loading:false
        // })
        console.log(res.data.records,"12323")
        this.setState({
            dataSource:res.data.records
        },()=>{
            console.log(this.state.dataSource,"12323")
        })

        // {
        //     list:res.data.records,
        //     pagination:{
        //       current: res.data.current,
        //       pageSize: res.data.size,
        //       total: res.data.total
        //     }
        //   }
      })
  }

  getUrl = () => {
    getCodeUrl().then(res=>{
      console.log(res)
      this.setState({
        codeUrl:res.data
      })
    })
  }

  handleChange = value => {
    console.log("1111")
  };

  // ======关闭弹窗==========

  handleCancelGroupAdd = () =>{
    this.setState({
      groupAddVisible:false,
    })
  }

  // ======确认==========

    handleSubmit = e => {
        const {id_payaccount} = this.state
        if(id_payaccount === ""){
            message.error("请选择产品");
            return false;
        }

        const serverAddress = getCookie("serverAddress");
        const { globalParameters } = this.props;
        const { codeUrl } = this.state;
        console.log(globalParameters)
        //const url = codeUrl+"&userName="+globalParameters.detailData.userName+"&deptId="+globalParameters.detailData.deptId+"&payAmount="+values.payAmount;
        const url = codeUrl+globalParameters.detailData.userAccount+"_"+id_payaccount;
        console.log(url)
        this.props.handleCancelAggregateCode()
        this.setState({
          groupAddVisible:true,
          qrUrl:url,
        })

    // const {  form } = this.props;
    // form.validateFieldsAndScroll((err, values) => {
    //   console.log(values);
    //   const res = /[^\d+(\d\d\d)*.\d+$]/g;
    //   var reg1=/^[1-9]\d*$/; // 验证正整数
    //   if(Number(values.payAmount) < 1  || !reg1.test(values.payAmount)){
    //     message.success('请输入不小于1的正整数');
    //     return false
    //   }
    //   if(Number(values.payAmount) <= 0  || res.test(values.payAmount) ){
    //     message.success('请输入不小于等于0的数字');
    //     return false
    //   }else{
    //     if(Number(values.payAmount) > 300){
    //       message.success('支付金额不能超过上限300');
    //       return false
    //     }
    //     const serverAddress = getCookie("serverAddress");
    //     const { globalParameters } = this.props;
    //     const { codeUrl } = this.state;
    //     console.log(globalParameters)
    //     //const url = codeUrl+"&userName="+globalParameters.detailData.userName+"&deptId="+globalParameters.detailData.deptId+"&payAmount="+values.payAmount;
    //     const url = codeUrl+globalParameters.detailData.userAccount+"_"+values.payAmount;

    //     console.log(url)
    //     this.props.handleCancelAggregateCode()
    //     this.setState({
    //       groupAddVisible:true,
    //       qrUrl:url,
    //     })
    //   }
    // });

  };

  changeRechargeAmount = (e) => {
    this.setState({
      RechargeAmount:e,
    })
  };

  radiogroupChange = (value) => {
      this.setState({
        id_payaccount:value.target.value
      })
    console.log(value.target.value,"value")
  }

  render() {
    const {
      form: { getFieldDecorator },
      handleCancelAggregateCode,
      handleAggregateCodeVisible
    } = this.props;

    const formItemLayout = {
      labelCol: {
        span: 7,
      },
      wrapperCol: {
        span: 17,
      },
    };

    const {
        groupAddVisible,
        qrUrl,
        value,
        dataSource
    } = this.state;

    const columns = [
        {
          title: '',
          dataIndex: 'id',
          render: id => {
            return (<Radio value={id}></Radio>)
          },
        },
        {
          title: '产品名称',
          dataIndex: 'productName',
          width:200
        },
        {
          title: '金额',
          dataIndex: 'price',
        },
        {
            title: '推广码',
            dataIndex: 'id',
            render: text => <a>二维码</a>,
        },
      ];
      console.log(dataSource,"12323")
    // confirmTag
    return (
      <div>
        <Modal
          title="支付金额"
          visible={handleAggregateCodeVisible}
          width={500}
          onCancel={handleCancelAggregateCode}
          footer={[
            <Button key="back" onClick={handleCancelAggregateCode}>
              取消
            </Button>,
            <Button type="primary" key="primary" onClick={()=>this.handleSubmit()}>
              确认
            </Button>
          ]}
        >
            <Radio.Group name="radiogroup" onChange={this.radiogroupChange}>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    bordered
                />
            </Radio.Group>
        </Modal>
        <Modal
          title="聚合码"
          visible={groupAddVisible}
          width={300}
          onCancel={this.handleCancelGroupAdd}
          footer={[

          ]}
        >
          <div>
            <QRCode
              value={qrUrl}
              size={250}
              fgColor="#000000"
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default ProductList;
