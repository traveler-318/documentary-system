
import { stringify } from 'qs';
import request from '../../utils/request';
import func from '../../utils/Func';

export async function getList(params) {
  return request(`/api/order/order/list?${stringify(params)}`);
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
