import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, List, Form, Input, Row, Tabs, Card, message } from 'antd';
import { getUnWeChatBind } from '../../../services/newServices/recharge';
import Panel from '../../../components/Panel';
import styles from './index.less';
import { subscription } from '../../../services/newServices/order';
import BindingQRCode from './components/code';

const FormItem = Form.Item;
const { TabPane } = Tabs;

@connect(({ post, loading }) => ({
  post,
  loading: loading.models.post,
}))
@Form.create()

class SmsRecharge extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      price:'0',
      valuePrice:'',
      list:[{
        number:'500',
        price:'50'
      },{
        number:'1000',
        price:'100'
      },{
        number:'2000',
        price:'200'
      }],
      bindingQRCodeVisible:false,
      bindingQRCode:''
    }
  }

  // ============ 提交 ===============
  handleSubmit = (item) => {
    console.log(item)
    getUnWeChatBind().then(res=>{
      console.log(res)
      if(res.code === 200){
        const url=res.data+"&money="+item.price;
        this.setState({
          bindingQRCode:url,
          bindingQRCodeVisible:true,
        })
      }else {
        message.error(res.msg)
      }
    })
  };

  onChange = (e) => {
    console.log(e.target.value)
    this.setState({
      valuePrice:e.target.value,
      price:Number(e.target.value)*0.1
    })
  };

  onKeyDown = (e) => {
    console.log(e)
    console.log(e.target.value)
    const {price}=this.state;
    if(e.keyCode === 13) {
      if(e.target.value % 100 == 0){
        
        getUnWeChatBind().then(res=>{
          console.log(res)
          if(res.code === 200){
            const url=res.data+"&money="+price;
            this.setState({
              bindingQRCode:url,
              bindingQRCodeVisible:true,
            })
          }else {
            message.error(res.msg)
          }
        })
      }else{
        message.error("仅支持100的整数倍,请输入正确的数量")
      }
      
    }

  };

  // =========关闭二维码弹窗========
  handleCancelBindingQRCode = () => {
    this.setState({
      bindingQRCodeVisible:false,
    })
  }

  // ============ 查询表单 ===============
  renderSearchForm = onReset => {

  };

  render() {
    const code = 'SmsRecharge';

    const {price,list,valuePrice,bindingQRCodeVisible,bindingQRCode}=this.state;

    return (
      <Panel>
        <Tabs type="card" onChange={this.statusChange}>
          <TabPane tab='短信充值' className={styles.tab} style={{paddingTop:"20px"}}>
            <div style={{height:'120px',boxShadow: "0px 0px 10px 0px rgba(0,37,106,0.1)",padding:"20px",margin:'20px 20px',fontSize:"18px",background:"#fff",width:"80%",}}>
              今天已发送<span style={{color:"#f50"}}>0</span>条短信，累计发送<span style={{color:"#f50"}}>0</span>条短信，剩余短信<span style={{color:"#f50"}}>0</span>条
            </div>
            <List grid={{ gutter: 16, column: 5 }}>
              {list.map(item=>{
                return (
                  <List.Item onClick={()=>this.handleSubmit(item)}>
                    <Card className={styles.item}>
                      <p className={styles.number}>{item.number}条</p>
                      <span>0.1/条</span>
                      <p className={styles.price}>{item.price}元</p>
                    </Card>
                  </List.Item>
                )
              })}
              <List.Item>
                <Card className={styles.item}>
                  <input placeholder='点击输入' value={valuePrice} onChange={(e)=>this.onChange(e)} onKeyDown={(e)=>this.onKeyDown(e)} />
                  <span>0.1/条</span>
                  <p className={styles.price}>{price}元</p>
                  <p>仅支持100的整数倍</p>
                </Card>
              </List.Item>
            </List>
            <div className={styles.tips}>
              购买说明：1.短信0.1元每条。
              <br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.余额永久有效，您可以放心充值。
              <br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.预充值金额不支持退款，请根据您的业务量按需充值。
            </div>
          </TabPane>
        </Tabs>
{/*
        <Tabs type="card" onChange={this.statusChange}>
          <TabPane tab='充值记录'>

          </TabPane>
        </Tabs>
*/}

        {/* 二维码 */}
        {bindingQRCodeVisible?(
          <BindingQRCode
            bindingQRCodeVisible={bindingQRCodeVisible}
            bindingQRCode={bindingQRCode}
            handleCancelBindingQRCode={this.handleCancelBindingQRCode}
          />
        ):""}
      </Panel>
    );
  }
}
export default SmsRecharge;
