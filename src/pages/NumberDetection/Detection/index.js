import React, { PureComponent } from 'react';
import { connect } from 'dva';
import echarts from 'echarts'
import {
  Form,
  DatePicker,
  Icon,
  Table,
  Button,
} from 'antd';
import Panel from '../../../components/Panel';
import { FormattedMessage } from 'umi/locale';
import styles from './index.less';
import moment from 'moment';

const { RangePicker,MonthPicker } = DatePicker;

@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class Detection extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  // ============ 初始化数据 ===============
  componentWillMount() {

  }

  render() {
    const code = 'detection';

    const {
      form,
    } = this.props;
    const { getFieldDecorator } = form;

    return (
      <>
        <span>号码检测</span>
      </>
    );
  }
}
export default Detection;
