import React, { PureComponent } from 'react';
import { FormattedMessage, formatMessage } from 'umi/locale';
import { Spin, Tag, Menu, Icon, Avatar, Tooltip, message } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import $ from "jquery";
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import HeaderDropdown from '../HeaderDropdown';
import SelectLang from '../SelectLang';
import styles from './index.less';


import { getSMSBalance } from '../../services/user';
import { getSalesmanInfo } from '../../services/user';
import router from 'umi/router';

export default class GlobalHeaderRight extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      remainingMoney:'',
      currentQuota:''
    };
  }

  componentDidMount() {
    getSMSBalance().then(resp => {
      console.log(resp,"resprespresp")
      if (resp.code === 200) {
        this.setState({ remainingMoney: resp.data});
      } else {
        message.error(resp.msg || '获取数据失败');
      }
    });
    getSalesmanInfo().then(resp => {
      console.log(resp,"resprespresp")
      if (resp.code === 200) {
        this.setState({ currentQuota: resp.data.currentQuota});
        sessionStorage.setItem("tenantId", resp.data.tenantId)
      } else {
        message.error(resp.msg || '获取数据失败');
      }
    });
  }


  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  getUnreadData = noticeData => {
    const unreadMsg = {};
    Object.entries(noticeData).forEach(([key, value]) => {
      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }
      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter(item => !item.read).length;
      }
    });
    return unreadMsg;
  };



  changeReadState = clickedItem => {
    const { id } = clickedItem;
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeNoticeReadState',
      payload: id,
    });
  };

  recharge =()=>{
    router.push(`/system/charging`);
  }

  payAmount = () => {
    const {remainingMoney}=this.state;
    return(
      <>
        <span onClick={()=>this.recharge()} style={{cursor: "pointer"}}>充值</span><br/>
        <span>短信余额：{remainingMoney}元</span>
      </>

    )
  }

  salesmanAmount = () => {
    const {currentQuota}=this.state;
    return(
      <span>业务员余额：{currentQuota}个</span>
    )
  }
  render() {
    const {
      currentUser,
      fetchingNotices,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      theme,
    } = this.props;
    const {
      remainingMoney,
      currentQuota
    }=this.state;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="userinfo">
          <Icon type="setting" />
          <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
        </Menu.Item>
        <Menu.Item key="password">
          <Icon type="user" />
          <FormattedMessage id="menu.account.password" defaultMessage="password settings" />
        </Menu.Item>
        <Menu.Item key="clearCache">
          <Icon type="close-circle" />
          <FormattedMessage id="menu.account.clear" defaultMessage="clear cache" />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    const unreadMsg = this.getUnreadData(noticeData);
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <>
        <div className={styles.reminder}>
          <marquee scrollamount='10'>近期有用户举报，部分公司有冒充跟单宝进行私自招收代理等严重违规行为！
            跟单宝系统归厦门软猫科技有限公司版权所有；跟单宝从未开放任何分公司、OEM、系统代理！(主账号非admin帐号均属于挂载他人名下，将会造成数据泄露风险)。
            唯一销售渠道电话/微信：15160078582（备注来源：跟单宝）</marquee>
          {/*<h3 className={styles.text}></h3>*/}
        </div>
        <div className={className}>
          <Tooltip
            title={this.salesmanAmount}
          >
            <span style={{padding:"0 12px"}}><Icon type="user"  style={{marginRight:5}} />{currentQuota}个</span>
          </Tooltip>
          <Tooltip
            title={this.payAmount}
          >
            <span style={{padding:"0 12px"}}><Icon type="mail"  style={{marginRight:5}} />{remainingMoney}元</span>
          </Tooltip>
          <HeaderSearch
            className={`${styles.action} ${styles.search}`}
            placeholder={formatMessage({ id: 'component.globalHeader.search' })}
            dataSource={[
              formatMessage({ id: 'component.globalHeader.search.example1' }),
              formatMessage({ id: 'component.globalHeader.search.example2' }),
              formatMessage({ id: 'component.globalHeader.search.example3' }),
            ]}
            onSearch={value => {
              console.log('input', value); // eslint-disable-line
            }}
            onPressEnter={value => {
              console.log('enter', value); // eslint-disable-line
            }}
          />
          <Tooltip title={"使用文档"}>
            <a
              target="_blank"
              href="https://www.yuque.com/gdb"
              rel="noopener noreferrer"
              className={styles.action}
            >
              <Icon type="question-circle-o" />
            </a>
          </Tooltip>
          <NoticeIcon
            className={styles.action}
            count={currentUser.unreadCount}
            onItemClick={(item, tabProps) => {
              console.log(item, tabProps); // eslint-disable-line
              this.changeReadState(item, tabProps);
            }}
            loading={fetchingNotices}
            locale={{
              emptyText: formatMessage({ id: 'component.noticeIcon.empty' }),
              clear: formatMessage({ id: 'component.noticeIcon.clear' }),
              viewMore: formatMessage({ id: 'component.noticeIcon.view-more' }),
              notification: formatMessage({ id: 'component.globalHeader.notification' }),
              message: formatMessage({ id: 'component.globalHeader.message' }),
              event: formatMessage({ id: 'component.globalHeader.event' }),
            }}
            onClear={onNoticeClear}
            onPopupVisibleChange={onNoticeVisibleChange}
            onViewMore={() => message.info('Click on view more')}
            clearClose
          >
            <NoticeIcon.Tab
              count={unreadMsg.notification}
              list={noticeData.notification}
              title="notification"
              emptyText={formatMessage({ id: 'component.globalHeader.notification.empty' })}
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
              showViewMore
            />
            <NoticeIcon.Tab
              count={unreadMsg.message}
              list={noticeData.message}
              title="message"
              emptyText={formatMessage({ id: 'component.globalHeader.message.empty' })}
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
              showViewMore
            />
            <NoticeIcon.Tab
              count={unreadMsg.event}
              list={noticeData.event}
              title="event"
              emptyText={formatMessage({ id: 'component.globalHeader.event.empty' })}
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
              showViewMore
            />
          </NoticeIcon>
          {currentUser.name ? (
            <HeaderDropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar
                size="small"
                className={styles.avatar}
                src={currentUser.avatar}
                alt="avatar"
              />
              <span className={styles.name}>{currentUser.name}</span>
            </span>
            </HeaderDropdown>
          ) : (
            <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
          )}
          {/* <SelectLang className={styles.action} /> */}
        </div>
      </>

    );
  }
}
