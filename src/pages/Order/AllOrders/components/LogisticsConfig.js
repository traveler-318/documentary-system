import React, { PureComponent } from 'react';
import { Modal, Checkbox, Form, Input, Card, Row, Col, Button, TreeSelect, Select, DatePicker, message, Cascader, Radio } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import { tenantMode } from '../../../../defaultSettings';
import { getCookie } from '../../../../utils/support';
import {equipment} from '../../../../services/newServices/order'
import styles from '../index.less';
import Authority from '../Logistics/authority'

const FormItem = Form.Item;
const { TextArea } = Input;


@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class LogisticsConfig extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      detail:{},
      data:{

      },
      checked:true,
      checked1:true,
      AuthorityVisible:false,
    };
  }

  componentWillMount() {
    const { LogisticsConfigList } = this.props;
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { detail } = this.state;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.deptId = getCookie("dept_id");
        values = {...values};
        values.outOrderNo = detail.outOrderNo
        values.id = detail.id
        values.sms_confirmation = false;

        equipment(values).then(res=>{
          if(res.code === 200){
            message.success(res.msg);
            this.props.handleCancelLogisticsConfig("getlist");
          }
        })
      }
    });
  };
  onChange = e => {
    console.log('checked = ', e.target.checked);
    this.setState({
      checked: e.target.checked,
    });
  };

  onChange1 = e => {
    console.log('checked = ', e.target.checked);
    this.setState({
      checked1: e.target.checked
    });
  };

  handleBulkDelivery = (e) =>{
    console.log(e)
    if(e === "基础授权配置"){
      this.setState({
        AuthorityVisible:true,
        title:e,
      })
    }
  }

  // 关闭物流弹窗
  handleCancel = () => {
    this.setState({
      AuthorityVisible:false
    })
  }

  render() {
    const {
      form: { LogisticsConfigList },
      LogisticsConfigVisible,
      handleCancelLogisticsConfig,
      } = this.props;

    const {
      loading,
      checked,
      checked1,
      AuthorityVisible,
      title,
      data
      } = this.state;

    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const formAllItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };
    // confirmTag
    return (
      <div>
        <Modal
          title="物流配置"
          visible={LogisticsConfigVisible}
          width={560}
          onCancel={handleCancelLogisticsConfig}
          footer={[
            <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
              确定
            </Button>,
          ]}
        >
          <Button className={styles.logisticsButton} onClick={()=>this.handleBulkDelivery('基础授权配置')}>
            基础授权配置
          </Button>
          <Button className={styles.logisticsButton} onClick={()=>this.handleBulkDelivery('打印模板')}>
            打印模板
          </Button>
          <Button className={styles.logisticsButton} onClick={()=>this.handleBulkDelivery('寄件人信息')}>
            寄件人信息
          </Button>
          <Button className={styles.logisticsButton} onClick={()=>this.handleBulkDelivery('物品信息')}>
            物品信息
          </Button>
          <Button className={styles.logisticsButton} onClick={()=>this.handleBulkDelivery('附加信息')}>
            附加信息
          </Button>
          <div className={styles.checkbox}>
            <Checkbox onChange={this.onChange} checked={checked} style={{color:"#409eff"}}>物流订阅</Checkbox>
            <Checkbox onChange={this.onChange1} checked={checked1} style={{color:"#409eff"}}>发货提醒</Checkbox>
          </div>
        </Modal>
        <Modal
          title="物流配置"
          visible={AuthorityVisible}
          width={860}
        >
          {/* 基础授权配置 */}
          {AuthorityVisible?(
            <Authority
              AuthorityVisible={AuthorityVisible}
              LogisticsConfigList={title}
              handleCancel={this.handleCancel}
            />
          ):""}

        </Modal>
      </div>

    );
  }
}

export default LogisticsConfig;
