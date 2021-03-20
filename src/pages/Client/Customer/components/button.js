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
import { getButton } from '../../../../utils/authority';
import { getCookie } from '../../../../utils/support';
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
      userName:getCookie("userName")

    };
  }

  componentWillMount() {

    this.setState({
        buttons:getButton(this.props.code)
    })

  }

  handleClick = (code) => {
      this.props.btnButtonBack(code)
  }
  render() {
    const {buttons,userName} = this.state;

    const actionButtons = buttons.filter(button => button.action === 2 || button.action === 3);

    const { tabKey } = this.props;
    let i = -1;
    return (
      <>
        {
          actionButtons.map((item,index)=>{
            console.log(item,tabKey,"item")
            if(item.code === "add"){
              i++;
              // 添加
              return (
                <Button type="primary" icon={item.source} onClick={()=>{
                  this.handleClick(item.code)
                }}>{item.name}</Button>
              )
            }else if(item.code === "Distribution"){
              if(userName === 'admin'){
                i++;
                return (
                  <Button type={i===0?'primary':''} icon={item.source} onClick={()=>{
                    this.handleClick(item.code)
                  }}>{item.name}</Button>
                )
              }
            }else {
              i++;
              return (
                <Button icon={item.source} onClick={()=>{
                  this.handleClick(item.code)
                }}>{item.name}</Button>
              )
            }

          })
        }
      </>
    );
  }
}

export default SearchButton;
