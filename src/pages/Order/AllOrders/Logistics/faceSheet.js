import React, { PureComponent  } from 'react';
import { connect } from 'dva';
import {
  Button,
  Form,
  Table,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import { getSurfacesingleList } from '../../../../services/newServices/logistics';
import styles from '../../../Logistics/FaceSheet/index.less';
import { EXPRESS100DATA, TEMPID } from '../../../Logistics/FaceSheet/data';


@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class FaceSheet extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data:{},
      loading:false,
      params:{
        size:10,
        current:1
      },
      selectedRowKey:['21']
    };
  }
  // ============ 初始化数据 ===============

  componentWillMount() {
    const { LogisticsConfigList } = this.props;
    this.getDataList()
  }

  getDataList = () => {
    const {params} = this.state;
    this.setState({
      loading:true
    })
    getSurfacesingleList(params).then(res=>{
      this.setState({
        loading:false
      })
      const data = res.data.records;

      for(let i=0; i<data.length; i++){
        data[i].index = i+1;
        for(let j=0; j<EXPRESS100DATA.length; j++){
          if(EXPRESS100DATA[j].num === data[i].kuaidicom){
            data[i].kuaidicom_value = EXPRESS100DATA[j].name;
            break;
          }
        }
        for(let s=0; s< TEMPID.length; s++){
          if(data[i].tempid  === TEMPID[s].id){
            data[i].tempid_value = TEMPID[s].value
          }
        }
        data[i].online_value = data[i].online === '0' ? '离线' : '在线';
      }
      this.setState({
        data:{
          list:data,
          pagination:{
            current: res.data.current,
            pageSize: res.data.size,
            total: res.data.total
          }
        }
      })
    })
  }


  render() {
    const {
      form,
    } = this.props;

    const {data,selectedRowKey,loading} = this.state;


    const columns = [
      {
        title: '快递公司编码',
        dataIndex: 'kuaidicom_value',
        width: 200,
      },
      {
        title: '打印设备码',
        dataIndex: 'siid',
        width: 200,
      },
      {
        title: '快递模板ID',
        dataIndex: 'tempid_value',
        width: 200,
      },
      {
        title: '宽',
        dataIndex: 'width',
        width: 100,
      },
      {
        title: '高',
        dataIndex: 'height',
        width: 100,
      },{
        title: '打印设备名称',
        dataIndex: 'comment',
        width: 200,
      },
      {
        title: '打印设备状态',
        dataIndex: 'online_value',
        width: 200,
        render: (res) => {
          return(
            <div>
              <span className={styles.statue} style={res === '离线' ? {background:"#dcdfe6"}:{background:"#67C23A"}}></span>{res}
            </div>
          )
        },
      },
    ];
    const rowSelection = {
      type: "radio",
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys);
      },
      getCheckboxProps: (record) => ({
        defaultChecked:selectedRowKey.includes(`${record.id}`)
      }),
    };
    return (
      <div>
        <Table rowSelection={rowSelection} loading={loading} rowKey={(record, index) => `${index}`} dataSource={data.list} columns={columns} />
      </div>

    );
  }
}
export default FaceSheet;
