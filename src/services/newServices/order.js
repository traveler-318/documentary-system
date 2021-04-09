
import { stringify } from 'qs';
import request from '../../utils/request';
import func from '../../utils/Func';

export async function getList(params) {
  return request(`/api/order/order/warehouslist`, {
    method: 'POST',
    body: params,
  });
}

//销售订单列表和售后列表
export async function getList1(params) {
  return request(`/api/order/order/list`, {
    method: 'POST',
    body: params,
  });
}

// 下属订单订单列表
export async function getPermissions(params) {
  return request(`/api/order/permissions/list`, {
    method: 'POST',
    body: params,
  });
}
// 下属订单搜索条件
export async function getCurrenttree() {
  return request(`/api/order/permissions/currenttree`);
}
// 组织获取业务员列表
export async function getCurrentsalesman(id) {
  return request(`/api/order/permissions/currentsalesman/${id}`);
}

export async function getDetails(params) {
  return request(`/api/order/order/detail?${stringify(params)}`);
}

export async function createData(params) {
  return request('/api/order/order/save', {
    method: 'POST',
    body: params,
  });
}

export async function updateData(params) {
  return request('/api/order/order/update', {
    method: 'POST',
    body: params,
  });
}

export async function orderFollowing(params) {
  return request('/api/order/order/orderFollowing', {
    method: 'POST',
    body: params,
  });
}


export async function deleteData(params) {
  return request('/api/order/order/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function getRegion() {
  return request(`/api/blade-system/dict-biz/dictionary?${stringify({code:"region"})}`);
}

// 批量提醒接口
export async function updateRemind(params) {
  return request('/api/order/order/updateReminds', {
    method: 'POST',
    body: params,
  });
}
// 设备
export async function equipment(params) {
  return request('/api/order/order/updateOrderAttribution', {
    method: 'POST',
    body: params,
  });
}
// 更新物流信息
export async function updateLogistics(params) {
  return request('/api/order/order/updateLogistics', {
    method: 'POST',
    body: params,
  });
}
// 签收提醒
export async function logisticsRemind(params) {
  return request('/api/order/order/logisticsRemind', {
    method: 'POST',
    body: params,
  });
}
export async function logisticsSubscription(params) {
  return request('/api/order/order/update', {
    method: 'POST',
    body: params,
  });
}

// 状态变更
export async function updateConfirmTag(params) {
  return request('/api/order/order/updateConfirmTag', {
    method: 'POST',
    body: params,
  });
}
// 逾期开关
export async function updateVoiceStatus(params) {
  return request('/api/order/order/updateVoiceStatus', {
    method: 'POST',
    body: params,
  });
}
// /order/order/logisticsSubscription

// 首次打印
export async function logisticsPrintRequest(params) {
  return request('/api/order/order/printRequest', {
    method: 'POST',
    body: params,
  });
}
// 首次打印
export async function logisticsRepeatPrint(params) {
  return request('/api/order/order/repeatPrint', {
    method: 'POST',
    body: params,
  });
}
// 本地打印
export async function localPrinting(params) {
  return request('/api/order/order/getOriginalDataJson', {
    method: 'POST',
    body: params,
  });
}

// 提醒
export async function updateReminds(params) {
  return request('/api/order/order/updateReminds', {
    method: 'POST',
    body: params,
  });
}

// 审核
export async function toExamine(params) {
  return request('/api/order/order/batchUpdateConfirmTag', {
    method: 'POST',
    body: params,
  });
}

// 详情关联订单
export async function orderDetail(params) {
  return request('/api/order/order/orderDetail', {
    method: 'POST',
    body: params,
  });
}

// 详情物流详情
export async function logisticsQuery(params) {
  return request('/api/order/order/logisticsQuery', {
    method: 'POST',
    body: params,
  });
}

// 产品分类
export async function productTreelist(params) {
  return request('/api/business/paypany/treelist', {
    method: 'POST',
    body: params,
  });
}

// 检查是否设置同步账号
export async function synCheck(params = {}) {
  return request(`/api/order/mall/syn_check`);
}

// 同步账号进行发送短信
export async function synSmsCertification(params = {}) {
  return request('/api/order/mall/syn_sms_certification', {
    method: 'POST',
    body: params,
  });
}

// 同步账号进行发送短信
export async function synbinding(params = {}) {
  return request('/api/order/mall/synbinding', {
    method: 'POST',
    body: params,
  });
}


export async function getVCode(name,tenantId,send_type) {
  return request("/api/order/order/getVCode?userName=" + name + '&tenantId=' + tenantId +'&send_type=' + send_type, {
    method: 'GET',
  });
}


// 同步账号进行发送短信
export async function syndata(params = {}) {
  return request('/api/order/mall/syndata', {
    method: 'POST',
    body: params,
  });
}

// 获取分组对应的销售
export async function getSalesmanLists(id) {
  return request(`/api/agent/salesman/group/${id}`, {
    method: 'get',
  });
}

// 获取操作日志详情
export async function getRecord(id) {
  return request(`/api/tracking_process/record/detail/${id}`, {
    method: 'get',
  });
}

// 订单发送短息记录列表
export async function getFindSmsRecord(id) {
  return request(`/api/order/order/findSmsRecord/${id}`, {
    method: 'get',
  });
}
// 订单语音接听记录列表
export async function getFindVoiceRecord(id) {
  return request(`/api/order/order/findVoiceRecord/${id}`, {
    method: 'get',
  });
}

// 物流订阅
export async function subscription(params) {
  return request('/api/order/order/logisticsSubscription', {
    method: 'POST',
    body: params,
  });
}
// 删除订阅
export async function deleteLogisticsSuber(params) {
  return request('/api/order/order/deleteLogisticsSuber', {
    method: 'POST',
    body: params,
  });
}

// 发货批量订阅
export async function batchLogisticsSubscription(params) {
  return request('/api/order/order/batchLogisticsSubscription', {
    method: 'POST',
    body: params,
  });
}


// 导出电话展示
export async function getPhone() {
  return request('/api/order/order/getPhone');
}
// 销售
export async function salesmanList(params) {
  return request("/api/agent/salesman/list",{
    method: 'POST',
    body: params,
  });
}

// tab显示
export async function menuTab(params) {
  return request("/api/menu_tab/detail",{
    method: 'POST',
    body: params,
  });
}

// 文本导入
export async function importText(params) {
  return request("/api/order/order/importText",{
    method: 'POST',
    body: params,
  });
}

// 获取订单菜单列表头
export async function orderMenuHead(params) {
  return request(`/api/menu_config/menulistconfig/orderMenuHead`,{
    method: 'POST',
    body: params,
  });
}
// 菜单列表头总模板
export async function orderMenuTemplate(params) {
  return request(`/api/menu_config/menulistconfig/orderMenuTemplate`,{
    method: 'POST',
    body: params,
  });
}
// 订单菜单列表头修改
export async function updateOrderHead(params) {
  return request("/api/menu_config/menulistconfig/updateOrderHead",{
    method: 'POST',
    body: params,
  });
}

// 耗时检测
export async function ordertimeinfotask(params) {
  return request("/api/order_time/ordertimeinfotask/list",{
    method: 'POST',
    body: params,
  });
}

// 批量发货时间
export async function addDeliveryTime(params) {
  return request("/api/order/order/addDeliveryTime",{
    method: 'POST',
    body: params,
  });
}


// 订单导入
export async function importOrder(params) {
  const { salesman, file, orderType,payAmount,createTime,productName,productType,payPanyId,productTypeId,productId } = params;
  const formData = new FormData();
  formData.append('salesman', salesman);
  formData.append('orderType', orderType);
  formData.append('payAmount', payAmount);
  formData.append('productName', productName);
  formData.append('productType', productType);
  formData.append('payPanyId', payPanyId);
  formData.append('productTypeId', productTypeId);
  formData.append('productId', productId);
  if(createTime){
    formData.append('createTime', createTime);
  }
  formData.append('file', file);
  return request('/api/order/order/importOrder', {
    method: 'POST',
    body: formData,
  });
}


