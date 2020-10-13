import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      copyright={
        <Fragment>
          
          <a
            key="github"
            title="git"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.ruanmao.cn"
          >
            Copyright <Icon type="copyright" /> 2020 厦门软猫科技有限公司{' '}
          </a>
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
