/**
 * Created by Lenovo on 2020/9/8.
 */
 import { stringify } from 'qs';
import request from '../../utils/request';
 import func from '../../utils/Func';


// ============ 工单管理 ===============
export async function getList(params) {
  return request("/api/tracking_order_after_record/afterrecord/list",{
    method: 'POST',
    body: params,
  });
}
export async function updateChatRecords(params) {
  return request("/api/tracking_order_after_record/afterrecord/updateChatRecords",{
    method: 'POST',
    body: params,
  });
}
//删除
export async function remove(params) {
  return request("/api/tracking_order_after_record/afterrecord/remove",{
    method: 'POST',
    body: params,
  });
}
//已读未读状态修改
export async function updateReaded(params) {
  return request("/api/tracking_order_after_record/afterrecord/updateReaded",{
    method: 'POST',
    body: params,
  });
}

export async function getUpToken(fileName) {
  return request("/api/qiniu/upToken?suffix="+fileName,{
    method:'get',
  });
}

//短信工单列表
export async function repairorderList(params) {
  return request("/api/repairorder/list",{
    method: 'POST',
    body: params,
  });
}
//短信工单处理
export async function repairorderUpdate(params) {
  return request("/api/repairorder/update",{
    method: 'POST',
    body: params,
  });
}

