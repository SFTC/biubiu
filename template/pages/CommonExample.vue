<template>
  <div>
    <toolbar></toolbar>
    <data-table></data-table>
    <main-dialog></main-dialog>
  </div>
</template>

<script>
  import Toolbar from './{{pageNameLower}}/Toolbar';
  import DataTable from './{{pageNameLower}}/DataTable';
  import MainDialog from './{{pageNameLower}}/MainDialog';

  export default {
    name: '{{pageNameUpper}}',
    components: {
      Toolbar,
      DataTable,
      MainDialog,
    },
  };
</script>
