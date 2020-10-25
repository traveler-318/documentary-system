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
    const baseImg='data:image/jpg;base64,'+ JSON.parse(sessionStorage.getItem('imgBase64'))[0] +''
    this.setState({
      imgBase64:sessionStorage.getItem('imgBase64'),
      baseImg:baseImg
    })

  }

  componentDidMount(){
    this.printHTML()
  }

  printHTML(){
    var beforePrint = function(){
    }
    var afterPrint = function(){
      window.close()
    }
    if (window.matchMedia) {
      var mediaQueryList = window.matchMedia('print');
      mediaQueryList.addListener(function(mql) {
        if (mql.matches) {
          // beforePrint();
        } else {
          // afterPrint();
        }
      });
    }
    window.onbeforeprint = beforePrint;
    window.onafterprint = afterPrint;

    window.print();    //Firefox可以调用   IE没有效果

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
      <div>
        <img src={baseImg}/>
      </div>
    );
  }
}

export default Background;
