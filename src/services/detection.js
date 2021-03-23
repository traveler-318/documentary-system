import request from '@/utils/request';
import func from '@/utils/Func';

// 单个号码检测
export async function getPhone(params) {
  return request(`/api//phoneNumber/check/phone`, {
    method: 'POST',
    body: params,
  });
}
// 批量检测
export async function importPhoneFile(params) {
  const { type, file} = params;
  const formData = new FormData();
  formData.append('type', type);
  formData.append('file', file);
  return request('/api/phoneNumber/check/importPhoneFile', {
    method: 'POST',
    body: formData,
  });
}
