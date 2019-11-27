<template>
  <div class="page-task-ltembank">
    <Spin size="large" fix v-if="fullLoading"></Spin>
    <table-page :columns="columns" :data="data" :total="total" @on-change-page="changePage" @on-change-pageSize="changePageSize">
      <div class="content-header" slot="form">
        <Input class="form-item" style="width:120px" v-model="searchKey" placeholder="关键字" />
        <DatePicker class="form-item" type="daterange" placeholder="选择查询时间范围" v-model="value" style="width: 200px"></DatePicker>
        <Select class="form-item" v-model="status" style="width:160px" placeholder="任务类型">
          <Option v-for="item in options" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select class="form-item" v-model="markUserId" filterable style="width:160px" placeholder="根据标注人员搜索">
          <Option v-for="item in userList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select class="form-item" v-model="reviewUserId" filterable style="width:160px" placeholder="根据审核人员搜索">
          <Option v-for="item in userList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <!-- <ButtonGroup> -->
          <Button type="primary" @click="searchTaskItemList">查询</Button>
          <Button type="primary" @click="reset">重置</Button>
        <!-- </ButtonGroup> -->
      </div>
    </table-page>
  </div>
</template>

<script>
import { taskItemList } from "api/task.js";
import TablePage from 'components/tablePage.vue';
 import {
    getUserList,
  } from 'api/user';
import {
  TASKTYPE
} from 'utils/tool.js'
const taskItemStatusData = {
  '0': '未领取',
  '1': '待标注',
  '2': '待审核',
  '3': '返工标注',
  '4': '返工审核',
  '5': '已完成'
}

const taskType = [{
  value: 'Classify',
  label: '分类任务'
},{
  value: 'Mark',
  label: '标注任务'
},{
  value: 'RejectPic',
  label: '图片剔除任务'
},{
  value: 'RejectFolder',
  label: '文件夹剔除任务'
},{
  value: 'Lasso',
  label: '分割任务'
}]
export default {
  name: 'TaskList',
  components: {
    TablePage
  },
  data () {
    return {
      fullLoading: false,
      searchKey: '',
      value: ['', ''],
      status: '',
      options: taskType,
      columns: [
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
                      this.showDetail(params)
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
      reviewUserId: '',
      markUserId: '',
      userList: []
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
        taskId: this.$route.query.taskId || '',
        startTime: this.value[0] !== '' ? new Date(this.value[0]).Format('yyyy-MM-dd') : '',
        endTime: this.value[1] !== '' ? new Date(this.value[1]).Format('yyyy-MM-dd') : '',
        searchKey: this.searchKey,
        markUserId: this.markUserId,
        reviewUserId: this.reviewUserId
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

    reset () {
      this.searchKey = '';
      this.value = ['', ''];
      this.status = ''
    },

    searchTaskItemList () {
      this.page.pageNum = 1
      this.taskItemList()
    },

    // 查看详情
    showDetail (params) {
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