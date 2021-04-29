import React, { PureComponent, Suspense } from 'react';
import { Layout } from 'antd';
import classNames from 'classnames';
import Link from 'umi/link';
import styles from './index.less';
import PageLoading from '../PageLoading';
import { getDefaultCollapsedSubMenus } from './SiderMenuUtils';
import { name } from '../../defaultSettings';

import siderLogo from '../../assets/siderLogo.svg'

// const BaseMenu = React.lazy(() => import('./BaseMenu'));
const FirstMenu = React.lazy(() => import('./FirstMenu'));
// const SecondtMenu = React.lazy(() => import('./SecondMenu'));
const { Sider } = Layout;

let firstMount = true;

export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openKeys: getDefaultCollapsedSubMenus(props),
      childrens:null
    };
  }

  componentDidMount() {
    firstMount = false;
  }

  static getDerivedStateFromProps(props, state) {
    const { pathname, flatMenuKeysLen } = state;
    if (props.location.pathname !== pathname || props.flatMenuKeys.length !== flatMenuKeysLen) {
      return {
        pathname: props.location.pathname,
        flatMenuKeysLen: props.flatMenuKeys.length,
        openKeys: getDefaultCollapsedSubMenus(props),
      };
    }
    return null;
  }

  isMainMenu = key => {
    const { menuData } = this.props;
    return menuData.some(item => {
      if (key) {
        return item.key === key || item.path === key;
      }
      return false;
    });
  };

  handleOpenChange = openKeys => {
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys],
    });
  };

  handleHover = childrens =>{
    this.setState({
      childrens:childrens
    })
  }

  render() {
    const { logo, collapsed, onCollapse, fixSiderbar, theme, isMobile } = this.props;
    const { openKeys,childrens } = this.state;
    const defaultProps = collapsed ? {} : { openKeys };

    const siderClassName = classNames(styles.sider, {
      [styles.fixSiderBar]: fixSiderbar,
      [styles.light]: theme === 'light',
    });
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        // onCollapse={collapse => {
        //   if (firstMount || !isMobile) {
        //     onCollapse(collapse);
        //   }
        // }}
        width={92}
        theme={theme}
        className={siderClassName}
      >
        <div className={styles.firstSidebar}>
          <div className={styles.logo} id="logo">
            <Link to="/dashboard/workplace">
              <img src={siderLogo} alt="logo" />
              <h1>{name}</h1>
            </Link>
          </div>
          <Suspense fallback={<PageLoading />}>
            <FirstMenu
              {...this.props}
              mode="inline"
              handleOpenChange={this.handleOpenChange}
              onOpenChange={this.handleOpenChange}
              hover = {this.handleHover}
              style={{ padding: '6px 0', width: '100%' }}
              {...defaultProps}
            />
            {/*<BaseMenu*/}
            {/*  {...this.props}*/}
            {/*  mode="inline"*/}
            {/*  handleOpenChange={this.handleOpenChange}*/}
            {/*  onOpenChange={this.handleOpenChange}*/}
            {/*  style={{ padding: '16px 0', width: '100%' }}*/}
            {/*  {...defaultProps}*/}
            {/*/>*/}
          </Suspense>
        </div>
        {/*<div>*/}
        {/*  {childrens?(*/}
        {/*    <Suspense fallback={<PageLoading />}>*/}
        {/*      <SecondtMenu*/}
        {/*        {...this.props}*/}
        {/*        childrens={childrens}*/}
        {/*        mode="inline"*/}
        {/*        handleOpenChange={this.handleOpenChange}*/}
        {/*        onOpenChange={this.handleOpenChange}*/}
        {/*        style={{ padding: '16px 0', width: '100%' }}*/}
        {/*        {...defaultProps}*/}
        {/*      />*/}
        {/*    </Suspense>*/}
        {/*  ):''}*/}
        {/*</div>*/}
      </Sider>
    );
  }
}
