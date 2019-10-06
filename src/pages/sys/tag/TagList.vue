<template>
  <div class="page-tag-list">
    <table-page :columns="columns" :data="data">
      <div class="content-header" slot="form">
        <Input class="form-item" style="width:300px" v-model="searchValue" placeholder="关键字: 名称|文件|路径" />
        <DatePicker class="form-item" type="date" placeholder="选择查询时间范围" style="width: 200px"></DatePicker>
        <Button type="primary">查询</Button>
        <Button style="float: right" type="primary" icon="md-add">新建数据源</Button>
      </div>
    </table-page>
  </div>
</template>

<script>
import TablePage from 'components/tablePage.vue';

export default {
  name: 'DataList',
  components: {
    TablePage
  },
  data () {
    return {
      searchValue: '',
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '任务编号',
          key: 'taskId',
          sortable: true
        },
        {
          title: '任务名称',
          key: 'taskName'
        },
        {
          title: '创建人',
          key: 'creator'
        },
        {
          title: '创建时间',
          key: 'createtime'
        },
        {
          title: '数量',
          key: 'count'
        },
        {
          title: '待标注',
          key: 'mark'
        },{
          title: '待审核',
          key: 'verify'
        },{
          title: '状态',
          key: 'status'
        },{
          title: '操作',
          key: 'action',
          width: 260,
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
              }, '查看')
            ]);
          }
        }
      ],
      data: [
        {
          taskId: 'QD0001',
          taskName: '任务拉框',
          creator: '张三',
          createtime: '2019-09-15',
          count: '1000',
          mark: '500',
          verify: '800',
          status: '草稿'
        },
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.page-tag-list {
  .tag-list-content {
    .content-header {
      overflow: hidden;
      margin-bottom: 20px;
      .form-item {
        margin-right: 12px;
      }
    }
    .content-middle {
      margin-bottom: 12px;
      &-btns {
        margin-bottom: 12px;
      }
      &-table {
        margin-bottom: 12px;
      }
    }
  }
}
</style>