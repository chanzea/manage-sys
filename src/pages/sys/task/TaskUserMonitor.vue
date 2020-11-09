<template>
  <div class="page-task-ltembank">
    <Spin size="large" fix v-if="fullLoading"></Spin>
    <table-page :columns="columns" :data="data" :total="total" @on-change-page="changePage" @on-change-pageSize="changePageSize">
      <div class="content-header" slot="form">
        <DatePicker class="form-item" type="daterange" placeholder="选择查询时间范围" v-model="value" style="width: 200px"></DatePicker>
        <!-- <Select class="form-item" v-model="status" style="width:160px" placeholder="任务类型">
          <Option v-for="item in options" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select> -->
        <Select class="form-item" v-model="userId" filterable style="width:160px" placeholder="根据标注人员搜索">
          <Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.userName }}</Option>
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
import { monitorUserDimension } from "api/task.js";
import TablePage from 'components/tablePage.vue';
 import {
    getUserList,
  } from 'api/user';
import {
  TASKTYPE
} from 'utils/tool.js'

export default {
  name: 'TaskUserMonitor',
  components: {
    TablePage
  },
  data () {
    return {
      fullLoading: false,
      searchKey: '',
      value: ['', ''],
      status: '',
      columns: [
        {
          title: '用户名',
          key: 'userName'
        },{
          title: '标注总数',
          key: 'markTotal'
        },{
          title: '标注积分总数',
          key: 'markPointTotal'
        },{
          title: '审核总数',
          key: 'reviewTotal'
        },
        {
          title: '审核积分总数',
          key: 'reviewPointTotal'
        }
      ],
      data: [],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      taskItemStatus: '', //状态
      total: null,
      userId: '',
      userList: []
    }
  },
  created() {
    this.taskUserMonitor()
    this.getUserList()
  },
  methods: {
    // 获取表格数据
    getUserList () {
      this.userList = []
      getUserList({
        enable: 1
      }).then(res => {
        const {userList} = res
        this.userList = userList
      })
    },
    // 获取题库列表
    taskUserMonitor () {
      this.fullLoading = true
      monitorUserDimension({
        page: {
          pageSize: this.page.pageSize,
          pageNum: this.page.pageNum
        },
        startTime: this.value[0] !== '' ? new Date(this.value[0]).Format('yyyy-MM-dd') : '',
        endTime: this.value[1] !== '' ? new Date(this.value[1]).Format('yyyy-MM-dd') : '',
        userId: this.userId
      }).then(res => {
        const {count, userMonitorList, userList} = res
        this.data = userMonitorList.map(item => {
          item.userName = item.userId !== 0 ? userList[item.userId].userName : '暂无';
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
      this.taskUserMonitor()
    },

    changePageSize (pageSize) {
      this.page.pageSize = pageSize
      this.taskUserMonitor()
    },

    reset () {
      this.searchKey = '';
      this.value = ['', ''];
      this.status = ''
      this.userId = ''
    },

    searchTaskItemList () {
      this.page.pageNum = 1
      this.taskUserMonitor()
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