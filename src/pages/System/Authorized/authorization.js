import React, { PureComponent } from 'react';
import {
  Modal,
  Form,
  Button,
  message,
  Icon,
  Alert
} from 'antd';
import copy from 'copy-to-clipboard';

@Form.create()
class Authorization extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,//确定按钮 loading
      isVisible: true,
    };
  }

  componentWillMount() {

  }
  copyData(authorizaDataInfo){
    let text = `AccessKey ID：${authorizaDataInfo.authorizationId} AccessKey Secret：${authorizaDataInfo.authorizationToken}`;
    copy(text);
    message.success('复制成功');
  }

  render() {
    // const {
    //   isVisible,
    // } = this.props;

    const { authorizaDataInfo,handleCancel } = this.props;
    const { confirmLoading, isVisible } = this.state;

    return (
      <>
        <Modal
          title="创建密钥"
          width={550}
          visible={isVisible}
          confirmLoading={confirmLoading}
          maskClosable={false}
          footer={[
            <Button key="back" onClick={() => {
              this.setState({
                isVisible: false,
              });
              handleCancel();
            }}>
              关闭
            </Button>,
          ]}
          onCancel={() => {
            this.setState({
              isVisible : false
            })
            handleCancel();
          }}
        >
          <Alert
            message="创建成功"
            description="创建成功，请及时保存"
            type="success"
            showIcon
          />
          <br/>
          <div className={'ant-alert-with-description ant-alert-success'} style={{fontWeight:"bold"}}>
            <div>AccessKey ID：{authorizaDataInfo.authorizationId}</div>
            <div>AccessKey Secret：{authorizaDataInfo.authorizationToken}</div>
          </div>

          <br/>
          <div>
            <a onClick={()=>this.copyData(authorizaDataInfo)}><Icon type="copy" />复制</a>
          </div>
        </Modal>

      </>
    );
  }
}

export default Authorization;
