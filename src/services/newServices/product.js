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

// ============ 产品类型 ===============
export async function getProductcategoryList(params) {
  return request(`/api/business/productcategory/list`, {
    method: 'POST',
    body: params,
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
