import copy from 'copy-to-clipboard';
import { message } from 'antd';
export function setListData(data) {
    return {
        list:data.records,
        pagination:{
          total:data.total,
          current:data.current,
          pageSize:data.size,
        }
    }
}

export function randomNumber(len = 4) {
  // len 随机数长度 type = number
  // 生成1-9的随机数字
  let result = ""
  for(let i=0; i<len; i++){
    result += Math.ceil(Math.random()*9);
  }
  return result
}

export function randomLetters(len = 4) {
  // len 随机数长度 type = number
  // 生成随机字母
  /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz';
  var maxPos = $chars.length;
  var pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

export function copyToClipboard(text) {
  // text 需要复制的文字
  copy(text);
  message.success('复制成功，如果失败，请在输入框内手动复制.');
}