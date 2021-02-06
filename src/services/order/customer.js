
import request from '@/utils/request';
import func from '@/utils/Func';

// 客户模块列表
export async function getDataInfo(params) {
  return request(`/api/client_info/clientinfo/list`, {
    method: 'POST',
    body: params,
  });
}

//新建
export async function createData(params) {
  return request('/api/client_info/clientinfo/save', {
    method: 'POST',
    body: params,
  });
}

//删除
export async function deleteData(params) {
  return request('/api/client_info/clientinfo/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

//导入
export async function importClient(params) {
  return request('/api/client_info/clientinfo/importClient', {
    method: 'POST',
    body: params,
  });
}

// 导出客户Excel模板
export async function exportClientExcel() {
  return request('/api/client_info/clientinfo/exportClientExcel');
}

//转移客户
export async function moveSalesman(params) {
  return request('/api/client_info/clientinfo/moveSalesman', {
    method: 'POST',
    body: params,
  });
}

//客户放入公海
export async function putPool(params) {
  return request('/api/client_info/clientinfo/putPool', {
    method: 'POST',
    body: params,
  });
}

//更改 客户状态/客户级别
export async function statusOrLevel(params) {
  return request('/api/client_info/clientinfo/statusOrLevel', {
    method: 'POST',
    body: params,
  });
}

//查询详情
export async function getDetail(params) {
  return request('/api/client_info/clientinfo/detail', {
    method: 'POST',
    body: params,
  });
}
