<template>
  <div class="page-task-list">
    <Spin size="large" fix v-if="fullLoading"></Spin>
    <div class="content-header">
      <div class="content-header-form">
          <Input class="form-item" style="width:300px" v-model="searchKey" placeholder="关键字" />
          <DatePicker class="form-item" type="daterange" placeholder="选择查询时间范围" v-model="value" style="width: 200px"></DatePicker>
          <Select class="form-item" v-model="status" style="width:120px" placeholder="状态">
            <Option v-for="item in options" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <ButtonGroup>
            <Button type="primary" @click="searchTaskList">查询</Button>
            <Button @click="reset">重置</Button>
          </ButtonGroup>
        </div>
    </div>
    <div class="content-middle">
      <div class="content-middle-table">
        <Table border :columns="columns" :data="data">
          <template slot-scope="{ row, index }" slot="action">
            <span class="opt-item" @click="show(row)">查看</span>
            <!-- <span class="opt-item" @click="jumpToItembank('/task/itembank', row)">题库</span> -->
            <span class="opt-item" @click="showItemBank(row)">题库</span>
            <Poptip
              confirm
              title="确认删除该任务?"
              @on-ok="onDelete(row)"
              @on-cancel="">
              <!-- <span class="opt-item">删除</span> -->
          </Poptip>
            <span class="opt-item" @click="offLine(row)">下线</span>
            <span class="opt-item" @click="online(row)">上线</span>
          </template>
        </Table>
      </div>
      <div class="content-middle-pages" v-if="total">
        <Page :total="total" size="small" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changePageSize" />
      </div>
    </div>
    <Modal v-model="isShowmodal" fullscreen :title="'所属任务名称: ' + taskName">
      <div style="margin-bottom: 12px;">
        <Select class="form-item" v-model="markUserId" filterable style="width:160px" placeholder="根据标注人员搜索">
          <Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.userName }}</Option>
        </Select>
        <Select class="form-item" v-model="reviewUserId" filterable style="width:160px" placeholder="根据审核人员搜索">
          <Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.userName }}</Option>
        </Select>
        <Button type="primary" @click="searchItemBankList">查询</Button>
      </div>
      <div style="margin-bottom: 12px">
        <Table border :loading="loading" :columns="itemBankcolumns" :data="itemBankData"></Table>
      </div>
      <div class="content-middle-right-pages">
        <Page :total="itemBankTotal" size="small" show-elevator show-sizer @on-change="changeItemBankPage" @on-page-size-change="changeItemBankPageSize" />
      </div>
    </Modal>
  </div>
</template>

<script>
import { getTaskList, taskOffline, taskOnline, taskItemList } from "@/api/task";
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
const taskStatusData = {
  '-1': '初始化',
  '-2': '初始化完成',
  '-3': '任务完成',
  '0': '下线',
  '1': '上线',
} 
export default {
  name: "TaskList",
  data() {
    return {
      fullLoading: false,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      searchKey: "",
      status: "",
      value: ['', ''],
      options: [
        {
          label: "完成",
          value: '-3'
        },
        {
          label: "上线",
          value: '1'
        },
        {
          label: "下线",
          value: '0'
        }
      ],
      taskName: '',
      taskId: '',
      columns: [
        {
          title: "任务编号",
          key: "id",
          sortable: true
        },
        {
          title: "任务名称",
          key: "taskName"
        },
        {
          title: '任务类型',
          key: 'taskTypeDis'
        },
        {
          title: "创建人",
          key: "creatorName"
        },
        {
          title: "创建时间",
          key: "createdTime"
        },
        {
          title: "数量",
          key: "taskItemTotal",
          width: '100'
        },
        {
          title: "待标注",
          key: "taskItemHadMarkTotal",
          width: '100'
        },
        {
          title: "待审核",
          key: "taskItemNeedReviewTotal",
          width: '100'
        },
        {
          title: "状态",
          key: "taskStatusDis"
        },
        {
          title: "操作",
          slot: "action",
          width: 260,
          align: "center",
        }
      ],
      total: 0,
      data: [],

      isShowmodal: false,
      itemBankData: [],
      itemBankTotal: null,
      loading: false,
      itemBankPage: {
        pageNum: 1,
        pageSize: 10
      },
      itemBankcolumns: [
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
      userList: [],
      markUserId: '',
      reviewUserId: ''
    };
  },

  created() {
    this.getTaskList();
    this.getUserList();
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
    getTaskList() {
      this.fullLoading = true
      let page = this.page;
      getTaskList({
        page,
        // tag: 'mark',
        searchKey: this.searchKey,
        taskStatus: this.status,
        startTime: this.value[0] !== '' ? new Date(this.value[0]).Format('yyyy-MM-dd') : '',
        endTime: this.value[1] !== '' ? new Date(this.value[1]).Format('yyyy-MM-dd') : ''
      }).then(res => {
        console.log('res', res)
        const { taskList, dataSetList, userList, count } = res
        this.data = taskList ? taskList.map(item => {
          item.creatorName = userList[item.creatorId].userName
          item.createdTime = dataSetList[item.dataSetId] ? new Date(dataSetList[item.dataSetId].createdTime).Format('yyyy-MM-dd') : '-'
          item.taskStatusDis = taskStatusData[item.taskStatus];
          item.taskTypeDis = TASKTYPE[item.taskType].label
          return item
        }) : []
        this.total = count;
        this.fullLoading = false
      }).catch(() => {
        this.fullLoading = false
      })
    },
    
    searchTaskList () {
      this.page.pageNum = page
      this.getTaskList()
    },

    // 新建任务
    jumpToPage(path) {
      this.$router.push({
        path
      })
    },
    
    // 跳转到题库
    // jumpToItembank(path, row) {
    //   this.$router.push({
    //     path,
    //     query: {
    //       taskId: row.id
    //     }
    //   })
    // },

    showItemBank (row) {
      console.log('row', row)
      this.taskName = row.taskName;
      this.taskId = row.id
      this.taskItemList()
    },

    //查看
    show(row) {
      this.$router.push({
        path: "/task/add",
        query: {
          id: row.id
        }
      })
    },

    //下线
    offLine(row) {
      taskOffline({taskId: row.id}).then( () => {
        row.taskStatus = 0;
        row.taskStatusDis = '下线'
        this.$Message.success('任务下线成功');
      })
    },

    online(row) {
      taskOnline({taskId: row.id}).then( () => {
        row.taskStatus = 1;
        row.taskStatusDis = '上线'
        this.$Message.success('任务上线成功');
      })
    },

    changePage (page) {
      this.page.pageNum = page
      this.getTaskList()
    },

    changePageSize (pageSize) {
      this.page.pageSize = pageSize
      this.getTaskList()
    },

    changeItemBankPage (page) {
      this.itemBankPage.pageNum = page
      this.taskItemList()
    },

    changeItemBankPageSize (pageSize) {
      this.itemBankPage.pageSize = pageSize
      this.taskItemList()
    },

    searchItemBankList () {
      this.itemBankPage.pageNum = 1
      this.taskItemList()
    },

    // 获取题库列表
    taskItemList () {
      this.loading = true
      this.itemBankData = []
      taskItemList({
        page: {
          pageSize: this.itemBankPage.pageSize,
          pageNum: this.itemBankPage.pageNum
        },
        taskId: this.taskId,
        markUserId: this.markUserId,
        reviewUserId: this.reviewUserId
      }).then(res => {
        this.isShowmodal = true
        const {count, taskItemList, taskList, userList} = res
        this.itemBankData = taskItemList.map(item => {
          item.taskName = taskList[item.taskId].taskName;
          item.taskTypeDis = TASKTYPE[taskList[item.taskId].taskType].label;
          item.taskType = taskList[item.taskId].taskType;
          item.status = taskItemStatusData[item.taskItemType];
          item.markUserName = item.markUserId !== 0 ? userList[item.markUserId].userName : '暂无';
          item.reviewUserName = item.reviewUserId !== 0 ? userList[item.reviewUserId].userName : '暂无';
          return item
        })
        this.itemBankTotal = count
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    // 查看详情
    showDetail (params) {
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
    
    // 删除任务
    onDelete (row) {
      console.log('row', row)
    },

    reset () {
      this.searchKey = ''
      this.status = ''
      this.value = ['', '']
    }
  }
};
</script>
<style lang="scss" scoped>
.page-task-list {
  .content-header {
    margin-bottom: 20px;
    &-form {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
    }
    .form-item {
      margin-right: 12px;
    }
  }
  .content-middle {
    margin-bottom: 12px;
    &-table {
      margin-bottom: 12px;
      .opt-item {
        margin-right: 12px;
      }
    }
  }
}
</style>

<style lang="scss">
  .ivu-poptip-body {
    display: flex;
  }
</style>