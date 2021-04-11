import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Cascader, DatePicker,
} from 'antd';
import { FormattedMessage } from 'umi/locale';
import { LOGISTICSSTATUS, ORDERSOURCE, ORDERTYPPE } from '@/pages/BranchOrder/components/data';
import { productTreelist } from '@/services/newServices/order';
import { branchTree,branchSalesman } from '@/services/branch';

const { RangePicker } = DatePicker;

@Form.create()
class QueryParamPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      branchDatas:[],//分公司数据
      productList:[],
      salesmanList:[],
      buttons:[],
    };
  }

  componentWillMount() {
    this.getTreeList();
    this.getBranchTree();
  }


  getTreeList = () => {
    productTreelist().then(res=>{
      this.setState({productList:res.data})
    })
  }

  //查询分公司
  getBranchTree = () =>{
    const {form} = this.props;
    branchTree().then(res=>{
      this.setState({branchDatas:res.data})
      if(res.data && res.data.length>0){
        // form.setFieldsValue({
        //   tenantId: res.data[0].tenantId
        // });
        this.changeGroup(res.data[0].tenantId);
      }
    })
  }

  // 选择组织
  changeGroup = (value) => {
    if(value){
      this.getBranchSalesman(value);
    }
  }

  // 根据组织获取对应的业务员数据
  getBranchSalesman(value){
    branchSalesman({
      tenantId:value || null
    }).then(res=>{
      if(res.code === 200 && res.data.length>0){
          res.data.unshift({user_account:'',user_name:'全部'});
          this.setState({
            salesmanList:res.data
          })
      }else{
        this.setState({
          salesmanList:[]
        })
      }
    })
  }

  render() {
    const { branchDatas,productList,salesmanList } = this.state;
    const { getFieldDecorator,params,onReset } = this.props;
    return (
      <div className={"default_search_form"}>
        <Form.Item label="姓名">
          {getFieldDecorator('userName',{
          })(<Input placeholder="请输入姓名" />)}
        </Form.Item>
        <Form.Item label="手机号">
          {getFieldDecorator('userPhone',{
          })(<Input placeholder="请输入手机号" />)}
        </Form.Item>
        <Form.Item label="SN">
          {getFieldDecorator('productCoding',{
          })(<Input placeholder="请输入SN" />)}
        </Form.Item>
        <Form.Item label="订单类型">
          {getFieldDecorator('orderType', {
          })(
            <Select placeholder={"请选择订单类型"} style={{ width: 120 }}>
              {ORDERTYPPE.map(item=>{
                return (<Select.Option value={item.key}>{item.name}</Select.Option>)
              })}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="分公司">
          {getFieldDecorator('tenantId', {
          })(
            <Select placeholder={"请选择分公司"} style={{ width: 200 }}
                    onChange={this.changeGroup}>
              {branchDatas.map(item=>{
                return (<Select.Option value={item.tenantId}>{item.tenantName}</Select.Option>)
              })}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="销售">
          {getFieldDecorator('salesman', {
          })(
            <Select mode="multiple" placeholder={"请选择销售"} style={{ width: 200 }}>
              {salesmanList.map((item,index)=>{
                return (<Select.Option key={index} value={item.user_account}>{item.user_name}</Select.Option>)
              })}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="订单来源">
          {getFieldDecorator('orderSource', {
          })(
            <Select placeholder={"请选择订单来源"} style={{ width: 120 }}>
              {ORDERSOURCE.map(item=>{
                return (<Select.Option value={item.key}>{item.name}</Select.Option>)
              })}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="物流状态">
          {getFieldDecorator('logisticsStatus', {
            initialValue: params.logisticsStatus ? params.logsticsStatus : "全部",
          })(
            <Select placeholder={"请选择物流状态"} style={{ width: 120 }}>
              {LOGISTICSSTATUS.map(item=>{
                return (<Select.Option value={item.key}>{item.name}</Select.Option>)
              })}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="产品分类">
          {getFieldDecorator('productType', {
          })(
            <Cascader
              style={{ width: 260 }}
              options={productList}
              fieldNames={{ label: 'value',value: "id"}}
              changeOnSelect={true}
            ></Cascader>
          )}
        </Form.Item>
        <div>
          <Form.Item label="下单时间">
            {getFieldDecorator('dateRange', {
            })(
              <RangePicker showTime size={"default"} />
            )}
          </Form.Item>
          <Form.Item label="发货时间">
            {getFieldDecorator('printTime', {
            })(
              <RangePicker showTime size={"default"} />
            )}
          </Form.Item>


          <div style={{ float: 'right' }}>
            <Button type="primary" htmlType="submit">
              <FormattedMessage id="button.search.name" />
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={()=>{
              // this.getSalesman();
              onReset()
            }}>
              <FormattedMessage id="button.reset.name" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default QueryParamPage;
