// 订单状态
// export const ORDERSTATUS = [
//     {"name":"全部",key:null},
//     {"name":"已授权",key:1},
//     {"name":"已解冻",key:2},
//     {"name":"已扣款",key:3},
//     {"name":"未授权",key:0},
// ]

// 订单状态
export const ORDERSTATUS = [
    {"name":"待审核",key:'0'},
    {"name":"已初审",key:'1'},
    {"name":"已终审",key:'2'},//已审核
    {"name":"已发货",key:'3'},
    {"name":"在途中",key:'4'},
    {"name":"已签收",key:'5'},
    {"name":"跟进中",key:'6'},
    {"name":"已激活",key:'7'},
    {"name":"退回中",key:'11'},
    {"name":"已退回",key:'8'},
    {"name":"已取消",key:'9'},
    {"name":"已过期",key:'10'},
    {"name":"全部",key:null},
]


export const ORDERTYPPE = [
    {name:"全部",key:null},
    {name:"免费",key:1},
    {name:"到付",key:2},
    {name:"收费",key:3},
    {name:"免押",key:4},
    {name:"其他",key:5},
]

export const GENDER = [
    {name:"未知",key:null},
    {name:"男",key:1},
    {name:"女",key:2},
]

// 订单类型
export const ORDERTYPE = [
    {name:"免费",key:1},
    {name:"到付",key:2},
    {name:"收费",key:3},
    {name:"免押",key:4},
    {name:"其他",key:5},
]
// 订单来源
export const ORDERSOURCE = [
    {name:"全部",key:null},
    {name:"新增",key:1},
    {name:"导入",key:2},
    {name:"H5扫码",key:3},
    {name:"销售",key:4},
    {name:"电销",key:5},
    {name:"网销",key:6},
    {name:"地推",key:7},
    {name:"免押宝",key:8},
]

// 订单来源
export const TIMETYPE = [
    {name:"跟进时间",key:1},
    {name:"下单时间",key:2},
    {name:"物流打印时间",key:3},
]

// 物流状态
export const LOGISTICSSTATUS = [
    {"name":"全部",key:null},
    {"name":"单号错误",key:'-1'},
    {"name":"暂无轨迹",key:'0'},
    {"name":"快递收件",key:'1'},
    {"name":"在途中",key:'2'},
    {"name":"已签收",key:'3'},
    {"name":"问题件",key:'4'},
    {"name":"疑难件",key:'5'},
    {"name":"退件签收",key:'6'},
    {"name":"快递揽件",key:'7'}
]

// 物流 LogisticsCompany

export const LOGISTICSCOMPANY = {
    "SF": "顺丰速运",
    "HTKY": "百世快递",
    "ZTO": "中通快递",
    "STO": "申通快递",
    "YTO": "圆通速递",
    "YD": "韵达速递",
    "YZPY": "邮政快递包裹",
    "EMS": "EMS",
    "HHTT": "天天快递",
    "JD": "京东物流",
    "QFKD": "全峰快递",
    "GTO": "国通快递",
    "DBL": "德邦",
    "ZJS": "宅急送",
    "AXD": "安信达快递",
    "BTWL": "百世快运",
    "SUNING": "苏宁",
    "ZYKD": "众邮快递",
}


// 支付公司
export const paymentCompany = [
    {"name":"支付宝","key":0},
    {"name":"财付通","key":1},
    {"name":"银联商务","key":2},
    {"name":"拉卡拉","key":3},
    {"name":"瑞银信","key":4},
    {"name":"银盛","key":5},
    {"name":"开店宝","key":6},
    {"name":"通联","key":7},
    {"name":"海科融通","key":8},
    {"name":"随行付","key":9},
    {"name":"易生","key":10},
    {"name":"汇付","key":11},
    {"name":"国通星驿","key":12},
    {"name":"现代金融","key":13},
    {"name":"嘉联","key":14},
    {"name":"中付","key":15},
    {"name":"畅捷通","key":16},
    {"name":"付临门","key":17},
    {"name":"乐刷","key":18},
    {"name":"卡友","key":19},
    {"name":"快钱","key":20},
    {"name":"盛付通","key":21},
    {"name":"钱袋宝","key":22},
    {"name":"付费通","key":23},
    {"name":"捷付睿通","key":24},
    {"name":"天翼电子","key":25},
    {"name":"联通支付","key":26},
    {"name":"中移电子","key":27},
    {"name":"钱宝","key":28},
    {"name":"电银信息","key":29},
    {"name":"腾付通","key":30},
    {"name":"易通金服","key":31},
    {"name":"合利宝","key":32},
    {"name":"资和信","key":33},
    {"name":"平安付","key":34},
    {"name":"联动优势","key":35},
    {"name":"顺丰恒通","key":36},
    {"name":"杉德","key":37},
    {"name":"易宝","key":38},
    {"name":"迅付","key":39},
    {"name":"富友","key":40},
    {"name":"中汇电子","key":41},
    {"name":"盛迪嘉","key":42},
    {"name":"新生支付","key":43},
    {"name":"广东信汇","key":44},
    {"name":"网银在线","key":45},
    {"name":"广州银联网络","key":46},
    {"name":"王府井","key":47},
    {"name":"银联商务","key":48},
    {"name":"易票联","key":49},
    {"name":"深银联易","key":50},
    {"name":"深圳市银联金融","key":51},
    {"name":"上海申鑫电子","key":52},
    {"name":"北京恒信通","key":53},
    {"name":"和融通","key":54},
    {"name":"易联","key":55},
    {"name":"山东运达","key":56},
    {"name":"广东汇卡","key":57},
    {"name":"支付通","key":58},
    {"name":"银结通","key":59},
    {"name":"宁波银联商务","key":60}]
// 产品类型
export const productType = [
    {"name":"传统POS","key":0},
    {"name":"电签POS","key":1},
    {"name":"MPOS","key":2},
    {"name":"智能机","key":3},
    {"name":"自备机","key":4},
    {"name":"其他","key":5},
]
// 产品序列号
export const productID = [
    {"name":"押金-99","key":0},
]
// 金额
export const amountOfMoney = [
    {"name":"99","key":0},
    {"name":"1999","key":1},
]

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
      "NSF": "新顺丰(NSF)"
    }
  }
}

// 导出
export function exportData() {
  return [
    {value:"姓名",code:"user_name"},
    {value:"手机号",code:"user_phone"},
    {value:"收货地址",code:"user_address"},
    {value:"产品分类",code:"product_type"},
    {value:"产品型号",code:"product_name"},
    {value:"SN",code:"product_coding"},
    {value:"订单状态",code:"confirm_tag"},
    {value:"订单类型",code:"order_type"},
    {value:"订单来源",code:"order_source"},
    {value:"销售",code:"salesman"},
    {value:"快递公司",code:"logistics_company"},
    {value:"快递单号",code:"logistics_number"},
    {value:"下单时间",code:"create_time"},
  ]
}

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
