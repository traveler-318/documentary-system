
import { stringify } from 'qs';
import request from '../../utils/request';
// import func from '../utils/Func';

export async function getList(params) {
  return request(`/api/order/order/list?${stringify(params)}`);
    // return request('/order/order/list', {
    //   method: 'POST',
    //   body: params,
    // });
}