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

  ImporMenu = () => (
    <Menu onClick={value=>{
        this.handleClick(value.key)
    }}>
      <Menu.Item key="SN-import">
        <Icon type="upload" />
        SN激活导入
      </Menu.Item>
      <Menu.Item key="text-import">
        <Icon type="upload" />
        文本导入
      </Menu.Item>
      <Menu.Item key="order-import">
        <Icon type="upload" />
        表格导入
      </Menu.Item>
    </Menu>
  );
  moreMenu = (moreList) => {
      return (

      <Menu onClick={this.handleMenuClick}>
          {
              moreList.map(item=>{
                  // if(item.code === "place-an-order"){
                  //   return (
                  //       <SubMenu key="sub1" title="批量物流下单">
                  //           <Menu.Item key="6" onClick={()=>this.handleClick('repeat-printing')}>
                  //               重复打印
                  //           </Menu.Item>
                  //           <Menu.Item key="7" onClick={()=>this.handleClick('first-printing')}>
                  //               首次打印
                  //           </Menu.Item>
                  //       </SubMenu>
                  //   )
                  // }else if(item.code === "transfer"){
                  //   return (
                  //       <Menu.Item key="4"  onClick={()=>this.handleClick('transfer')}>
                  //           <Icon type="loading-3-quarters" />
                  //           转移客户
                  //       </Menu.Item>
                  //   )
                  // }
                if(item.code === "transfer"){
                  return (
                    <Menu.Item key="4"  onClick={()=>this.handleClick('transfer')}>
                      <Icon type="loading-3-quarters" />
                      转移客户
                    </Menu.Item>
                  )
                }
              })
          }


      </Menu>
    )
  };

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

    let i = -1;
    let tabActionButtons = [];
    if(tabKey === '3'){
      actionButtons.map(item=>{
        if(item.code === "subscribe"){
          tabActionButtons[0] =item
        }else if(item.code === 'export'){
          tabActionButtons[1] =item
        }else if(item.code === 'resetLogistics'){
          tabActionButtons[2] =item
        }
      })
    }else if(tabKey === '2'){
      actionButtons.map(item=>{
        if(item.code === "subscribe"){
          tabActionButtons[1] =item
        }else if(item.code === 'export'){
          tabActionButtons[2] =item
        }else if(item.code === 'deliver-goods'){
          tabActionButtons[0] =item
        }
      })
    }else{
      tabActionButtons =actionButtons;
    }
    console.log(buttons,tabKey,moreList,"获取按钮")
    return (
      <>
        {
          tabActionButtons.map((item,index)=>{

            // console.log(item,tabKey,"item")
                // if(tabKey === 'null' && (item.code === "place-an-order" || item.code === "transfer")){

                //     moreList.push(item);
                //     this.setState({
                //         moreList
                //     })
                // }
                if(tabKey === '0' && (item.code === "add" || item.code === "last-trial" || item.code === "first-trial" || item.code === "synchronization")){
                  i++;
                // 待审核
                    return (
                        <Button type="primary" type={i<2?'primary':''} icon={item.source} onClick={()=>{
                            this.handleClick(item.code)
                        }}>{item.name}</Button>
                    )
                }else if(tabKey === '1' && (item.code === "last-trial")){
                  i++;
                    // 已初审
                    return (
                        <Button type={i===0?'primary':''} icon={item.source} onClick={()=>{
                            this.handleClick(item.code)
                        }}>{item.name}</Button>
                    )
                }else if(tabKey === '2' && (item.code === "deliver-goods" || item.code === "subscribe" )){
                  i++;
                    // 已终审
                    return (
                        <Button type={i===0?'primary':''} icon={item.source} onClick={()=>{
                            this.handleClick(item.code)
                        }}>{item.name}</Button>
                    )
                }else if(tabKey === '3' && (item.code === "subscribe" || item.code === 'resetLogistics')){
                  i++;
                    // 已发货
                    return (
                        <Button type={i===0?'primary':''} icon={item.source} onClick={()=>{
                            this.handleClick(item.code)
                        }}>{item.name}</Button>
                    )
                }else if(tabKey === '4' && (item.code === 'returnOfGoods' || item.code === 'resetLogistics')){
                  i++;
                  // 在途中
                  return (
                    <Button type={i===0?'primary':''} icon={item.source} onClick={()=>{
                      this.handleClick(item.code)
                    }}>{item.name}</Button>
                  )
                }else if(tabKey === '5' && (item.code === "bell" || item.code === 'returnOfGoods' || item.code === 'resetLogistics')){
                  i++;
                    // 已签收
                    return (
                        <Button type={i===0?'primary':''} icon={item.source} onClick={()=>{
                            this.handleClick(item.code)
                        }}>{item.name}</Button>
                    )
                }else if(tabKey === '6' && (item.code === "bell" || item.code === 'returnOfGoods')){
                  i++;
                    // 跟进中
                    return (
                        <Button type={i===0?'primary':''} icon={item.source} onClick={()=>{
                            this.handleClick(item.code)
                        }}>{item.name}</Button>
                    )
                }else if(tabKey === '7' && item.code === 'returnOfGoods'){
                  i++;
                  // 已激活
                  return (
                    <Button type={i===0?'primary':''} icon={item.source} onClick={()=>{
                      this.handleClick(item.code)
                    }}>{item.name}</Button>
                  )
                }
                // else if(tabKey === '10' && item.code === 'Claim'){
                //   i++;
                //     // 已过期
                //     return (
                //         <Button type={i===0?'primary':''} icon={item.source} onClick={()=>{
                //             this.handleClick(item.code)
                //         }}>{item.name}</Button>
                //     )
                // }
                else if(tabKey === 'null' && (item.code === "add" || item.code === "bell" || item.code === 'Import' || item.code === 'overdue' || item.code === 'timeConsuming')){
                  i++;
                    // 全部
                    if(item.code === 'Import'){
                        return (
                            <Dropdown overlay={this.ImporMenu()}>
                                <Button>
                                    导入<Icon type="down" />
                                </Button>
                            </Dropdown>
                        )
                    }else{
                        return (
                            <Button type={i<2?'primary':''} icon={item.source} onClick={()=>{
                                this.handleClick(item.code)
                            }}>{item.name}</Button>
                        )
                    }
                }
                {/* 已激活什么都没有 */}
                {/* 已退回什么都没有 */}
                {/* 已取消什么都没有 */}
                if(item.code === 'export'){
                  i++;
                    return (
                        <Button type={i===0?'primary':''} icon={item.source} onClick={()=>{
                            this.handleClick(item.code)
                        }}>{item.name}</Button>
                    )
                }
                if(item.code === 'status-change'){
                  i++;
                    return (
                        <Button type={i===0?'primary':''} icon={item.source} onClick={()=>{
                            this.handleClick(item.code)
                        }}>{item.name}</Button>
                    )
                }
                if(item.code === 'deliverGoodsTime'){
                  i++;
                    return (
                        <Button type={i===0?'primary':''} icon={item.source} onClick={()=>{
                            this.handleClick(item.code)
                        }}>{item.name}</Button>
                    )
                }
            })
        }
        {
            moreList.length > 0 ? (
                <Dropdown overlay={this.moreMenu(moreList)}>
                    <Button>
                        更多 <Icon type="down" />
                    </Button>
                </Dropdown>
            ): ""
        }
      </>
    );
  }
}

export default SearchButton;
