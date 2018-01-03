<template>
  <layout
    :showLcControl="showLcControl"
    :collapseMenu="collapseMenu"
  >
    <router-view slot="content"></router-view>
  </layout>
</template>

<script>
  import layout from 'common/layout/Layout';

  export default {
    name: 'DevExample',
    data() {
      return {
        // 是否展示配送中心切换控件
        showLcControl: true,
        // 是否折叠左侧导航栏
        collapseMenu: false,
      };
    },
    components: { layout },
  };
</script>