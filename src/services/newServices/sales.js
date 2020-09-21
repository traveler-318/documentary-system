/**
 * Created by Lenovo on 2020/9/8.
 */
 import { stringify } from 'qs';
import request from '../../utils/request';
 import func from '../../utils/Func';


// ============ 销售管理 ===============
export async function getList(params) {
  return request(`/api/agent/salesman/list?${stringify(params)}`);
}

export async function updateStatus(params) {
  return request("/api/agent/salesman/updateStatus",{
    method: 'POST',
    body: params,
  });
}

export async function getAddList(params) {
  return request('/api/agent/salesman/save', {
    method: 'POST',
    body: params,
  });
}

export async function getSubmit(params) {
  return request('/api/logistics/authorization/update', {
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

// ============ 分组 ===============
export async function getSalesmangroup(params) {
  return request('/api/agent/salesmangroup/list', {
    method: 'get',
    body: params,
  });
}
// ============ 新增分组 ===============
export async function getSalesmangroupSubmit(params) {
  return request('/api/agent/salesmangroup/save', {
    method: 'POST',
    body: params,
  });
}
