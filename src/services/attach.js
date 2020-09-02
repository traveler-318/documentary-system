import { stringify } from 'qs';
import func from '../utils/Func';
import request from '../utils/request';

export async function list(params) {
  return request(`/api/blade-resource/attach/list?${stringify(params)}`);
}

export async function submit(params) {
  return request('/api/blade-resource/attach/submit', {
    method: 'POST',
    body: params,
  });
}

export async function detail(params) {
  return request(`/api/blade-resource/attach/detail?${stringify(params)}`);
}

export async function remove(params) {
  return request('/api/blade-resource/attach/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
