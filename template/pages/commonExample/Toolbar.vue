<template>
  <toolbar-template>
    <div slot="function-buttons">
      <!-- 功能按钮区，除查询、下载等与search表单相关的按钮外，其余功能按钮均放于此处，此处button，非特殊情况不使用icon -->
      <el-button 
        type="primary"
        v-if="$checkAuth('AUTH_BUTTON_sample_create')"
        @click="handleCreate"
      >创建账号</el-button>
      <el-button 
        type="primary"
      >设置XXXXX</el-button>
      <el-button 
        type="primary"
      >设置XXXXX</el-button>
    </div>
    
    <el-form :inline="true" label-width="65px">
      <!-- form label字段尽量控制在四字以内 -->
      <logistics-supplier-station-cascade
        autoInit
        :config="lsscConfig"
        :value="areaValue"
        @input="handleUpdateSearchCondition('areaValue', $event)"
      ></logistics-supplier-station-cascade>

      <el-form-item label="账号">
        <el-input 
          :value="searchCondition.main"
          @input="handleUpdateSearchCondition('main', $event)"
          placeholder="账号"
        ></el-input>
      </el-form-item>

      <el-form-item label="姓名">
        <el-input 
          :value="searchCondition.chineseName" 
          @input="handleUpdateSearchCondition('chineseName', $event)"
          placeholder="姓名"
        ></el-input>
      </el-form-item>

      <el-form-item label="电话">
        <el-input 
          :value="searchCondition.phone" 
          @input="handleUpdateSearchCondition('phone', $event)"
          placeholder="电话"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="search-buttons">
      <el-button type="primary" @click="handleSearch" icon="el-icon-search">查询</el-button>
      <el-button type="primary" @click="handleDownload" icon="el-icon-download" v-if="$checkAuth('AUTH_BUTTON_sample_searchbutton')">下载</el-button>
    </div>
  </toolbar-template>
</template>

<script>
  import { mapActions, mapState, mapMutations } from 'vuex';
  import ToolbarTemplate from 'common/components/ToolbarTemplate';
  import LogisticsSupplierStationCascade from 'common/components/LogisticsSupplierStationCascade';
  import { NAMESPACE, UPDATE_SEARCH } from '../../store/modules/{{pageNameLower}}';

  export default {
    name: 'Toolbar',
    data() {
      return {
        lsscConfig: {
          logisticsCenter: {
            show: true,
            haveAll: false,
            multiple: false,
          },
          supplier: {
            show: true,
            haveAll: false,
            multiple: false,
          },
          station: {
            show: true,
            haveAll: false,
            multiple: false,
          },
        },
      };
    },
    components: {
      ToolbarTemplate,
      LogisticsSupplierStationCascade,
    },
    methods: {
      ...mapActions('layout', [
        'showDownloads',
      ]),
      ...mapActions(NAMESPACE, [
        'search',
        'download',
        'openMainDialog',
        'createMain',
      ]),
      ...mapMutations(NAMESPACE, {
        updateSearchCondition: UPDATE_SEARCH,
      }),
      handleCreate() {
        this.openMainDialog();
      },
      handleSearch() {
        const params = {
          ...this.searchCondition,
          page: 1,
          a: { aa: 'aa', bb: 'bb' },
          arr: ['first', 'second'],
        };
        this.search(params);
      },
      handleDownload() {
        const params = {
          ...this.searchCondition,
          is_download: 1,
        };
        this.download(params).then((data) => {
          if (data) {
            this.showDownloads();
          }
        });
      },
      handleUpdateSearchCondition(key, value) {
        if (key === 'areaValue') {
          this.updateSearchCondition({
            ...this.searchCondition,
            ...value,
          });
        } else {
          this.updateSearchCondition({
            ...this.searchCondition,
            [key]: value,
          });
        }
      },
    },
    computed: {
      ...mapState({
        searchCondition: state => state[NAMESPACE].searchCondition,
      }),
      areaValue() {
        return {
          logisticsCenter: this.$store.state[NAMESPACE].searchCondition.logisticsCenter,
          supplier: this.$store.state[NAMESPACE].searchCondition.supplier,
          station: this.$store.state[NAMESPACE].searchCondition.station,
        };
      },
    },
    mounted() {
      this.handleSearch();
    },
  };
</script>