/**
 * Created by Lenovo on 2020/9/8.
 */
// import { stringify } from 'qs';
import request from '../../utils/request';
// import func from '../utils/Func';

export async function getList(params) {
  return request('/api/logistics/authorization/list', {
    method: 'get',
    body: params,
  });
}
