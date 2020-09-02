import { stringify } from 'qs';
import func from '../utils/Func';
import request from '../utils/request';

export async function list(params) {
  return request(`/api/blade-resource/sms/list?${stringify(params)}`);
}

export async function submit(params) {
  return request('/api/blade-resource/sms/submit', {
    method: 'POST',
    body: params,
  });
}

export async function detail(params) {
  return request(`/api/blade-resource/sms/detail?${stringify(params)}`);
}

export async function remove(params) {
  return request('/api/blade-resource/sms/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function enable(params) {
  return request('/api/blade-resource/sms/enable', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function send(params) {
  return request('/api/blade-resource/sms/endpoint/send-message', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
