import React, { PureComponent } from 'react';
import { Modal, Checkbox, Form, Input, Icon, Row, Col, Button, DatePicker, message, Switch, Upload } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import { getList,getVCode,exportOrder,getPhone } from '../../../../services/newServices/order'
import { getAccessToken, getToken } from '../../../../utils/authority';


const FormItem = Form.Item;
const { Dragger } = Upload;
const { TextArea } = Input;

@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class Text extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  componentWillMount() {

  }



  render() {
    const {
      form: { getFieldDecorator },
      textVisible,
      confirmLoading,
      handleTextCancel
    } = this.props;


    return (
      <>
        <Modal
          title="文本导入"
          width={500}
          visible={textVisible}
          onCancel={handleTextCancel}
          footer={[
            <Button key="back" onClick={handleTextCancel}>
              清除
            </Button>,
            <Button type="primary" onClick={handleTextCancel}>
              导入
            </Button>,
          ]}
        >
          <TextArea rows={8} placeholder="请输入信息" />
        </Modal>
      </>
    );
  }
}

export default Text;
