import React, { Fragment, PureComponent } from 'react';
import { Card, Divider, message, Modal } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import { getButton } from '../../utils/authority';
import styles from './SwordPage.less';
import ToolBar from './ToolBar';
import SearchBox from './SearchBox';
import StandardTable from '../StandardTable';
import { requestApi } from '../../services/api';

export default class Grid extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      size: 10,
      formValues: {},
      selectedRows: [],
      buttons: getButton(props.code),
    };
  }

  componentDidMount() {
    this.handleSearch();
  }

  handleSearch = e => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const { form } = this.props;

    form.validateFields(async (err, fieldsValue) => {
      if (err) {
        return;
      }

      const values = {
        ...fieldsValue,
      };

      await this.setState({
        formValues: values,
      });

      this.refreshTable(true);
    });
  };

  handleFormReset = async () => {
    const { form, onReset } = this.props;
    form.resetFields();
    await this.setState({
      current: 1,
      size: 10,
      formValues: {},
      selectedRows: [],
    });
    if (onReset) {
      onReset();
    }
    this.refreshTable();
  };

  handleStandardTableChange = async (pagination, filters, sorter) => {
    await this.setState({
      current: pagination.current,
      size: pagination.pageSize,
      sorts:sorter
    });
    this.refreshTable();
  };

  refreshTable = (firstPage = false) => {
    const { onSearch } = this.props;
    const { current, size, formValues,sorts } = this.state;

    const params = {
      current: firstPage ? 1 : current,
      size,
      sorts:sorts,
      ...formValues,
    };
    if (onSearch) {
      onSearch(params);
    }
  };

  handleSelectRows = (rows,keys) => {
    this.setState({
      selectedRows: rows,
    });

    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(rows,keys);
    }
  };

  getSelectKeys = () => {
    const { selectedRows } = this.state;
    const { pkField = 'id', childPkField = 'id' } = this.props;
    return selectedRows.map(row => {
      const selectKey = row[pkField] || row[childPkField];
      if (`${selectKey}`.indexOf(',') > 0) {
        return `${selectKey}`.split(',');
      }
      return selectKey;
    });
  };

  handleToolBarClick = btn => {
    const { selectedRows } = this.state;
    const keys = this.getSelectKeys();
    this.handleClick(btn, keys, selectedRows);
  };

  handleClick = (btn, keys = [], rows) => {
    const { path, alias } = btn;
    const { btnCallBack } = this.props;
    const refresh = (temp = true) => this.refreshTable(temp);
    console.log(btn.path, keys, rows)
    if (alias === 'add') {
      if (keys.length > 1) {
        message.warn('父记录只能选择一条!');
        return;
      }
      if(btn.path === "/system/dept/add" && rows.length > 0 && rows[0].parentId != "0"){
        message.warn('不能对子节点新增数据!');
          return;
      }
      if (keys.length === 1) {
        router.push(`${path}/${keys[0]}`);
        return;
      }
      router.push(path);
      return;
    }
    if (alias === 'edit') {

      if (keys.length <= 0) {
        message.warn('请先选择一条数据!');
        return;
      }
      if (keys.length > 1) {
        message.warn('只能选择一条数据!');
        return;
      }
      router.push(`${path}/${keys[0]}?_K=${Date.parse(new Date())}`);
      return;
    }
    if (alias === 'view') {
      if (keys.length <= 0) {
        message.warn('请先选择一条数据!');
        return;
      }
      if (keys.length > 1) {
        message.warn('只能选择一条数据!');
        return;
      }
      router.push(`${path}/${keys[0]}`);
      return;
    }
    if (alias === 'delete') {
      if (keys.length <= 0) {
        message.warn('请先选择要删除的记录!');
        return;
      }

      Modal.confirm({
        title: '删除确认',
        content: '确定删除选中记录?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          const response = await requestApi(path, { ids: keys.join(',') });
          if (response.success) {
            message.success(response.msg);
            refresh();
          } else {
            message.error(response.msg || '删除失败');
          }
        },
        onCancel() {},
      });
      return;
    }
    if (btnCallBack) {
      btnCallBack({ btn, keys, rows, refresh });
    }
  };

  render() {
    const { buttons, selectedRows } = this.state;
    const {
      loading = false,
      rowKey,
      pkField,
      childPkField,
      data,
      scroll,
      tblProps,
      cardProps,
      actionColumnWidth,
      renderSearchForm,
      renderButton,
      renderLeftButton,
      renderRightButton,
      renderActionButton,
      counterElection,
      multipleChoice
    } = this.props;
    let { columns } = this.props;

    const actionButtons = buttons.filter(button => button.action === 2 || button.action === 3);

    if (columns && Array.isArray(columns) && (actionButtons.length > 0 || renderActionButton)) {
      const key = pkField || rowKey || 'id';
      columns = [
        ...columns,
        {
          title: formatMessage({ id: 'table.columns.action' }),
          width: actionColumnWidth || 170,
          fixed: 'right',
          render: (text, record) => (
            <Fragment>
              <div style={{ textAlign: 'center' }}>
                {actionButtons.map((button, index) => (
                  <Fragment key={button.code}>
                    {index > 0 ? <Divider type="vertical" /> : null}
                    <a
                      title={formatMessage({ id: `button.${button.alias}.name` })}
                      onClick={() =>
                        this.handleClick(button, [record[childPkField || key]], [record])
                      }
                    >
                      <FormattedMessage id={`button.${button.alias}.name`} />
                    </a>
                  </Fragment>
                ))}
                {renderActionButton
                  ? renderActionButton([record[childPkField || key]], [record])
                  : null}
              </div>
            </Fragment>
          ),
        },
      ];
    }

    return (
      <Card bordered={false} {...cardProps}>
        <div className={styles.swordPage}>
          <SearchBox onSubmit={this.handleSearch} onReset={this.handleFormReset}>
            {renderSearchForm ? renderSearchForm(this.handleFormReset) : ""}
          </SearchBox>
          <ToolBar
            buttons={buttons}
            renderButton={renderButton}
            renderLeftButton={renderLeftButton}
            renderRightButton={renderRightButton}
            onClick={this.handleToolBarClick}
          />
          <StandardTable
            rowKey={rowKey || 'id'}
            selectedRows={selectedRows}
            selectedRowKeys={this.props.selectedKey}
            loading={loading}
            columns={columns}
            data={data}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
            onChangeCheckbox={this.props.onChangeCheckbox}
            scroll={scroll}
            tblProps={tblProps}
            counterElection={counterElection}
            multipleChoice={multipleChoice}
            size="middle"
            bordered
          />
        </div>
      </Card>
    );
  }
}
