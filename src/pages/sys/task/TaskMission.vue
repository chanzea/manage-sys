<template>
  <div class="page-task-mission">
    <div class="task-mission-content">
      <Tabs :value="currentTab">
        <TabPane v-for="(item, index) in tabLists" :key="index" :label="item.label" :name="item.name">
          <table-page :columns="columns" :data="data">
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
  },

  created(){
    
  },

  methods: {
    getTaskList: function() {
      let page = this.page || "";
      getTaskList({ page }).then(res => {
        console.log(res);
        // this.data = res.data.taskList;
        // this.total = res.data.count;
      });
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