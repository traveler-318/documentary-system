import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, List, Form, Input, Row, Tabs, Card, message, Tooltip, Icon } from 'antd';
import { getUnWeChatBind } from '../../../services/newServices/recharge';
import Panel from '../../../components/Panel';
import styles from './index.less';
import { subscription } from '../../../services/newServices/order';
import BindingQRCode from './components/code';
import { getUserInfo, getTenantInfo } from '../../../services/user';

const FormItem = Form.Item;
const { TabPane } = Tabs;

@connect(({ post, loading }) => ({
  post,
  loading: loading.models.post,
}))
@Form.create()

class SalesmanRecharge extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      price:'0',
      valuePrice:'',
      list:[{
        number:5,
      },{
        number:10,
      },{
        number:20,
      },{
        number:50,
      },{
        number:100,
      }],
      unitPrice:"",
      bindingQRCodeVisible:false,
      bindingQRCode:'',
      money:'',
      remainingMoney:''
    }
  }

  componentDidMount() {
    getUserInfo().then(resp => {
      if (resp.code === 200) {
        console.log(resp)
        this.setState({ remainingMoney: resp.data.remainingMoney});
      } else {
        message.error(resp.msg || '获取数据失败');
      }
    });
    getTenantInfo().then(resp => {
      console.log(resp)
      if (resp.code === 200) {
        // 0 = 试用  1标准  2企业
        // 企业版的是60元/人
        // 标准版的是80元/人

        let _list = this.state.list.map(item=>{
          item.price = item.number * (resp.data.version === '1' ? 80 : 60);
          return item
        })

        this.setState({
          version:resp.data.version,
          unitPrice:resp.data.version === '1' ? '80' : '60',
          list:_list
        });
      }
    });
  }

  // ============ 提交 ===============
  handleSubmit = (item) => {
    console.log(item)
    // message.error("充值功能正在维护!如有需要请联系负责人充值")
    getUnWeChatBind().then(res=>{
      console.log(res)
      if(res.code === 200){
        const url=res.data+"&money="+item.price;
        this.setState({
          bindingQRCode:url,
          bindingQRCodeVisible:true,
          money:item.price
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
      price:Number(e.target.value)/0.1
    })
  };

  accMul = (arg1,arg2) => {
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
  }

  onKeyDown = (e) => {
    const price=e.target.value
    if(e.keyCode === 13) {
      if(e.target.value % 10 == 0){
        // message.error("充值功能正在维护!如有需要请联系负责人充值")

        getUnWeChatBind().then(res=>{
          if(res.code === 200){
            const url=res.data+"&money="+price;
            console.log(url)
            this.setState({
              bindingQRCode:url,
              bindingQRCodeVisible:true,
              money:price
            })
          }else {
            message.error(res.msg)
          }
        })
      }else{
        message.error("仅支持10的整数倍,请输入正确的数量")
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

    const {
      price,
      list,
      valuePrice,
      bindingQRCodeVisible,
      bindingQRCode,
      money,
      remainingMoney,
      version,
      unitPrice
    }=this.state;

    return (
      <div>
            <div style={{height:'120px',boxShadow: "0px 0px 10px 0px rgba(0,37,106,0.1)",padding:"20px",margin:'20px 20px',fontSize:"18px",background:"#fff",width:"80%",}}>
              业务员余额：{remainingMoney}个
              {/*今天已发送<span style={{color:"#f50"}}>0</span>条短信，累计发送<span style={{color:"#f50"}}>0</span>条短信，剩余短信<span style={{color:"#f50"}}>0</span>条*/}
            </div>
            <List grid={{ gutter: 24, column: 6 }}>
              {list.map(item=>{
                return (
                  <List.Item onClick={()=>this.handleSubmit(item)}>
                    <Card className={styles.item}>
                      <p className={styles.number}>{item.number}个</p>
                      {/* // 0 = 试用  1标准  2企业
                      // 企业版的是60元/人
                      // 标准版的是80元/人 */}
                      <span>{unitPrice}元/人</span>
                      <p className={styles.price}>{item.price}元</p>
                    </Card>
                  </List.Item>
                )
              })}
              {/* <List.Item>
                <Card className={styles.item}>
                  <input style={{fontSize:"14px"}} type='Number' placeholder='点击输入金额回车确认' value={valuePrice} onChange={(e)=>this.onChange(e)} onKeyDown={(e)=>this.onKeyDown(e)} />
                  <span>0.1/条</span>
                  <p className={styles.price}>{price}条</p>
                  <p>仅支持10的整数倍</p>
                </Card>
              </List.Item> */}
            </List>
            {/* <div className={styles.tips}>
              购买说明：1.短信0.1元每条。
              <br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.余额永久有效，您可以放心充值。
              <br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.预充值金额不支持退款，请根据您的业务量按需充值。
            </div> */}
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
            money={money}
            handleCancelBindingQRCode={this.handleCancelBindingQRCode}
          />
        ):""}
      </div>
    );
  }
}
export default SalesmanRecharge;
