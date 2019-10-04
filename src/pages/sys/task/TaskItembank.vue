<template>
  <div class="page-task-ltembank">
    <div class="task-ltembank-content">
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
        <div class="content-middle-table">
          <Table border :columns="columns" :data="data"></Table>
        </div>
        <div class="content-middle-pages">
          <Page :total="100" />
        </div>
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
      },],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '图片编号',
          key: 'picId',
          sortable: true
        },
        {
          title: '图片名称',
          key: 'picName'
        },
        {
          title: '任务编号',
          key: 'taskId'
        },{
          title: '任务名称',
          key: 'taskName'
        },
        {
          title: '标注人员',
          key: 'marker'
        },{
          title: '审核人员',
          key: 'auditor'
        },{
          title: '状态',
          key: 'status'
        },{
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  color: '#2d8cf0',
                  marginRight: '12px'
                },
                on: {
                  click: () => {
                      this.show(params)
                  }
                }
              }, '查看'),
              h('span', {
                style: {
                  color: '#2d8cf0',
                  marginRight: '12px'
                },
                on: {
                  click: () => {
                    this.remove(params)
                  }
                }
              }, '详情')
            ]);
          }
        }
      ],
      data: [
        {
          picId: 'QD0001',
          picName: '任务拉框',
          taskId: 'QD0001',
          taskName: '任务001',
          marker: '张三',
          auditor: '王二',
          status: '完成'
        },
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.page-task-ltembank {
  .task-ltembank-content {
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
}
</style>