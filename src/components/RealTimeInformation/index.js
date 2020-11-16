import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {notification} from 'antd'
import { getCookie } from '../../utils/support';

let dataList = [];
let intervalDuration = 5000;
let timer = null;
let heartHandler = null;
let oncloseTimer = null;
let notifyKey = [] ;//'update-notify'
let dataParamCode = 200;

class RealTimeInformation extends Component {
  static propTypes = {
    
  };

  constructor(props) {
    super(props);
    this.state = {
      type: props.defaultActiveKey,
      tabs: [],
      active: {},
    };
  }

    componentDidMount(){
        var is_support = ("WebSocket" in window);
        if (is_support) {
            if(getCookie('userName')){
                this.initWebSocket();
            }else{
                this.resetData();
            }
        }else{
            console.log("您的浏览器不支持 WebSocket!")
        }
    } 

    componentWillUnmount(){
        this.resetData();
    }

    resetData = () =>{
        window.layoutSocket && window.layoutSocket.close();
        dataList = [];
        intervalDuration = 5000;
        clearTimeout(timer);
        timer = null;
        clearInterval(heartHandler);
        heartHandler = null;
        clearInterval(oncloseTimer);
        oncloseTimer = null;
        notifyKey = [];
        dataParamCode = 200;
    }

    initWebSocket = () => {
        // alert(process.env.NODE_ENV)
        // console.log(window.location.hostname,window.location.hostname === "47.102.204.79","判断环境")
        if(window.location.hostname === "47.102.204.79" || process.env.NODE_ENV === 'development'){
            window.layoutSocket = new WebSocket(`ws://47.102.204.79:9060/imserver/${getCookie('tenantId')}/${getCookie('userName')}`);
        }else{
            window.layoutSocket = new WebSocket(`ws://121.40.58.47:9060/imserver/${getCookie('tenantId')}/${getCookie('userName')}`);
        }
        // 链接成功
        window.layoutSocket.onopen = function () {
            console.log('websocket was connected');
            clearInterval(oncloseTimer);
            oncloseTimer = null;
            heartHandler = setInterval(() => {
                window.layoutSocket.send(JSON.stringify({"HeartBeat":1}))
            }, 60000)
        }
        //连接发生错误
        window.layoutSocket.onerror = function() {
            console.log("WebSocket连接发生错误");
        };
        //连接关闭
        window.layoutSocket.onclose = function() {
            console.log("WebSocket连接关闭");
        }
        
        window.layoutSocket.addEventListener("message", (event) => {
            
            let dataParam = JSON.parse(event.data);
            console.log(dataParam,"event");

            if(dataParam.code === 200){
                dataParamCode = 200;
                dataList.push(event.data);
                // console.log(!timer,"!timer!timer!timer!timer")
                if(!timer){
                    console.log("第一条数据")
                    timer = true;
                    // 获取第一次音频时长
                    intervalDuration = 1000;
                    this.outputInformation();
                    // if(JSON.parse(_data).type === 0){
                    //     this.outputInformation();
                    // }else{
                    //     let _data = dataList[0];
                    //     const texturl = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&per=0&text=" + encodeURI(JSON.parse(_data).data);      
                    //     const textAudio = new Audio(texturl);
                    //     textAudio.src = texturl;
                    //     textAudio.load();
                    //     textAudio.oncanplay = () => {  
                    //         // 获取音频时长
                    //         this.outputInformation();
                    //     }
                    // }
                }
            }else if(dataParam.code === 401){
                dataParamCode = 401;
                // 断开链接
                clearInterval(heartHandler);
                clearTimeout(timer);
                heartHandler = null;
                timer = null;
                dataList = [];
                intervalDuration = 5000;
                window.layoutSocket && window.layoutSocket.close();
                // window.layoutSocket && window.layoutSocket.close();
            }
        });

        window.layoutSocket.onclose =  (e) => {
            console.log("ws close", e);
            clearTimeout(timer);
            clearInterval(heartHandler);
            timer = null;
            heartHandler = null;
            // 断链重连
            // this.initWebSocket();
            if(!oncloseTimer && dataParamCode != 401){
                oncloseTimer = setInterval(()=>{
                    if(!heartHandler){
                        console.log("重新链接------")
                        if(getCookie('userName')){
                            this.initWebSocket()
                        }else{
                            console.log("断开链接------")
                            this.resetData();
                        }
                    }
                },8000)
            }
        }

    }

    outputInformation = () => {
        timer = setTimeout(() => {
            let _data = dataList[0];
            console.log("定时器响应",_data,intervalDuration);
            // 播放类型 0文字  1语音
            // console.log(JSON.parse(_data).type,JSON.parse(_data).type === 0,"播放类型")
            if(JSON.parse(_data).type === 0){
                intervalDuration = 1000;
                this.openNotification(JSON.parse(_data),1000);
            }else{
                const url = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&per=0&text=" + encodeURI(JSON.parse(_data).data);      
                const audio = new Audio(url);
                audio.src = url;
                audio.load();
                audio.oncanplay = () => {  
                    // 获取音频时长
                    // console.log("myVid.duration",audio.duration*1000);
                    intervalDuration = audio.duration*1000+10000;
                    this.openNotification(JSON.parse(_data),audio.duration*1000+10000);
                    audio.play();
                }
            }
            dataList.shift();
                
            // if(dataList.length <= 0){
            //     clearTimeout(timer);
            //     timer = null;
            // }
        }, intervalDuration);
    }

    

    openNotification = (data,time) => {
        notifyKey.push(data.id);
        console.log(notifyKey,"notifyKey1");
        notification.open({
            message:this.reactNode(),
          description: data.data,
          duration: null,
          key:data.id,
          onClose:()=>{
            if(dataList.length > 0){
                notifyKey.forEach((item, i) => {
                    if (item == data.id) {
                        notifyKey.splice(i, 1); // 从下标 i 开始, 删除 1 个元素
                    }
                })
                console.log(notifyKey,data.id,"notifyKey")
                let param = JSON.stringify({"id":data.id,"pushType":data.type});
                window.layoutSocket.send(param);
                this.outputInformation();
            }else{
                clearTimeout(timer);
                timer = null;
            }
          }
        });
        if(notifyKey.length < 3){
            this.outputInformation();
        }
    };

    reactNode = () => {
        return(
        <div>
            <span>新消息</span>
            <span style={{color: '#E6A23C',marginLeft:5,fontSize:'14px'}}>(确认消息请关闭弹窗)</span>
        </div>
        )
    }

    render() {
        
        return (
            <></>
        );
    }
}

export default RealTimeInformation;
