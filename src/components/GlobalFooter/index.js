import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

const GlobalFooter = ({ className, links, copyright }) => {
  const clsString = classNames(styles.globalFooter, className);
  return (
    <footer className={clsString}>
      {links && (
        <div className={styles.links}>
          {links.map(link => (
            <a
              key={link.key}
              title={link.key}
              target={link.blankTarget ? '_blank' : '_self'}
              href={link.href}
              style={{color:"rgba(0, 0, 0, 0.45) !important"}}
            >
              {link.title}
            </a>
          ))}
        </div>
      )}
      {copyright && <div className={styles.copyright} style={{color:"rgba(0, 0, 0, 0.45) !important"}}>{copyright}</div>}
    </footer>
  );
};

export default GlobalFooter;
