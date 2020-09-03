export const USERORDER_NAMESPACE = 'userOrder';

export function USERORDER_LIST(payload) {
  return {
    type: `${USERORDER_NAMESPACE}/fetchList`,
    payload,
  };
}

export function USERORDER_DETAIL(id) {
  return {
    type: `${USERORDER_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function USERORDER_CLEAR_DETAIL() {
  return {
    type: `${USERORDER_NAMESPACE}/clearDetail`,
    payload: {},
  };
}

export function USERORDER_SUBMIT(payload) {
  return {
    type: `${USERORDER_NAMESPACE}/submit`,
    payload,
  };
}

export function USERORDER_REMOVE(payload) {
  return {
    type: `${USERORDER_NAMESPACE}/remove`,
    payload,
  };
}
