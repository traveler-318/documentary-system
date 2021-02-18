
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
