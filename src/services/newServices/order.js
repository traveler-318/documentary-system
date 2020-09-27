
import { stringify } from 'qs';
import request from '../../utils/request';
import func from '../../utils/Func';

export async function getList(params) {
  return request(`/api/order/order/list`, {
    method: 'POST',
    body: params,
  });
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
  return request('/api/order/order/updateEquipment', {
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
// /order/order/logisticsSubscription

// 首次打印
export async function logisticsPrintRequest(params) {
  return request('/api/order/order/printRequest', {
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
  
}
