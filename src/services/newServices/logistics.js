/**
 * Created by Lenovo on 2020/9/8.
 */
// import { stringify } from 'qs';
import request from '../../utils/request';
 import func from '../../utils/Func';

export async function getList(params) {
  return request('/api/logistics/authorization/list', {
    method: 'get',
    body: params,
  });
}

export async function getAddList(params) {
  return request('/api/logistics/authorization/save', {
    method: 'POST',
    body: params,
  });
}

export async function getSubmit(params) {
  return request('/api/logistics/authorization/submit', {
    method: 'POST',
    body: params,
  });
}

export async function getRemove(params) {
  return request('/api/logistics/authorization/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
