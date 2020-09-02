export const ATTACH_NAMESPACE = 'attach';

export function ATTACH_LIST(payload) {
  return {
    type: `${ATTACH_NAMESPACE}/fetchList`,
    payload,
  };
}

export function ATTACH_DETAIL(id) {
  return {
    type: `${ATTACH_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function ATTACH_CLEAR_DETAIL() {
  return {
    type: `${ATTACH_NAMESPACE}/clearDetail`,
    payload: {},
  };
}

export function ATTACH_SUBMIT(payload) {
  return {
    type: `${ATTACH_NAMESPACE}/submit`,
    payload,
  };
}

export function ATTACH_REMOVE(payload) {
  return {
    type: `${ATTACH_NAMESPACE}/remove`,
    payload,
  };
}
