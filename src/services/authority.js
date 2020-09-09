import { stringify } from 'qs';
import func from '../utils/Func';
import request from '../utils/request';

// =====================授权配置===========================


export async function list(params) {
  return request(`/api/logistics/authorization/list?${stringify(params)}`);
}

export async function remove(params) {
  return request('/api/logistics/authorization/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function submit(params) {
  return request('/api/logistics/authorization/submit', {
    method: 'POST',
    body: params,
  });
}

export async function detail(params) {
  return request(`/api/logistics/authorization/detail?${stringify(params)}`);
}
