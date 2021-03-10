
import request from '@/utils/request';
import func from '@/utils/Func';

// 客户模块列表
export async function getDataInfo(type,params) {
  return request(`/api/client_info/clientinfo/`+type, {
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
  const { salesman, file, clientStatus,clientLevel,createTime,province,city,area,queryUrlKey } = params;
  const formData = new FormData();
  if(queryUrlKey === 'list'){
    formData.append('salesman', salesman);
    formData.append('clientLevel', clientLevel);
    formData.append('clientStatus', clientStatus);
    formData.append('province', province);
    formData.append('city', city);
    formData.append('area', area);
  }
  if(createTime){
    formData.append('createTime', createTime);
  }
  formData.append('file', file);
  return request('/api/client_info/clientinfo/importClient', {
    method: 'POST',
    body: formData,
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

//领取客户
export async function receive(params) {
  return request('/api/client_info/clientinfo/receive', {
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

//修改
export async function updateData(params) {
  return request('/api/client_info/clientinfo/update', {
    method: 'POST',
    body: params,
  });
}

//跟进
export async function clientFollow(params) {
  return request('/api/client_info/clientinfo/clientFollow', {
    method: 'POST',
    body: params,
  });
}

export async function queryCreator() {
  return request('/api/client_info/clientinfo/creator', {
    method: 'POST',
  });
}

//客户订单
export async function clientOrder(params) {
  return request(`/api/client_info/clientinfo/clientOrder`, {
    method: 'POST',
    body: params,
  });
}
//客户归属日志
export async function clientOperationRecord(params) {
  return request(`/api/client_operation_record/record/list`, {
    method: 'POST',
    body: params,
  });
}
