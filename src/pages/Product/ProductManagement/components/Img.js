import React, { PureComponent } from 'react';
import {
  Modal,
  Checkbox,
  Form,
  Input,
  Button,
  message,
  Radio,
  Table, Select, Icon, Tooltip,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { getCookie } from '../../../../utils/support';
import { getImg} from '../../../../services/newServices/product';


const { Option } = Select;
const FormItem = Form.Item;
@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class Background extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data:[],
      senderId:'',

    };
  }


  componentWillMount() {

    const {ImgDetails}=this.props
  }


  // ======确认==========

  handleSubmit = () => {
    const {  list } = this.state;
    this.props.handleClick(list)
    this.props.handleCancelImg(list)
  };

  onChange = (row) => {
    console.log(row)
    this.setState({
      list:row
    })
  }


  render() {
    const {
      form: { getFieldDecorator },
      handleImgDetailsVisible,
      handleCancelImgDetails,
      ImgDetails
      } = this.props;

    return (
      <div>
        <Modal
          title="选择图片"
          visible={handleImgDetailsVisible}
          width={550}
          onCancel={handleCancelImgDetails}
          footer={[
            <Button key="back" onClick={handleCancelImgDetails}>
              取消
            </Button>
          ]}
        >
         <img src={ImgDetails} style={{ width: '100%' }}/>
        </Modal>

      </div>
    );
  }
}

export default Background;
