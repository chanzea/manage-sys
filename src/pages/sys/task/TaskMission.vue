<template>
  <div class="page-task-mission">
    <div class="task-mission-content">
      <Tabs :value="currentTab" @on-click="changeTab">
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
  mixins: [returnMinxin],
  data () {
    return {
      actionText: "重做任务",
      searchData: {
        inputValue: '',
        dateValue: ''
      },
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
      total: null
    }
  },
  created() {
    this.getTaskList();
    this.columns = this.missionColumns;
  },
  methods: {
    getTaskList: function() {
      let page = this.page || "";
      getTaskList({ page, tag: 'mark' }).then(res => {
        console.log(res);
        const { taskList, count } = res
        this.data = taskList ? taskList.map(item => {
          item.taskRemain = item.taskItemMarkTotal - item.taskItemHadMarkTotal;
          item.taskTypeDis = taskType[item.taskType].label
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
        tag: 'mark'
      }
      taskItemList(params).then( (res) => {
        let {userList, taskItemList, taskList} = res;
        this.userList = userList;
        this.data = taskItemList;
        this.taskList = taskList;
      });
    },

    getCompleteTaskItemList(){
      let params = {
        page: this.page,
        taskItemStatus: 5,
        tag: "mark"
      }
      taskItemList(params).then( (res) => {
        let {userList, taskItemList, taskList} = res;
        this.userList = userList;
        this.data = taskItemList;
        this.taskList = taskList;
      });
    },

    changeTab(value){
      this.data = [];
      this.currentTab = value;
      this.columns =  value == "taskMission" ? this.missionColumns : this.returnColumns;
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
    

    //这个函数在minxin里面
    actionCallFn(params){
        this.$router.push({
          path: '/task/type',
          query: {
            id: params.row.taskId,
            taskItemId: params.row.id,
            type: taskType[params.row.taskItemType].type,
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
          type: taskType[params.row.taskType].type
        }
      })
    },

    changePage (page) {
      this.page.pageNum = page
      this.justGetdata()
    },

    changePageSize (pageSize) {
      this.page.pageSize = pageSize
      this.justGetdata()
    },
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