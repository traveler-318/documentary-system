import request from '../utils/request';

//授权查看列表【上级】
export async function superiorlist(params) {
  return request('/external/authorized/superiorlist', {
    method: 'POST',
    body: params,
  });
}
//授权查看列表【上级】
export async function superiorupdate(params) {
  return request('/external/authorized/superiorupdate', {
    method: 'POST',
    body: params,
  });
}

//授权配置列表【下级】
export async function subordinateList(params) {
  return request('/external/authorized/list', {
    method: 'POST',
    body: params,
  });
}

//修改【下级】
export async function subordinateUpdate(params) {
  return request('/external/authorized/update', {
    method: 'POST',
    body: params,
  });
}
