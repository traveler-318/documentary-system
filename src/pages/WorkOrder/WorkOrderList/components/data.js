

// 状态
export const ORDERSTATUS = [
  {"name":"待回复",key:0},
  {"name":"已回复",key:1},
  {"name":"已完成",key:2},
]

export function currentTime() {
  var myDate = new Date();
  var year = myDate.getFullYear();
  var month = myDate.getMonth()+1;
  var day = myDate.getDate();
  var hour = myDate.getHours();
  var minute = myDate.getMinutes();
  var second = myDate.getSeconds();
  return year+'_'+month+'_'+day+'_ '+hour+':'+minute+':'+second;
}
// 物流查询时使用
export function getLogisticsQuery() {
  return {
    "status": "200",
    "msg": "success",
    "result": {
      "SFEXPRESS": "顺丰速运",
      "HTKY": "百世快递",
      "ZTO": "中通快递",
      "STO": "申通快递",
      "YTO": "圆通速递",
      "YUNDA": "韵达速递",
      "CHINAPOST": "邮政快递包裹",
      "EMS": "EMS",
      "TTKDEX": "天天快递",
      "JD": "京东物流",
      "QFKD": "全峰快递",
      "GTO": "国通快递",
      "DEPPON": "德邦",
      "ANXINDA": "安信达快递",
      "BSKY": "百世快运",
      "SUNING": "苏宁",
      "NSF": "新顺丰(NSF)",
      "ZYKD": "众邮快递",
      "JITU": "极兔速递",
    }
  }
}
