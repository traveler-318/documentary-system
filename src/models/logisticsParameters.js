export default {
  namespace: 'logisticsParameters',

  state: {
    listParam:{},
    detailData:{},
  },

  effects: {
    *setListId(enterParameter, { call, put, select }) {
        yield put({
            type: 'changeId',
            payload: enterParameter.payload,
        });
    },
    *setDetailData(enterParameter, { call, put, select }) {
      yield put({
          type: 'changeDetailData',
          payload: enterParameter.payload,
      });
    },
  },

  reducers: {
    changeId(state, action) {
        return {
          listParam: action.payload,
        };
    },
    changeDetailData(state, action) {
      return {
        detailData: action.payload,
      };
  },
  },
};
