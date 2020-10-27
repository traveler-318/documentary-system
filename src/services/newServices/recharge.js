/**
 * Created by Lenovo on 2020/9/8.
 */
 import { stringify } from 'qs';
import request from '../../utils/request';
 import func from '../../utils/Func';


// ============ 短信充值 ===============
export async function getUnWeChatBind() {
  return request(`/api/system/topup/amount`, {
    method: 'GET',
  });
}



