<template>
  <data-table-template :tableData="searchResult">
    <el-table-column
      prop="id"
      label="ID"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="商圈名称"
      width="200">
    </el-table-column>
    <el-table-column
      prop="dispatcher_phone"
      label="电话"
      width="300">
    </el-table-column>
    <el-table-column
      prop="operate"
      label="操作">
      <template slot-scope="scope">
        <el-button
          size="small"
          @click="handleEdit(scope.row)">编辑</el-button>
        <el-button
          size="small"
          @click="handleSetXXX(scope.row.id)">先请求再打开窗口</el-button>
      </template>
    </el-table-column>
    <el-pagination
      slot="pagination"
      small
      @current-change="handleCurrentChange"
      :current-page="pagination.current"
      :page-size="pagination.perpage"
      layout="total, prev, pager, next"
      :total="pagination.total">
    </el-pagination>
  </data-table-template>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import DataTableTemplate from 'common/components/DataTableTemplate';
  import { NAMESPACE } from '../../store/modules/{{pageNameLower}}';

  export default {
    name: 'DataTable',
    components: {
      DataTableTemplate,
    },
    computed: {
      ...mapState({
        searchCondition: state => state[NAMESPACE].searchCondition,
        searchResult: state => state[NAMESPACE].searchResult,
        pagination: state => state[NAMESPACE].pagination,
      }),
    },
    methods: {
      ...mapActions(NAMESPACE, [
        'search',
        'openMainDialog',
        'getMainById',
      ]),
      handleCurrentChange(current) {
        this.search({
          ...this.searchCondition,
          page: current,
        });
      },
      handleEdit(data) {
        this.openMainDialog({
          ...data,
          id: '1',
          delivery: false,
          desc: 'ddd',
          name: 'ddd',
          region: 'shanghai',
          resource: '线下场地免费',
          type: ['1'],
        });
      },
      handleSetXXX(id) {
        this.getMainById(id).then((data) => {
          if (data) {
            this.openMainDialog({
              ...data,
              id: '1',
              delivery: false,
              desc: 'ddd',
              name: 'ddd',
              region: 'shanghai',
              resource: '线下场地免费',
              type: ['1'],
            });
          }
        });
      },
    },
  };
</script>