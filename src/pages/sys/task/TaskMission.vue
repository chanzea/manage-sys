<template>
  <div class="page-task-mission">
    <div class="task-mission-content">
      <Tabs :value="currentTab">
        <TabPane v-for="(item, index) in tabLists" :key="index" :label="item.label" :name="item.name">
          <table-page :columns="columns" :data="data" :total="total" @on-change-page="changePage" @on-change-pageSize="changePageSize">
            <div class="content-header" slot='form'>
              <Input class="form-item" style="width:300px" placeholder="任务编号,任务名称,任务用途" v-model="searchData.inputValue"></Input>
              <DatePicker class="form-item" type="date" placeholder="选择查询时间范围" style="width: 200px"></DatePicker>
              <ButtonGroup>
                <Button type="primary">查询</Button>
                <Button>重置</Button>
              </ButtonGroup>
            </div>
          </table-page>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
import TablePage from 'components/tablePage.vue';
import { getTaskList } from "@/api/task";
export default {
  name: 'TaskMission',
  components: {
    TablePage
  },
  data () {
    return {
      searchData: {
        inputValue: '',
        dateValue: ''
      },
      currentTab: 'taskMission',
      tabLists: [{
        label: (h) => {
          return h('div', [
            h('span', '任务大厅'),
            h('Badge', {
              props: {
                count: 3
              }
            })
          ])
        },
        name: 'taskMission'
      },{
        label: (h) => {
          return h('div', [
            h('span', '返工任务'),
            h('Badge', {
              props: {
                count: 3
              }
            })
          ])
        },
        name: 'taskRework'
      },{
        label: (h) => {
          return h('div', [
            h('span', '已完成任务'),
            h('Badge', {
              props: {
                count: 3
              }
            })
          ])
        },
        name: 'taskComplete'
      }],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '任务编号',
          key: 'id',
          sortable: true
        },
        {
          title: '任务名称',
          key: 'taskName'
        },
        {
          title: '任务用途',
          key: 'taskRemark'
        },
        {
          title: '数量',
          key: 'taskItemMarkTotal'
        },
        {
          title: '剩余数量',
          key: 'taskRemain'
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
                  marginRight: '12px',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                      this.taskItemAllotMark(params)
                  }
                }
              }, '领取任务')
            ]);
          }
        }
      ],
      data: [
        // {
        //   taskId: 'QD0001',
        //   taskName: '任务拉框',
        //   taskRemark: '标注任务步态数据',
        //   taskItemMarkTotal: '1000',
        //   taskRemain: '500'
        // },
      ],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: null
    }
  },
  created() {
    this.getTaskList()
  },
  methods: {
    getTaskList: function() {
      let page = this.page || "";
      getTaskList({ page, tag: 'mark' }).then(res => {
        console.log(res);
        const { taskList, count } = res
        this.data = taskList.map(item => {
          item.taskRemain = item.taskItemMarkTotal - item.taskItemHadMarkTotal
          return item
        })
        this.total = count;
      });
    },
    changePage (page) {
      this.page.pageNum = page
      this.getTaskList()
    },

    changePageSize (pageSize) {
      this.page.pageSize = pageSize
      this.getTaskList()
    },

    taskItemAllotMark (params) {
      console.log('params', params)
      this.$router.push({
        path: '/task/classify',
        query: {
          id: params.row.id
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.page-task-mission {
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