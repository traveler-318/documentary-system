/**
 * Created by Lenovo on 2020/9/28.
 */
import React, { PureComponent } from 'react';
import {
  Modal,
  Checkbox,
  Form,
  Input,
  Button,
  message,
  Radio,
  Timeline,
  Table,
  Empty
} from 'antd';
import { connect } from 'dva';
import styles from './edit.less';
import moment from 'moment';
import router from 'umi/router';
import { getCookie } from '../../../../utils/support';
import { logisticsQuery } from '../../../../services/newServices/order';
import { getLogisticsQuery } from './data';


@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class LogisticsDetails extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {

    };
  }


  componentWillMount() {

  }

  render() {
    const {
      visible,
      handleImgModal,
      ImgBig
      } = this.props;

    return (
      <div>
        <Modal
          visible={visible}
          maskClosable={false}
          onCancel={handleImgModal}
          width={700}
          footer={null}
        >
          <div>
            <img style={{width:'100%'}} src={ImgBig} />
          </div>
        </Modal>
      </div>
    );
  }
}

export default LogisticsDetails;
