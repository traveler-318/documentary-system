import { routerRedux } from 'dva/router';
import { notification } from 'antd';
import { stringify } from 'qs';
import { getFakeCaptcha } from '../services/api';
import { accountLogin, socialLogin, getCity } from '../services/user';
import { dynamicRoutes, dynamicButtons } from '../services/menu';
import {
  setAuthority,
  setToken,
  setAccessToken,
  setCurrentUser,
  setRoutes,
  setButtons,
  removeAll,
  setCityData,
} from '../utils/authority';
import { getPageQuery, formatRoutes, formatButtons, getTopUrl } from '../utils/utils';
import { reloadAuthorized } from '../utils/Authorized';
import { setCookie, getCookie } from '../utils/support';


export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      if (response.error_description) {
        notification.error({
          message: response.error_description,
        });
      } else {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: true,
            type: 'login',
            data: { ...response },
          },
        });
        console.log(response,"response")
        if(response.code){
          return false;
        }
        // 缓存全局使用数据
        // dept_id->部门id  跟当前人帐号挂钩
        setCookie("dept_id",response.dept_id);
        // 网关地址
        setCookie("serverAddress",response.serverAddress);
        // 租户id
        setCookie("tenantId",response.tenant_id);
        //账户名字
        setCookie("userName",response.user_name);
        //角色名字
        setCookie("ROLENAME",response.role_name);
        // --------结束

        const responseCity = yield call(getCity);
        yield put({
          type: 'saveCityData',
          payload: {
            CityData: responseCity.data,
          },
        });

        const responseRoutes = yield call(dynamicRoutes);
        const responseButtons = yield call(dynamicButtons);
        yield put({
          type: 'saveMenuData',
          payload: {
            routes: responseRoutes.data,
            buttons: responseButtons.data,
          },
        });
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            redirect = null;
          }
        }
        yield put(routerRedux.replace('/dashboard/workplace'));
      }
    },
    *socialLogin({ payload }, { call, put }) {
      const response = yield call(socialLogin, payload);
      if (response.error_description) {
        notification.error({
          message: response.error_description,
        });
      } else {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: true,
            type: 'login',
            data: { ...response },
          },
        });
        reloadAuthorized();
        const topUrl = getTopUrl();
        const redirectUrl = '/oauth/redirect/';
        // eslint-disable-next-line prefer-destructuring
        window.location.href = topUrl.split(redirectUrl)[0];
        yield put(routerRedux.replace('/'));
      }
    },
    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          type: 'logout',
          data: {
            authority: 'guest',
            logout: true,
          },
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push('/user/login?id='+(getCookie("tenantId") || ""))
      );
      removeAll();
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      const { status, type } = payload;

      if (status) {
        const {
          data: {
            token_type,
            access_token,
            role_name,
            account,
            user_id,
            oauth_id,
            user_name,
            avatar,
          },
        } = payload;
        const token = `${token_type} ${access_token}`;
        setToken(token);
        setAccessToken(access_token);
        setAuthority(role_name);
        setCurrentUser({
          userId: user_id,
          oauthId: oauth_id,
          avatar,
          account,
          name: user_name,
          authority: role_name,
        });
      } else {
        removeAll();
      }

      return {
        ...state,
        status: type === 'login' ? (status ? 'ok' : 'error') : '',
        type: payload.type,
      };
    },
    saveMenuData(state, { payload }) {
      const { routes, buttons } = payload;
      setRoutes(formatRoutes(routes));
      setButtons(formatButtons(buttons));
      return {
        ...state,
      };
    },
    saveCityData(state, { payload }) {
      const { CityData } = payload;
      setCityData(CityData);
      return {
        ...state,
      };
    },
  },
};
