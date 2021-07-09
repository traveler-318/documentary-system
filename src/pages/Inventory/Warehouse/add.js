import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Button,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  Divider,
  Icon,
  Radio,
  Modal,
  message,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';
import {
  warehouseList,
  warehouseSave
} from '../../../services/newServices/inventory';
import { getCookie } from '../../../utils/support';

const FormItem = Form.Item;
const { TextArea } = Input;
@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class WarehouseAdd extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  // ============ 初始化数据 ===============

  componentWillMount() {

  }

  handleSubmit = () => {
    const {  form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      values.deptId = getCookie("dept_id");
      if (!err) {
        const params = {
          ...values
        };
        warehouseSave(params).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
          }
        })
      }
    });
  };


  renderRightButton = () => (
    <>

    </>
  );

  render() {
    const {
      form:{ getFieldDecorator },
      warehouseVisible,
      handleCancelWarehouse
    } = this.props;

    const formAllItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };
    return (
      <Modal
        title="新建仓库"
        visible={warehouseVisible}
        maskClosable={false}
        destroyOnClose
        width={600}
        onCancel={handleCancelWarehouse}
        footer={[
          <Button key="back" onClick={handleCancelWarehouse}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={()=>this.handleSubmit()}>
            确定
          </Button>,
        ]}
      >
        <Form>
          <FormItem {...formAllItemLayout} label="仓库名称">
            {getFieldDecorator('warehouseName', {
              rules: [
                {
                  required: true,
                  message: '请输入仓库名称',
                },
              ],
            })(
              <Input placeholder="请输入仓库名称" />
            )}
          </FormItem>
          <FormItem {...formAllItemLayout} label="仓库位置">
            {getFieldDecorator('warehousePosition', {
              rules: [
                {
                  required: true,
                  message: '请输入仓库位置',
                },
              ],
            })(
              <Input placeholder="请输入仓库位置" />
            )}
          </FormItem>
          <FormItem {...formAllItemLayout} label="状态">
            {getFieldDecorator('warehouseStauts', {
              rules: [
                {
                  required: true,
                  message: '请选择仓库状态',
                },
              ],
            })(
              <Radio.Group onChange={this.onChangeRadio}>
                <Radio value={0}>启用</Radio>
                <Radio value={1}> 禁用</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem {...formAllItemLayout} label="备注">
            {getFieldDecorator('remarks')(
              <TextArea
                rows={3}
                onChange={this.TextAreaChange}
                placeholder='请输入描述信息'
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
export default WarehouseAdd;
