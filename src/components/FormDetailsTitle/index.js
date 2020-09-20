import React, { PureComponent } from 'react';
import { Icon } from 'antd';

let styles = {
    // borderLeft: '3px solid blue',
    lineHeight: '16px',
    paddingLeft: '6px',
    marginBottom: '20px',
}

class FormDetailsTitle extends PureComponent {

  render() {
    const {
      title
    } = this.props;

    return (
    <div style={styles}><Icon style={{marginRight:10}} type="tag" theme="filled" />{title}</div>
    );
  }
}

export default FormDetailsTitle;
