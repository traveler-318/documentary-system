import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, TreeSelect, Select, DatePicker, message, Cascader, Radio, Modal } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import Panel from '../../../../components/Panel';
import FormDetailsTitle from '../../../../components/FormDetailsTitle';
import styles from '../../../../layouts/Sword.less';
import { USER_INIT, USER_CHANGE_INIT, USER_SUBMIT } from '../../../../actions/user';
import { getUserInfo } from '../../../../services/user';
import func from '../../../../utils/Func';
import { tenantMode } from '../../../../defaultSettings';
import { CITY } from '../../../../utils/city';
import { getCookie } from '../../../../utils/support';



import {
  updateData,
  getRegion,
  logisticsSubscription,
  getDetails,
  productTreelist,
  logisticsPrintRequest
} from '../../../../services/newServices/order'
import {
  LOGISTICSCOMPANY,
  paymentCompany,
  productType,
  productID,
  amountOfMoney,
  GENDER,
  ORDERTYPE,
  ORDERSOURCE
} from '../data.js';

import {
  getList,
  // 打印模板
  getSurfacesingleList,
  // 寄件配置
  getDeliveryList,
  // 物品信息
  getGoodsList,
  // 附加信息
  getAdditionalList
} from '../../../../services/newServices/logistics'

const FormItem = Form.Item;
const { TextArea } = Input;

const tipsStyle = {
  lineHeight: '16px',
  paddingLeft: '12px',
  marginBottom: '20px',
  color:'red'
}

@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class LogisticsConfiguration extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      PRODUCTCLASSIFICATION:[
        {
          name:"测试销售",
          id:"1"
        }
      ],
      detail:{},
      productList:[],
      senderItem:{},
      printTemplateItem:{},
      deliveryItem:{},
      goodsItem:{},
      additionalItem:{},
      currentIndex:0,
      listID:[],
      handlePrintingClick:false,
      localPrintStatus:''
    };
  }


  componentWillMount() {
    const { globalParameters } = this.props;

    console.log(globalParameters.listParam,"data")

    this.setState({
      listID:globalParameters.listParam
    })
    // 获取详情数据
    this.getDetailsData(globalParameters.listParam[0].id);

    // 拼装对应产品
    // this.assemblingData();
    this.getTreeList();

    getUserInfo().then(resp => {
      if (resp.success) {
        const userInfo = resp.data;
        this.setState({
          localPrintStatus: userInfo.localPrintStatus
        });
      }
    });

  }

  getDetailsData = (id,type) => {
    getDetails({id}).then(res=>{
      let _data = res.data

      if(sessionStorage.logisticsConfigurationValues){
        let _value = JSON.parse(sessionStorage.logisticsConfigurationValues);

        if(!_data.productType && type === "switch"){
          _data.productName = _value.productType[2];
          _data.productType = `${_value.productType[0]}/${_value.productType[1]}`;
        }

        if(!_data.logisticsCompany){
          _data.logisticsCompany = _value.logisticsCompany;
        }

        if(!_data.smsConfirmation){
          _data.smsConfirmation = _value.smsConfirmation;
        }

        if(!_data.shipmentRemind){
          _data.shipmentRemind = _value.shipmentRemind;
        }
        // _data.productCoding = _data.productCoding || "";
      }
      console.log(_data,"_data_data_data")
      this.setState({
        detail:{..._data},
      },()=>{
        const { form } = this.props;
        form.setFieldsValue({ productCoding: _data.productCoding,logisticsNumber: _data.logisticsNumber});
      })
    })
  }

  // 切换数据
  handleSwitch = (type) => {
    let { currentIndex, listID } = this.state
    if(type === 0){
      this.setState({
        currentIndex:currentIndex - 1
      },()=>{

      })
      this.getDetailsData(listID[currentIndex - 1].id,"switch");
    }else{
      this.getDetailsData(listID[currentIndex + 1].id,"switch");
      this.setState({
        currentIndex:currentIndex + 1
      },()=>{

      })
    }
  }

  // 获取打印的默认数据
  getDefaultData = (callBack) => {
    const promise1 = new Promise((resolve, reject) => {
      getList({current:1,size:10}).then(res=>{
        let _datas = res.data.records
        resolve(_datas,"senderItem")
      })
    })

    const promise2 = new Promise((resolve, reject) => {
      getSurfacesingleList({current:1,size:10}).then(res=>{
        let _datas = res.data.records
        resolve(_datas,"printTemplateItem")
      })
    })

    const promise3 = new Promise((resolve, reject) => {
      getDeliveryList({current:1,size:10}).then(res=>{
      let _datas = res.data.records
        resolve(_datas)
      })
    })

    const promise4 = new Promise((resolve, reject) => {
      getGoodsList({current:1,size:10}).then(res=>{
        let _datas = res.data.records
        resolve(_datas)
      })
    })

    const promise5 = new Promise((resolve, reject) => {
      getAdditionalList({current:1,size:10}).then(res=>{
        let _datas = res.data.records
        resolve(_datas)
      })
    })
    Promise.all([promise1, promise2, promise3, promise4, promise5]).then((values,type) => {
      console.log(values,type,"values");
      let _dataList = [],authorizationItem={},printTemplateItem={},senderItem={},goodsItem={},additionalItem={}

      values.map((item,index)=>{
        // if(item.length === 0){
        //   if(index === 0){
        //     // 授权配置
        //     return message.error("请设置默认基础授权配置");
        //   }else if(index === 1){
        //     // 打印模板
        //     return message.error("请设置默认打印模板");
        //   }else if(index === 2){
        //     // 寄件配置
        //     return message.error("请设置默认寄件人信息");
        //   }else if(index === 3){
        //     // 物品
        //     return message.error("请设置默认物品信息");
        //   }else if(index === 4){
        //     // 附加信息
        //     return message.error("请设置默认附加信息");
        //   }
        // }
        for(let i=0; i<item.length; i++){
          if(item[i].status === 1){
            if(index === 0){
              authorizationItem = item[i];
            }else if(index === 1){
              printTemplateItem= item[i] //faceSheetItem
            }else if(index === 2){
              senderItem = item[i]
            }else if(index === 3){
              goodsItem = item[i]
            }else if(index === 4){
              additionalItem = item[i]
            }
          }
        }

      });
      console.log(senderItem, printTemplateItem, authorizationItem, goodsItem, additionalItem)
      if(JSON.stringify(authorizationItem) === "{}"){
        // 授权配置
        return message.error("请设置默认基础授权配置");
      }else if(JSON.stringify(printTemplateItem) === "{}"){
        // 打印模板
        return message.error("请设置默认打印模板");
      }else if(JSON.stringify(senderItem) === "{}"){
        // 寄件配置
        return message.error("请设置默认寄件人信息");
      }else if(JSON.stringify(goodsItem) === "{}"){
        // 物品
        return message.error("请设置默认物品信息");
      }else if(JSON.stringify(additionalItem) === "{}"){
        // 附加信息
        return message.error("请设置默认附加信息");
      }

      if(authorizationItem.online === '0'){
        message.success('当前选择的打印模板不在线!请检查机器网络或者联系管理员排查!');
        return false;
      }

      callBack({senderItem, printTemplateItem, authorizationItem, goodsItem, additionalItem});
    });
  }

  getTreeList = () => {
    productTreelist().then(res=>{
      console.log(res.data,"productTreelist")
      this.setState({productList:res.data})
    })
  }

  assemblingData = () => {
    // let TheThirdLevel = productID.map(item=>{
    //   return {
    //     ...item,
    //     key:`${item.key}_3`,
    //     children:amountOfMoney
    //   }
    // })
    let TheSecondLevel = productType.map(item=>{
      return {
        ...item,
        key:`${item.key}_2`,
        children:productID
      }
    })
    let TheFirstLevel = paymentCompany.map(item=>{
      return {
        ...item,
        key:`${item.key}_1`,
        children:TheSecondLevel
      }
    })
    this.setState({productList:TheFirstLevel})
    console.log(TheFirstLevel,"TheFirstLevel")
  }

  componentWillReceiveProps(pre,nex){
    console.log(pre,nex)
  }

  saveData = (values,callBack) => {
    console.log(values,"123")
    const { detail } = this.state;
    console.log(detail,"detail")
    sessionStorage.logisticsConfigurationValues = JSON.stringify(values);
    values.id = detail.id;
    values.deptId = getCookie("dept_id");
    values.confirmTag = detail.confirmTag;
    values.outOrderNo = detail.outOrderNo;
    values.tenantId = detail.tenantId;
    values.userPhone = detail.userPhone;
    values.payAmount = values.productType[2].split("-")[1];
    values.productName = values.productType[2];
    values.productType = `${values.productType[0]}/${values.productType[1]}`;
    // values.productName = values.productName.join("/");
    logisticsSubscription(values).then(res=>{
      if(res.code === 200){
        if(callBack){
          callBack()
        }else{
          this.saveSuccess(res.msg);
        }
      }else{
        message.error(res.msg);
      }
    })
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { detail } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.saveData(values)
      }
    });
  };
  // 保存并打印
  handlePrinting = (e) => {
    const { form } = this.props;
    const { detail,localPrintStatus } = this.state;
    form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log("先保存数据")
          // 先保存数据
          this.saveData(values,()=>{
            // 获取物流配置
            this.getDefaultData((res)=>{
              console.log(res,"获取物流配置成功");
              const { listID } = this.state;
              res.senderItem.printAddr = res.senderItem.administrativeAreas +""+ res.senderItem.printAddr;
              // senderItem, printTemplateItem, authorizationItem, goodsItem, additionalItem
              let param = {
                recMans: [],
                ...res.goodsItem,
                ...res.printTemplateItem,
                ...res.additionalItem,
                sendMan:{
                  ...res.senderItem,
                },
                subscribe:values.shipmentRemind, //物流订阅
                shipmentRemind:values.smsConfirmation, //发货提醒
                ...res.authorizationItem
              };
              for(let i=0; i<listID.length; i++){
                param.recMans.push(
                  {
                    "mobile": listID[i].userPhone,
                    "name": listID[i].userName,
                    "printAddr": listID[i].userAddress,
                    "out_order_no": listID[i].outOrderNo,
                    "id":listID[i].id,
                    'salesman':listID[i].salesman,
                  }
                )
              }
              console.log(localPrintStatus)
              if(localPrintStatus === 1){
                param.localPrintStatus=1;
                const { dispatch } = this.props;
                console.log(param)
                const data={"data":{"taskId":"5431A08512FBA31480C99C5D2D2F0156","eOrder":"[{\"pkgName\":\"重庆\",\"sameCity\":\"1\",\"kuaidinum\":\"73140216290416\",\"orgCode\":\"51394\",\"waterMark\":\"04-01\",\"bulkpen\":\"680- 04-01 001\",\"sameProv\":\"1\",\"orgName\":\"昆山高新区二\"}]","kuaidinum":"73140216290416","kuaidicom":"zhongtong","imgBase64":"[\"/9j/4AAQSkZJRgABAgAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0a\\nHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIy\\nMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAQNAmADASIA\\nAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQA\\nAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3\\nODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWm\\np6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEA\\nAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSEx\\nBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElK\\nU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3\\nuLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iii\\ngAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKA\\nCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK\\nKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAOf8AG3ie38I+EtQ1eaeCKaOJ\\nharNkiWcqfLTA5OSOcdgTkAEj5En+IPjK5uJZ38VayHkcuwjvZEUEnPCqQFHsAAO1fZ+paTpus26\\n2+qafaX0CuHWO6hWVQ2CMgMCM4JGfc1wfjofDvwHoZv7/wALaHLcSZW1tEsIQ9w47D5eFGRlu2e5\\n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\\nTsCLmQKx53kDByasfD/wtq/he3vJ7f4ex6ZrUWjvHHfyawLhby4AUhDEHwgdl3ZyAMYyM17JRQB4\\nPYfDnXdc8faLrl74Tg8NSWt3/aGp3a6iLoXswdXwkYY+Xlg3GcAMeSVANjxP4G13x3q00eqeBLHT\\nL+aXyj4ih1UOiQpJlW8gYMjGMBAWAJyM7AML7hRQBT0mzm07RrGyuLuS8nt7eOKS5kzumZVALnJJ\\nySM9T16mrlFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFF\\nABRRRQAUUUUAFFFFABRRRQAUUUUAFcP4d+KeieKvFt14d0m1vpprbzTJdAReQURtu9WEhLKSVAwD\\nncDgDJGf8ZvHT+DfCQt7I41PVN8EDBmUxIF+eVSv8S7lA5HLA87SK+eNE8O+Db7R4LnVvHf9l3z7\\nvMs/7Imn8vDED51ODkAHjpnHagD7Por5Y8N/Cnwr4u1GSw0P4h/a7qOIzMn9iyx4QEAnLuB1YfnW\\nx8DtM/sT4yeItJ87zvsNpc23m7du/ZcRruxk4zjOMmgD1e/+L/gTTNRubC813y7q1leGZPsk52up\\nIYZCYOCD0rH1P4/eBrDyvs1xfalvzu+yWpXy8YxnzSnXPbPQ5xxnP+OnjbxF4O/sH+wNQ+x/avtH\\nnfuY5N23y9v31OMbm6etcR4k+IPxD0HTo7r+2PEcW+UR51Pwxb2cfIJ4fL5bj7uOmTnigD1f/hdv\\nw8/6GH/ySuP/AI3XQeGPG3h3xj9q/sDUPtn2XZ537mSPbuzt++ozna3T0rwjxJ8QfiHoOnR3X9se\\nI4t8ojzqfhi3s4+QTw+Xy3H3cdMnPFe/+E7641Pwbod/eSeZdXWn280z7QNztGpY4HAySelAGxRR\\nRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFF\\nABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUA\\nFFFFABRRRQAUUUUAFFFFABRRRQBwfxX8JaR4i8IXmo6jDI9xpFld3FqVkKgN5J4YDqNyo31QdiQf\\nDPhx408B+HPD1xZ+KPDP9qXz3bSpN9ggn2xlEAXdIwI5DHHTn3r6X8WWNxqfg3XLCzj8y6utPuIY\\nU3AbnaNgoyeBkkda+bPAnxQ1L4V2V94f1Hw3JK7XAuPLnka2liZkUEMGU5BVUI4HfrkYAJPhl4z8\\nNaB8U9e1u8l/szSLuK4Fon2djsDzo6JsjDbcKD04GMZ6V0nwKnh174l+LPEbSx209wkjpYlgzFZp\\nt7EHgkIVVScfxjp0PN+JPit4V8XajHf658PPtd1HEIVf+2pY8ICSBhEA6sfzqPw8i/EPxr4a07Qv\\nC0eneHdKuBNc2zFrmIFm3yNLKUyTIsSoA+R8gAIHQA9D+J2i67qG6/8AEq+BhpFlLMLF765vYpAj\\nchSI2G+QrGPlXOSDgV4ZqsFxdeGo9Wj8I2ml6e1wsaX8BucSsQ/yL5srBh8jZKjgqASM4Ponifw1\\n4pv/ABH4l8TxeD4LWODzXnvNVuDdojQIxdoElC743UALujdRxtKAfLy8Gr+FvEGh6jqvjnWdcvfE\\ns8rwWywASC3jOHWQK21dofeuwMBhuFHDAAual4cuvD9wqeJPBHh/RIHQFLu6k1GWBmJOEDwTSDeQ\\nGODjhSfTPv8A8OLnVZtGeC8vPDF1p9mkVrZHQLiSZUCLgo7OTyF8vHOeTntXhEPi/wAceFrrQtN8\\nYXfiDS9DtkRoEsreKGVlSIeWoZlAkA3IHRye4YbhXtfw61fwDql5qFx4Mtfs11cxQy30MdrJEke0\\nEIp48pW5bhD82GPOCaAPQKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACi\\niigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKK\\nKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAr39jb6np1zYXkfm\\nWt1E8MybiNyMCGGRyMgnpWPongbwt4c8htJ0Gxt5oN3l3HlB5l3Zz+9bLngkcnpx0roKKAK99YWe\\np2clnf2kF3ayY3wzxiRGwQRlTwcEA/hWfoPhXQvDH2z+xdMgsvtkvnT+UD8zdhz0UZOFGFGTgDJr\\nYooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiivL/GnxH1jw58U/D3\\nheztrF7HUvs3nSTI5kXzJ2jbaQwA4AxkHmgD1CiuDsPGupXXhXxzqjwWgn0G9v7e1VUba6wIGQv8\\n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\\nDjhwd0ZyCzHO7OBnJK+x/FnxrqXgPwra6ppcFpNPLepbst0jMoUo7ZG1lOcoO/rXeUUAfGHjr4j6\\nx8QPsH9rW1jD9h8zy/siOud+3OdzN/cHTHerngr4s694D0abS9LtNNmgluGuGa6jdmDFVXA2uoxh\\nB29a+w6KAOX+HfiS88XeBNN1y/jgjurrzd6QKQg2yugwCSeijvXUUUUAFFFFABRRRQAUUUUAFFFF\\nABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFef/ABT/AOZK/wCx\\nrsf/AGevQK8/+Kf/ADJX/Y12P/s9AHoFFFFAHn/ws/5nX/sa77/2SvQK8/8AhZ/zOv8A2Nd9/wCy\\nV6BQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFF\\nFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUU\\nUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABXn/xT/5kr/sa7H/2evQK8/8Ain/zJX/Y12P/\\nALPQB6BRRRQB5/8ACz/mdf8Asa77/wBkr0CvP/hZ/wAzr/2Nd9/7JXoFABRRRQAUUUUAFFFFABRR\\nRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFF\\nABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUA\\nFFFFABRRRQAUUUUAFef/ABT/AOZK/wCxrsf/AGevQK8/+Kf/ADJX/Y12P/s9AHoFFFFAHi/g/Q/F\\nWp6j4xm0Pxj/AGLar4lvUa3/ALMiudz5Ul9znIyCBj2966j/AIRL4h/9FP8A/KBb/wCNHws/5nX/\\nALGu+/8AZK9AoA8//wCES+If/RT/APygW/8AjR/wiXxD/wCin/8AlAt/8a9AooA8/wD+ES+If/RT\\n/wDygW/+NH/CJfEP/op//lAt/wDGvQKKAPP/APhEviH/ANFP/wDKBb/40f8ACJfEP/op/wD5QLf/\\nABr0CigDz/8A4RL4h/8ART//ACgW/wDjR/wiXxD/AOin/wDlAt/8a9AooA8//wCES+If/RT/APyg\\nW/8AjR/wiXxD/wCin/8AlAt/8a9AooA8/wD+ES+If/RT/wDygW/+NH/CJfEP/op//lAt/wDGvQKK\\nAPP/APhEviH/ANFP/wDKBb/40f8ACJfEP/op/wD5QLf/ABr0CigDz/8A4RL4h/8ART//ACgW/wDj\\nR/wiXxD/AOin/wDlAt/8a9AooA8//wCES+If/RT/APygW/8AjR/wiXxD/wCin/8AlAt/8a9AooA8\\n/wD+ES+If/RT/wDygW/+NH/CJfEP/op//lAt/wDGvQKKAPP/APhEviH/ANFP/wDKBb/40f8ACJfE\\nP/op/wD5QLf/ABr0CigDz/8A4RL4h/8ART//ACgW/wDjR/wiXxD/AOin/wDlAt/8a9AooA8//wCE\\nS+If/RT/APygW/8AjR/wiXxD/wCin/8AlAt/8a9AooA8/wD+ES+If/RT/wDygW/+NH/CJfEP/op/\\n/lAt/wDGvQKKAPP/APhEviH/ANFP/wDKBb/40f8ACJfEP/op/wD5QLf/ABr0CigDz/8A4RL4h/8A\\nRT//ACgW/wDjR/wiXxD/AOin/wDlAt/8a9AooA8//wCES+If/RT/APygW/8AjR/wiXxD/wCin/8A\\nlAt/8a9AooA8/wD+ES+If/RT/wDygW/+NH/CJfEP/op//lAt/wDGvQKKAPP/APhEviH/ANFP/wDK\\nBb/40f8ACJfEP/op/wD5QLf/ABr0CigDz/8A4RL4h/8ART//ACgW/wDjR/wiXxD/AOin/wDlAt/8\\na9AooA8//wCES+If/RT/APygW/8AjR/wiXxD/wCin/8AlAt/8a9AooA8/wD+ES+If/RT/wDygW/+\\nNH/CJfEP/op//lAt/wDGvQKKAPP/APhEviH/ANFP/wDKBb/40f8ACJfEP/op/wD5QLf/ABr0CigD\\nz/8A4RL4h/8ART//ACgW/wDjR/wiXxD/AOin/wDlAt/8a9AooA8//wCES+If/RT/APygW/8AjR/w\\niXxD/wCin/8AlAt/8a9AooA8/wD+ES+If/RT/wDygW/+NH/CJfEP/op//lAt/wDGvQKKAPP/APhE\\nviH/ANFP/wDKBb/40f8ACJfEP/op/wD5QLf/ABr0CigDz/8A4RL4h/8ART//ACgW/wDjR/wiXxD/\\nAOin/wDlAt/8a9AooA8//wCES+If/RT/APygW/8AjR/wiXxD/wCin/8AlAt/8a9AooA8/wD+ES+I\\n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\\nFnqdnJZ39pBd2smN8M8YkRsEEZU8HBAP4UAeCaBe6V8R/Eq+LfH2vaNa6dbOV0zQZr+MBQD96RSQ\\ncZAzkAuQMgIFU+76bq2m6zbtcaXqFpfQK5RpLWZZVDYBwSpIzgg49xWX/wAIJ4P/AOhU0P8A8F0P\\n/wATWppuk6bo1u1vpen2ljAzl2jtYViUtgDJCgDOABn2FAHJ+KfBGs634tsvEGk+Kf7KmtLQ28Ub\\n6el0ELMS7rvbCsw2qSBnC4zg4qv/AMIl8Q/+in/+UC3/AMa9Arz/AP4VZ/1Pvjn/AMHH/wBhQBH4\\nafxhp3xLn0LW/EMmt6euji884adHbrHK02xVJQHnajkZPPPHGa9Ern/DHg/TvC32qW2nvry+vNn2\\nu+v7lppp9mdm4nj5Q20YA4AzmugoAKKKKACiiigAooooAKKKKACiiigArz/4p/8AMlf9jXY/+z16\\nBXn/AMU/+ZK/7Gux/wDZ6APQKKKKAPP/AIWf8zr/ANjXff8AslegV5/8LP8Amdf+xrvv/ZK9AoAK\\nKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoo\\nooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiii\\ngAooooAKKKKACiiigAooooAKKKKACiiigArz/wCKf/Mlf9jXY/8As9egV5/8U/8AmSv+xrsf/Z6A\\nPQKKKKAPP/hZ/wAzr/2Nd9/7JXoFef8Aws/5nX/sa77/ANkr0CgAooooAKKKKACiiigAooooAKKK\\nKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoooo\\nAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigA\\nooooAKKKKACvP/in/wAyV/2Ndj/7PXoFef8AxT/5kr/sa7H/ANnoA9AooooA8/8AhZ/zOv8A2Nd9\\n/wCyV6BXn/ws/wCZ1/7Gu+/9kr0CgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiii\\ngAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKA\\nCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACvP/AIp/8yV/\\n2Ndj/wCz16BXn/xT/wCZK/7Gux/9noA9AooooA8/+Fn/ADOv/Y133/slegV5/wDCz/mdf+xrvv8A\\n2SvQKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigA\\nooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACi\\niigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK8/+Kf/ADJX/Y12P/s9egV5/wDFP/mSv+xr\\nsf8A2egD0CiiigDxfwf4L/4SPUfGN5/wk3iPS9niW9i8nTL/AMiNsFTuK7TlucZ9APSuo/4VZ/1P\\nvjn/AMHH/wBhR8LP+Z1/7Gu+/wDZK9AoA8//AOFWf9T745/8HH/2FH/CrP8AqffHP/g4/wDsK9Ar\\nk9S8d22k+PNN8L32nXduNRRvs+oSlFgkcAEIp3ZJJypBwQ2wAEODQBl/8Ks/6n3xz/4OP/sKP+FW\\nf9T745/8HH/2FegUUAef/wDCrP8AqffHP/g4/wDsKP8AhVn/AFPvjn/wcf8A2FegUUAef/8ACrP+\\np98c/wDg4/8AsKP+FWf9T745/wDBx/8AYV6BRQB5/wD8Ks/6n3xz/wCDj/7Cj/hVn/U++Of/AAcf\\n/YV6BRQB5/8A8Ks/6n3xz/4OP/sKP+FWf9T745/8HH/2FegUUAef/wDCrP8AqffHP/g4/wDsKP8A\\nhVn/AFPvjn/wcf8A2FegUUAef/8ACrP+p98c/wDg4/8AsKP+FWf9T745/wDBx/8AYV6BRQB5/wD8\\nKs/6n3xz/wCDj/7Cj/hVn/U++Of/AAcf/YV6BRQB5/8A8Ks/6n3xz/4OP/sKP+FWf9T745/8HH/2\\nFegUUAef/wDCrP8AqffHP/g4/wDsKP8AhVn/AFPvjn/wcf8A2FegUUAeL/DvwfeeLvAmm65f+OPG\\nUd1debvSDViEG2V0GAVJ6KO9dR/wqz/qffHP/g4/+wo+CX/JIdC/7eP/AEokr0CgDz//AIVZ/wBT\\n745/8HH/ANhR/wAKs/6n3xz/AODj/wCwr0CigDz/AP4VZ/1Pvjn/AMHH/wBhR/wqz/qffHP/AIOP\\n/sK9AooA8/8A+FWf9T745/8ABx/9hR/wqz/qffHP/g4/+wr0CigDz/8A4VZ/1Pvjn/wcf/YUf8Ks\\n/wCp98c/+Dj/AOwr0CigDz//AIVZ/wBT745/8HH/ANhR/wAKs/6n3xz/AODj/wCwr0CigDz/AP4V\\nZ/1Pvjn/AMHH/wBhR/wqz/qffHP/AIOP/sK9AooA8/8A+FWf9T745/8ABx/9hR/wqz/qffHP/g4/\\n+wr0CigDz/8A4VZ/1Pvjn/wcf/YUf8Ks/wCp98c/+Dj/AOwr0CigDz//AIVZ/wBT745/8HH/ANhR\\n/wAKs/6n3xz/AODj/wCwr0CigDz/AP4VZ/1Pvjn/AMHH/wBhR/wqz/qffHP/AIOP/sK9AooA8/8A\\n+FWf9T745/8ABx/9hR/wqz/qffHP/g4/+wr0CigDyvxL8PZtG8K6vqlv468atPZWU1xGsmrkqWRC\\nwBwoOMj1FHhr4ezaz4V0jVLjx141We9sobiRY9XIUM6BiBlScZPqa7Tx3/yTzxL/ANgq6/8ARTUe\\nBP8Aknnhr/sFWv8A6KWgDn/+FWf9T745/wDBx/8AYUf8Ks/6n3xz/wCDj/7CrF/8SfsOo3Nn/wAI\\nV4yuPIleLzrfSt8cm0kbkbdypxkHuKr/APC0/wDqQvHP/gn/APs6AD/hVn/U++Of/Bx/9hR/wqz/\\nAKn3xz/4OP8A7Cq998YrPTLOS8v/AAb4ytLWPG+afTBGi5IAyxfAySB+Ndh4k1//AIRzTo7z+yNV\\n1TfKIvJ0y28+RcgncVyMLxjPqR60Acv/AMKs/wCp98c/+Dj/AOwo/wCFWf8AU++Of/Bx/wDYVY0n\\n4m2ep+I9P0Obw54j0u6v/M+zvqViIEby0LtyXycAdgeo9asfEPxfceFNHtI9Kigudd1K7jtNPtZi\\nNsjswyWG5TtA4yDwzJng0AZ//CrP+p98c/8Ag4/+wo/4VZ/1Pvjn/wAHH/2FdB4L8Sf8JT4XtdRl\\nj8i+XMF9bFdrQXCHbIhXJK8jIDc7SuetV/GfiW/8L/2Nc2+m/bLC41CO1vnQSPJCknyqyoinPzEf\\nU4UAlwVAMf8A4VZ/1Pvjn/wcf/YUf8Ks/wCp98c/+Dj/AOwroPF3i6z8HadaXl5Z3159qu0s4YbG\\nISSNIwYqApYZztI45yRxXP8A/C0/+pC8c/8Agn/+zoAP+FWf9T745/8ABx/9hR/wqz/qffHP/g4/\\n+wroPCPi6z8Y6dd3lnZ31n9lu3s5ob6IRyLIoUsCoY4xuA55yDxXQUAef/8ACrP+p98c/wDg4/8A\\nsKP+FWf9T745/wDBx/8AYV6BRQB5/wD8Ks/6n3xz/wCDj/7Cj/hVn/U++Of/AAcf/YV6BRQB5/8A\\n8Ks/6n3xz/4OP/sKP+FWf9T745/8HH/2FegUUAef/wDCrP8AqffHP/g4/wDsKP8AhVn/AFPvjn/w\\ncf8A2FegUUAef/8ACrP+p98c/wDg4/8AsKP+FWf9T745/wDBx/8AYV6BRQB5/wD8Ks/6n3xz/wCD\\nj/7CuP8AH/gD+y/+EX/4q3xXefavEFpa/wCl6l5nk7t37yP5RtkGOG7ZNe4V5/8AFP8A5kr/ALGu\\nx/8AZ6AO4sLX7Dp1tZ/aJ7jyIki864ffJJtAG527scZJ7mrFFFAHn/ws/wCZ1/7Gu+/9krz/AMT+\\nAbfxH8Y/FV/4ki1Wy8PW2nrdjUIIiqMY4oQwDFGDYG/gc/L7V6B8LP8Amdf+xrvv/ZK0PiN40sPB\\nXh77Tqekz6ja3e+2EaiMxs5QkRybjnawDchW4ByOgIB4h/wj3wM/6HPXP+/Lf/I9Y9xp/wAJY/FF\\npYQarrk2kSxF59U84L5L4bCeUbbc3ReR/f8AY12hvNf1q4SDQfgbo1k6IzynVNOUKwyANrMsQB5P\\nGST7YNT6d8AtctEuNSbX9GGrTJITbNpEU9qGLZAXeMIDgcrGNoJABHUA5z/hHvgZ/wBDnrn/AH5b\\n/wCR6ktfBegL4q8Hax4Al1nWtPGsKl/cSW7MtuY3hYZxGu0bXJyeOPY10d1oni7wv5D6j8MfBviG\\nxhiXz5dKsEE0jH5RwVzuzhjtiK4JxjnHefC/xLpuv6Xfw6f4Uk8OvZ3BS7tlt1ji87kEAgLucKq7\\ngVBGVHPBoA7yiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAPP/gl/wAkh0L/ALeP\\n/SiSvQK8/wDgl/ySHQv+3j/0okr0CgAooooAKKKKAK9/fW+madc395J5draxPNM+0naigljgcnAB\\n6Vw//C7fh5/0MP8A5JXH/wAbroPHf/JPPEv/AGCrr/0U1fHHhbw3eeLvEdpodhJBHdXW/Y87EINq\\nM5yQCeintQB9T/8AC7fh5/0MP/klcf8Axuj/AIXb8PP+hh/8krj/AON15B/wzj4w/wCglof/AH/m\\n/wDjVH/DOPjD/oJaH/3/AJv/AI1QB6//AMLt+Hn/AEMP/klcf/G6P+F2/Dz/AKGH/wAkrj/43XkH\\n/DOPjD/oJaH/AN/5v/jVH/DOPjD/AKCWh/8Af+b/AONUAe36J8UvBviPWINJ0nWftF9Pu8uL7LMm\\n7apY8sgA4BPJrsK+QPgl/wAle0L/ALeP/SeSvpvxr4103wHo0OqapBdzQS3C26raorMGKs2TuZRj\\nCHv6UASeJ/G3h3wd9l/t/UPsf2rf5P7mSTdtxu+4pxjcvX1qx4b8U6N4u06S/wBDvPtdrHKYWfyn\\njw4AJGHAPRh+dfNHxg+I+j/ED+xv7Jtr6H7D5/mfa0Rc7/Lxjazf3D1x2r0/9nH/AJJ5qH/YVk/9\\nFRUAdRf/ABf8CaZqNzYXmu+XdWsrwzJ9knO11JDDITBwQelFh8X/AAJqeo21hZ675l1dSpDCn2Sc\\nbnYgKMlMDJI618seO/8AkofiX/sK3X/o1q9U8NfALxVo3irSNUuNQ0ZoLK9huJFjmlLFUcMQMxgZ\\nwPUUAe963reneHNHn1bVrj7PYwbfMl2M+3cwUcKCTyQOBXH/APC7fh5/0MP/AJJXH/xuj42/8kh1\\n3/t3/wDSiOvnDwL8ONY+IH2/+ybmxh+w+X5n2t3XO/djG1W/uHrjtQB9H/8AC7fh5/0MP/klcf8A\\nxuj/AIXb8PP+hh/8krj/AON15B/wzj4w/wCglof/AH/m/wDjVH/DOPjD/oJaH/3/AJv/AI1QB6//\\nAMLt+Hn/AEMP/klcf/G6P+F2/Dz/AKGH/wAkrj/43XkH/DOPjD/oJaH/AN/5v/jVY/in4KeJPCPh\\ny71y/vdKktbXZvSCWQudzqgwDGB1Yd6APb9X+InhXxd4N8U2Gh6r9ruo9Eu5mT7PLHhBGQTl1A6s\\nPzrqPAn/ACTzw1/2CrX/ANFLXzB8LP8Amdf+xUvv/ZK+n/An/JPPDX/YKtf/AEUtAHHy/FLTvDnx\\nH8VaT4n1n7PYwfZP7Oi+ys+3dDul5jQk8lT8x+laH/C7fh5/0MP/AJJXH/xujwl/yV74i/8AcM/9\\nJ2r0CgDw/wCKXxS8G+I/hxq2k6TrP2i+n8ny4vssybtsyMeWQAcAnk13HxWv7y38IQ6dpl3PZ6nq\\n+oW2n2dzDIY/KkeQNlmX5lXajAkZPPSuo1vRNO8R6PPpOrW/2ixn2+ZFvZN21gw5UgjkA8GuD8X+\\nKvh94g0v+zvEMN3eGHU57WCwiim82a7g+Qonl4BJEq7csAd4zgg4AI/FGoXEHxfjmXTp9VbRvDU2\\noWNlAQrmd5vKcg98oMY+bp8qlsA834b8W+EtI8S3viDx34hjm8Y73t3gW0naLS1UlTBFhCMjkFgT\\nnJwTlmePQtI8O2PxO8EXmgeGNV0Dz5dRimh1NZEkk2WylWCu7fL+8YZGMnPpWpca34rm8B+Imm1K\\nSbxF4R1gzfuwLU3dtGQwaeNSMxPGZCAMBgi4LEHIBnz+L/D1v4xl174bXceo6vfof7R0M29xGt8q\\nfvGlj+UKJwqv1znc2AWJD6nxA0T+xdDudePinxzBqWoylLHS4NQ3AXUuWSEIgICg5GAx4XAJOM9B\\nPr1x4p+IHh6z8O6pOmlWlp/aupSQqAkqSqBbxNlSQzAsxRgvyncPmUEcf8QvC+sT+LdB1zxBqvmR\\ny+JbWw06zspHjS3tWYksW4YTNtXJU8Y4JG0KAaGuabqmkeC/htZa3eT3mpr4lsXuZZ5N7h2MjFC2\\n5t23dtznnb+FdR9vvP8Ahev9nfa5/sP/AAjXn/ZvMPl+Z9p279vTdjjPXFc/ceAPEun6doGkxX/9\\nr6bpfiW0u7QybVmtrJA24SMSA+0nACjOBxwQqc/qnje8/wCF+Je6PawSWMEtr4Zu55iT80szOxVc\\nqQwKSKD8y/Jn+IUAdx8LP+Z1/wCxrvv/AGSvQK4vwFpd3oVx4lt9SSOCfUddvNQtIzKjNLbkxgSA\\nAk4yQDnkZGcZFdpQAUUUUAFFFFABRRRQAUUUUAFFFFABXn/xT/5kr/sa7H/2evQK8/8Ain/zJX/Y\\n12P/ALPQB6BRRRQB5/8ACz/mdf8Asa77/wBkrj9b+Bnw/wDDmjz6tq2ta5b2MG3zJfMjfbuYKOFh\\nJPJA4Fdh8LP+Z1/7Gu+/9ko+Nv8AySHXf+3f/wBKI6APIP8AhHvgZ/0Oeuf9+W/+R6P+Ee+Bn/Q5\\n65/35b/5HrQ0L4k/Cyx8PaZZ6j4K+0X0FpFFcTf2Vav5kioAzbi2TkgnJ5Nc/wDEfxp4D8R+Hrez\\n8L+Gf7Lvku1leb7BBBujCOCu6NiTyVOOnHtQB3fiX4BeFdG8K6vqlvqGstPZWU1xGsk0RUsiFgDi\\nMHGR6isz4d/BTw34u8Cabrl/e6rHdXXm70gljCDbK6DAMZPRR3r2fx3/AMk88S/9gq6/9FNXP/BL\\n/kkOhf8Abx/6USUAdppOmw6No1jpdu0jQWVvHbxtIQWKooUE4AGcD0FXKKKACiiigAooooAKKKKA\\nCiiigAooooAKKKKACiiigAooooA8/wDgl/ySHQv+3j/0okr0CvP/AIJf8kh0L/t4/wDSiSvQKACi\\niigAooooA5/x3/yTzxL/ANgq6/8ARTV8wfBL/kr2hf8Abx/6TyV9P+O/+SeeJf8AsFXX/opq+YPg\\nl/yV7Qv+3j/0nkoA+j/iP46/4V/4et9W/s77f512tt5Xn+VjKO27O1v7mMY715f/AMNNf9Sj/wCV\\nL/7VXQftHf8AJPNP/wCwrH/6Klr5goA9/wD+Gmv+pR/8qX/2qvcNC1P+2/D2mat5Pk/brSK58rdu\\n2b0Dbc4GcZxnAr4Qr7f8Cf8AJPPDX/YKtf8A0UtAHzB8Ev8Akr2hf9vH/pPJXr/7R3/JPNP/AOwr\\nH/6KlryD4Jf8le0L/t4/9J5K+p/EnhbRvF2nR2GuWf2u1jlEyp5rx4cAgHKEHox/OgD4Yr6f/Zx/\\n5J5qH/YVk/8ARUVcB8dPBPh3wd/YP9gaf9j+1faPO/fSSbtvl7fvscY3N09a7/8AZx/5J5qH/YVk\\n/wDRUVAGfrv7PH9t+IdT1b/hKfJ+3Xctz5X9n7tm9y23PmDOM4zgUaF+0P8A234h0zSf+EW8n7dd\\nxW3m/wBobtm9wu7HljOM5xkVxHiz4v8AjvTPGWuWFnrvl2trqFxDCn2SA7UWRgoyUycADrXt9h8I\\nPAmmajbX9noXl3VrKk0L/a5ztdSCpwXwcEDrQBX+Nv8AySHXf+3f/wBKI68//Zl/5mn/ALdP/a1e\\ngfG3/kkOu/8Abv8A+lEdef8A7Mv/ADNP/bp/7WoA7D4j/GD/AIV/4ht9J/sL7f51otz5v2vysZd1\\n242N/cznPeuP/wCGmv8AqUf/ACpf/aqwP2jv+Sh6f/2Co/8A0bLXj9AH0foX7Q/9t+IdM0n/AIRb\\nyft13Fbeb/aG7ZvcLux5YzjOcZFdh8bf+SQ67/27/wDpRHXzB4E/5KH4a/7Ctr/6NWvp/wCNv/JI\\ndd/7d/8A0ojoA8A+Fn/M6/8AYqX3/slfT/gT/knnhr/sFWv/AKKWvmD4Wf8AM6/9ipff+yV9P+BP\\n+SeeGv8AsFWv/opaAOf1bwt4s03xpqHiPwffaUf7WijS/tNWV9geIBY3jMY3fdyME9yecjaf8Xf/\\nAOpG/wDJuvQKKAPO54/jFNbyxJN4Kgd0KrLGLkshI+8NwIyOvII9Qa1NG8PS/Dv4fpp3h7Tv7Zvr\\nfDmMyJbNdyMw3sWIwMA8ZydqKuT1rsKKAPLxp/jnxR4vsNfvtDsdA/sO0ufsMFxdi6+03E0ZQb2j\\nI2xjCk8Z9M5+W5HB8WYXmeKLwGjzPvlZVugXbaFy3qdqqMnsAO1eiUUAeT6L4b+Keh3mrXkMng2e\\n61S7N1cTXDXTP0AWMMAD5aAYVTnGTXQfEmwvL7/hEfsdpPceR4ls55vJjL+XGu/c7Y6KMjJPAruK\\nKAPO/EuqeNPEOqXPhfw7o93o1uHWO78QXTKAkZ3Em3UH5yVAwwOVLYIQ4YZeo/DO48N+BtCsPC9v\\n/ad5pet2+r3CTTiFrx0BDbScqn8OB2Vf4m+96xRQB5vp+n+LvFHxA0fX9f0ODQLHQ4p/Jg+1pdSX\\nMkylG+ZCAqgBTyM59c/L6RRRQAUUUUAFFFFABRRRQAUUUUAFFFFABXn/AMU/+ZK/7Gux/wDZ69Ar\\nz/4p/wDMlf8AY12P/s9AHoFFFFAHn/ws/wCZ1/7Gu+/9krsNb0TTvEejz6Tq1v8AaLGfb5kW9k3b\\nWDDlSCOQDwa4/wCFn/M6/wDY133/ALJXoFAFewsbfTNOtrCzj8u1tYkhhTcTtRQAoyeTgAdasUUU\\nAeN6r8E9e1VLi1n+Jesz6fK+RbXavMNobKhsygMRgc7RyM4FeoeHNAsfC3h+z0XTVkFpaoVTzG3M\\nxJLMxPqWJPGBzwAOK1KKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAPP/AIJf\\n8kh0L/t4/wDSiSvQK8/+CX/JIdC/7eP/AEokr0CgAooooAKKKKAOf8d/8k88S/8AYKuv/RTV8wfB\\nL/kr2hf9vH/pPJX0/wCO/wDknniX/sFXX/opq+WPhBf2emfFLRry/u4LS1j8/fNPII0XMEgGWPAy\\nSB+NAHs/7R3/ACTzT/8AsKx/+ipa+YK+3/8AhO/B/wD0Neh/+DGH/wCKo/4Tvwf/ANDXof8A4MYf\\n/iqAPiCvt/wJ/wAk88Nf9gq1/wDRS0f8J34P/wChr0P/AMGMP/xVH/Cd+D/+hr0P/wAGMP8A8VQB\\n8wfBL/kr2hf9vH/pPJXtfx91bUtG8C2NxpeoXdjO2pxo0lrM0TFfKlOCVIOMgHHsK8U+CX/JXtC/\\n7eP/AEnkr1/9o7/knmn/APYVj/8ARUtAHP8AwL/4rX+3v+Er/wCJ99k+z/Zv7V/0ryd/mbtnmZ25\\n2rnHXaPSvdNN0nTdGt2t9L0+0sYGcu0drCsSlsAZIUAZwAM+wrwv9mX/AJmn/t0/9rV7ZqXiXQdG\\nuFt9U1vTbGdkDrHdXSRMVyRkBiDjIIz7GgCvP4L8K3VxLcXHhrRpp5XLySSWETM7E5JJK5JJ5zXy\\nx4L8aeKrrx14et7jxLrM0Eup2ySRyX8rK6mVQQQWwQRxio/FnhPxJqnjLXNR07w/qt5Y3WoXE9vc\\n29lJJHNG0jMrowBDKQQQRwQax/An/JQ/DX/YVtf/AEatAH0/8bf+SQ67/wBu/wD6UR15/wDsy/8A\\nM0/9un/tavQPjb/ySHXf+3f/ANKI68w/Z413R9E/4ST+1tVsbDzvs3l/a7hIt+PNzjcRnGR09RQB\\nn/tHf8lD0/8A7BUf/o2WvH6+3/8AhO/B/wD0Neh/+DGH/wCKo/4Tvwf/ANDXof8A4MYf/iqAPkDw\\nJ/yUPw1/2FbX/wBGrX0/8bf+SQ67/wBu/wD6UR10H/Cd+D/+hr0P/wAGMP8A8VXD/F/xZ4b1P4W6\\nzZ2HiDSru6k8jZDBexyO2J4ycKDk4AJ/CgDxj4Wf8zr/ANipff8AslfT/gT/AJJ54a/7BVr/AOil\\nr5g+Fn/M6/8AYqX3/slfT/gT/knnhr/sFWv/AKKWgDHv/wDhaf8AaNz/AGd/whv2HzX+z/aPtXme\\nXk7d+ON2MZxxmq//ABd//qRv/Juufg1fxFpfxe8d/wBgeF/7c8z+z/O/0+O28nFv8v3wd2ct06bf\\neug/4S34h/8ARMP/ACv2/wDhQBj+KfEnxT8I+HLvXL+PwbJa2uzekC3Rc7nVBgEgdWHeu48beJ/+\\nEO8IX2v/AGP7Z9l8v9x5vl7t0ip97Bxjdnp2ry/4peIvGV98ONWttW8Cf2XYv5PmXn9rwz+XiZCP\\nkUZOSAOOmc9q9Q8Yte/2H5Vl4Xg8SedKqTWE88cSbBlt5MgKnDKvGO+e1AHP/wDCW/EP/omH/lft\\n/wDCuX8HXfxD0H+0ZbPwdPqWjahKLyyhm8Q28v2fflnKzHJkVywYZ+uSWLGv4y8aePte83wNZeCv\\n7O1bUbQySH7fHc/6KdyvyAETJBXcx74AyVNdJpWseNdD0u30zTPhNHbWdumyKJNet8KPyySTkknk\\nkknJNAEk3xD8VaZqOkQ654C/s611LUIbBbj+2IptryHA+VFycAE9unWj4v8Aiyz0zwJrNnYeIILT\\nXY/I2QwXojuVzLGThQdwyhJ+h9Kz9O8deJ/GOj2OrWvwtg1Cx83z7WWbV4PlkRiu9Q6AqwIYA4B9\\nKy/2hbXTbbw1FLbaZaf2teXCvcXS2KtKbeMBSWl2kqA7QLnIJ3BeQSKAPWLPxLoOoW91cWWt6bcw\\nWib7mSG6R1hXBOXIOFGFJyfQ+leP3XiHxfdao3xNsbm7n8I2t75EWmQOzCWxTfHLcmPKc7gWAYFg\\nTk4VATJf6RB4ysbmPw3o1jbWmnXbxaz4YsjFZ3N3NHMViWaZfl8vZufjIBVlVmbDJ0ll408Yq8ml\\n2Hw1tA9gkaPaQeIbXNupX5AUA+QFRwMDgcUAegaVqtjrml2+p6Zcx3NncJvilTow/mCDkEHkEEHB\\nFXK8z+Hug3dnrNxquly2mlaXdPMuq+HY7hLtbO8VsDy3jIVCVwWX+HhcH5fL9MoAKKKKACiiigAo\\noooAKKKKACiiigArz/4p/wDMlf8AY12P/s9egV5/8U/+ZK/7Gux/9noA9AooooA8/wDhZ/zOv/Y1\\n33/slegV5/8ACz/mdf8Asa77/wBkr0CgAorP1vW9O8OaPPq2rXH2exg2+ZLsZ9u5go4UEnkgcCuP\\n/wCF2/Dz/oYf/JK4/wDjdAHcQ39ncXlzZw3cEl1a7ftEKSAvFuGV3KOVyORnrVivD/DvxS8G2PxH\\n8aatc6zssdS+w/ZJfssx8zy4Sr8BMjBOOQM9q7D/AIXb8PP+hh/8krj/AON0Ad5HPDM8yRSxu8L7\\nJVVgSjbQ2G9DtZTg9iD3rP1TxHpGjeH2169vo10tUR/tMYMqlXICkbASQSw5GeteGfEW4s7fxlrH\\n/CJX09jaTRC28X3UEQltIllkWMMU/im+d9wX5uuMN5ldH8SvAuv23gjUbPw7qch0GNIEt/Dlppau\\nxAdM4lGZGO7MhOCTznuaAPVNb1vTvDmjz6tq1x9nsYNvmS7GfbuYKOFBJ5IHArQrxf4ieDvH0ngT\\nUkm8Yz69GfKzpsGiRo8371OhQlhj73A/h9K9I8MaR4i0v7V/b/ij+3PM2eT/AKBHbeTjO77hO7OV\\n69NvvQB0FFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAHn/AMEv+SQ6F/28f+lElegV5/8ABL/k\\nkOhf9vH/AKUSV6BQAUUUUAFFFFAGX4l02bWfCur6XbtGs97ZTW8bSEhQzoVBOATjJ9DXzp/wzj4w\\n/wCglof/AH/m/wDjVfR+u6n/AGJ4e1PVvJ877DaS3Plbtu/YhbbnBxnGM4NeH/8ADTX/AFKP/lS/\\n+1UAYH/DOPjD/oJaH/3/AJv/AI1R/wAM4+MP+glof/f+b/41Xp/w4+MH/CwPENxpP9hfYPJtGufN\\n+1+bnDou3Gxf7+c57UfEf4wf8K/8Q2+k/wBhfb/OtFufN+1+VjLuu3Gxv7mc570AeYf8M4+MP+gl\\nof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41Xv/gnxP/wmPhCx1/7H9j+1eZ+483zNu2Rk+9gZztz0\\n710FAHg/w7+CniTwj4703XL+90qS1tfN3pBLIXO6J0GAYwOrDvWx+0d/yTzT/wDsKx/+ipa5/wD4\\naa/6lH/ypf8A2qj/AISf/hoH/ilPsf8AYP2T/iZfavN+1b9n7vZswmM+bnOf4cY54AOQ+D/xH0f4\\nf/2z/a1tfTfbvI8v7IiNjZ5mc7mX++Ome9ZfxZ8a6b488VWuqaXBdwwRWSW7LdIqsWDu2RtZhjDj\\nv61J8Tfhl/wrn+y/+Jv/AGh9v83/AJdvK2bNn+22c7/bpXn9AH0X4a+PvhXRvCukaXcafrLT2VlD\\nbyNHDEVLIgUkZkBxkegrxTwJ/wAlD8Nf9hW1/wDRq16hoX7PH9t+HtM1b/hKfJ+3WkVz5X9n7tm9\\nA23PmDOM4zgVv6F+zx/YniHTNW/4SnzvsN3Fc+V/Z+3fscNtz5hxnGM4NAHpHxE8N3ni7wJqWh2E\\nkEd1deVsediEG2VHOSAT0U9q8I/4Zx8Yf9BLQ/8Av/N/8ar3/wAbeJ/+EO8IX2v/AGP7Z9l8v9x5\\nvl7t0ip97Bxjdnp2rx//AIaa/wCpR/8AKl/9qoAwP+GcfGH/AEEtD/7/AM3/AMao/wCGcfGH/QS0\\nP/v/ADf/ABqt/wD4aa/6lH/ypf8A2qvYPBPif/hMfCFjr/2P7H9q8z9x5vmbdsjJ97Aznbnp3oA8\\nA/4Zx8Yf9BLQ/wDv/N/8ao/4Zx8Yf9BLQ/8Av/N/8arr9d/aH/sTxDqek/8ACLed9hu5bbzf7Q27\\n9jld2PLOM4zjJrQ8E/HT/hMfF9joH/COfY/tXmfv/t3mbdsbP93yxnO3HXvQBzmg/CbXvAejeL9U\\n1S702aCXw5e26rayOzBiobJ3IoxhD39K9j8Cf8k88Nf9gq1/9FLR47/5J54l/wCwVdf+imo8Cf8A\\nJPPDX/YKtf8A0UtAHP8AhL/kr3xF/wC4Z/6TtXoFcf4h+HOl69rg1uK/1XR9TMXkzXWk3P2d7hOM\\nCQ4OcbR+QBzhcZ//AAqz/qffHP8A4OP/ALCgD0CuX8CeK38Y6Pe6l9m8u1TUJ4LOYKyrdQK3ySgM\\nMjIO0/7St0+6MOf4SQ3VvLb3HjfxrNBKhSSOTVgyupGCCCmCCOMV1n9gJYeF/wCxPD0/9irFF5dr\\nLBEsnknOclXBD5P3s8nJOQTmgDk9Q8G6v4c1TV/FPhrxLHFcXjm41CDXQJLWRVztHmKA8SRqz4wT\\nwFBwBXB658Ybjxbp0fhv7LB4dj1O7k0+81WeYXVtHEAocRuqhWY78E/dUMp3ANuT0CH4TaXd6jb6\\nj4m1XVfEd1FlxHqE+bZJSVZmSJQAqkr9zJXHBBwK7SbSdNudLGlz6faS6eEVBaPCrRBVxtGwjGBg\\nYGOMCgA0mGxttGsYNLMZ0+O3jS1Mcm9TEFATDZO4bcc5Oa8r+MWj358NeLtbv3ge1W0s7TTEilk3\\nRobiN5y6H5dzOI+R/DGo45z1nh34b2PhLxAb7QdT1K00x0fzdIM3mW7OQgDjdkg/KSTkkkgZCgqb\\nnxE8N3ni7wJqWh2EkEd1deVsediEG2VHOSAT0U9qAOf+KaJ4fi0XxnaWeJtJ1WOW9mhC7zbSqIZf\\nlYgOzARICeRgYIAJB4glvPCXxQ/4SZNOnm0S80SddQa0U/JJbhpRJKMbSxQCNCzA8kZAGD0HiTQ/\\nFWp6jHNofjH+xbVYgjW/9mRXO58kl9znIyCBj2965fW/hv4y8R6PPpOrfEf7RYz7fMi/sOFN21gw\\n5VgRyAeDQBufCjTZtP8AhvpL3bRy3l8jX9xOpLNM0zGQM7EZZ9rICTnpjJAFdpXL+G9D8VaZqMk2\\nueMf7atWiKLb/wBmRW218gh9yHJwARj39q6igAooooAKKKKACiiigAooooAKKKKACvP/AIp/8yV/\\n2Ndj/wCz16BXn/xT/wCZK/7Gux/9noA9AooooA8/+Fn/ADOv/Y133/slegV5/wDCz/mdf+xrvv8A\\n2SvQKACo554bW3luLiWOGCJC8kkjBVRQMkkngADnNR31/Z6ZZyXl/dwWlrHjfNPII0XJAGWPAySB\\n+NeX3msap8XJRpGgJfaX4RO7+0NXki8t75AxXyrfP8LbTknp0YDG1wDL8F6/ff8ACzbzxNdtGnh3\\nxbcS2VhNGu1He3ISBnLcoXVZFVc5Zs/KBgj2yuf1jwXoWueEk8M3dp/xLYokitwrEvBsXajIxyQw\\nHc5zyDkEg8fp3ijxT4Flg0XxhpV9q1gJRb2viCxjMxkUsix+dGMsG+fGeWYjADnLEAx/ipr3/CQ6\\nd4h8KeF7KC4+zRG+1/UMbY4PJAYR7h96Y+Uq98BdvZimXcxeHPFHjrw7cePLi0MFx4NtrlpLq5+y\\nq9w0ucgqyjJDOdo468cV1njv4geFbfRde8PWzTvr+p2nlLYw2EqzSyzwqke7Kj5trJkE7gF24yAt\\ncvqNtZ+HPiHoWna54an8SfY/B9vatbWNiLzbIkpUyBXxheCN3X5h60AUND8NfCmfx34rtb+40oaR\\nb/Y/7NL6syId0RMu1/MG/wCbGeTjpxXd/BaGxttG8TwaWYzp8fiO6S1Mcm9TEFjCYbJ3DbjnJzXF\\n6RJo9p4v8R6je/CfXJtMvvs32C2/4R1G+z7Iysnyn5V3Ng/LnPeu0+CzwyaN4ne3spLGBvEd0Y7S\\nSIRNAu2PCFBwpUcY7YxQB6ZRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB5/8ABL/kkOhf9vH/\\nAKUSV6BXn/wS/wCSQ6F/28f+lElegUAFFFFABRRRQBz/AI7/AOSeeJf+wVdf+imr4gr73v7G31PT\\nrmwvI/MtbqJ4Zk3EbkYEMMjkZBPSuH/4Ul8PP+he/wDJ24/+OUAfMngrxrqXgPWZtU0uC0mnlt2t\\n2W6RmUKWVsjaynOUHf1r2Pw34bs/jvp0nijxRJPZ31rKdPSPTGEcZjUCQEiQOd2ZW5zjAHHr3H/C\\nkvh5/wBC9/5O3H/xyvMPiPreo/CTxDb6B4HuP7K0y4tFvZYNiz7pmd0LbpQzD5Y0GAccdOTQB7v4\\nW8N2fhHw5aaHYSTyWtrv2POwLnc7OckADqx7V4Z4l+PvirRvFWr6Xb6fozQWV7NbxtJDKWKo5UE4\\nkAzgegri/wDhdvxD/wChh/8AJK3/APjdcPf31xqeo3N/eSeZdXUrzTPtA3OxJY4HAySelAHuHxE+\\nCnhvwj4E1LXLC91WS6tfK2JPLGUO6VEOQIwejHvWP+zj/wAlD1D/ALBUn/o2KjwT428RfEbxfY+F\\nPFeof2hol/5n2m18mOLfsjaRfnjVWGHRTwR0x0rr/iPomnfCTw9b6/4Ht/7K1O4u1spZ97T7oWR3\\nK7ZSyj5o0OQM8deTQBn/ALTX/Mrf9vf/ALRrE+E3wm0Hx54VutU1S71KGeK9e3VbWRFUqERsncjH\\nOXPf0rzvxP428ReMfsv9v6h9s+y7/J/cxx7d2N33FGc7V6+le/8A7OP/ACTzUP8AsKyf+ioqAPVN\\nJ02HRtGsdLt2kaCyt47eNpCCxVFCgnAAzgegq5RXyB/wu34h/wDQw/8Aklb/APxugD3/AONv/JId\\nd/7d/wD0ojr5Ar2DwT428RfEbxfY+FPFeof2hol/5n2m18mOLfsjaRfnjVWGHRTwR0x0r1//AIUl\\n8PP+he/8nbj/AOOUAeSfCb4TaD488K3Wqapd6lDPFevbqtrIiqVCI2TuRjnLnv6V9B+FvDdn4R8O\\nWmh2Ek8lra79jzsC53OznJAA6se1Hhvwto3hHTpLDQ7P7JaySmZk815MuQATlyT0UflWxQB5Xq3w\\nC8K6zrN9qlxqGsrPe3ElxIsc0QUM7FiBmMnGT6msPW/hxo/wk0efxxoFzfXOp6Zt8mK/dHhbzGET\\nbgiqx+WRiMMOQOvSvWPFl9caZ4N1y/s5PLurXT7iaF9oO11jYqcHg4IHWvnjwT428RfEbxfY+FPF\\neof2hol/5n2m18mOLfsjaRfnjVWGHRTwR0x0oA3NB+LOvePNG8X6XqlppsMEXhy9uFa1jdWLBQuD\\nudhjDnt6V1fhP/haf/CG6H/Z3/CG/Yf7Pt/s/wBo+1eZ5flrt3443YxnHGa0NX+HfhXwj4N8U3+h\\n6V9kupNEu4Wf7RLJlDGSRh2I6qPyrqPAn/JPPDX/AGCrX/0UtAHP/wDF3/8AqRv/ACbo/wCLv/8A\\nUjf+TdegUUAef/8AF3/+pG/8m6P+Lv8A/Ujf+TdegUUAef8A/F3/APqRv/Juj/i7/wD1I3/k3XoF\\nFAHn/wDxd/8A6kb/AMm6P+Lv/wDUjf8Ak3XoFFAHn/8Axd//AKkb/wAm6P8Ai7//AFI3/k3XoFFA\\nHn//ABd//qRv/Juj/i7/AP1I3/k3XoFFAHn/APxd/wD6kb/ybo/4u/8A9SN/5N16BRQB5/8A8Xf/\\nAOpG/wDJuj/i7/8A1I3/AJN16BRQB5//AMXf/wCpG/8AJuj/AIu//wBSN/5N16BRQB5//wAXf/6k\\nb/ybo/4u/wD9SN/5N16BRQB5/wD8Xf8A+pG/8m6P+Lv/APUjf+TdegUUAef/APF3/wDqRv8Aybrl\\n/GH/AAnn9o+Dv+Eo/wCEc+w/8JLZbP7M8/zPMy2M+Zxtxu984r2ivP8A4p/8yV/2Ndj/AOz0AegU\\nUUUAef8Aws/5nX/sa77/ANkr0CvP/hZ/zOv/AGNd9/7JXoFAEc8EN1by29xFHNBKhSSORQyupGCC\\nDwQRxio7b7Hb7dOtfIi+zRJi2iwvlRnKp8o+6vyMB2+U46Vj+J/DVx4k+yxL4h1XSbWHe0i6ZKIZ\\nJXOApMmCQoG/5cclgf4RXm/wRsbfTPGXxFsLOPy7W11BIYU3E7UWS4CjJ5OAB1oA9c1LVtN0a3W4\\n1TULSxgZwiyXUyxKWwTgFiBnAJx7Gs+Dxp4VuriK3t/EujTTyuEjjjv4mZ2JwAAGySTxivO/2jv+\\nSeaf/wBhWP8A9FS12GjWHw4vtRT+w7TwpcX0GJ1+wx27yR7SMONnIwSOexxQB2FUxBpray9wsVod\\nUS3VHkCr56wsxKgn7wQsrEDoSp9Ky/E/hq48SfZYl8Q6rpNrDvaRdMlEMkrnAUmTBIUDf8uOSwP8\\nIrzf4I2NvpnjL4i2FnH5dra6gkMKbidqLJcBRk8nAA60Ae0Vhx6t4V0jVJtLi1DRrLULm43y2izR\\nRyyzSY5ZMgs7ZXkjJ4rm/iv4kvNL0fT9B0e6+za34gu0sbSbcV8lSyh5NwU4xuVeMMN+4crUel+E\\nvhbHbr4Whh8P3t4iPbukkkMl67AHeSw+cOPmPGNuONoAwAeiVl6b4l0HWbhrfS9b02+nVC7R2t0k\\nrBcgZIUk4yQM+4rzf4oTzeI/iD4T8AxyyLZ3b/bdShZikdxCpLBNy/NnEUvHAyUOcjKx/F3wvZ+G\\nvC9v4q8KWNjo2p6PdpKbiziELNG58srtUbXyzJwwxt3DuQQD2CsvTfEug6zcNb6Xrem306oXaO1u\\nklYLkDJCknGSBn3FeV+OdZ/4TzxR4F8K2bzxaZq8Ueq31vMfLWe3I8xUZkJbcFjl4BxuKHPAK2Pi\\n74Xs/DXhe38VeFLGx0bU9Hu0lNxZxCFmjc+WV2qNr5Zk4YY27h3IIB6ZqXiXQdGuFt9U1vTbGdkD\\nrHdXSRMVyRkBiDjIIz7Gqf8Awnfg/wD6GvQ//BjD/wDFUR6Z4b8Y6dp+uXmhWN59qtI5YXvrSOSR\\nY2G9VJIOMbjwDjJNed/Erw14auNU8N+DtH0TTbXUNXvVe5eytbeOWOzTJkIYjKE4yCB83lsOehAP\\nXPt9n/Z39o/a4PsPlef9p8weX5eN2/d0245z0xVPTfEug6zcNb6Xrem306oXaO1uklYLkDJCknGS\\nBn3FeZ/Gv/iX2fhGzm/0bwedQSDVIYfkQxqUKJtT5toRZSAvA2juFrL+Kmk6DC/hVPA2n6anima9\\njurBdMhQF4dpbzDtGwpuVCGfjAYjgNQB7RqWrabo1utxqmoWljAzhFkupliUtgnALEDOATj2NZ8H\\njTwrdXEVvb+JdGmnlcJHHHfxMzsTgAANkknjFed/tHf8k80//sKx/wDoqWuw0aw+HF9qKf2HaeFL\\ni+gxOv2GO3eSPaRhxs5GCRz2OKAOsnnhtbeW4uJY4YIkLySSMFVFAySSeAAOc1n6b4l0HWbhrfS9\\nb02+nVC7R2t0krBcgZIUk4yQM+4rzf45zzQp4WS+lkTwtNqaprCqxAddyMobb85G1ZThe4B6hax/\\nippOgwv4VTwNp+mp4pmvY7qwXTIUBeHaW8w7RsKblQhn4wGI4DUAe6UUUUAef/BL/kkOhf8Abx/6\\nUSV6BXn/AMEv+SQ6F/28f+lElegUAFFFFABRRRQBh+NIJrrwL4ht7eKSaeXTLlI441LM7GJgAAOS\\nSeMV82fC3QtY8M/EfSdX1/Sr7StMt/O869v7d4IYt0Lqu53AUZZlAyeSQO9fV9cf8UtE1HxH8ONW\\n0nSbf7RfT+T5cW9U3bZkY8sQBwCeTQBw/wAa7+z8Y+DbPTvC93Brl9HqCTvbaZILmRYxHIpcrHkh\\nQWUZ6ZYetanwC0nUtG8C31vqmn3djO2pyOsd1C0TFfKiGQGAOMgjPsa5v4KfDvxV4R8ZXl/rmlfZ\\nLWTT3hV/tEUmXMkZAwjE9FP5V7xQB8gfG3/kr2u/9u//AKTx15/XuHxS+FvjLxH8R9W1bSdG+0WM\\n/k+XL9qhTdthRTwzgjkEciuP/wCFJfEP/oXv/J23/wDjlAHt/wAUtd0fxN8ONW0jQNVsdV1O48ny\\nbKwuEnml2zIzbUQljhVYnA4AJ7V84f8ACCeMP+hU1z/wXTf/ABNeofC34W+MvDnxH0nVtW0b7PYw\\ned5kv2qF9u6F1HCuSeSBwK938SeKdG8I6dHf65efZLWSUQq/lPJlyCQMICein8qAPJ/2eNC1jRP+\\nEk/tbSr6w877N5f2u3eLfjzc43AZxkdPUV65qXiXQdGuFt9U1vTbGdkDrHdXSRMVyRkBiDjIIz7G\\nuT/4Xb8PP+hh/wDJK4/+N15h8R9E1H4t+IbfX/A9v/aumW9otlLPvWDbMru5XbKVY/LIhyBjnrwa\\nAOH8WeE/EmqeMtc1HTvD+q3ljdahcT29zb2Ukkc0bSMyujAEMpBBBHBBr6rg8aeFbq4it7fxLo00\\n8rhI447+JmdicAABskk8Yri9C+KXg3wz4e0zQNX1n7NqemWkVleQfZZn8qaNAjruVCpwykZBIOOC\\na8o8J/CDx3pnjLQ7+80Ly7W11C3mmf7XAdqLIpY4D5OAD0oA+n76/s9Ms5Ly/u4LS1jxvmnkEaLk\\ngDLHgZJA/GvB/jp/xWv9g/8ACKf8T77J9o+0/wBlf6V5O/y9u/y87c7WxnrtPpXqHxS0TUfEfw41\\nbSdJt/tF9P5Plxb1TdtmRjyxAHAJ5NeX/DL/AIs5/an/AAnv/Eo/tXyvsf8Ay8eb5W/f/qd+3HmJ\\n1xnPGcGgDY+Cl/Z+DvBt5p3ii7g0O+k1B50ttTkFtI0ZjjUOFkwSpKsM9MqfSvOPiloWseJviPq2\\nr6BpV9qumXHk+Te2Fu88Mu2FFba6AqcMrA4PBBHaq/xr8U6N4u8ZWd/od59rtY9PSFn8p48OJJCR\\nhwD0YfnXo/wt+KXg3w58ONJ0nVtZ+z30HneZF9lmfbumdhyqEHgg8GgDuPCfizw3pfg3Q9O1HxBp\\nVnfWun28FxbXF7HHJDIsaqyOpIKsCCCDyCKx/ilruj+Jvhxq2kaBqtjqup3Hk+TZWFwk80u2ZGba\\niEscKrE4HABPavnDXf8AipviHqf9kf6T/aeqy/Y/4PN8yU7PvYxncOuMZ5xXoHgnwT4i+HPi+x8V\\n+K9P/s/RLDzPtN150cuzfG0a/JGzMcu6jgHrnpQBT+HvhrXtGt/GdxqmialYwN4XvkWS6tXiUthD\\ngFgBnAJx7GvovwJ/yTzw1/2CrX/0Utcvq/xE8K+LvBvimw0PVftd1Hol3MyfZ5Y8IIyCcuoHVh+d\\ndR4E/wCSeeGv+wVa/wDopaAOgorm9D8a6b4i8S6zomnQXbvpDiO6uWRViEmSNi5beTlXGduPkPPI\\nz0lABRXH+KPiPo/hXxDpugXFtfXmp6jt8mC0RONz7Eyzsqjc2R14wc44z2FABRRRQAUVn65rFv4f\\n0O91e7SeS3s4mlkWCIyOQPQD+ZwB1JABIx/AvjrS/Hmhi/sD5VxHhbq0dsvbuex9VODhu+OxBAAO\\noooooAKK5vxr4103wHo0OqapBdzQS3C26raorMGKs2TuZRjCHv6V0lABRXP6L400LxBrmraNYXe6\\n/wBLlMU8LqVJxgMy5+8obKk9iPQqT0FABRXP+FPGmheNbO4udEu/OW3lMUqOpR15O1ip52sBkH8O\\nCCB0FABRRRQAUUUUAFFFFABXn/xT/wCZK/7Gux/9nr0CvP8A4p/8yV/2Ndj/AOz0AegUUUUAef8A\\nws/5nX/sa77/ANkr0CvP/hZ/zOv/AGNd9/7JXoFABXj/AMIP+Sh/E7/sKj/0bcV6B4n0jxFqn2X+\\nwPFH9h+Xv87/AECO587ONv3yNuMN067vauH0f4U+KtB1HVL/AEz4h+RdapL514/9ixN5r5Y5wzkD\\nl26Y60AemalpOm6zbrb6pp9pfQK4dY7qFZVDYIyAwIzgkZ9zXi/xp8Pab4MstG8XeGLaPRtWt71b\\ndWsUWJGUpI2WQDBPy49wxDZGMeka54Y1/U7LRmsPGF3p2qaehWa6jtleK7LIFZngyFzkZXqFycDo\\nRj2nwxu73xLYa74u8U3evXGmur2MS26WkUTAlssqE7ju2HIx9wA7hwAD0SvH/hB/yUP4nf8AYVH/\\nAKNuK9A8T6R4i1T7L/YHij+w/L3+d/oEdz52cbfvkbcYbp13e1cPo/wp8VaDqOqX+mfEPyLrVJfO\\nvH/sWJvNfLHOGcgcu3THWgCn8bNNm1DxV8PUVruCCTUzbvd2xKtCzvDtKvjCvhWK/wC6T2o+LXgP\\nw5ofw8bWdF06PS9Q0Z4Wtbiy/ducyInzsOXIyGDE7gRnPJz6JrHhOz8T+Ek0LxG/29vKQSXaoIn8\\n5Vx5yAZCNnJwMjkg5BIPHy/CXUdc+w23jHxpfa5pljhorNbZbfewwMyOGZn+UMMn5vmJDDJyAc2s\\n93N8W/hf4i1WWMJqOhKhuXZEElwYZCwwMYJaaPAwASwA9K6z4631vafCjUoZ5Nkl3LBDANpO9xIs\\nhHHT5UY8+nriuk8Z+DLHxlpaQTySWt/bP51hqEHEtrKMEMpBBxkDIyM4HIIBGGnw3vdXvLWXxr4o\\nn8RW9nKJrey+xx2sBfBGZUXPmdsZIx8wOQxFAHFrpd3oHxb+F76qkdqi6EunlnlTH2hIZFaPg9d0\\nkYHYlgBmus+Ot9b2nwo1KGeTZJdywQwDaTvcSLIRx0+VGPPp64rpPGfgyx8ZaWkE8klrf2z+dYah\\nBxLayjBDKQQcZAyMjOByCARhp8N73V7y1l8a+KJ/EVvZyia3svscdrAXwRmVFz5nbGSMfMDkMRQB\\n1HhOxuNM8G6HYXkfl3Vrp9vDMm4Ha6xqGGRwcEHpXnfw6MPjb4keJvHbRySWdu66dpLyOHVVC/Oy\\nqwDISNrdBjznHJzXpHiTSptc8NalpMFzHave2725meIyhFcbWO0MuTtJxzwcHnoa/g/w1D4P8J2G\\ngwXElwlojAzOAC7MxdjgdBuY4HOBjk9aAOD+Jet67qvjTSvhxo1xBYR6xaPJeXkiCQtCwlDoFI4+\\nVGPGCSVGVAJOH4y8BL8LLC28a+CbuS0l0xI4b63uXaRbxGdVy3uWI3KMDoV2lRn0Txv8O9L8a/Zr\\nqSafT9Xs+bTUbQ7ZIyMlQf7yhsNjIIOcFcnOHefCvU/Etxar408Z3et6fbP5sdlDZx2as+Ry5Qnc\\nNu4diNxww5yAdhZppvjPwrpV7qmk2lxBd28N4ttdRrOsbOmeNwwSAxGcDv615P8AGnw9pvgyy0bx\\nd4Yto9G1a3vVt1axRYkZSkjZZAME/Lj3DENkYx6Z4j8LajqEWl/8I54hn8OyaduSNLeBZIHjKhdr\\nQkhTtwNueF5wM4Iw7T4Y3d74lsNd8XeKbvXrjTXV7GJbdLSKJgS2WVCdx3bDkY+4Adw4ABl/EvW9\\nd1XxppXw40a4gsI9YtHkvLyRBIWhYSh0CkcfKjHjBJKjKgEnD8ZeAl+FlhbeNfBN3JaS6YkcN9b3\\nLtIt4jOq5b3LEblGB0K7Soz6J43+Hel+Nfs11JNPp+r2fNpqNodskZGSoP8AeUNhsZBBzgrk5w7z\\n4V6n4luLVfGnjO71vT7Z/NjsobOOzVnyOXKE7ht3DsRuOGHOQDvNC1P+2/D2mat5Pk/brSK58rdu\\n2b0Dbc4GcZxnArQqOCCG1t4re3ijhgiQJHHGoVUUDAAA4AA4xUlAHn/wS/5JDoX/AG8f+lElegV5\\n/wDBL/kkOhf9vH/pRJXoFABRRRQAUUUUAU9W1KHRtGvtUuFkaCyt5LiRYwCxVFLEDJAzgeoryv8A\\n4aO8H/8AQN1z/vxD/wDHa9A8d/8AJPPEv/YKuv8A0U1fJHw78N2fi7x3puh38k8drdebveBgHG2J\\n3GCQR1UdqAPd/wDho7wf/wBA3XP+/EP/AMdo/wCGjvB//QN1z/vxD/8AHaP+GcfB/wD0Etc/7/w/\\n/GqP+GcfB/8A0Etc/wC/8P8A8aoAP+GjvB//AEDdc/78Q/8Ax2j/AIaO8H/9A3XP+/EP/wAdo/4Z\\nx8H/APQS1z/v/D/8ao/4Zx8H/wDQS1z/AL/w/wDxqgDY8LfGvw34u8R2mh2Flqsd1db9jzxRhBtR\\nnOSJCeintWP+0d/yTzT/APsKx/8AoqWvIPgl/wAle0L/ALeP/SeSvpvxr4K03x5o0Ol6pPdwwRXC\\n3CtauqsWCsuDuVhjDnt6UAfKngX4cax8QPt/9k3NjD9h8vzPtbuud+7GNqt/cPXHavpP4TeCtS8B\\n+FbrS9UntJp5b17hWtXZlClEXB3KpzlD29KueBfhxo/w/wDt/wDZNzfTfbvL8z7W6NjZuxjaq/3z\\n1z2rsKAPnTxL8AvFWs+KtX1S31DRlgvb2a4jWSaUMFdywBxGRnB9TXv+ralDo2jX2qXCyNBZW8lx\\nIsYBYqiliBkgZwPUV4B4l+PvirRvFWr6Xb6fozQWV7NbxtJDKWKo5UE4kAzgegrn9W+PvirWdGvt\\nLuNP0ZYL23kt5GjhlDBXUqSMyEZwfQ0Aex+FvjX4b8XeI7TQ7Cy1WO6ut+x54owg2oznJEhPRT2q\\nv8YPhxrHxA/sb+ybmxh+w+f5n2t3XO/y8Y2q39w9cdq8Q+CX/JXtC/7eP/SeSvb/AIwfEfWPh/8A\\n2N/ZNtYzfbvP8z7WjtjZ5eMbWX++eue1AHzp418Fal4D1mHS9UntJp5bdbhWtXZlClmXB3KpzlD2\\n9K5uvofw34bs/jvp0nijxRJPZ31rKdPSPTGEcZjUCQEiQOd2ZW5zjAHHr5B8RPDdn4R8d6lodhJP\\nJa2vlbHnYFzuiRzkgAdWPagCv4E/5KH4a/7Ctr/6NWvp/wCNv/JIdd/7d/8A0ojr5g8Cf8lD8Nf9\\nhW1/9GrX0/8AG3/kkOu/9u//AKUR0AeAfCz/AJnX/sVL7/2SvV/Efjp/DPwg8L6PpB87xDq2lWsF\\nvBEzedEjQhfNULzuzhV5GWORnaRXlHws/wCZ1/7FS+/9kr3/AMFeC9CmsPCPi02m3V4NEt4hKjFQ\\n+YFUMwH3mC7lBPZuc4XaAeWaV8PtV8M3GjaBe/ELUvDmoawjzpaWsUn2cS5VfLMqyqjSkYGADyAM\\n8pu6fVfhn4m0bS7jULz4vazHBAm4l5GjBPQLue5VQSSAMkDJHNdJ8YfEPg6x8L3GkeJV+13VxEZr\\nSyhOJt4O1ZFfBEeCT8x6gOMNyp5/TPAPiD4iTy3/AI7e+07RViCaboq3bM8Y2EJLIWJJkUMeX+dm\\nzuAUbSAYGlfDjxT4ynvfH2r+IJ9C1OSWR4jp9qZWaFUChojFJuKlQVXGS6gEFtwJv+GPA+t+LtDh\\n1fSPjBrktvJwyssoeJx1Rx5/DDI/MEEggmxpfiTxT8H7y00PxfH9v8Jea1vZ6xGpZ4lwCgIBJCgZ\\n+Qjd97YWCAHsPAfhfwtba5qXirwjqvmabqUSI1jbSDyIpPvkleqtgrhCAU3OOjAKAU7/APt74VfC\\nvWL+XXZPEOoQ3CSxT6irkKrvFHsx5hOB8xGGHJ6euHYeL/jVqenW1/Z+EdDktbqJJoX8wDcjAFTg\\n3GRkEda9I8beGP8AhMfCF9oH2z7H9q8v9/5Xmbdsiv8AdyM5246965/XE8c+FfD3h3SfBemWOsfZ\\nbQW13LdkR48tEVGAMq43fOcZbGB+IBz/APwkPxz/AOhM0P8A7/L/APJFcp4V8O/FnwfrOq6npXg/\\nTVfUn3PA10ggiG4sFSNZwABuwM5IHAIyc9X/AMJD8c/+hM0P/v8AL/8AJFU9V8bfGXQ9LuNT1Pwt\\n4ftrO3TfLK8y4Uf+BGSScAAckkAZJoAuf8JD8c/+hM0P/v8AL/8AJFWPBPxVv7uDxVN43isdMj0C\\nWGGY2kUjbHd3jYHDPu+ZVHy+p7VH8JviV4q8eazdJqmk2kOlxW7lbu1t5VUzBk+QuzMudrk469DX\\nSeHfhtZ6Pq3iu6v54NVtfEF2Ll7Se0GyPEkjhTksH5cc4H3c/QA8w+NfxE8K+LvBtnYaHqv2u6j1\\nBJmT7PLHhBHICcuoHVh+der6T8U/BOtyzx2Wvwf6PF50zzxyQIiblTJeRVX7zqOvevIP2gYvD+i/\\n2Romj6NpVldSbru4e2slikCDKRjeoAKk+Zkc8op47+t2Hhv4eeKtEvF0rS9GnsJnNrcSafEsJYo6\\nsULx7WxuRG64I2kZBBIBw/jJNGvPiR4e8XeF/GHhi1vInMV/LPfQMvlhSA5QEFyVLRn5geY8FQCw\\nufFD4iWF/p0PhTwzrulSXmr5iubx7iM21vbEMH3Sk7VY9McnGcAMUz0H/Ckvh5/0L3/k7cf/AByj\\n/hSXw8/6F7/yduP/AI5QBY8E3fgfwzoen+HtI8RaHLN8qMYbyLfdTtgF9u8ksxxgZOOFHAFdxXD2\\nHwg8CaZqNtf2eheXdWsqTQv9rnO11IKnBfBwQOtdxQAUUUUAFFFFABRRRQAV5/8AFP8A5kr/ALGu\\nx/8AZ69Arz/4p/8AMlf9jXY/+z0AegUUUUAef/Cz/mdf+xrvv/ZK9Arz/wCFn/M6/wDY133/ALJX\\noFABRXP+J/C//CU/Zba51W+ttMTebqztJPK+2ZwAkjj5vL27wVGN28HI2ivI/iL4YtPhG+leMfBT\\nyafKLgWc9m7vLFOrKz/NuYnHyYIz/dI2lckA98ooooAKKKKACiiigAooooAKKKKACiiigAooooAK\\nKKKACiiigAooooA8/wDgl/ySHQv+3j/0okr0CvP/AIJf8kh0L/t4/wDSiSvQKACiiigAooooA5/x\\n3/yTzxL/ANgq6/8ARTV8wfBL/kr2hf8Abx/6TyV9P+O/+SeeJf8AsFXX/opq+YPgl/yV7Qv+3j/0\\nnkoA93+NfinWfCPg2zv9DvPsl1JqCQs/lJJlDHISMOCOqj8q8I/4Xb8Q/wDoYf8AySt//jdev/tH\\nf8k80/8A7Csf/oqWvmCgD0D/AIXb8Q/+hh/8krf/AON19T+E7641Pwbod/eSeZdXWn280z7QNztG\\npY4HAySelfDFfb/gT/knnhr/ALBVr/6KWgD5g+CX/JXtC/7eP/SeSvr+vkD4Jf8AJXtC/wC3j/0n\\nkr2v4+6tqWjeBbG40vULuxnbU40aS1maJivlSnBKkHGQDj2FAHqlFeH/ALPGu6xrf/CSf2tqt9f+\\nT9m8v7XcPLsz5ucbicZwOnoK9woA+IPHf/JQ/Ev/AGFbr/0a1fT/APwpL4ef9C9/5O3H/wAcr5g8\\nd/8AJQ/Ev/YVuv8A0a1fb9AHj/jbwT4d+HPhC+8V+FNP/s/W7Dy/s1150kuzfIsbfJIzKco7DkHr\\nnrXP/DL/AIvH/an/AAnv/E3/ALK8r7H/AMu/lebv3/6nZuz5adc4xxjJr3i+sLPU7OSzv7SC7tZM\\nb4Z4xIjYIIyp4OCAfwrwf46f8UV/YP8Awin/ABIftf2j7T/ZX+i+ds8vbv8ALxuxubGem4+tAFD4\\nj63qPwk8Q2+geB7j+ytMuLRb2WDYs+6ZndC26UMw+WNBgHHHTk11/gnwT4d+I3hCx8V+K9P/ALQ1\\nu/8AM+03XnSRb9kjRr8kbKowiKOAOmetV/gpYWfjHwbeaj4otINcvo9QeBLnU4xcyLGI42CBpMkK\\nCzHHTLH1r2CxsLPTLOOzsLSC0tY87IYIxGi5JJwo4GSSfxoA83134W+DfDPh7U9f0jRvs2p6ZaS3\\ntnP9qmfypo0Lo21nKnDKDggg45BrwDW/il4y8R6PPpOraz9osZ9vmRfZYU3bWDDlUBHIB4NfV/jv\\n/knniX/sFXX/AKKaviCgD0D4Wf8AM6/9ipff+yV6/BpPxF1jwz4TsvD2t2OmaFLoluJ7hYsTx5ij\\nVhk5JbBZkKbO4JBCk+QfCz/mdf8AsVL7/wBkr6f8Cf8AJPPDX/YKtf8A0UtAHl+mfC3w1rVrLJ4V\\n8cTyeJbS7El7rkM7TSEvEdyqEdQFYsTuyxyHUscEDM8X+F9Z8D29jcax8WPE4gu7gQCSG3ndY+Ml\\nnPn4AA5wMsecA4ON86bqXgb49JdaZZ3dzovidGe6jt0aTyZNwDyMN3AWR0YuwwqzMFHFdZ8W/DD+\\nKvh1qFrbQedfW2Lu1Ubsl06hQudzFC6gYOSw6dQAcfffBHxJqdnJZ3/xO1W7tZMb4Z4ZJEbBBGVM\\n+DggH8Kp3Hwu0C58Qainw58aSaNrFqkkNzYw3TNggJ8u4MJFTdjcfnAY4wCu2usn8b3ng34M6drH\\niC1ng1o2iW0UFyTK8txtIRpDkEbgu9gSCORy3BufCvwRN4Q8Py3GqNJJ4g1R/P1KR5zL82WKrnoS\\nAxJPOWZuSMUAU9T8cn4X6HpMXjW+vta1O/8AMdprO2hVEK7MoB8nyjcMEgk8k44UY/8Aw0d4P/6B\\nuuf9+If/AI7XsFFAHj//AA0d4P8A+gbrn/fiH/47Xlmm+O9B13xA2vfEVtZ1SeK4MlpptrGhsolw\\nOCruDjIX5RjOwbi+4ivrOvH/ANnH/knmof8AYVk/9FRUARwftD+CbW3it7fSNZhgiQJHHHbQqqKB\\ngAASYAA4xW54f+N3hPxBLfALfWENjaNdzz3saKgQMq4G12JYl1AAHPQc4B9IrP1zRrPxDod7pF+m\\n+1u4mifABK56MuQQGBwQccEA0AfLHi+xuNe8G3nxH1OPZdazraw2abgfKtkjlGMrgHlFTlQf3Wf4\\nq9vsfhreeGfiLHrnhPUINP0W8z/ammSIWQ4yR5SjgZJOORs5xuUlK5/9oCxt9M+FmjWFnH5dra6h\\nBDCm4naiwShRk8nAA617RQB4/wD8JD8c/wDoTND/AO/y/wDyRR/wkPxz/wChM0P/AL/L/wDJFewU\\nUAeb+FtZ+K134jtIPEvhnSrLSG3/AGieCRS6YRiuAJm6ttHQ9fxr0iiigAooooAKKKKACiiigArz\\n/wCKf/Mlf9jXY/8As9egV5/8U/8AmSv+xrsf/Z6APQKKKKAPP/hZ/wAzr/2Nd9/7JXoFef8Aws/5\\nnX/sa77/ANkr0CgCnquq2Oh6XcanqdzHbWdum+WV+ij+ZJOAAOSSAMk15P4aW++LXjW28XanYSWv\\nhfRnY6NE7bXmnDL+8bHLAFASAQoKqo3YfOx8U/BXirxvcabaadPo39i2rrcS2168qtNMCwwxRSdm\\n04+Uqfmb/ZIsQQfFm1t4re3i8BwwRIEjjjW6VUUDAAA4AA4xQB6JRRRQAUUUUAFFFFABRRRQAUUU\\nUAFFFFABRRRQAUUUUAFFFFABRRRQB5/8Ev8AkkOhf9vH/pRJXoFef/BL/kkOhf8Abx/6USV6BQAU\\nUUUAFFFFAHP+O/8AknniX/sFXX/opq+YPgl/yV7Qv+3j/wBJ5K+n/Hf/ACTzxL/2Crr/ANFNXyR8\\nO/Eln4R8d6brl/HPJa2vm70gUFzuidBgEgdWHegD6P8AjX4W1nxd4Ns7DQ7P7XdR6gkzJ5qR4QRy\\nAnLkDqw/OvCP+FJfEP8A6F7/AMnbf/45Xr//AA0d4P8A+gbrn/fiH/47R/w0d4P/AOgbrn/fiH/4\\n7QB5B/wpL4h/9C9/5O2//wAcr6n8J2Nxpng3Q7C8j8u6tdPt4Zk3A7XWNQwyODgg9K83/wCGjvB/\\n/QN1z/vxD/8AHaP+GjvB/wD0Ddc/78Q//HaAPIPgl/yV7Qv+3j/0nkr6n8SeKdG8I6dHf65efZLW\\nSUQq/lPJlyCQMICein8q+WPgl/yV7Qv+3j/0nkr1/wDaO/5J5p//AGFY/wD0VLQBz/xN/wCLx/2X\\n/wAIF/xN/wCyvN+2f8u/lebs2f67Zuz5b9M4xzjIrQ+HGt6d8JPD1xoHji4/srU7i7a9ig2NPuhZ\\nEQNuiDKPmjcYJzx05FZ/7Mv/ADNP/bp/7Wrc+LPwm17x54qtdU0u702GCKyS3ZbqR1YsHdsjajDG\\nHHf1oA9csL631PTra/s5PMtbqJJoX2kbkYAqcHkZBHWvljQvhb4y8M+IdM1/V9G+zaZpl3Fe3k/2\\nqF/KhjcO7bVcscKpOACTjgGvR7D41+G/B2nW3hfUbLVZb7Rok0+4kt4o2jaSECNihMgJUlTgkA47\\nCi/+Nfhvxjp1z4X06y1WK+1mJ9Pt5LiKNY1kmBjUuRISFBYZIBOOxoA6j/hdvw8/6GH/AMkrj/43\\nR/wu34ef9DD/AOSVx/8AG68g/wCGcfGH/QS0P/v/ADf/ABqj/hnHxh/0EtD/AO/83/xqgDQ+I+ia\\nj8W/ENvr/ge3/tXTLe0Wyln3rBtmV3crtlKsflkQ5Axz14Nev/C3RNR8OfDjSdJ1a3+z30HneZFv\\nV9u6Z2HKkg8EHg15v4b8SWfwI06Twv4ojnvL66lOoJJpiiSMRsBGATIUO7MTcYxgjn02P+GjvB//\\nAEDdc/78Q/8Ax2gDqL/4v+BNM1G5sLzXfLurWV4Zk+yTna6khhkJg4IPSuX8beNvDvxG8IX3hTwp\\nqH9oa3f+X9mtfJki37JFkb55FVRhEY8kdMda4i/+CniTxjqNz4o0690qKx1mV9Qt47iWRZFjmJkU\\nOBGQGAYZAJGe5rf+HfwU8SeEfHem65f3ulSWtr5u9IJZC53ROgwDGB1Yd6AMDwf8O/FXhHTvGN/r\\nmlfZLWTw1ewq/wBoiky5CkDCMT0U/lXo48H6x4r+Hngr+yfFt9oH2bSofM+yB/3+6KPGdsifd2nr\\nn7x6V2Hjv/knniX/ALBV1/6KajwJ/wAk88Nf9gq1/wDRS0Aef/8ACoPGH/RWdc/Kb/4/R/wqDxh/\\n0VnXPym/+P17BRQB4nefArXtQuLW4vfiTqVzPaPvtpJrd3aFsg5QmbKnKg5HoPSrn/CoPGH/AEVn\\nXPym/wDj9ewUUAY/hbR7zQfDlppl/q0+rXUO/fez53y5dmGcsx4BA6npVzVo76bRr6LS5o4NQe3k\\nW1lkGVSUqdjHg8BsHofoauUUAeNz+F/jhc28sD+NNGCSIUYxqEYAjHDLbgqfcEEdq7zwB4Lt/Afh\\ndNHgn+0yGV5p7jYU812OAdpZtuFCrwf4c9Sa6iigAooooA4P4s+CtS8eeFbXS9LntIZ4r1LhmunZ\\nVKhHXA2qxzlx29aueOvhxo/xA+wf2tc30P2HzPL+yOi537c53K39wdMd67CigDx//hnHwf8A9BLX\\nP+/8P/xqj/hnHwf/ANBLXP8Av/D/APGq9gooA8f/AOGcfB//AEEtc/7/AMP/AMar2CiigAooooAK\\nKKKACiiigArz/wCKf/Mlf9jXY/8As9egV5/8U/8AmSv+xrsf/Z6APQKKKKAPP/hZ/wAzr/2Nd9/7\\nJXoFef8Aws/5nX/sa77/ANkr0CgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigA\\nooooAKKKKAPP/gl/ySHQv+3j/wBKJK9Arz/4Jf8AJIdC/wC3j/0okr0CgAooooAKKKKAM/XdM/tv\\nw9qek+d5P260ltvN27tm9Cu7GRnGc4yK8P8A+GZf+pu/8pv/ANtr6AooA+f/APhmX/qbv/Kb/wDb\\naP8AhmX/AKm7/wApv/22voCigD5//wCGZf8Aqbv/ACm//baP+GZf+pu/8pv/ANtr6AooA8f8E/Av\\n/hDvF9jr/wDwkf2z7L5n7j7D5e7dGyfe8w4xuz07V2HxH8C/8LA8PW+k/wBo/YPJu1ufN8jzc4R1\\n243L/fznPauwooA8/wDhl8Mv+Fc/2p/xN/7Q+3+V/wAu3lbNm/8A22znf7dK9AoooA8P139nj+2/\\nEOp6t/wlPk/bruW58r+z92ze5bbnzBnGcZwKNC/Z4/sTxDpmrf8ACU+d9hu4rnyv7P279jhtufMO\\nM4xnBr3CigAooooA8v8AiP8AB/8A4WB4ht9W/t37B5Nott5X2Tzc4d23Z3r/AH8Yx2rj/wDhmX/q\\nbv8Aym//AG2voCigDP0LTP7E8PaZpPned9htIrbzdu3fsQLuxk4zjOMmtCiigDn/AB3/AMk88S/9\\ngq6/9FNR4E/5J54a/wCwVa/+ilo8d/8AJPPEv/YKuv8A0U1HgT/knnhr/sFWv/opaAOgooooAKKK\\nKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACvP/in/wAyV/2Ndj/7PXoFef8A\\nxT/5kr/sa7H/ANnoA9AooooA8/8AhZ/zOv8A2Nd9/wCyV6BXn/ws/wCZ1/7Gu+/9kr0CgAooooAK\\nKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAPP8A4Jf8kh0L/t4/9KJK9Arz\\n/wCCX/JIdC/7eP8A0okr0CgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoooo\\nAKKKKAOf8d/8k88S/wDYKuv/AEU1HgT/AJJ54a/7BVr/AOilo8d/8k88S/8AYKuv/RTUeBP+SeeG\\nv+wVa/8AopaAOgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACvP/\\nAIp/8yV/2Ndj/wCz16BXn/xT/wCZK/7Gux/9noA9AooooA8/+Fn/ADOv/Y133/slegVw9/8ACDwJ\\nqeo3N/eaF5l1dSvNM/2ucbnYkscB8DJJ6VX/AOFJfDz/AKF7/wAnbj/45QB6BRXn/wDwpL4ef9C9\\n/wCTtx/8co/4Ul8PP+he/wDJ24/+OUAegUV5/wD8KS+Hn/Qvf+Ttx/8AHKP+FJfDz/oXv/J24/8A\\njlAHoFFef/8ACkvh5/0L3/k7cf8Axyj/AIUl8PP+he/8nbj/AOOUAegUV5//AMKS+Hn/AEL3/k7c\\nf/HKP+FJfDz/AKF7/wAnbj/45QB6BRXn/wDwpL4ef9C9/wCTtx/8co/4Ul8PP+he/wDJ24/+OUAe\\ngUV5/wD8KS+Hn/Qvf+Ttx/8AHKP+FJfDz/oXv/J24/8AjlAHoFFef/8ACkvh5/0L3/k7cf8Axyj/\\nAIUl8PP+he/8nbj/AOOUAegUV5//AMKS+Hn/AEL3/k7cf/HKP+FJfDz/AKF7/wAnbj/45QB6BRXn\\n/wDwpL4ef9C9/wCTtx/8co/4Ul8PP+he/wDJ24/+OUAegUV5/wD8KS+Hn/Qvf+Ttx/8AHKP+FJfD\\nz/oXv/J24/8AjlAHoFFef/8ACkvh5/0L3/k7cf8Axyj/AIUl8PP+he/8nbj/AOOUAHwS/wCSQ6F/\\n28f+lElegV5//wAKS+Hn/Qvf+Ttx/wDHKP8AhSXw8/6F7/yduP8A45QB6BRXn/8AwpL4ef8AQvf+\\nTtx/8co/4Ul8PP8AoXv/ACduP/jlAHoFFef/APCkvh5/0L3/AJO3H/xyj/hSXw8/6F7/AMnbj/45\\nQB6BRXn/APwpL4ef9C9/5O3H/wAco/4Ul8PP+he/8nbj/wCOUAegUV5//wAKS+Hn/Qvf+Ttx/wDH\\nKP8AhSXw8/6F7/yduP8A45QB6BRXn/8AwpL4ef8AQvf+Ttx/8co/4Ul8PP8AoXv/ACduP/jlAHoF\\nFef/APCkvh5/0L3/AJO3H/xyj/hSXw8/6F7/AMnbj/45QB6BRXn/APwpL4ef9C9/5O3H/wAco/4U\\nl8PP+he/8nbj/wCOUAegUV5//wAKS+Hn/Qvf+Ttx/wDHKP8AhSXw8/6F7/yduP8A45QB6BRXn/8A\\nwpL4ef8AQvf+Ttx/8co/4Ul8PP8AoXv/ACduP/jlAHoFFef/APCkvh5/0L3/AJO3H/xyj/hSXw8/\\n6F7/AMnbj/45QB6BRXn/APwpL4ef9C9/5O3H/wAco/4Ul8PP+he/8nbj/wCOUAdB47/5J54l/wCw\\nVdf+imo8Cf8AJPPDX/YKtf8A0Utc/wD8KS+Hn/Qvf+Ttx/8AHKP+FJfDz/oXv/J24/8AjlAHoFFe\\nf/8ACkvh5/0L3/k7cf8Axyj/AIUl8PP+he/8nbj/AOOUAegUV5//AMKS+Hn/AEL3/k7cf/HKP+FJ\\nfDz/AKF7/wAnbj/45QB6BRXn/wDwpL4ef9C9/wCTtx/8co/4Ul8PP+he/wDJ24/+OUAegUV5/wD8\\nKS+Hn/Qvf+Ttx/8AHKP+FJfDz/oXv/J24/8AjlAHoFFef/8ACkvh5/0L3/k7cf8Axyj/AIUl8PP+\\nhe/8nbj/AOOUAegUV5//AMKS+Hn/AEL3/k7cf/HKP+FJfDz/AKF7/wAnbj/45QB6BRXn/wDwpL4e\\nf9C9/wCTtx/8co/4Ul8PP+he/wDJ24/+OUAegUV5/wD8KS+Hn/Qvf+Ttx/8AHKP+FJfDz/oXv/J2\\n4/8AjlAHoFFef/8ACkvh5/0L3/k7cf8Axyj/AIUl8PP+he/8nbj/AOOUAegUV5//AMKS+Hn/AEL3\\n/k7cf/HKP+FJfDz/AKF7/wAnbj/45QB6BRXn/wDwpL4ef9C9/wCTtx/8co/4Ul8PP+he/wDJ24/+\\nOUAegV5/8U/+ZK/7Gux/9no/4Ul8PP8AoXv/ACduP/jlH/Ckvh5/0L3/AJO3H/xygD0Ciq9hY2+m\\nadbWFnH5draxJDCm4naigBRk8nAA61YoAKK5vxr4103wHo0OqapBdzQS3C26raorMGKs2TuZRjCH\\nv6Vz8nxh0ixeFta8P+J9EtJH2fbNR0wpEG2kgZUkknacAA/lkgA9Eoqv9vs/7O/tH7XB9h8rz/tP\\nmDy/Lxu37um3HOemK4eb4vaFJqNxZ6LpmueIfs2BPNo9iZ442JYAFiRnO0kEZUjoTzQB6BRXJ6B8\\nRdA8Qaoujq93p+tbC7aZqNs0E6gc9D8pJXDAAk7TnscbGv8AiPSPC2ltqWtX0dpaBwm9gWLMegVV\\nBLHqcAHgE9AaANSivNx8ZdLSzhv7rwz4rs9Mk2E6hPpuIERyArlgxyvI6ZzngGu81LVtN0a3W41T\\nULSxgZwiyXUyxKWwTgFiBnAJx7GgC5RXN+F/HegeM7i9i0G6kuks0iaWUwtGuXL4UbgCSNhJ4xyO\\nTzjcv7630zTrm/vJPLtbWJ5pn2k7UUEscDk4APSgCxRXHx+PEt/h/p/inVtLnt5L7yxBp1tIs80p\\nlbEax/d3sykPtHIGeMg1oav4n/svxf4c0D7H5v8AbP2n9/5u3yfJjD/dwd2c46jHvQB0FFFFABRR\\nRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFF\\nABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUA\\nFFFFABRRRQB4/wDtHf8AJPNP/wCwrH/6KlrsPilfaXZfDXXRq0kCxz2kkMCzLu3zlT5YUd2DAMMd\\nNu7gAkcf+0d/yTzT/wDsKx/+ipa6ix+D/gHT7yO6h8OQPImcCeWSZDkEco7FT17jjr1oA8s1SfV3\\n+Enw78F3UskL+I7hUluXYSlLcTKYhj02yRMAGUgIF7kD3/StKsdD0u30zTLaO2s7dNkUSdFH8ySc\\nkk8kkk5Jrzv41aNePo+leLdNTzb7w1di8ELAsjx7lLEqoycFEJ5UBQ5z0rtPC/i7RfGOlpf6Pexz\\nAorSwFgJYCcjbImcqcq3scZBI5oA4f44aJCvhiHxhaeXb61oVxBLBciMMzL5gAQ54IDMHGQcYIx8\\nxrP+ItvrXiPS/AXjrR9HkvRp7xahNp8Dl5cSeTIAuFywBTaSBkZBxjOJPi74nt/EMFv8PPD88F7q\\n+q3aRXIjzIlqiPk72TO1gyAkYO1VckDjPoltd6L4Ut9E8OTajHA5t1trFbpwrTiIImAcAF/mTgcn\\nJwODgAy/CPxO8LeNNsWm33lXxz/oN2BHN/F0GSH4Ut8pbAxnFbmq+G9F1y4t59W0u0v3tkdIRdRC\\nRUDlS2FbIz8i84yOcdTny/46aD4ctdEk8TrLHYeKY3hazmhuPKln2OqnC5+Yqrg7gNw2rzgYr1Dw\\n1NfXPhXSJ9UEg1CSyhe6EkexhKUBfK4G07s8YGKAPM/hB/yUP4nf9hUf+jbij9oHxJ9k8If8I9bR\\n+dcX22e62ru+z26SLh2wcruk2KCQQfmHXFHwg/5KH8Tv+wqP/RtxVz4x+HNIs/APivXoLGNdUvkt\\nUuLkkszKs0QAGThRhVyFxnAznAoAPFmkzeMPHmj+DLNbvTND0S3XUbi4s0MBSTBS3WFjGQpXBIwc\\nEbxw0dYfiLwB9k+I/gvTv+Et8Vzfbvt3+kzalumt9kIb90235d3RuuRXoGt+HfGV9rE9zpPjv+y7\\nF9vl2f8AZEM/l4UA/OxyckE89M47V5/4i8O+MofiP4Ltrnx39ovp/t32S8/siFPsu2EF/kBw+4cc\\n9OooA9I8N+C/+Ec1GS8/4SbxHqm+IxeTqd/58a5IO4LtGG4xn0J9a6iuP0Tw74ysdYgudW8d/wBq\\nWKbvMs/7Ihg8zKkD51ORgkHjrjHeuwoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAo\\noooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACii\\nigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAMfxJ4W0bxdp0dhrln9rtY5RMqea8eHA\\nIByhB6MfzrYoooAK4/WfhZ4J1/UXv9R0CB7p8l3hkkh3kkkswjZQzEk5Y8n1rsKKAMfw94V0LwpZ\\nm10PTILKNvvlAS8mCSNznLNjccZJxnA4qxrOh6X4h057DV7CC9tWydkyZ2kgjcp6q2CcMMEZ4NaF\\nFAHH6N8LPBOgail/p2gQJdJgo80kk2wgghlEjMFYEDDDketaHifwT4d8Y/Zf7f0/7Z9l3+T++kj2\\n7sbvuMM52r19K6CigDz/AP4Ul8PP+he/8nbj/wCOVoeNfBz638M7nwponkW37qCG2E7tsRI3QgFs\\nM33Ux3rsKKACuX1zw3ean478Ka5DJAtrpH2z7QjsQ7ebEEXaAMHBHOSPxrqKKACiiigAooooAKKK\\nKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoooo\\nAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigA\\nooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACi\\niigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKK\\nKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoooo\\nAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigA\\nooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACi\\niigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKK\\nKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoooo\\nAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigA\\nooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACi\\niigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKK\\nKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoooo\\nAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigA\\nooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACi\\niigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKK\\nKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoooo\\nAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigA\\nooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACi\\niigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKK\\nKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoooo\\nAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigA\\nooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACi\\niigAooooAKKKKACiiigAooooAKKKKAMfxT4ks/CPhy71y/jnktbXZvSBQXO51QYBIHVh3rYrx/42\\n+J/+JHrvhT7H/wAwq31L7V5v/T7HHs2Y/HOfbFblte+K/GVvJa2esyeF9W0e4ktNTVdLFxBcvhSj\\nxNLj5CvzAdcOM8bWYA6zQPEln4j/ALU+xxzp/ZuoS6fN5ygbpI8biuCcryME4PtWxXh/gDw74yu/\\n+Eo/s7x39g8nxBdxXH/Eohl+0TDbul5Py7uPlHAxXcfDzxTcah8KLPxL4hvPMkWK4murjygMJHJI\\nM7UHZV7DnHrQBueG/FukeKkvTpk0nm2Vw9vc288ZiliZWIBZG5AbBIz7g4IYCO18Z6NdeKJ/DbSz\\n22qx7jHDdW7w/aUUcvEWADrncOOuxiAVG6uXsJvAPjbWNV8TaLq89vfW2nva319bPJabI5FO2Ryy\\nqCyBGwxyBgE/dTb5hdX9nd6HPrmk3fxcmkitJ/st/LIGgT13SL0j3Iu7B/g9RQB9Bz6/Y2/iWz0B\\nmka/ureS5VY13CNEKjL45QEsQpIAJUjOcAyanruj6J5X9rarY2HnZ8v7XcJFvxjONxGcZHT1FfMl\\n7PNp/g6XxBZS/Eq21q7t7Z7nUZ2KWUzfKMtIPmZMMQhJ7r617X8XdSsNH8L297caJpWqX8l2lpYj\\nVII5IY3kOWLM5XYu1Dzkchc8A4ANC7+KHg+01jTtO/tyxm+3eb/pMN3C0NvsXd+9bf8ALu6L1yaP\\n+FoeD/8AhIf7I/tyx/49PtX237XD9m+/t8vfv/1nfbjpzXiGr/8AI3+HP+SVf8vP/Hn/AMef+rH/\\nAB9f+yf7WaP+ah/80q/5BX/cN/1v/pR/7JQB9J6bq2m6zbtcaXqFpfQK5RpLWZZVDYBwSpIzgg49\\nxVO+8WeG9MvJLO/8QaVaXUeN8M97HG65AIypORkEH8a4v4LxC10bX7d7jRnnfWJrny9IuY5YEjdU\\nClAjEohKMFVsHC9K5u91nwNpHxe8bf8ACaRWMnm/Yfsn2uwNzjFv8+MI23qnpnj0oA9Q/wCE78H/\\nAPQ16H/4MYf/AIqj/hO/B/8A0Neh/wDgxh/+KrxjXPEvwpn8d+FLqwt9KGkW/wBs/tIJpLIh3RAR\\nbk8sb/mzjg468UfETxL8KdQ8Cala+GrfSk1d/K+zmDSWhcYlQthzGMfKG789KAPoes/U9d0fRPK/\\ntbVbGw87Pl/a7hIt+MZxuIzjI6eorL8SeNdN8L6zoWl3sF3JPrVx9ntmhRSqNuRcvlgQMyDoD0NV\\n9b1b4fahcfZ9e1Dwxcz2junl381u7QtnDDDnKnKgEe3tQBc/4Tvwf/0Neh/+DGH/AOKo/wCE78H/\\nAPQ16H/4MYf/AIquf/4tB/1I3/kpR/xaD/qRv/JSgDvIJ4bq3iuLeWOaCVA8ckbBldSMggjggjnN\\nSVl6Jq2g6hb/AGfQdQ025gtERPLsJkdYVxhRhDhRhSAPb2rUoAKKKKACiiigAooooAKKKKACiiig\\nAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAC\\niiigAoorzd/COna74o1u1tvHvjKK+tZVlu7S31Fo47fzgXRUymNuOgBOAMGgD0iivP8A/hVn/U++\\nOf8Awcf/AGFc/wCJfDV54O1HwreWfjHxXefavEFpZzQ32pmSNo2JLAqAM52gc8YJ4oA9gorz/wCK\\nGn+Hbz/hGv7f0P8AtT7Tqsemw/6XJB5Hn/ef5D83+rXg/mK5vw/pfhfwT8UvE1/p6R6Touh6PDBf\\nmaV33TTOJVZNxYkbVVccEtgAHOaAPUNW8R6RoVxp9vqV9HBPqNwttaRkFmlkJAAAAJxkgFjwMjJG\\nRWpXkdp4Xb4s2+reIteju7WyvbdrXQbO6RT9liIRhdAAg72dQcZGVBGXQqRueHfGmqRRXXhvxFBA\\n3jS0ila3tUfyk1REXKSxuVCDecggdNrEqoBVQDsIdc0u41y50SK/gfU7aJZprUP86I3Qkfln03KT\\njcudCvE/EXinX9C8S6d4t1X4bXcF+yf2VB5GvLIJy5LKhjjQljkPgYxk85ITFyDwT4d8Y/F7x3/b\\n+n/bPsv9n+T++kj27rf5vuMM52r19KAPYKK+cNb8KeDb74Ez+NNJ8N/2XfPt8tft00/l4uREeWOD\\nkA9V4z7Zr6PoAKKKKACiiigDyf4ueG7PTPAnjfXIZJ2utX+wfaEdgUXypY0XaAMjIPOSfwrqNb/4\\nWP8A2xP/AGB/win9mfL5P2/7R533Ru3bPl+9uxjtis/42/8AJIdd/wC3f/0ojqn4r1vWvGN/e+B/\\nDWn3drEXa11bWby1KwQxFFLpED992VwB04ORwQ6gHEfDPX/HOoXuv2ugt4Yzd3suql79blBcCRyj\\nPABhjEGjxkjIJAPPA9D+Gfhvxh4R0yDQ9Zk0OTSLWKTyHs2mM5kaTf8AMWAXb8z9Bn7vvUnizwTM\\nllo+qeD7e0g17w+ipYicFhNbhChtmYnoVPBY5BzgruLCx4e8eza9b6vZnQbu18S6WjmfSZWO0sBm\\nMC427MPxgnHcgFRuIBh6fpn9t+PfixpPneT9utLG283bu2b7V13YyM4znGRXEa3YeJ9F8PX3hbw5\\n42g1Wx0/T7g6lbwaVBFDaW6o+9JJV3HznIYBfvk7mYjGTpz+GPGS6Nf+JNT0+TWpfEKRXGp6VYXE\\nmnz26RqdkQPJkQxM0bxld2SuCxG6tSTxJpcHg3UPDWkfDnxlplrd2klvmHQ84Lx+Xvb5wXbGMknJ\\nxyaAK9hpfjvTPhZba5Z+P/LtbXREu4bL+xoDtRYA6x7ycnAAG4j3xWxrPik/8K80O61bwdP4nkm0\\nqLUpJZIIfsiusQaVpGOfLYKWI+T5s7V5yBx66b4NuLWz/tb4YeOb6+htILaS6/s+aLzfKiWMNsWb\\nC8IOB+teka/4l8NWPgGGHxBDfeHtM1W0ezjgezYPAjIVCERh1jbZyFPp0+UgAHmGgabq4im8Van8\\nKNDvbe6tElgKXdpaWdvbbQ+4RMG+Y8sXckgcDaAQS/03V4NRufGEXwo0NNITRHVbf7XaTWwIJlF1\\nhAN/y8YUZI6NXT3uo+IvEHgZfB3hLwjrllCLSPT5b/XVjtfJhwqZ2nPm5QOGKgFcggZIFXJ7Xxvo\\nXhWXw3qGhWmu6D9iNgLnRpzDdxWypsLtFLkPKUOQqHG5SOcigC58JfDt5Y2t/wCJryLSrX/hIIrS\\n4hsdKhMcMEaxfLwejHecgZGQTk54x4PFX/CM/F7x3/xIdc1X7R/Z/wDyCrPz/K22/wDHyMZ3ceuD\\n6V2HhPXbefwa1roml6r9q0a0W2XT9UhNtMXSP93GzkbNzKEOQTgOpIGQKp/CrQb7TPD97q+s2kdr\\nrGu3suo3UQh2NEHPyxnknA5YAnK7yCM5yAcX4i8f/a/iP4L1H/hEvFcP2H7d/o02m7ZrjfCF/dLu\\n+bb1bpgUfFLx/wD238ONW07/AIRLxXYed5P+k3+m+VCmJkb5m3HGcYHuRXceJ7C8uPil4CvIbSeS\\n1tf7Q+0TJGSkW6BQu5hwuTwM9a5Px74qvvG3gy98OaZ4I8XQ3l88KRSXem+VEpEqN8z7sKMKeTwO\\n+BzQB7JWHP4L8K3VxLcXHhrRpp5XLySSWETM7E5JJK5JJ5zVfxJ4b1LW9Z0K9svEN3pkGnXHm3Nt\\nCG23q7kOx8OoxhCOQ33zx68f4w8X+I/EWqX/AIL8C6fdxahbuseo6pcL5CWsbYwUJ5ycn5gM4UlA\\n3DAAj+GfhPw3qdn4kvLjw/pV3ayeILz7BNJZRyI1uCoXymIwYwQwG3jg0fDbwn4bvv8AhLvtnh/S\\nrjyPEt5BD51lG/lxrs2ouRwoycAcCvQPCvh638KeF9O0O1bfHaRBC+CPMcnLvgk43MWOM8ZwOK87\\n0DX77wNqnimwv/CHie9N3rtzfQz6dYefE0Um0qd+4DOByO3Q85AAPSNI0nQdKe7TRdP02zcOqXK2\\nUKRncF3KH2gc7XBAPZs961K4P4dWl9d3/ibxXqenXenXGs3qrDbXKeWwtoU2RMyEkq5y27JwcAgA\\nEZ7ygAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK\\nKKKACiiigAooooAKKKKACiiigAooooAKKKKACvH4NI8Rap8XvHf9geKP7D8v+z/O/wBAjufOzb/L\\n98jbjDdOu72r2CvJ5fE2neAPiv4quvExnsbHW4rSWwu/JaSOXyY9jr8gJDAt0x0GTjK5ANj/AIRL\\n4h/9FP8A/KBb/wCNY+t+CPHdxqPhua88U/8ACQWtnrdrdTW/9nwWnlIhJaXcGy2BkbR13e1bH/C7\\nfh5/0MP/AJJXH/xuqeq/G7wl/ZdwugX8mpaw6bLGzSynJmmbhBgquRuIyAc4zjJwKANTxv4b8San\\n4j8N654ak0pbrSPtWU1JpAjeaip0QZOAG7jt1rh7HTb8fErxJaeONJ0rV2vdKh1xrbTYZJcvbN5U\\naxq+CWI3gqc7sgZwSDsWvgHS7HwXoEPjzxNfRW8FottcWFzqn2ezkcl5FjYBvmZMhQQ3IhXAwMVl\\n6Rqvg/wz8Sbu+0e5jXwvovhxbWa5t/MuYoZZbveE3jcWJL54J/iH8JwAV1srG4t/Cuo2njPx4+j6\\n/cNafa5Na2NbT4IjjMYjJYs6uuQdo25yQQa2NIsdF03xvrdrqjazrNv4Yt4tQk1XW70XP2OUoXAh\\njC7sFCWJ5+aJeMqprn7nxV8MrT4eXXh+18R3dwLa4lvtMSC2lgltnEhlijhlaJihBO3zGyfmY5AI\\nA6T4S+MfCrada6PFrX2vxLq0st/fD7LLH5ly4Mkn8OwbVXb8pAOzIHNAHKXPizxH4r8fwa1H4Rjv\\nLfTdMbVNG026bbK0JnjRpwADulZVbap4HysoYgb+v+Huv2OreOfHuvo0ltYTW+mXO67XyTGn2ZiS\\n27gADnOcEcgkEGtT/m4X/uVP/busPx5r0Ot39/4M8CxWk/iTVH+z6zdJbjbDbqm1jLLjBIDBP4iv\\nzKMPtFAHGWmt6dffstajpNtcb77TfK+1xbGHl+Ze7k5IwcgZ4Jx3r6Prxfwta+D/AAt428b+HNWu\\nNKg0xYtLijh1N4VWfZBksVbCs24hiQPvHPeu4+HXia88V6Pqeo3B8y0Gq3MWnT+SY/PtQwMbYIGc\\nZK5wPu4PzAmgDsKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooo\\noAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiig\\nAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAKepaTpus262+qafaX0CuHWO6hWVQ2CMgM\\nCM4JGfc0abpOm6Nbtb6Xp9pYwM5do7WFYlLYAyQoAzgAZ9hVyigAooooAy5/DmkXWsy6tcWMc15L\\nZHT5GkJZXty24xlCdpBPtnt0o0Dw5pHhbS103RbGO0tA5fYpLFmPUszElj0GSTwAOgFalFAGXqXh\\nrQdZuFuNU0TTb6dUCLJdWqSsFyTgFgTjJJx7mtCCCG1t4re3ijhgiQJHHGoVUUDAAA4AA4xUlFAB\\nRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFF\\nFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUU\\nUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB//Z\"]"},"message":"提交成功","result":true,"returnCode":"200"}
                console.log(data.data.imgBase64)
                sessionStorage.setItem('imgBase64', data.data.imgBase64)
                window.open(`#/order/allOrders/img`)

                //logisticsPrintRequest(param).then(response=>{
                //  console.log(response)
                //})
              }else {
                param.localPrintStatus=0;
                console.log(param)
                logisticsPrintRequest(param).then(response=>{
                  if(response.code === 200){
                    this.saveSuccess(response.msg);
                  }else{
                    message.error(response.msg);
                  }
                })
              }
            });
          })
        }
      });
  }

  handleChange = value => {
  };

  saveSuccess = (msg) => {
    const {currentIndex, listID} = this.state;
    const _this=this;
    if(currentIndex === listID.length-1){
      Modal.success('操作成功');
      this.setState({
        handlePrintingClick:true
      })
    }else{
      const next = this.handleSwitch
      Modal.confirm({
        title: '操作成功',
        content: msg,
        okText: '处理下一条',
        cancelText: '取消',
        async onOk() {
          next(1);
        },
        onCancel() {},
      });
    }

  }



  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  }

  // onChange = (value, selectedOptions) => {
  //   this.setState({
  //     cityparam:{
  //       province:value[0],
  //       city:value[1],
  //       area:value[2],
  //     }
  //   })
  // };

  onProductChange = (value, selectedOptions) => {
    // 对应产品
    console.log(value, selectedOptions,"123");
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const {
      PRODUCTCLASSIFICATION,
      loading,
      detail,
      productList,
      currentIndex,
      listID,
      handlePrintingClick,
    } = this.state;

    console.log(listID,"listID")

    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const formAllItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };

    console.log(detail,"detaildetaildetail")

    return (
      <Panel title="发货配置" back="/order/AllOrders">
        <div style={{background:"#fff",marginBottom:10,padding:"10px 10px 10px 20px"}}>
          <Button style={{marginRight:10}} type="primary" onClick={this.handleSubmit} loading={loading}>
            保存
          </Button>
          <Button style={{marginRight:10}} disabled={handlePrintingClick} type="primary" onClick={this.handlePrinting} loading={loading}>
            保存并打印
          </Button>
          <Button icon="reload" onClick={this.handleSubmit} loading={loading}>
            重置
          </Button>
          <Button
            icon="right"
            onClick={ currentIndex === listID.length-1 ? "" : ()=>this.handleSwitch(1)}
            style={{float:"right"}}
            disabled={ currentIndex === listID.length-1 ? true : false }
          >
          </Button>
          <Button
            icon="left"
            onClick={ currentIndex != 0 ? ()=>this.handleSwitch(0) : ""}
            disabled={ currentIndex != 0 ? false : true }
            style={{float:"right",marginRight:5}}
          >
          </Button>
        </div>
        <Form style={{ marginTop: 8 }}>
          <Card title="" className={styles.card} bordered={false}>
            <Row gutter={24}>
              <Col span={24}>
                <FormDetailsTitle
                  title="客户信息"
                />
              </Col>
              <div style={{display: 'flow-root', clear: 'both'}}>
                <Col span={12}>
                  <FormItem {...formAllItemLayout} label="姓名" style>
                    <span>{detail.userName}</span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formAllItemLayout} label="手机号">
                    <span>{detail.userPhone}</span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formAllItemLayout} label="收货地址">
                    <span>{detail.userAddress}</span>
                  </FormItem>
                </Col>
              </div>
              <Col span={12}>
                <FormDetailsTitle
                  title="发货配置"
                />
                <FormItem {...formAllItemLayout} label="对应产品">
                  {getFieldDecorator('productType', {
                    initialValue: detail.productType ? [...detail.productType.split("/"),detail.productName] : "",
                    rules: [
                      {
                        required: true,
                        message: '请选择对应产品',
                      },
                    ],
                  })(
                    <Cascader
                      options={productList}
                      fieldNames={{ label: 'value'}}
                      onChange={(value, selectedOptions)=>{
                        console.log("123")
                      }}
                    ></Cascader>
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="类型">
                  {getFieldDecorator('orderType', {
                    initialValue: parseInt(detail.orderType),
                    rules: [
                      {
                        required: true,
                        message: '请选择类型',
                      },
                    ],
                  })(
                  <Select placeholder={"请选择类型"}>
                    {ORDERTYPE.map(item=>{
                      return (<Option value={item.key}>{item.name === "到付" ? "代收" : item.name}</Option>)
                    })}
                  </Select>
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="SN">
                  {getFieldDecorator('productCoding', {
                    initialValue: detail.productCoding,
                    rules: [
                      {
                        required: true,
                        message: '请输入SN',
                      },
                    ],
                  })(
                    <Input
                      placeholder="请输入SN"
                      onPressEnter={this.handleSubmit}
                    />
                   )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="物流公司">
                  {getFieldDecorator('logisticsCompany', {
                    initialValue: detail.logisticsCompany,
                    // rules: [
                    //   {
                    //     required: true,
                    //     message: '请选择物流公司',
                    //   },
                    // ],
                  })(
                  <Select placeholder={"请选择物流公司"}>
                    {Object.keys(LOGISTICSCOMPANY).map(key=>{
                      return (<Option value={LOGISTICSCOMPANY[key]}>{LOGISTICSCOMPANY[key]}</Option>)
                    })}
                  </Select>
                  )}
                </FormItem>
                <FormItem {...formAllItemLayout} label="物流单号">
                  {getFieldDecorator('logisticsNumber', {
                    initialValue: detail.logisticsNumber,
                    // rules: [
                    //   {
                    //     required: true,
                    //     message: '请输入物流单号',
                    //   },
                    // ],
                  })(<Input placeholder="请输入物流单号" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                {/* <div style={{height:287}}></div> */}
                <div style={tipsStyle}>如您需要此订单进入自动化流程，请打开本开关</div>
                {/* <FormItem {...formAllItemLayout} label="设备提醒">
                  {getFieldDecorator('product', {
                    initialValue: 1,
                  })(
                    <Radio.Group>
                      <Radio value={1}>开</Radio>
                      <Radio value={0}>关</Radio>
                    </Radio.Group>
                  )}
                </FormItem> */}
                <FormItem {...formAllItemLayout} label="发货提醒">
                  {getFieldDecorator('smsConfirmation', {
                    initialValue: detail.smsConfirmation || 1,
                  })(
                    <Radio.Group>
                      <Radio value={1}>开</Radio>
                      <Radio value={0}>关</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                {/* <FormItem {...formAllItemLayout} label="签收提醒">
                  {getFieldDecorator('product', {
                    initialValue: detail.product,
                  })(
                    <Radio.Group value={1}>
                      <Radio value={1}>开</Radio>
                      <Radio value={0}>关</Radio>
                    </Radio.Group>
                  )}
                </FormItem> */}
                <FormItem {...formAllItemLayout} label="物流订阅">
                  {getFieldDecorator('shipmentRemind', {
                    initialValue: detail.shipmentRemind || 1,
                  })(
                    <Radio.Group>
                      <Radio value={1}>开</Radio>
                      <Radio value={0}>关</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                {/* <FormItem {...formAllItemLayout} label="备注信息">
                  {getFieldDecorator('orderNote')(
                    <TextArea rows={4} />
                  )}
                </FormItem> */}
              </Col>
            </Row>

          </Card>

        </Form>
      </Panel>
    );
  }
}

export default LogisticsConfiguration;
