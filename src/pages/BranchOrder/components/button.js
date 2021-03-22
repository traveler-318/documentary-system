import React, { PureComponent } from 'react';
import {
  Modal,
  Checkbox,
  Form,
  Input,
  Icon,
  Row,
  Col,
  Button,
  DatePicker,
  message,
  Switch,
  Upload,
  Select, Tooltip,
  Dropdown,
  Menu,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { getButton } from '../../../utils/authority';
const { SubMenu } = Menu;
@connect(({ globalParameters}) => ({
  globalParameters,
}))
@Form.create()
class SearchButton extends PureComponent {

  constructor(props) {

    super(props);
    this.state = {
        buttons:[],
    };
  }

  componentWillMount() {

    this.setState({
        buttons:getButton(this.props.code)
    })

    console.log(this.props.code,"获取按钮code")

  }

  handleClick = (code) => {
      this.props.btnButtonBack(code)
  }


  render() {
    const {buttons} = this.state;

    const actionButtons = buttons.filter(button => button.action === 2 || button.action === 3);

    const { tabKey } = this.props;

    let moreList = [];
    if(tabKey === 'null'){
        actionButtons.map(item=>{
            if((item.code === "place-an-order" || item.code === "transfer")){
                moreList.push(item)
            }
        })
    }

    let tabActionButtons = [];
    tabActionButtons =actionButtons;
    console.log(buttons,tabKey,moreList,"获取按钮")
    return (
      <>
        {
          tabActionButtons.map((item,index)=>{
                return (
                  <Button type={index<1?'primary':''} icon={item.source} onClick={()=>{
                    this.handleClick(item.code)
                  }}>{item.name}</Button>
                )

            })
        }
      </>
    );
  }
}

export default SearchButton;
