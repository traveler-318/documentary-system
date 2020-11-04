/**
 * Created by xiewenxin on 2020/11/4.
 */
import { stringify } from 'qs';
import request from '../../utils/request';
 import func from '../../utils/Func';

// ============ 列表查询 ===============
export async function getList(params) {
  return request("/api/tracking/task/list",{
    method: 'POST',
    body: params,
  });
}

export async function updateStatus(id) {
  return request("/api/tracking/task/updateStatus/"+id,{
    method: 'POST',
  });
}