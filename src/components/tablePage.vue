<template>
  <div class="table-page-component">
    <div class="content-header">
      <slot name="form"></slot>
    </div>
    <div class="content-middle">
      <div class="content-middle-table">
        <Table border :columns="columns" :data="data"></Table>
      </div>
      <div class="content-middle-pages">
        <Page :total="total" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TablePage',
  props: {
    columns: {
      type: Array,
      default:() => {
        return []
      }
    },
    data: {
      type: Array,
      default:() => {
        return []
      }
    },
    total: {
      type: Number,
      default: 100
    }
  }
}
</script>

<style lang="scss" scoped>
.table-page-component {
  .content-header {
    margin-bottom: 20px;
    .form-item {
      margin-right: 12px;
    }
  }
  .content-middle {
    margin-bottom: 12px;
    &-table {
      margin-bottom: 12px;
    }
  }
}
</style>