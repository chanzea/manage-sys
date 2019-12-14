<template>
  <div class="table-page-component">
    <div class="content-header">
      <slot name="form"></slot>
    </div>
    <div class="content-middle">
      <div class="content-middle-table">
        <Table border :columns="columns" :data="data"></Table>
      </div>
      <div class="content-middle-pages" v-if="total">
        <Page :total="total" size="small" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changePageSize" />
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
      default: 0
    }
  },
  methods: {
    changePage (page) {
      this.$emit('on-change-page', page)
    },
    changePageSize (pageSize) {
      this.$emit('on-change-pageSize', pageSize)
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