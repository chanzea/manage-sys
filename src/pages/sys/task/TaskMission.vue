<template>
  <div class="page-task-mission">
    <div class="task-mission-content">
      <Tabs :value="currentTab" @on-click="changeTab">
        <TabPane v-for="(item, index) in tabLists" :key="index" :label="item.label" :name="item.name">
          <table-page v-if="item.name === 'taskMission'"  :columns="columns" :data="data" :total="total" @on-change-page="changePage" @on-change-pageSize="changePageSize">
            <div class="content-header" slot='form'>
              <Input class="form-item" style="width:300px" placeholder="任务编号,任务名称,任务用途" v-model="searchData.inputValue"></Input>
              <DatePicker style="margin-left: 15px;width: 200px" class="form-item" type="daterange" @on-change="handleDateRangeChange" placeholder="选择查询时间范围" v-model="searchData.dateRange" ></DatePicker>
              <ButtonGroup>
                <Button type="primary" @click="searchTaskList">查询</Button>
                <Button @click="reset">重置</Button>
              </ButtonGroup>
            </div>
          </table-page>

          <table-page v-else :columns="columns" :data="data" :total="total" @on-change-page="changePage" @on-change-pageSize="changePageSize">
            <div class="content-header" slot='form'>
              <Input class="form-item" style="width:300px" placeholder="任务编号,任务名称,任务用途" v-model="searchData.inputValue"></Input>
              <DatePicker style="margin-left: 15px;width: 200px" class="form-item" type="daterange" @on-change="handleDateRangeChange" placeholder="选择查询时间范围" v-model="searchData.dateRange" ></DatePicker>
              <ButtonGroup>
                <Button type="primary" @click="searchTaskList">查询</Button>
                <Button @click="reset">重置</Button>
              </ButtonGroup>
              <div style="margin-top: 10px; font-weight: bold" v-if="currentTab == 'taskComplete'">获得任务总积分：{{markPoint}}</div>
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
import {
  TASKTYPE
} from 'utils/tool.js'
export default {
  name: 'TaskMission',
  components: {
    TablePage
  },
  mixins: [returnMinxin],
  data () {
    return {
      actionText: "重做任务",
      searchData: {
        inputValue: '',
        dateRange: ["", ""]
      },
      markPoint: 0,
      userlist:[],
      currentTab: 'taskMission',
      tabLists: [{
        label: (h) => {
          return h('div', [
            h('span', '任务大厅'),
          ])
        },
        name: 'taskMission'
      },{
        label: (h) => {
          return h('div', [
            h('span', '返工任务'),
          ])
        },
        name: 'taskRework'
      },{
        label: (h) => {
          return h('div', [
            h('span', '已完成任务'),
          ])
        },
        name: 'taskComplete'
      }],
      missionColumns: [
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
          title: '数量',
          key: 'taskItemMarkTotal'
        },
        {
          title: '最近标注时间点',
          key: 'personLastMarkTime'
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
      columns: [],
      data: [],
      userList: [],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      searchKey: "",
      total: null
    }
  },
  created() {
    this.getTaskList();
    this.columns = this.missionColumns;
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
        tag: 'mark',
        searchKey: this.searchData.inputValue,
        ...this.dateRange
      };
      getTaskList(params).then(res => {
        const { taskList, count} = res
        this.data = taskList ? taskList.map(item => {
          item.taskRemain = item.taskItemMarkTotal - item.taskItemHadMarkTotal;
          item.taskTypeDis = TASKTYPE[item.taskType].label
          if (item.personLastMarkTime) {
            item.personLastMarkTime = new Date(item.personLastMarkTime).Format('yyyy-MM-dd hh:mm:ss')
          }
          return item
        }) : []
        this.total = count;
      });
    },

    //获取返工列表
    getReturnTaskItemList(){
      let params = {
        page: this.page,
        taskItemStatus: 3, // RETURN_REVIEW(4)   
        tag: 'mark',
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

    handleDateRangeChange(value) {
      this.searchData.dateRange = value;
    },

    getCompleteTaskItemList(){
      let params = {
        page: this.page,
        taskItemStatus: 5,
        tag: "mark",
        searchKey: this.searchData.inputValue,
        ...this.dateRange
      }
      taskItemList(params).then( (res) => {
        let {userList, taskItemList, taskList, count, markPoint} = res;
        this.userList = userList;
        this.data = taskItemList;
        this.taskList = taskList;
        this.total = count;
        this.markPoint = markPoint;
      });
    },

    changeTab(value){
      this.data = [];
      this.currentTab = value;
      this.columns =  value == "taskMission" ? this.missionColumns : this.computeCol;
      if(this.currentTab == "taskRework"){
        this.actionText = "重做任务"
      } else {
        this.actionText = "查看详情"
      }
      this.page = {
        pageNum: 1,
        pageSize: 10
      };
      this.justGetdata();
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
          path: '/task/type',
          query: {
            id: params.row.taskId,
            taskItemId: params.row.id,
            type: TASKTYPE[this.taskList[params.row.taskId].taskType].type,
            viewOnly:  this.currentTab == "taskComplete",
          }
        }) 
    },

    //领取路由跳转
    taskItemAllotMark (params) {
      this.$router.push({
        path: '/task/type',
        
        query: {
          id: params.row.id,
          type: TASKTYPE[params.row.taskType].type,
        }
      })

      // let routeUrl = this.$router.resolve({
      //       path: '/task/type',
      //       query: {
      //         id: params.row.id,
      //         type: TASKTYPE[params.row.taskType].type,
      //       }
      // });
      // window.open(routeUrl .href, '_blank');
    },

    changePage (page) {
      this.page.pageNum = page
      this.justGetdata()
    },

    changePageSize (pageSize) {
      this.page.pageSize = pageSize
      this.justGetdata()
    },

    reset () {
      this.searchData = {
        inputValue: '',
        dateRange: ["", ""]
      }
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