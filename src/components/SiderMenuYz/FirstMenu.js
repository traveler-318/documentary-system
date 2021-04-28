import React, { PureComponent, Suspense } from 'react';
import classNames from 'classnames';
import { Menu, Icon } from 'antd';
import Link from 'umi/link';
import { urlToList } from '../_utils/pathTools';
import { getMenuMatches } from './SiderMenuUtils';
import { isUrl } from '@/utils/utils';
import styles from './index.less';
import IconFont from '@/components/IconFont';
import PageLoading from '@/components/PageLoading';
const SecondtMenu = React.lazy(() => import('./SecondMenu'));

const { SubMenu } = Menu;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'icon-geren' #For Iconfont ,
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string') {
    if (isUrl(icon)) {
      return <Icon component={() => <img src={icon} alt="icon" className={styles.icon} />}  style={{marginRight:'4px'}}/>;
    }
    if (icon.startsWith('icon-')) {
      return <IconFont type={icon} />;
    }
    return <Icon type={icon} style={{marginRight:'4px'}}/>;
  }
  return icon;
};

export default class BaseMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      chooseMenuName:null
    };
  }
  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = (menusData,selectedKeys) => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => this.getSubMenuOrItem(item,selectedKeys))
      .filter(item => item);
  };

  // Get the currently selected menu
  getSelectedMenuKeys = pathname => {
    const { flatMenuKeys } = this.props;
    return urlToList(pathname).map(itemPath => getMenuMatches(flatMenuKeys, itemPath).pop());
  };

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = (item,selectedKeys) => {
    let {chooseMenuName} = this.state

    let current = chooseMenuName ? chooseMenuName == item.path ? true : false:false;
    if(!chooseMenuName) current = selectedKeys.indexOf(item.path)>-1 ?true:false;

    return <li key={item.path} className={ `${styles.li} ${current?styles.active:''} `}>{this.getMenuItemPath(item,current)}</li>;
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = (item,current) => {
    const { name } = item;
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target } = item;
    const { handleOpenChange,collapsed } = this.props;

    const { location, isMobile, onCollapse } = this.props;

    let isView = !collapsed && current
    return (
      <>
      <Link
        replace={itemPath === location.pathname}
        onClick={
          () => {
              this.setState({
                chooseMenuName:item.path
              })
              onCollapse(false);
            }
        }
      >
        {icon}
        <span>{name.substring(0,2)}</span>
      </Link>
        <div className={`${styles.secondSidebar} ${isView?styles.view : ''}`}>
          {item.children?(
            <Suspense fallback={<PageLoading />}>
              <SecondtMenu
                {...this.props}
                childrens={item.children}
                titleName={name}
                mode="inline"
                handleOpenChange={handleOpenChange}
                style={{ padding: '16px 0', width: '100%' }}
              />
            </Suspense>
          ):''}
        </div>
        </>
    );
  };

  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  render() {
    const {
      openKeys,
      theme,
      mode,
      location: { pathname },
      className,
      collapsed,
    } = this.props;

    let selectedKeys = this.getSelectedMenuKeys(pathname);
    // if (!selectedKeys.length && openKeys) {
    //   selectedKeys = [openKeys[openKeys.length - 1]];
    // }

    const { menuData,style } = this.props;
    const cls = classNames(className, {
      'top-nav-menu': mode === 'horizontal',
    });

    return (
      <ul
        key="Menu"
        mode={mode}
        theme={theme}
        style={style}
        className={cls}
      >
        {this.getNavMenuItems(menuData,selectedKeys)}
      </ul>
    );
  }
}
