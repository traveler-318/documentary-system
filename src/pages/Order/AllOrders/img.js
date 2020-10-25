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
    const baseImg='data:image/png;base64,'+ JSON.parse(sessionStorage.getItem('imgBase64'))[0] +''

    this.setState({
      imgBase64:sessionStorage.getItem('imgBase64'),
      baseImg:baseImg
    })
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
