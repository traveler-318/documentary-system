
// import config from '../../config/config';
import menu from '../locales/zh-CN/menu';
import tabs from '../locales/zh-CN/tabs'
import { store } from '@/utils/utils';

const { get } = store;
const GlobalModel = {
  namespace: 'tabs',
  state: {
    collapsed: false,
    notices: [],
    pathname: '/',
    pageName: '新页面',
    paths: [],
    pages: [],
  },
  effects: {

  },
  reducers: {
    // 设置当前Path
    setCurrentPath(state, { payload }) {
      const { pathname, pageName } = payload;
      const { paths } = state;
      if (!paths.some(path => path === pathname)) {
        paths.push(pathname);
      }
      sessionStorage.setItem('current-tab-activeKey',pathname)
      return { ...state, pathname, pageName, paths };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      const getName = (routes = [], parentName, pathname) => {
        const list = [];
        routes.forEach(item => {
          // eslint-disable-next-line no-shadow
          const { routes, path } = item;
          // const pName = parentName && path ? `${parentName}.${path}` : parentName || path;
          const pName = 'menu';

          if (routes && routes.length) {
            list.push(...getName(routes, pName, pathname));
          } else if (pName && path) {
            if (item.path === pathname) {
              list.push(pName);
            }
          }
        });


        console.log(list)
        return list;
      };

      // 监听路由变化
      return history.listen((location ) => {
        let { pathname } = location;
        console.log(location)
        // console.log("====")
        let id;
        if (pathname === '/' || pathname ==='/user/login') {
          return;
        }
        try {
          id = pathname.split('/').slice(-1)[0];
        } catch (error) { }
        const { title } = get(id, 'sessionstorage') || {};
        let name = '';
        name = pathname.substr(pathname.lastIndexOf('/') + 1);

        // const pageName =
        //   menu[getName(config.routes, 'menu', pathname)[0]] || title || name || '新标签页';
        // const pageName = tabs['menu'+pathname.replace(/\//g,".").replace(/.list/g,"")] ;
        const pageName = tabs['menu'+pathname.replace(/\//g,".")] ;
        if(!pageName) {
          localStorage.setItem('isAntTap','2')
          return false;
        }else{
          localStorage.setItem('isAntTap','1')
        }
        // setTimeout(() => {
          dispatch({ type: 'setCurrentPath', payload: { pathname, pageName: title || pageName } });

          // dispatch({ type: 'addPath', payload: { pathname, pageName } });
        // }, 0);
      });
    },
  },
};
export default GlobalModel;
