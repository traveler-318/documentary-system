import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Button,
  Form, message, Modal,
} from 'antd';
import Grid from '../../components/Sword/Grid';
import {
  getProductattributeList,
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
      data: {},
      loading: false,
      submitLoading:false,
      selectDataArr: [],
      columns: [
        {
          title: '编号',
          dataIndex: '',
          width: 60,
          render: (res, rows, index) => {
            return (
              index + 1
            );
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
          render: (res, row) => {
            return (
              <div>
                {
                  res === '' ?
                    (res)
                    : (<a onClick={() => this.handleImg(row)}>查看</a>)
                }
              </div>
            );
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
            return (
              <div>
                {
                  res === '' ?
                    (res)
                    : (moment(res).format('YYYY-MM-DD HH:mm:ss'))
                }
              </div>
            );
          },
        },
      ],
      params: {
        size: 10,
        current: 1,
      },
      handleImgDetailsVisible: false,
      ImgDetails: '',
      selectedRowKeys:[]
    };
  }

  // ============ 初始化数据 ===============

  componentWillMount() {
    this.getDataList();

    const {selectedRows} = this.props;
    const dataIntArr=selectedRows.map(item => {
      return +item;
    });
    this.setState({
      selectedRowKeys:dataIntArr
    })
  }

  getDataList = () => {
    const { params } = this.state;
    this.setState({
      loading: true,
    });
    getProductattributeList(params).then(res => {
      this.setState({
        loading: false,
      });
      let datas = res.data.records.map(item => {
        item.selections = true;
        return item;
      });
      this.setState({
        data: {
          list: datas,
          pagination: {
            current: res.data.current,
            pageSize: res.data.size,
            total: res.data.total,
          },
        },
      });
    });
  };

  onSelectRow = (rows, key) => {
    this.setState({
      selectDataArr: rows,
      selectedRowKeys: rows.map(item=>item.id),
    });
  };

  // 图片弹框
  handleImg = (row) => {
    this.setState({
      handleImgDetailsVisible: true,
      ImgDetails: row.h5Background,
    });
  };
  handleCancelImgDetails = () => {
    this.setState({
      handleImgDetailsVisible: false,
    });
  };

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

  handleSubmit = () => {
    const { selectedRowKeys } = this.state;
    console.log(selectedRowKeys,"selectedRowKeysselectedRowKeysselectedRowKeys")
    if (selectedRowKeys.length <= 0) {
      Modal.confirm({
        title: '提示',
        content: '提示当前操作会关闭渠道商的所有产品代理,确认是否操作!',
        okText: '确定',
        okType: 'info',
        cancelText: '取消',
        onOk:() => {
          this.saveData(selectedRowKeys);
        },
        onCancel() {},
      });
    }else{
      this.saveData(selectedRowKeys);
    }
  };

  saveData = (selectedRowKeys) => {
    const { handleOkProduct } = this.props;
    this.setState({
      submitLoading:true
    })
    handleOkProduct(selectedRowKeys,()=>{
      this.setState({
        submitLoading:false
      })
    });
  }

  render() {
    const {
      form, isVisible, handleCancelProduct,
    } = this.props;

    const {
      data,
      loading,
      handleImgDetailsVisible,
      ImgDetails,
      selectedRowKeys,
      submitLoading
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
        title="授权产品"
        width={'80%'}
        visible={isVisible}
        maskClosable={false}
        footer={[
          <Button key="back" onClick={handleCancelProduct}>
            取消
          </Button>,
          <Button key="submit" type="primary"  loading={submitLoading} onClick={(e) => this.handleSubmit(e)}>
            确定
          </Button>,
        ]}
        onCancel={handleCancelProduct}
      >
        <Grid
          form={form}
          data={data}
          counterElection={false}
          selectedKey={selectedRowKeys}
          onSelectRow={this.onSelectRow}
          loading={loading}
          columns={columns}
          scroll={{ x: 1000 }}
        />
        {/* 查看图片 */}
        {handleImgDetailsVisible ? (
          <Img
            handleImgDetailsVisible={handleImgDetailsVisible}
            ImgDetails={ImgDetails}
            handleCancelImgDetails={this.handleCancelImgDetails}
          />
        ) : ''}
      </Modal>
    );
  }
}

export default AuthorizedProductPage;
