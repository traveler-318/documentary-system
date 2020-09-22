/**
 * Created by Lenovo on 2020/9/8.
 */
 import { stringify } from 'qs';
import request from '../../utils/request';
 import func from '../../utils/Func';


// ============ 销售管理 ===============
export async function getList(params) {
  //return request(`/api/agent/salesman/list?${stringify(params)}`,{
    //method: 'POST'
  //});
  return request("/api/agent/salesman/list",{
    method: 'POST',
    body: params,
  });
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

export async function getUpdate(params) {
  return request('/api/agent/salesman/update', {
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
    method: 'POST',
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
// ============ 删除分组 ===============
export async function getDeleteGroup(params) {
  return request(`/api/agent/salesmangroup/deleteGroup/${params}`, {
    method: 'POST',
  });
}