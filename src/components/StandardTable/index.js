import React, { PureComponent, Fragment } from 'react';
import { Table, Alert, Checkbox } from 'antd';
import styles from './index.less';
import { Resizable } from 'react-resizable';

const ResizeableTitle = props => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns, rowKey = 'id' } = props;
    const needTotalList = initTotalList(columns);

    // 使用外层传入的 selectedRows 初始化选中行，避免使用 Grid 时重新初始化 StandardTable 导致的状态异常
    const selectedRowKeys = props.selectedRows ? props.selectedRows.map(row => row[rowKey]) : [];

    this.state = {
      selectedRowKeys,
      needTotalList,
      expandProps: props.expandProps,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      return {
        selectedRowKeys: [],
        needTotalList,
      };
    }
    if (nextProps.expandProps) {
      return {
        expandProps: nextProps.expandProps,
      };
    }
    return null;
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows,selectedRowKeys);
    }

    this.setState({ selectedRowKeys, needTotalList });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  onCounterElection = (e) => {
    const { onChangeCheckbox } = this.props;
    if (onChangeCheckbox) {
      onChangeCheckbox(e);
    }
  }

  components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  handleResize = index => (e, { size }) => {
    // this.setState(({ columns }) => {
      const nextColumns = [...this.props.columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      cons
      return { columns: nextColumns };
    // });
  };

  render() {
    const { selectedRowKeys, needTotalList, expandProps } = this.state;
    const { data = {}, counterElection, multipleChoice, rowKey, alert = false, ...rest } = this.props;
    const { list = [], pagination } = data;
    console.log(data,"pagination")
    const paginationProps = pagination
      ? {
          showSizeChanger: true,
          showQuickJumper: true,
          ...pagination,
          pageSizeOptions:[10,15,20,50],
          showTotal:(total, range) => `共${pagination.total}条数据`
        }
      : false;

    const rowSelection = {
      selectedRowKeys:counterElection?this.props.selectedRowKeys:selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    console.log(rest.tblProps)

    const columns = this.props.columns.map((col, index) => ({
      ...col,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));

    return (
      <div className={styles.standardTable}>
        {alert ? (
          <div className={styles.tableAlert}>
            <Alert
              message={
                <Fragment>
                  已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                  {needTotalList.map(item => (
                    <span style={{ marginLeft: 8 }} key={item.dataIndex}>
                      {item.title}
                      总计&nbsp;
                      <span style={{ fontWeight: 600 }}>
                        {item.render ? item.render(item.total) : item.total}
                      </span>
                    </span>
                  ))}
                  <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                    清空
                  </a>
                </Fragment>
              }
              type="info"
              showIcon
            />  
          </div>
        ) : null}
        <Table
          rowKey={rowKey || 'key'}
          rowSelection={multipleChoice?"":rowSelection}
          dataSource={list}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          
          {...rest}
          {...rest.tblProps}
          {...expandProps}
          components={this.components}
        />
        {counterElection?(
          <div className={styles.counterElection}>
            <Checkbox onChange={this.onCounterElection}>反选</Checkbox>
          </div>
        ):""}
      </div>
    );
  }
}

export default StandardTable;
