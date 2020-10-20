import React, { Component, Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import Link from 'umi/link';
import { Icon, Spin, Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import GlobalFooter from '../components/GlobalFooter';
import SelectLang from '../components/SelectLang';
import styles from './UserLayout.less';
import loginLogo from '../assets/loginLogo.svg';
import getPageTitle from '../utils/getPageTitle';
import { title } from '../defaultSettings';
import { getTopUrl, getQueryString, validateNull } from '../utils/utils';

import loginchahua from '../assets/loginchahua.png'
import loginLogos from '../assets/loginLogo.png'

const { Header, Footer, Sider, Content } = Layout;

const links = [
  // {
  //   key: 'help',
  //   title: formatMessage({ id: 'layout.user.link.help' }),
  //   href: '',
  // },
  // {
  //   key: 'privacy',
  //   title: formatMessage({ id: 'layout.user.link.privacy' }),
  //   href: '',
  // },
  // {
  //   key: 'terms',
  //   title: formatMessage({ id: 'layout.user.link.terms' }),
  //   href: '',
  // },
];

const copyright = (
  <Fragment>
    <a
      key="github"
      title="git"
      target="_blank"
      rel="noopener noreferrer"
      href="https://www.ruanmao.cn"
      // style={{color:"rgba(0, 0, 0, 0.45)"}}
      className={styles.textColor}
    >
      Copyright <Icon type="copyright" /> 2020 厦门软猫科技有限公司{' '}
    </a>
  </Fragment>
);

class UserLayout extends Component {
  state = {
    loading: false,
  };

  componentDidMount() {
    const domain = getTopUrl();
    const redirectUrl = '/oauth/redirect/';
    const {
      dispatch,
      route: { routes, authority },
    } = this.props;

    let source = getQueryString('source');
    const code = getQueryString('code');
    const state = getQueryString('state');
    if (validateNull(source) && domain.includes(redirectUrl)) {
      // eslint-disable-next-line prefer-destructuring
      source = domain.split('?')[0];
      // eslint-disable-next-line prefer-destructuring
      source = source.split(redirectUrl)[1];
    }
    if (!validateNull(source) && !validateNull(code) && !validateNull(state)) {
      this.setState({ loading: true });
      dispatch({
        type: 'login/socialLogin',
        payload: { source, code, state, tenantId: '000000' },
      }).then(() => {
        this.setState({ loading: false });
      });
    } else {
      dispatch({
        type: 'menu/fetchMenuData',
        payload: { routes, authority },
      });
      dispatch({
        type: 'tenant/fetchInfo',
        payload: { domain },
      });
    }
  }

  render() {
    const {
      children,
      location: { pathname },
      breadcrumbNameMap,
      tenant: { info },
    } = this.props;

    const { loading } = this.state;

    const { backgroundUrl } = info;

    const backgroundStyle = {
      backgroundImage: `url(${backgroundUrl})`,
      flex:1
    };

    return (
      <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
        {/* <Layout> */}
          {/* <Sider
            style={{
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
              left: 0,
            }}
          >
            <img src={loginchahua}/>
          </Sider>
          <Content> */}
            <Spin spinning={loading}>
              <div style={{
                background: "#F2F7F5",
                height: "100vh",
                float: "left",
                width: "40%"
              }}>
                <img src={loginLogos} style={{position:"absolute",left:"50px",top:"50px",width:"140px"}}/>
                <img src={loginchahua} style={{
                  height:"100vh",
                  float:"left",
                  padding:"0 40px",
                  marginTop:"180px"
                }}/>
              </div>
              <div className={styles.container} style={backgroundStyle}>
                <div className={styles.lang}>
                  <SelectLang />
                </div>
                <div className={styles.content}>
                  <div className={styles.top} style={{width:"440px",margin:"0 auto"}}>
                    <div className={styles.header} style={{fontSize:"28px",fontWeight:"bold",color:"#000"}}>
                      跟单宝助力支付代理商激活更简单
                    </div>
                    {/* <div className={styles.header}>
                      <Link to="/">
                        <img alt="logo" className={styles.logo} src={loginLogo} />
                        <span className={styles.title}>{title}</span>
                      </Link>
                    </div> */}
                    <div className={styles.desc}>
                      行业首个支付代理商POS跟单解决方案
                    </div>
                  </div>
                  {children}
                </div>
                <GlobalFooter links={links} copyright={copyright} />
              </div>
            </Spin>
          {/* </Content> */}
        {/* </Layout> */}
        
      </DocumentTitle>
    );
  }
}

export default connect(({ menu: menuModel, tenant }) => ({
  menuData: menuModel.menuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
  tenant,
}))(UserLayout);
