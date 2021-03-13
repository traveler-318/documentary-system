import React, { PureComponent } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Tag, 
  message,
  Table,
  Radio,
  Divider
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
import { copyToClipboard, setListData } from '../../../../utils/publicMethod';
import QRCode  from 'qrcode.react';
import copy from 'copy-to-clipboard';


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
      previewVisible:false
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
        size:100,
        current:1
    }).then(res=>{
        // this.setState({
        //   loading:false
        // })
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
      this.setState({
        codeUrl:res.data
      })
    })
  }

  handleChange = value => {

  };

  // ======关闭弹窗==========

  handleCancelGroupAdd = () =>{
    this.setState({
      groupAddVisible:false,
    })
  }

  // ======确认==========

    handleSubmit = (row) => {
        const serverAddress = getCookie("serverAddress");
        const { globalParameters } = this.props;
        const { codeUrl } = this.state;
        console.log(globalParameters)

        if(!globalParameters.detailData.name){
          message.error('当前销售二维码未绑定售后人员，请配置售后人员后再次尝试。');
          return false;
        }

        //const url = codeUrl+"&userName="+globalParameters.detailData.userName+"&deptId="+globalParameters.detailData.deptId+"&payAmount="+values.payAmount;
        const url = codeUrl+globalParameters.detailData.userAccount+"_"+row.id+"_"+row.price;
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

  handlePreview = (row) => {
    const serverAddress = getCookie("serverAddress");
    const { globalParameters } = this.props;
    const { codeUrl } = this.state;
    console.log(globalParameters)
    //const url = codeUrl+"&userName="+globalParameters.detailData.userName+"&deptId="+globalParameters.detailData.deptId+"&payAmount="+values.payAmount;
    const url = codeUrl+globalParameters.detailData.userAccount+"_"+row.id+"_"+row.price;
    console.log(url)
    // this.props.handleCancelAggregateCode()

    
    window.open(url)
    // this.setState({
    //   previewVisible:true,
    //   qrUrl:url,
    // })
  }

  handleCancelPreview = () => {
    this.setState({
      previewVisible:false
    })
  }

  // 复制链接
  handleCopy = (row) => {
    const { globalParameters } = this.props;
    const { codeUrl } = this.state;
    const url = codeUrl+globalParameters.detailData.userAccount+"_"+row.id+"_"+row.price;
    console.log(url)
    copy(url);
    if(url){
      message.success('复制成功！')
    }else{
      message.warning('复制失败！')
    }

  }

  changeRechargeAmount = (e) => {
    this.setState({
      RechargeAmount:e,
    })
  };

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
        dataSource,
        previewVisible
    } = this.state;

    const columns = [
        {
          title: '产品名称',
          dataIndex: 'productName',
          width:180
        },
        {
          title: '金额',
          dataIndex: 'price',
          width:100
        },
        {
            title: '推广码',
            dataIndex: 'id',
            render: (text,row) => {
              return(<>
                <a onClick={()=>this.handleSubmit(row)}>二维码</a>
                <Divider type="vertical" />
                <a onClick={()=>this.handlePreview(row)}>预览</a>
                <Divider type="vertical" />
                <a onClick={()=>this.handleCopy(row)}>复制链接</a>
              </>)
            },
        },
      ];
    // confirmTag
    return (
      <div>
        <Modal
          title="支付金额"
          visible={handleAggregateCodeVisible}
          width={530}
          onCancel={handleCancelAggregateCode}
          maskClosable={false}
          footer={null}
        >
          <Table
              columns={columns}
              dataSource={dataSource}
              bordered
              pagination={false}
          />
        </Modal>
        <Modal
          title="聚合码"
          visible={groupAddVisible}
          maskClosable={false}
          width={300}
          onCancel={this.handleCancelGroupAdd}
          footer={null}
        >
          <div>
            <QRCode
              value={qrUrl}
              size={250}
              fgColor="#000000"
            />
          </div>
        </Modal>
        {previewVisible?(
          <Modal
          title="预览"
          visible={previewVisible}
          maskClosable={false}
          width={423}
          onCancel={this.handleCancelPreview}
          footer={null}
        >
          <div>
            <iframe
              src={qrUrl}
              width={375}
              height={500}
              frameBorder="no"
              border="0"
              marginWidth="0"
              marginHeight="0"
              scrolling="no"
              allowTransparency="yes"
            />
          </div>
        </Modal>
        ):""}
        
      </div>
    );
  }
}

export default ProductList;
