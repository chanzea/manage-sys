<template>
  <div class="page-task-list">
    <table-page :columns="columns" ref="table" :data="data" :total="total">
      <div class="content-header" slot="form">
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
          <Button type="primary">新建</Button>
          <Button type="primary">删除</Button>
          <Button type="primary">上线</Button>
          <Button type="primary">下线</Button>
        </ButtonGroup>
      </div>
    </table-page>
  </div>
</template>

<script>
import TablePage from "components/tablePage.vue";
import { getTaskList, taskOffline } from "@/api/task";
// import taskList from "@/mock/task";

export default {
  name: "TaskList",
  components: {
    TablePage
  },
  data() {
    return {
      page: {
        pageNum: 10,
        pageSize: 1
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
          key: "creatorId"
        },
        {
          title: "创建时间",
          key: "createtime"
        },
        {
          title: "数量",
          key: "taskItemTotal"
        },
        {
          title: "待标注",
          key: "taskItemUnMarkTotal"
        },
        {
          title: "待审核",
          key: "taskItemUnReviewTotal"
        },
        {
          title: "状态",
          key: "taskStatus"
        },
        {
          title: "操作",
          key: "action",
          width: 260,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    color: "#2d8cf0",
                    marginRight: "12px"
                  },
                  on: {
                    click: () => {
                      this.show(params);
                    }
                  }
                },
                "查看"
              ),
              h(
                "span",
                {
                  style: {
                    color: "#2d8cf0",
                    marginRight: "12px"
                  },
                  on: {
                    click: () => {
                      this.remove(params);
                    }
                  }
                },
                "题库"
              ),
              h(
                "span",
                {
                  style: {
                    color: "#2d8cf0",
                    marginRight: "12px"
                  },
                  on: {
                    click: () => {
                      this.remove(params);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "span",
                {
                  style: {
                    color: "#2d8cf0",
                    marginRight: "12px"
                  },
                  on: {
                    click: () => {
                      this.remove(params);
                    }
                  }
                },
                "删除"
              ),
              h(
                "span",
                {
                  style: {
                    color: "#2d8cf0",
                    marginRight: "12px"
                  },
                  on: {
                    click: () => {
                      this.offLine(params);
                    }
                  }
                },
                "下线"
              ),
              h(
                "span",
                {
                  style: {
                    color: "#2d8cf0",
                    marginRight: "12px"
                  },
                  on: {
                    click: () => {
                      this.online(params);
                    }
                  }
                },
                "下线"
              ),
            ]);
          }
        }
      ],
      total: 0,
      data: [
        {
          id: 38,
          taskName: "task3",
          taskRemark: "task1-desc",
          taskType: 1,
          markPointType: 1,
          markPoint: 10,
          reviewPoint: 10,
          reviewScale: 0,
          dataSetId: 17,
          dataSetSnapshotId: 0,
          markUserIds: [84],
          reviewUserIds: [8],
          taskStatus: 1,
          taskItemTotal: 5,
          taskItemUnMarkTotal: 5,
          taskItemUnReviewTotal: 5,
          taskItemReMarkTotal: 0,
          taskItemReReviewTotal: 0,
          creatorId: 8
        }
      ]
    };
  },

  created() {
    this.getTasklistInfo();
    // this.data = taskList.data.taskList;
    // this.total = taskList.data.count;
  },

  methods: {
    getTasklistInfo() {
      let page = this.page;
      getTaskList({ page }).then(res => {
        console.log(res);
        this.data = res.data.taskList;
        this.total = res.data.count;
      });
    },

    //查看
    show(params) {
      let raw = params.row;

      this.$router.push({
        path: "/task/update",
        query: {
          id: raw.id
        }
      })
      console.log(raw.id)
    },

    //下线
    offLine(params) {
      let raw = params.row;
      taskOffline({taskId: raw.id}).then( () => {
        raw.taskStatus = 2;
      })
    },

    online(params) {
      let raw = params.row;
      taskOnline({taskId: raw.id}).then( () => {
        raw.taskStatus = 1;
      })
    }


  }
};
</script>
<style lang="scss" scoped>
.page-task-list {
  .content-header {
    display: flex;
    flex-direction: column;
    &-form {
      display: flex;
      align-items: center;
      margin-top: 12px;
    }
    .btns {
      margin-top: 12px;
    }
  }
}
</style>