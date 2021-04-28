import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Menu, Icon } from 'antd';
import Link from 'umi/link';
import { urlToList } from '../_utils/pathTools';
import { getMenuMatches } from './SiderMenuUtils';
import { isUrl } from '@/utils/utils';
import styles from './index.less';
import IconFont from '@/components/IconFont';

const { SubMenu } = Menu;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'icon-geren' #For Iconfont ,
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string') {
    if (isUrl(icon)) {
      return <Icon component={() => <img src={icon} alt="icon" className={styles.icon}/>}/>;
    }
    if (icon.startsWith('icon-')) {
      return <IconFont type={icon}/>;
    }
    return <Icon type={icon}/>;
  }
  return icon;
};

export default class SecondMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      menuChange:false
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

    // doc: add hideChildrenInMenu
    if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
      const { name } = item;
      return (
        <li className={`${styles.groupNav} ${item.open ? styles.collapsed:''}`}>
          <div className={styles.secondGroupTitle}
               onClick={() => {
                 item.open = !item.open
                 this.setState({
                   menuChange:!this.state.menuChange
                 })
               }}
          >
            <Icon type="down" style={{ fontSize: '12px', color: '#878787', marginRight: '4px' }}/>{name}
          </div>
          <ul>
            {this.getNavMenuItems(item.children)}
          </ul>
        </li>
        // <SubMenu
        //   title={
        //     item.icon ? (
        //       <span>
        //         {getIcon(item.icon)}
        //         <span>{name}</span>
        //       </span>
        //     ) : (
        //       name
        //     )
        //   }
        //   key={item.path}
        // >
        //   {this.getNavMenuItems(item.children)}
        // </SubMenu>
      );
    }
    // return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;

    let current = selectedKeys ? selectedKeys.indexOf(item.path)>-1 ?true:false : false
    return <li key={item.path} className={ `${styles.item} ${current?styles.active:''} `}>{this.getMenuItemPath(item)}</li>;
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    const { name } = item;
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    const { location, isMobile, onCollapse } = this.props;
    return (
      <Link
        to={`${itemPath}?_K=${Date.parse(new Date())}`}
        target={target}
        replace={itemPath === location.pathname}
        onClick={
          isMobile
            ? () => {
              onCollapse(true);
            }
            : undefined
        }
      >
        {icon}
        <span>{name}</span>
      </Link>
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
      titleName,
    } = this.props;
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys(pathname);

    const { handleOpenChange, menuData, childrens } = this.props;
    console.log(collapsed);

    return (
      <>
        <div className={styles.sideerTitle}>{titleName}</div>
        <ul style={{ padding: '0 0 0 12px' }}>
          {this.getNavMenuItems(childrens,selectedKeys)}
        </ul>
        {/*<Menu*/}
        {/*  key="Menu"*/}
        {/*  mode={mode}*/}
        {/*  theme='light'*/}
        {/*  onOpenChange={handleOpenChange}*/}
        {/*  selectedKeys={selectedKeys}*/}
        {/*  style={style}*/}
        {/*  className={cls}*/}
        {/*  {...props}*/}
        {/*>*/}
        {/*  {this.getNavMenuItems(childrens)}*/}
        {/*</Menu>*/}
      </>
    );
  }
}
