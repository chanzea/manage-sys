<template>
  <div class="page-task-list">
    <div class="task-list-content">
      <div class="content-header">
        <Input class="form-item" style="width:300px" v-model="searchValue" placeholder="关键字" />
        <DatePicker class="form-item" type="date" placeholder="选择查询时间范围" style="width: 200px"></DatePicker>
        <Select class="form-item" v-model="status" style="width:60px" placeholder="状态">
          <Option v-for="item in options" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <ButtonGroup>
          <Button type="primary">查询</Button>
          <Button>重置</Button>
        </ButtonGroup>
      </div>
      <div class="content-middle">
        <ButtonGroup>
          <Button type="primary">新建</Button>
          <Button type="primary">删除</Button>
          <Button type="primary">上线</Button>
          <Button type="primary">下线</Button>
        </ButtonGroup>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskList',
  data () {
    return {
      searchValue: '',
      status: '',
      options: [{
        label: '草稿',
        value: 0
      },{
        label: '上线',
        value: 1
      },{
        label: '下线',
        value: 2
      },]
    }
  }
}
</script>
<style lang="scss" scoped>
.page-task-list {
  .task-list-content {
    .content-header {
      margin-bottom: 20px;
      .form-item {
        margin-right: 12px;
      }
    }
    .content-middle {
      margin-bottom: 12px;
    }
  }
}
</style>