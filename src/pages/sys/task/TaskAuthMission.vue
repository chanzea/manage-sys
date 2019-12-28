<template>
  <div class="page-task-mission">
    <div class="task-mission-content">
      <Tabs :value="currentTab" @on-click="changeTab">
        <TabPane v-for="(item, index) in tabLists" :key="index" :label="item.label" :name="item.name" >
          <table-page v-if="item.name == 'taskMission'" :columns="columns" :data="data" :total="total" @on-change-page="changePage" @on-change-pageSize="changePageSize">
            <div class="content-header" slot='form'>
              <Input class="form-item" style="width:300px" placeholder="任务编号,任务名称,任务用途" v-model="searchData.inputValue"></Input>
              <DatePicker style="margin-left: 15px;width: 200px" class="form-item" type="daterange" @on-change="handleDateRangeChange" placeholder="选择查询时间范围" v-model="searchData.dateRange" ></DatePicker>
              <ButtonGroup>
                <Button type="primary" @click="searchTaskList">查询</Button>
                <Button @click="reset">重置</Button>
              </ButtonGroup>
            </div>
          </table-page>

          <table-page v-else :columns="computeCol" :data="data" :total="total" @on-change-page="changePage" @on-change-pageSize="changePageSize">
            <div class="content-header" slot='form'>
              <Input class="form-item" style="width:300px" placeholder="任务编号,任务名称,任务用途" v-model="searchData.inputValue"></Input>
              <DatePicker style="margin-left: 15px;width: 200px" class="form-item" type="daterange" @on-change="handleDateRangeChange" placeholder="选择查询时间范围" v-model="searchData.dateRange" ></DatePicker>
              <ButtonGroup>
                <Button type="primary" @click="searchTaskList">查询</Button>
                <Button @click="reset">重置</Button>
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
import { getTaskList, taskItemList } from "@/api/task";
import returnMinxin from "./returnMinxin"
const taskType = {
  '1': {
    label: '分类任务',
    type: 'Classify'
  }, 
  '2': {
    label: '标注任务',
    type: 'Mark'
  },
  '3': {
    label: '图片剔除任务',
    type: 'RejectPic'
  },
  '4': {
    label: '文件夹剔除任务',
    type: 'RejectFolder'
  },
  '5': {
    label: '分割任务',
    type: 'Lasso'
  }
}
export default {
  name: 'TaskMission',
  components: {
    TablePage
  },
  mixins:[returnMinxin],
  data () {
    return {
      searchData: {
        inputValue: '',
        dateRange: ["", ""]
      },
      userList: [],
      taskList: [],
      currentTab: 'taskMission',
      tabLists: [{
        label: (h) => {
          return h('div', [
            h('span', '审核大厅'),
            // h('Badge', {
            //   props: {
            //     count: 3
            //   }
            // })
          ])
        },
        name: 'taskMission'
      },{
        label: (h) => {
          return h('div', [
            h('span', '返工审核'),
            // h('Badge', {
            //   props: {
            //     count: 3
            //   }
            // })
          ])
        },
        name: 'taskRework'
      },{
        label: (h) => {
          return h('div', [
            h('span', '已完成审核'),
            // h('Badge', {
            //   props: {
            //     count: 3
            //   }
            // })
          ])
        },
        name: 'taskComplete'
      }],
      columns: [],
      data: [],
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
  computed: {
      dateRange: function() {
        return {
          startTime: this.searchData.dateRange[0],
          endTime: this.searchData.dateRange[1]
        }
      }
  },

  methods: {
    getTaskList: function() {
      let page = this.page || "";
      let params = {
        page, 
        tag: 'review',
        searchKey: this.searchData.inputValue,
        ...this.dateRange
      }
      getTaskList(params).then(res => {
        let { taskList, count } = res
        taskList = taskList || [];
        this.data = taskList.map(item => {
          item.taskRemain = item.taskItemMarkTotal - item.taskItemHadMarkTotal;
          item.taskTypeDis = taskType[item.taskType].label
          return item
        })
        this.total = count;
      });
    },

    //获取返工审核列表
    getReturnTaskItemList(){
      let params = {
        page: this.page,
        taskItemStatus: 4, // RETURN_REVIEW(4),
        tag: "review",
        searchKey: this.searchData.inputValue,
        ...this.dateRange
      }
      taskItemList(params).then( (res) => {
        let {userList, taskItemList, taskList, count} = res;
        this.userList = userList;
        this.data = taskItemList;
        this.taskList = taskList;
        this.total = count;
      });
    },

    getCompleteTaskItemList(){
      let params = {
        page: this.page,
        taskItemStatus: 5,
        tag: "review",
        searchKey: this.searchData.inputValue,
        ...this.dateRange
      }
      taskItemList(params).then( (res) => {
        let {userList, taskItemList, taskList, count} = res;
        this.userList = userList;
        this.data = taskItemList;
        this.taskList = taskList;
        this.total = count;
      });
    },

    taskItemAllotMark (params) {
      this.$router.push({
        path: '/task/review',
        query: {
          id: params.row.id,
          type: taskType[params.row.taskType].type
        }
      })

      // let routeUrl = this.$router.resolve({
      //       path: '/task/review',
      //       query: {
      //         id: params.row.id,
      //         type: taskType[params.row.taskType].type,
      //       }
      // });
      // window.open(routeUrl .href, '_blank');
    },

    changeTab(value){
      this.userList = [];
      this.data = [];
      this.taskList = [];
      this.currentTab = value;
      this.page = {
        pageNum: 1,
        pageSize: 10
      };
      if(this.currentTab == "taskRework"){
        this.actionText = "返工审核"
      } else {
        this.actionText = "查看详情"
      }
      this.justGetdata();
    },

    handleDateRangeChange(value) {
      this.searchData.dateRange = value;
    },

    //判断调哪个函数
    justGetdata(){
      let getDataMap = {
        taskMission: this.getTaskList,
        taskRework: this.getReturnTaskItemList,
        taskComplete: this.getCompleteTaskItemList
      }
      getDataMap[this.currentTab]();
    },
    
    searchTaskList () {
      this.page.pageNum = 1
      this.justGetdata()
    },

    //这个函数在minxin里面
    actionCallFn(params){
        this.$router.push({
          path: '/task/review',
          query: {
            id: params.row.taskId,
            taskItemId: params.row.id,
            type: taskType[this.taskList[params.row.taskId].taskType].type,
            viewOnly:  this.currentTab == "taskComplete"
          }
        }) 
    },

    //修改分页
    changePage (page) {
      this.page.pageNum = page
      this.justGetdata()
    },

    changePageSize (pageSize) {
      this.page.pageSize = pageSize
      this.justGetdata();//判断当前调用哪些函数
    },

    reset () {
      this.searchData = {
        inputValue: '',
        dateRange: ["", ""]
      }
    }

  },

  watch: {
    currentTab: {
      handler (val) {
        this.columns =  [
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
            title: '任务类型',
            key: 'taskTypeDis'
          },
          {
            title: '任务用途',
            key: 'taskRemark'
          },
          {
            title: '任务待审核总数',
            key: 'taskItemReviewTotal'
          },
          {
            title: '待审核题目总数',
            key: 'taskItemNeedReviewTotal'
            
          },{
            title: '已审核题目总数',
            key: 'taskItemHadReviewTotal'   
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
                }, '开始审核')
              ]);
            }
          }
        ];
      },
      immediate: true
    } 
  },
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