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
    {"name":"待审核",key:1},
    {"name":"已审核",key:2},
    {"name":"已发货",key:3},
    {"name":"在途中",key:4},
    {"name":"已签收",key:4},
    {"name":"跟进中",key:4},
    {"name":"已激活",key:4},
    {"name":"全部",key:null},
]
 

export const ORDERTYPPE = [
    {name:"全部",key:null},
    {name:"免押",key:1},
    {name:"到付",key:2},
    {name:"收费",key:3},
    {name:"免费",key:4},
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
    {name:"免押",key:2},
    {name:"到付",key:3},
    {name:"收费",key:4},
    {name:"其他",key:5},
]
// 订单来源 
export const ORDERSOURCE = [
    {name:"新增",key:1},
    {name:"导入",key:2},
    {name:"客户",key:3},
    {name:"销售",key:4},
    {name:"电销",key:5},
    {name:"网销",key:6},
    {name:"地推",key:7},
]

// 订单来源 
export const TIMETYPE = [
    {name:"跟进时间",key:1},
    {name:"下单时间",key:2},
    {name:"物流打印时间",key:3},
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
    "SUNING": "苏宁"
}


// 支付公司
export const paymentCompany = [{"name":"支付宝","key":0},{"name":"财付通","key":1},{"name":"银联商务","key":2},{"name":"拉卡拉","key":3},{"name":"瑞银信","key":4},{"name":"银盛支付","key":5},{"name":"开店宝","key":6},{"name":"通联支付","key":7},{"name":"海科融通","key":8},{"name":"随行付","key":9},{"name":"易生支付","key":10},{"name":"上海汇付","key":11},{"name":"福建国通星驿","key":12},{"name":"现代金融控股（成都）","key":13},{"name":"嘉联支付","key":14},{"name":"中付支付","key":15},{"name":"畅捷通支付","key":16},{"name":"付临门支付","key":17},{"name":"乐刷支付","key":18},{"name":"卡友支付","key":19},{"name":"快钱支付","key":20},{"name":"盛付通","key":21},{"name":"钱袋宝","key":22},{"name":"付费通","key":23},{"name":"捷付睿通","key":24},{"name":"天翼电子商务","key":25},{"name":"联通支付","key":26},{"name":"中移电子商务","key":27},{"name":"钱宝","key":28},{"name":"电银信息技术","key":29},{"name":"腾付通","key":30},{"name":"易通金服支付","key":31},{"name":"合利宝","key":32},{"name":"资和信","key":33},{"name":"平安付电子支付","key":34},{"name":"联动优势","key":35},{"name":"顺丰恒通支付","key":36},{"name":"杉德支付","key":37},{"name":"易宝支付","key":38},{"name":"迅付信息科技","key":39},{"name":"富友支付","key":40},{"name":"中汇电子支付","key":41},{"name":"广东盛迪嘉","key":42},{"name":"新生支付","key":43},{"name":"广东信汇电子商务","key":44},{"name":"网银在线（北京）科技","key":45},{"name":"广州银联网络支付","key":46},{"name":"北京数字王府井科技","key":47},{"name":"北京银联商务","key":48},{"name":"易票联支付","key":49},{"name":"深圳市深银联易办事金融服务","key":50},{"name":"深圳市银联金融网络","key":51},{"name":"上海申鑫电子支付股份","key":52},{"name":"北京恒信通电信服务","key":53},{"name":"北京和融通支付科技","key":54},{"name":"山西易联数据处理","key":55},{"name":"山东运达电子商务","key":56},{"name":"广东汇卡商务服务","key":57},{"name":"成都支付通新信息技术服务","key":58},{"name":"广东银结通电子支付结算","key":59},{"name":"宁波银联商务","key":60}]
// 产品类型
export const productType = [
    {"name":"MPOS","key":0},
    {"name":"EPOS","key":1},
    {"name":"大POS","key":2},
    {"name":"扫码终端","key":3},
    {"name":"扫脸终端","key":4},
    {"name":"聚合支付","key":5},
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