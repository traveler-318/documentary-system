/**
 * Created by Lenovo on 2020/9/8.
 */
import { stringify } from 'qs';
import request from '../../utils/request';
import func from '../../utils/Func';


export async function getList(params) {
  return request(`/api/blacklist/list`, {
    method: 'POST',
    body: params,
  });
}

export async function save(params) {
  return request(`/api/blacklist/save`, {
    method: 'POST',
    body: params,
  });
}
