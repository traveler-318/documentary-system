import React, { Suspense } from 'react';
import { Layout, message, Spin } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import Media from 'react-media';
import logo from '../assets/logo.svg';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import PageTab from './PageTab'
import SiderMenu from '@/components/SiderMenuYz';
import getPageTitle from '@/utils/getPageTitle';
import styles from './BasicLayout.less';
import RealTimeInformation from '@/components/RealTimeInformation/index';
import watermark from 'watermark-dom';
import { getCookie } from '@/utils/support';
import { getUserInfo } from '../services/user';

// lazy load SettingDrawer
const SettingDrawer = React.lazy(() => import('@/components/SettingDrawer'));

const { Content } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class BasicLayout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isShowWaterMark:true,
      defaultSettings:{
        watermark_id: 'wm_div_id',          //水印总体的id
        watermark_prefix: 'mask_div_id',    //小水印的id前缀
        watermark_txt:"",             //水印的内容
        watermark_x:0,                     //水印起始位置x轴坐标
        watermark_y:0,                     //水印起始位置Y轴坐标
        watermark_rows:0,                   //水印行数
        watermark_cols:0,                   //水印列数
        watermark_x_space:80,              //水印x轴间隔
        watermark_y_space:160,               //水印y轴间隔
        watermark_font:'微软雅黑',           //水印字体
        watermark_color:'black',            //水印字体颜色
        watermark_fontsize:'14px',          //水印字体大小
        watermark_alpha:0.06,               //水印透明度，要求设置在大于等于0.005
        watermark_width:140,                //水印宽度
        watermark_height:30,               //水印长度
        watermark_angle:15,                 //水印倾斜度数
        watermark_parent_width:document.body.clientWidth-80,      //水印的总体宽度（默认值：body的scrollWidth和clientWidth的较大值）
        watermark_parent_height:document.body.clientHeight-80,     //水印的总体高度（默认值：body的scrollHeight和clientHeight的较大值）
        watermark_parent_node:null
      },
      defaultSettings1:{
        watermark_id: 'wm1_div_id',          //水印总体的id
        watermark_prefix: 'mask1_div_id',    //小水印的id前缀
        watermark_txt:"",             //水印的内容
        watermark_x:0,                     //水印起始位置x轴坐标
        watermark_y:0,                     //水印起始位置Y轴坐标
        watermark_rows:0,                   //水印行数
        watermark_cols:0,                   //水印列数
        watermark_x_space:80,              //水印x轴间隔
        watermark_y_space:160,               //水印y轴间隔
        watermark_font:'微软雅黑',           //水印字体
        watermark_color:'black',            //水印字体颜色
        watermark_fontsize:'14px',          //水印字体大小
        watermark_alpha:0.06,               //水印透明度，要求设置在大于等于0.005
        watermark_width:140,                //水印宽度
        watermark_height:30,               //水印长度
        watermark_angle:15,                 //水印倾斜度数
        watermark_parent_width:document.body.clientWidth-180,      //水印的总体宽度（默认值：body的scrollWidth和clientWidth的较大值）
        watermark_parent_height:document.body.clientHeight-180,     //水印的总体高度（默认值：body的scrollHeight和clientHeight的较大值）
        watermark_parent_node:null
      }
    };
  }

  componentDidMount() {
    const {
      dispatch,
      route: { routes, path, authority },
    } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'setting/getSetting',
    });
    dispatch({
      type: 'menu/fetchMenuData',
      payload: { routes, path, authority },
    });

    let {defaultSettings,defaultSettings1,isShowWaterMark} = this.state;
    if(isShowWaterMark){
      let date = new Date();
      let m = date.getMonth()+1; //获取当前月份(0-11,0代表1月)
      m = m > 10 ? m : "0" + m;
      let d = date.getDate(); //获取当前日(1-31)
      getUserInfo().then(resp => {
        if (resp.success) {
          const userInfo = resp.data;
          let watermark_txt = userInfo.name+' '+userInfo.phone.substring(7)+' '+m+'/'+d;

          defaultSettings.watermark_txt = watermark_txt;
          defaultSettings1.watermark_txt = watermark_txt;
          watermark.init(defaultSettings)
          watermark.init(defaultSettings1)
        } else {
          message.error(resp.msg || '获取数据失败');
        }
      });

      // watermark_txt = getCookie("userName")+" 8582 "+m+'/'+d;
      // defaultSettings.watermark_parent_node = "executive_box"
    }


    sessionStorage.removeItem('MENUCHANGE')
  }

  // 组件即将销毁
  componentWillUnmount() {
    this.handleMenuCollapse(true);
    sessionStorage.removeItem('MENUCHANGE')
  }

  getContext() {
    const { location, breadcrumbNameMap } = this.props;
    return {
      location,
      breadcrumbNameMap,
    };
  }

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        // paddingLeft: collapsed ? '80px' : '180px',
        paddingLeft: collapsed ? '92px' : '223px',
      };
    }
    return null;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  renderSettingDrawer = () => {
    // Do not render SettingDrawer in production
    // unless it is deployed in preview.pro.ant.design as demo
    if (process.env.NODE_ENV === 'production' && process.env.APP_TYPE !== 'site') {
      return null;
    }
    return <SettingDrawer />;
  };

  render() {
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location: { pathname },
      isMobile,
      menuData,
      breadcrumbNameMap,
      fixedHeader,
    } = this.props;

    const isTop = PropsLayout === 'topmenu';
    const istab = localStorage.getItem('isAntTap')
    const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};

    const layout = (
      <Layout>
        {isTop && !isMobile ? null : (
          <SiderMenu
            logo={logo}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            {...this.props}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            isMobile={isMobile}
            {...this.props}
          />
          <Content className={[styles.tabContent,istab === '1'?'':'word-style-hide']} style={contentStyle}>
            <PageTab>{children}</PageTab>
          </Content>
          {istab === '1'?'':(
            <Content className={[styles.content,istab === '2'?'':'word-style-hide']} style={contentStyle}>
              {children}
            </Content>
          ) }


          {/* <Footer /> */}
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
          <ContainerQuery query={query}>
            {params => (
              // <Spin tip="请稍等..." spinning={true}>
                <Context.Provider value={this.getContext()}>
                  <div className={classNames(params)}>{layout}</div>
                  {/* 暂时关闭 */}
                  {/* <RealTimeInformation/> */}
                </Context.Provider>
              // </Spin>
            )}
          </ContainerQuery>
        </DocumentTitle>
        <Suspense fallback={null}>{this.renderSettingDrawer()}</Suspense>
      </React.Fragment>
    );
  }
}

export default connect(({ global, setting, menu: menuModel }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  menuData: menuModel.menuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
  ...setting,
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <BasicLayout {...props} isMobile={isMobile} />}
  </Media>
));
