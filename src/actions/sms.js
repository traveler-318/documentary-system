export const SMS_NAMESPACE = 'sms';

export function SMS_INIT() {
  return {
    type: `${SMS_NAMESPACE}/fetchInit`,
    payload: { code: 'sms' },
  };
}

export function SMS_LIST(payload) {
  return {
    type: `${SMS_NAMESPACE}/fetchList`,
    payload,
  };
}

export function SMS_DETAIL(id) {
  return {
    type: `${SMS_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function SMS_CLEAR_DETAIL() {
  return {
    type: `${SMS_NAMESPACE}/clearDetail`,
    payload: {},
  };
}

export function SMS_SUBMIT(payload) {
  return {
    type: `${SMS_NAMESPACE}/submit`,
    payload,
  };
}

export function SMS_REMOVE(payload) {
  return {
    type: `${SMS_NAMESPACE}/remove`,
    payload,
  };
}
