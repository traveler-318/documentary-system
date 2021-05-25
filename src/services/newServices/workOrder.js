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
