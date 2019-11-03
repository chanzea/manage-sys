<template>
  <div class="page-task-list">
    <div class="content-header">
      <div class="content-header-form">
          <Input class="form-item" style="width:300px" v-model="searchValue" placeholder="关键字" />
          <DatePicker class="form-item" type="date" placeholder="选择查询时间范围" style="width: 200px"></DatePicker>
          <Select class="form-item" v-model="status" style="width:60px" placeholder="状态">
            <Option v-for="item in options" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <ButtonGroup>
            <Button type="primary">查询</Button>
            <Button>重置</Button>
          </ButtonGroup>
        </div>
        <ButtonGroup class="btns">
          <Button type="primary" @click="jumpToPage('/task/add')">新建</Button>
          <Button type="primary">删除</Button>
          <Button type="primary">上线</Button>
          <Button type="primary">下线</Button>
        </ButtonGroup>
    </div>
    <div class="content-middle">
      <div class="content-middle-table">
        <Table border :columns="columns" :data="data">
          <template slot-scope="{ row, index }" slot="action">
            <span class="opt-item" @click="show(row)">查看</span>
            <span class="opt-item" @click="jumpToPage('/task/itembank')">题库</span>
            <span class="opt-item">编辑</span>
            <span class="opt-item">删除</span>
            <span class="opt-item" @click="offLine(row)">下线</span>
            <span class="opt-item" @click="online(row)">上线</span>
          </template>
        </Table>
      </div>
      <div class="content-middle-pages">
        <Page :total="total" size="small" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changePageSize" />
      </div>
    </div>
  </div>
</template>

<script>
import { getTaskList, taskOffline, taskOnline } from "@/api/task";
// import taskList from "@/mock/task";
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
      page: {
        pageNum: 1,
        pageSize: 10
      },
      searchValue: "",
      status: "",
      options: [
        {
          label: "草稿",
          value: 0
        },
        {
          label: "上线",
          value: 1
        },
        {
          label: "下线",
          value: 2
        }
      ],
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
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
          title: "创建人",
          key: "creatorName"
        },
        {
          title: "创建时间",
          key: "createdTime"
        },
        {
          title: "数量",
          key: "taskItemTotal"
        },
        {
          title: "待标注",
          key: "taskItemHadMarkTotal"
        },
        {
          title: "待审核",
          key: "taskItemNeedReviewTotal"
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
      data: []
    };
  },

  created() {
    this.getTasklistInfo();
  },

  methods: {
    getTasklistInfo() {
      let page = this.page;
      getTaskList({ page, tag: 'mark' }).then(res => {
        const { taskList, dataSetList, userList } = res
        this.data = res.taskList.map(item => {
          item.creatorName = userList[item.creatorId].userName
          item.createdTime = new Date(dataSetList[item.dataSetId].createdTime).Format('yyyy-MM-dd')
          item.taskStatusDis = taskStatusData[item.taskStatus]
          return item
        })
        this.total = res.count;
      });
    },

    jumpToPage(path) {
      this.$router.push({
        path
      })
    },

    //查看
    show(row) {
      this.$router.push({
        path: "/task/update",
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
      this.getTasklistInfo()
    },

    changePageSize (pageSize) {
      this.page.pageSize = pageSize
      this.getTasklistInfo()
    },

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