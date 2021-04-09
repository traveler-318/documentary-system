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

//新增【上级】
export async function superiorSave(params) {
  return request('/api/external/authorized/submit', {
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
//发送短信验证
export async function smsSend(params) {
  return request('/api/sms/send', {
    method: 'POST',
    body: params,
  });
}

//操作开关
export async function switchverification(params) {
  return request('/api/external/authorized/switchverification', {
    method: 'POST',
    body: params,
  });
}
//查看密钥
export async function lookkey(params) {
  return request('/api/external/authorized/lookkey', {
    method: 'POST',
    body: params,
  });
}

//查看详情
export async function detail(params) {
  return request('/api/external/authorized/detail', {
    method: 'POST',
    body: params,
  });
}

//获取代理公司列表
export async function authorizedcompanylist(params) {
  return request(`/api/external/authorized/authorizedcompanylist`, {
    method: 'POST',
    body: params,
  });
}
