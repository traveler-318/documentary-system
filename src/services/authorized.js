import request from '../utils/request';
import func from '@/utils/Func';

//授权查看列表【上级】
export async function superiorlist(params) {
  return request('/api/external/authorized/superiorlist', {
    method: 'POST',
    body: params,
  });
}
//授权查看列表【上级】
export async function superiorupdate(params) {
  return request('/api/external/authorized/superiorupdate', {
    method: 'POST',
    body: params,
  });
}

//授权配置列表【下级】
export async function subordinateList(params) {
  return request('/api/external/authorized/list', {
    method: 'POST',
    body: params,
  });
}

//新增【下级】
export async function subordinateSave(params) {
  return request('/api/external/authorized/save', {
    method: 'POST',
    body: params,
  });
}

//修改【下级】
export async function subordinateUpdate(params) {
  return request('/api/external/authorized/update', {
    method: 'POST',
    body: params,
  });
}

export async function subordinateRemove(params) {
  return request('/api/external/authorized/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

