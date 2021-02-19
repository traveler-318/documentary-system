
import request from '@/utils/request';

// 客户模块列表
export async function getDataInfo(params) {
  return request(`/api/tracking/ordermaintenance/list`, {
    method: 'POST',
    body: params,
  });
}
//新建
export async function createData(params) {
  return request('/api/tracking/ordermaintenance/save', {
    method: 'POST',
    body: params,
  });
}
// 客户模块列表
export async function getDetails(params) {
  return request(`/api/tracking/ordermaintenance/detail?id=`+params.id, {
    method: 'GET'
  });
}

export async function getProductDetail(params) {
  return request(`/api/business/productattribute/detail`, {
    method: 'POST',
    body: params,
  });
}

//阶段更新
export async function processupdate(params) {
  return request('/api/tracking/ordermaintenance/processupdate', {
    method: 'POST',
    body: params,
  });
}
//跟进
export async function followupdate(params) {
  return request('/api/tracking/ordermaintenance/followupdate', {
    method: 'POST',
    body: params,
  });
}
export async function phrase() {
  return request(`/api/tracking/ordermaintenance/phrase`, {
    method: 'GET'
  });
}
export async function followway() {
  return request(`/api/tracking/ordermaintenance/followway`, {
    method: 'GET'
  });
}
