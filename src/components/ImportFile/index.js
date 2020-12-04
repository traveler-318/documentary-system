import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Upload,
  Icon,
  Switch,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Tree,
} from 'antd';
import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';
import { USER_INIT, USER_LIST, USER_ROLE_GRANT } from '../../../actions/user';
import { resetPassword } from '../../../services/user';
import { tenantMode } from '../../../defaultSettings';
import { getAccessToken, getToken } from '../../../utils/authority';

const FormItem = Form.Item;
const { TreeNode } = Tree;
const { Dragger } = Upload;

@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user,
}))
@Form.create()
class ImportFile extends PureComponent {
  state = {
    visible: false,
    excelVisible: false,
    confirmLoading: false,
    selectedRows: [],
    checkedTreeKeys: [],
    params: {},
    deptId: 0,
    isCovered: 0,
    onReset: () => {},
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(USER_INIT());
  }
 

  onClickReset = () => {
    const { onReset } = this.state;
    this.setState({ deptId: 0 });
    onReset();
  };


  handleExcelImport = () =>
    this.setState({
      excelVisible: false,
    });

  handleExcelCancel = () =>
    this.setState({
      excelVisible: false,
    });



  onUpload = info => {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} 数据导入成功!`);
      this.handleExcelCancel();
      this.onClickReset();
    } else if (status === 'error') {
      message.error(`${info.file.response.msg}`);
    }
  };


  render() {
    const code = 'user';

    const { visible, excelVisible, confirmLoading, checkedTreeKeys, isCovered } = this.state;

    const {
      form,
      loading,
      user: {
        data,
        init: { roleTree, deptTree },
      },
    } = this.props;

    const uploadProps = {
      name: 'file',
      headers: {
        'Blade-Auth': getToken(),
      },
      action: `/api/blade-user/import-user?isCovered=${isCovered}`,
    };


    return (
      <>
        <Modal
          title="用户数据导入"
          width={500}
          visible={excelVisible}
          maskClosable={false}
          confirmLoading={confirmLoading}
          onOk={this.handleExcelImport}
          onCancel={this.handleExcelCancel}
          okText="确认"
          cancelText="取消"
        >
          <Form style={{ marginTop: 8 }} hideRequiredMark>
            <FormItem {...formItemLayout} label="模板上传">
              <Dragger {...uploadProps} onChange={this.onUpload}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">将文件拖到此处，或点击上传</p>
                <p className="ant-upload-hint">请上传 .xls,.xlsx 格式的文件</p>
              </Dragger>
            </FormItem>
          </Form>
        </Modal>
      </>
    );
  }
}
export default ImportFile;
