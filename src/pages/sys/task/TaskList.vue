<template>
  <div class="page-task-list">
    <table-page :columns="columns" :data="data">
      <div class="content-header" slot="form">
        <Input class="form-item" style="width:300px" v-model="searchValue" placeholder="关键字" />
        <DatePicker class="form-item" type="date" placeholder="选择查询时间范围" style="width: 200px"></DatePicker>
        <Select class="form-item" v-model="status" style="width:60px" placeholder="状态">
          <Option v-for="item in options" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <ButtonGroup>
          <Button type="primary">查询</Button>
          <Button>重置</Button>
        </ButtonGroup>
        <ButtonGroup class="btns">
          <Button type="primary">新建</Button>
          <Button type="primary">删除</Button>
          <Button type="primary">上线</Button>
          <Button type="primary">下线</Button>
        </ButtonGroup>
      </div>
    </table-page>
  </div>
</template>

<script>
import TablePage from 'components/tablePage.vue';
export default {
  name: 'TaskList',
  components: {
    TablePage
  },
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
              }, '题库'),
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
              }, '编辑'),
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
              }, '删除'),
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
              }, '下线')
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
.page-task-list {
  .btns {
    margin-top: 12px;
  }
}
</style>