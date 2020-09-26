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


