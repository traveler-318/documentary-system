/**
 * Created by Lenovo on 2020/9/8.
 */
 import { stringify } from 'qs';
import request from '../../utils/request';
 import func from '../../utils/Func';


// ============ 短信管理 ===============
export async function getList(params) {
  return request("/api/sms_ali_record/alirecord/list",{
    method: 'POST',
    body: params,
  });
}

export async function updateStatus(params) {
  return request("/api/agent/salesman/updateStatus",{
    method: 'POST',
    body: params,
  });
}
