/**
 * Created by Lenovo on 2020/9/8.
 */
 import { stringify } from 'qs';
import request from '../../utils/request';
 import func from '../../utils/Func';


// ============ 支付产品 ===============
export async function getPaypanyList(params) {
  return request(`/api/business/paypany/list`, {
    method: 'POST',
    body: params,
  });
}

export async function getAddSave(params) {
  return request('/api/business/paypany/save', {
    method: 'POST',
    body: params,
  });
}

export async function getPaypanyUpdate(params) {
  return request('/api/business/paypany/update', {
    method: 'POST',
    body: params,
  });
}

export async function getPaypanyRemove(params) {
  return request('/api/business/paypany/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

// ============ 产品类型 ===============
export async function getProductcategoryList(params) {
  return request(`/api/business/productcategory/list`, {
    method: 'POST',
    body: params,
  });
}
export async function getProductcategoryUpdate(params) {
  return request('/api/business/productcategory/update', {
    method: 'POST',
    body: params,
  });
}
export async function getProductcategorySave(params) {
  return request('/api/business/productcategory/save', {
    method: 'POST',
    body: params,
  });
}
export async function getProductcategoryRemove(params) {
  return request('/api/business/productcategory/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
// ============ 产品管理 ===============
export async function getProductattributeList(params) {
  return request(`/api/business/productattribute/list`, {
    method: 'POST',
    body: params,
  });
}

export async function getProductattributeAdd(params) {
  return request(`/api/business/productattribute/save`, {
    method: 'POST',
    body: params,
  });
}

export async function getProductattributeUpdate(params) {
  return request(`/api/business/productattribute/update`, {
    method: 'POST',
    body: params,
  });
}

export async function getProductattributeRemove(params) {
  return request('/api/business/productattribute/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function getImg(page,size) {
  return request(`/api/blade-resource/attach/list?current=`+page+`&size=`+size);
}

//获取代理列表
export async function getProductAgentlist(params) {
  return request(`/api/business/productattribute/agentlist`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 保存代理数据
 * @param params [id,productTypeId]
 * @returns {Promise<void>}
 */
export async function getProductAgentsave(params) {
  return request(`/api/business/productattribute/saveagent`, {
    method: 'POST',
    body: params,
  });
}
