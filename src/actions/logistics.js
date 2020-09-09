export const LOGISTICS_NAMESPACE = 'logistics';

export function LOGISTICS_LIST(payload) {
  return {
    type: `${LOGISTICS_NAMESPACE}/fetchList`,
    payload,
  };
}

export function LOGISTICS_INIT() {
  return {
    type: `${LOGISTICS_NAMESPACE}/fetchInit`,
    payload: { code: 'logistics' },
  };
}

export function LOGISTICS_DETAIL(id) {
  return {
    type: `${LOGISTICS_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function LOGISTICS_SUBMIT(payload) {
  return {
    type: `${LOGISTICS_NAMESPACE}/submit`,
    payload,
  };
}

export function LOGISTICS_REMOVE(payload) {
  return {
    type: `${LOGISTICS_NAMESPACE}/remove`,
    payload,
  };
}
