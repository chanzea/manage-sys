<template>
  <div class="page-task-add">
    <div class="task-add-content">
      <Form :model="formItem" ref="taskForm" :rules="ruleValidate" :label-width="100">
        <!-- <FormItem label="任务编号:" prop="taskId">
          <Input v-model="formItem.taskId" placeholder="编号"></Input>
        </FormItem> -->
        <FormItem label="任务名称:" prop="taskName">
          <Input v-model="formItem.taskName" placeholder="任务名称"></Input>
        </FormItem>
        <FormItem label="任务用途:" prop="taskRemark">
          <Input
            v-model="formItem.taskRemark"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="描述"
          ></Input>
        </FormItem>
        <div>
          <FormItem label="标注任务积分:" prop="markPointType" inline="true">
            <!-- <div class="task-mark"> -->
              <span style="margin-right:12px">按</span>
              <Select class="task-mark-select" v-model="formItem.markPointType">
                <Option value="1">每一题</Option>
                <Option value="2">每个标注</Option>
              </Select>
              <span style="margin:0 12px">积分</span>
          </FormItem>
          <FormItem prop="markPoint" inline="true" label="每次积分:">
              <Input type="number" placeholder="积分" v-model="formItem.markPoint" />          
          </FormItem>
        </div>
        <FormItem label="审核任务积分:" prop="reviewPoint">
          <div class="task-mark">
            <span style="margin-right:12px">完成任务累计</span>
            <Input
              class="task-mark-input"
              type="text"
              v-model="formItem.reviewPoint"
              placeholder="积分"
            ></Input>
          </div>
        </FormItem>

        <FormItem label="审核比例:" prop="reviewScale">
          <Input
            type="text"
            v-model="formItem.reviewScale"
            placeholder="比例"
          ></Input>
        </FormItem>

        <FormItem label="任务模版:" prop="taskType">
          <Select v-model="formItem.taskType">
            <Option :key="item.id" v-for=" (item) in taskType" :value="item.id">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="数据源:" prop="dataSetId">
          <Select v-model="formItem.dataSetId" placeholder="选择数据源">
            <Option  v-for=" item in dataSetList" :key="item.id"  :value="item.id">{{item.folderName}}({{item.folderDesc}})</Option>
          </Select>
        </FormItem>
        <FormItem label="标注人员:" prop="markUserIds">
          <Select v-model="formItem.markUserIds" multiple filterable clearable>
            <Option :key="item.id" v-for=" (item) in userList" :value="item.id">{{item.userName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="审核人员:" prop="reviewUserIds">
          <Select v-model="formItem.reviewUserIds" multiple filterable clearable>
            <Option :key="item.id" v-for=" (item) in userList" :value="item.id">{{item.userName}}</Option>
          </Select>
        </FormItem>
      </Form>
      <div class="btn-list">
        <Button class="btn-list-item" type="primary" :loading="loading" @click="submit">提交</Button>
        <Button class="btn-list-item">取消</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserList } from "@/api/user";
import { taskAdd } from "@/api/task"
import {getDatasetList} from "@/api/data"
// import { }

export default {
  name: "TaskAdd",
  data() {
    return {
      loading: false,
      isUpdate: false,
      formItem: {
        taskName: null,
        taskRemark: null,
        taskType: null,
        markPointType: null,
        markPoint: null,
        reviewPoint: null,
        dataSetId: null,
        reviewScale: null,
        markUserIds: [],
        reviewUserIds: []
      },

      dataSetList: [],//数据源
      userList: [],//用户列表

      taskType: {
        "CLASSIFY": {
          label: "分类任务",
          id: 1,
        }, 
        MARK:{
          label: "标注任务",
          id: 2,
        },
        REJECT_PIC: {
          label: "图片剔除任务",  
          id: 3
        },

         REJECT_FOLDER: {
           label: "文件夹剔除任务",
           id: 4
         },  
         LASSO: {
           label: "分割任务",
           id: 5
         }
      },

      ruleValidate: {
        taskName: [
          {
            required: true,
            message: "The name cannot be empty",
            trigger: "blur"
          }
        ]
      }
    };
  },

  created() {
    this.isUpdate = this.$route.meta.isUpdate;
    this.getRenderData();
  },

  watch: {
    '$route.path': function() {
      this.isUpdate = this.$route.meta.isUpdate;
    }
  },

  computed: {
    // authorList: function() {
    //   return this.userList.filter( i => i.)
    // }
  },

  methods: {
    submit() {
      this.$refs["taskForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          let params = this.formItem;
          // params = {"taskName":"test","taskRemark":"test","taskType":1,"markPointType":"1","markPoint":"100","reviewPoint":"1000","dataSetId":17,"markUserIds":[7,8],"reviewUserIds":[9,10]};
          // params.tokenId = sessionStorage.getItem("tokenId")
          taskAdd(params).then(res => {
            this.$Message.success('添加成功');
            this.$router.push('/task/mission');
            this.loading = false;
          }).catch(() => {
            this.loading = false
          })
        }
      });
    },
    //获取数据源与用户列表，用来渲染筛选项
    getRenderData() {
      let list = [
        getDatasetList(),
        getUserList()
      ]
      let baseData = Promise.all(list).then( (list) => {
        this.dataSetList = list[0].dataSetList;
        this.userList = list[1].userList;
      }).catch( err => {
        console.log(err)
      })
    },

    //获取
    getTaskInfo() {
      
    }
  }
};
</script>

<style lang="scss" scoped>
.page-task-add {
  .task-add-content {
    width: 550px;
    padding-left: 40px;
    .task-mark {
      display: flex;
      &-select {
        width: 170px;
      }
      &-input {
        width: 85px;
        position: relative;
        &::after {
          content: "分";
          position: absolute;
          top: 7px;
          right: -20px;
        }
      }
    }
    .btn-list {
      padding-left: 100px;
      display: flex;
      &-item {
        margin-right: 8px;
      }
    }
  }
}
</style>