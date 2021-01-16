/**
 * Created by Lenovo on 2020/9/8.
 */
 import { stringify } from 'qs';
import request from '../../utils/request';
 import func from '../../utils/Func';


// ============ 短信充值 ===============
export async function getUnWeChatBind(type) {
  return request("/api/system/topup/amount?type="+type, {
    method: 'POST',
  });
}

// ============ 充值记录明细 ===============
export async function topUpRecordList(params) {
  return request(`/api/system/topup/topUpRecordList`, {
    method: 'POST',
    body: params,
  });
}
// ============ 消费报表明细 ===============
export async function statisticsformtaskList(params) {
  return request(`/api/tracking_statistics_form_task/statisticsformtask/list`, {
    method: 'POST',
    body: params,
  });
}
// ============ 短信发送明细 ===============
export async function smsList(params) {
  return request(`/api/sms_receipt/receipt/smsList`, {
    method: 'POST',
    body: params,
  });
}
// ============ 语音发送明细 ===============
export async function voiceList(params) {
  return request(`/api/ali_voice_record/voicerecord/voiceList`, {
    method: 'POST',
    body: params,
  });
}

// ============ 打印 ===============
export async function logisticsPrintList(params) {
  return request(`/api/logistics/printsynchronization/logisticsPrintList`, {
    method: 'POST',
    body: params,
  });
}
// ============ 物流 ===============
export async function logisticsSubscriptList(params) {
  return request(`/api/subscription/subscriptionsynchron/logisticsSubscriptList`, {
    method: 'POST',
    body: params,
  });
}



// ============ 充值状态 ===============
export async function topUpState(params) {
  return request(`/api/system/topup/topUpState`, {
    method: 'POST',
    body: params,
    isShowTips:true
  });
}
