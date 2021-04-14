import React, { PureComponent } from 'react';
import {
  Modal,
  Checkbox,
  Form,
  Input,
  Button,
  message,
  Radio,
  Table, Select, Icon, Tooltip,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import localforage from 'localforage';

const { Option } = Select;
const FormItem = Form.Item;
@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class Background extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:[],
      senderId:'',

    };
  }


  componentWillMount() {

    localforage.getItem('imgBase64', (err, value)=>{

      console.log(value)
      // 当离线仓库中的值被载入时，此处代码运行
      let baseImg = "";

      try {
        baseImg='data:image/png;base64,'+ JSON.parse(value)[0] +''
      } catch (e) {
        baseImg='data:image/png;base64,'+ value.slice(2,value.length - 2) +''
      }

      sessionStorage.removeItem("printingType")

      this.setState({
        imgBase64:value,
        baseImg:baseImg
      })
    });

    
  }
  printHTML(){
     var beforePrint = function(){

    }
     var afterPrint = function(){
        window.close()
     }


    window.document.body.innerHTML = window.document.getElementById('billDetails').innerHTML;  

    window.onbeforeprint = beforePrint;
    window.onafterprint = afterPrint;
    window.print(); 

  }


  render() {
    const {
      form: { getFieldDecorator },
      handleImgDetailsVisible,
      handleCancelImgDetails,
      ImgDetails
      } = this.props;


      const {baseImg}=this.state


    return (
      <div id={"billDetails"}>
        <img id={"img"} src={baseImg} onLoad={()=>this.printHTML()}/>
      </div>
    );
  }
}

export default Background;
