import { stringify } from 'qs';
import func from '../../utils/Func';
import request from '../../utils/request';

// =====================组织管理===========================

export async function list(params) {
  return request(`/api/blade-system/organization/list?${stringify(params)}`);
}

export async function tree(params) {
  return request(`/api/blade-system/organization/tree?${stringify(params)}`);
}

export async function remove(params) {
  return request('/api/blade-system/organization/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function submit(params) {
  return request('/api/blade-system/organization/submit', {
    method: 'POST',
    body: params,
  });
}

export async function detail(params) {
  return request(`/api/blade-system/organization/detail?${stringify(params)}`);
}
