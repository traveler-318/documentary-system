
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
export async function getDetail(params) {
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
