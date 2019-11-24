<template>
  <div class="page-task-ltembank">
    <Spin size="large" fix v-if="fullLoading"></Spin>
    <table-page :columns="columns" :data="data" :total="total" @on-change-page="changePage" @on-change-pageSize="changePageSize">
      <!-- <div class="content-header" slot="form">
        <Input class="form-item" style="width:300px" v-model="searchValue" placeholder="关键字" />
        <DatePicker class="form-item" type="date" placeholder="选择查询时间范围" style="width: 200px"></DatePicker>
        <Select class="form-item" v-model="status" style="width:60px" placeholder="状态">
          <Option v-for="item in options" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <ButtonGroup>
          <Button type="primary">查询</Button>
          <Button>重置</Button>
        </ButtonGroup>
      </div> -->
    </table-page>
  </div>
</template>

<script>
import { taskItemList } from "api/task.js";
import TablePage from 'components/tablePage.vue';
import {
  TASKTYPE
} from 'utils/tool.js'
const taskItemStatusData = {
  '0': '待分发',
  '1': '待标注',
  '2': '待审核',
  '3': '返工标注',
  '4': '返工标注审核',
  '5': '已完成'
}
export default {
  name: 'TaskList',
  components: {
    TablePage
  },
  data () {
    return {
      fullLoading: false,
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
        // {
        //   
        //   width: 60,
        //   align: 'center'
        // },
        {
          title: '题目编号',
          key: 'id'
        },{
          title: '所属任务编号',
          key: 'taskId'
        },{
          title: '所属任务名称',
          key: 'taskName'
        },{
          title: '所属任务类型',
          key: 'taskTypeDis'
        },
        {
          title: '标注人员',
          key: 'markUserName'
        },{
          title: '审核人员',
          key: 'reviewUserName'
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
                  marginRight: '12px',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                      this.show(params)
                  }
                }
              }, '查看详情')
            ]);
          }
        }
      ],
      data: [],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      taskItemStatus: '', //状态
      total: null,
    }
  },
  created() {
    this.taskItemList()
  },
  methods: {
    // 获取题库列表
    taskItemList () {
      this.fullLoading = true
      taskItemList({
        page: {
          pageSize: this.page.pageSize,
          pageNum: this.page.pageNum
        },
        taskId: this.$route.query.taskId || ''
      }).then(res => {
        console.log('res', res)
        const {count, taskItemList, taskList, userList} = res
        this.data = taskItemList.map(item => {
          item.taskName = taskList[item.taskId].taskName;
          item.taskTypeDis = TASKTYPE[taskList[item.taskId].taskType].label;
          item.taskType = taskList[item.taskId].taskType;
          item.status = taskItemStatusData[item.taskItemType];
          item.markUserName = item.markUserId !== 0 ? userList[item.markUserId].userName : '暂无';
          item.reviewUserName = item.reviewUserId !== 0 ? userList[item.reviewUserId].userName : '暂无';
          return item
        })
        this.total = count
        this.fullLoading = false
      }).catch(() => {
        this.fullLoading = false
      })
    },
    changePage (page) {
      this.page.pageNum = page
      this.taskItemList()
    },

    changePageSize (pageSize) {
      this.page.pageSize = pageSize
      this.taskItemList()
    },

    // 查看详情
    show (params) {
      console.log('params', params)
      this.$router.push({
        path: '/task/type',
        query: {
          id: params.row.taskId,
          taskItemId: params.row.id,
          type: TASKTYPE[params.row.taskType].type,
          viewOnly: true,
        }
      })
    },
  },
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