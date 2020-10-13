import React, { PureComponent } from 'react';
// import styles from './index.less'

let styles = {
    borderLeft: '3px solid #52b7b4',
    lineHeight: '16px',
    paddingLeft: '6px',
    marginBottom: '20px',
}

class FormTitle extends PureComponent {

  render() {
    const {
      title
    } = this.props;

    return (
    <div style={styles}>{title}</div>
    );
  }
}

export default FormTitle;
