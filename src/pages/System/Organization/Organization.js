import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Col, Divider, Form, Input, Row, Tag } from 'antd';
import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';
import { DEPT_LIST } from '../../../actions/organization';
import { tenantMode } from '../../../defaultSettings';

const FormItem = Form.Item;

@connect(({ organization, loading }) => ({
  organization,
  loading: loading.models.organization,
}))
@Form.create()
class Organization extends PureComponent {
  // ============ 查询 ===============
  handleSearch = params => {
    const { dispatch } = this.props;
    dispatch(DEPT_LIST(params));
  };

  // ============ 查询表单 ===============
  renderSearchForm = onReset => {

  };

  handleClick = row => {
    router.push(`/system/organization/add/${row.id}`);
  };

  renderActionButton = (keys, rows) => {
    let row = rows[0];
    return row.deptCategory == 3 ? '':(
            <Fragment>
              <Divider type="vertical" />
              <a
                title="新增下级"
                onClick={() => {
                  this.handleClick(row);
                }}
              >
                新增下级
              </a>
            </Fragment>
      )
  };

  render() {
    const code = 'organization';

    const {
      form,
      loading,
      organization: { data },
    } = this.props;

    const columns = [
      {
        title: '租户ID',
        dataIndex: 'tenantId',
      },
      {
        title: '组织名称',
        dataIndex: 'deptName',
      },
      {
        title: '组织类型',
        dataIndex: 'deptCategoryName',
        render: deptCategoryName => (
          <span>
            <Tag color="geekblue" key={deptCategoryName}>
              {deptCategoryName}
            </Tag>
          </span>
        ),
      },
      {
        title: '排序',
        dataIndex: 'sort',
      },
    ];

    if (!tenantMode) {
      columns.splice(0, 1);
    }

    return (
      <Panel>
        <Grid
          code={code}
          form={form}
          onSearch={this.handleSearch}
          renderSearchForm={this.renderSearchForm}
          renderActionButton={this.renderActionButton}
          actionColumnWidth={250}
          loading={loading}
          data={data}
          multipleChoice={true}
          columns={columns}
        />
      </Panel>
    );
  }
}
export default Organization;
