export default {
  namespace: 'globalParameters',

  state: {
    listParam:[],
    detailData:{},
    paramList:[]
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
    *setParam(enterParameter, { call, put, select }) {
      yield put({
          type: 'changeParam',
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
    changeParam(state, action) {
      return {
        paramList: action.payload,
      };
    },
  },
};
