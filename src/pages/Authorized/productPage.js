import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Button,
  Form, message, Modal,
} from 'antd';
import Grid from '../../components/Sword/Grid';
import {
  getProductattributeList
} from '../../services/newServices/product';
import moment from 'moment';
import Img from '@/pages/Product/ProductManagement/components/Img';

@connect(({ globalParameters }) => ({
  globalParameters,
}))
@Form.create()
class AuthorizedProductPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data:{ },
      loading:false,
      selectDataArr:[],
      columns: [
        {
          title: '编号',
          dataIndex: '',
          width: 60,
          render: (res,rows,index) => {
            return(
              index+1
            )
          },
        },
        {
          title: '页面标题',
          dataIndex: 'h5Title',
          width: 200,
        },
        {
          title: '页面背景',
          dataIndex: 'h5Background',
          width: 80,
          render: (res,row) => {
            return(
              <div>
                {
                  res === '' ?
                    (res)
                    :(<a onClick={()=>this.handleImg(row)}>查看</a>)
                }
              </div>
            )
          },
        },
        {
          title: '产品',
          dataIndex: 'productName',
          width: 200,
        },
        {
          title: '类型',
          dataIndex: 'productTypeName',
          width: 140,
        },
        {
          title: '支付公司',
          dataIndex: 'payPanyName',
          width: 300,
        },
        {
          title: '价格',
          dataIndex: 'price',
          width: 100,
        },
        {
          title: '自定义1',
          dataIndex: 'customOne',
          width: 150,
        },
        {
          title: '自定义2',
          dataIndex: 'customTwo',
          width: 150,
        },
        {
          title: '自定义3',
          dataIndex: 'customThree',
          width: 150,
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 180,
          render: (res) => {
            return(
              <div>
                {
                  res === '' ?
                    (res)
                    :(moment(res).format('YYYY-MM-DD HH:mm:ss'))
                }
              </div>
            )
          },
        }
      ],
      params:{
        size:10,
        current:1
      },
      handleImgDetailsVisible:false,
      ImgDetails:''
    };
  }

  // ============ 初始化数据 ===============

  componentWillMount() {
    this.getDataList();

  }

  getDataList = () => {
    const {params} = this.state;
    this.setState({
      loading:true
    })
    getProductattributeList(params).then(res=>{
      this.setState({
        loading:false
      })
      this.setState({
        data:{
          list:res.data.records,
          pagination:{
            current: res.data.current,
            pageSize: res.data.size,
            total: res.data.total
          }
        }
      })
    })
  }

  onSelectRow = (rows,key) => {
    this.setState({
      selectDataArr: rows
    });
  };

  // 图片弹框
  handleImg = (row) => {
    console.log(row)
    this.setState({
      handleImgDetailsVisible:true,
      ImgDetails:row.h5Background
    })
  }
  handleCancelImgDetails = () => {
    this.setState({
      handleImgDetailsVisible:false
    })
  }

  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

  handleSubmit = ()=>{
    const { selectDataArr } = this.state;
    const { handleOkProduct } = this.props;

    if(selectDataArr.length <= 0){
      return message.info('请至少选择一条数据');
    }

    console.log(selectDataArr)
    handleOkProduct(selectDataArr.map(item=>item.id));
  }

  render() {
    const {
      form,isVisible,handleCancelProduct
    } = this.props;

    const {
      data,
      loading,
      handleImgDetailsVisible,
      ImgDetails
    } = this.state;


    const columns = this.state.columns.map((col, index) => ({
      ...col,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));

    return (
      <Modal
        className={'authorized-product-page'}
        title="选择产品"
        width={'80%'}
        visible={isVisible}
        maskClosable={false}
        footer={[
          <Button key="back" onClick={handleCancelProduct}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={(e)=>this.handleSubmit(e)}>
            确定
          </Button>,
        ]}
        onCancel={handleCancelProduct}
      >
        <Grid
          form={form}
          data={data}
          onSelectRow={this.onSelectRow}
          loading={loading}
          columns={columns}
          scroll={{ x: 1000 }}
        />
        {/* 查看图片 */}
        {handleImgDetailsVisible?(
          <Img
            handleImgDetailsVisible={handleImgDetailsVisible}
            ImgDetails={ImgDetails}
            handleCancelImgDetails={this.handleCancelImgDetails}
          />
        ):""}
      </Modal>
    );
  }
}
export default AuthorizedProductPage;
