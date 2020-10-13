import React, { Component, Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import Link from 'umi/link';
import { Icon, Spin } from 'antd';
import DocumentTitle from 'react-document-title';
import GlobalFooter from '../components/GlobalFooter';
import SelectLang from '../components/SelectLang';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';
import getPageTitle from '../utils/getPageTitle';
import { title } from '../defaultSettings';
import { getTopUrl, getQueryString, validateNull } from '../utils/utils';

const links = [
  {
    key: 'help',
    title: formatMessage({ id: 'layout.user.link.help' }),
    href: '',
  },
  {
    key: 'privacy',
    title: formatMessage({ id: 'layout.user.link.privacy' }),
    href: '',
  },
  {
    key: 'terms',
    title: formatMessage({ id: 'layout.user.link.terms' }),
    href: '',
  },
];

const copyright = (
  <Fragment>
    <a
      key="github"
      title="git"
      target="_blank"
      rel="noopener noreferrer"
      href="https://www.ruanmao.cn"
      style={{color:"rgba(0, 0, 0, 0.45)"}}
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
    };

    return (
      <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
        <Spin spinning={loading}>
          <div className={styles.container} style={backgroundStyle}>
            <div className={styles.lang}>
              <SelectLang />
            </div>
            <div className={styles.content}>
              <div className={styles.top}>
                <div className={styles.header}>
                  <Link to="/">
                    <img alt="logo" className={styles.logo} src={logo} />
                    <span className={styles.title}>{title}</span>
                  </Link>
                </div>
                <div className={styles.desc}>
                  Sword是BladeX前端UI项目，基于react 、ant design、umi、dva等流行技术栈。
                </div>
              </div>
              {children}
            </div>
            <GlobalFooter links={links} copyright={copyright} />
          </div>
        </Spin>
      </DocumentTitle>
    );
  }
}

export default connect(({ menu: menuModel, tenant }) => ({
  menuData: menuModel.menuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
  tenant,
}))(UserLayout);
