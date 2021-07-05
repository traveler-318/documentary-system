
import { stringify } from 'qs';
import request from '../../utils/request';
import func from '../../utils/Func';

export async function snmanagerList(params) {
  return request(`/api/tracking_sn_manager/snmanager/list`, {
    method: 'POST',
    body: params,
  });
}

export async function warehouseList(params) {
  return request(`/api/tracking_ware_house/warehouse/list`, {
    method: 'POST',
    body: params,
  });
}

export async function warehouseSave(params) {
  return request(`/api/tracking_ware_house/warehouse/save`, {
    method: 'POST',
    body: params,
  });
}

