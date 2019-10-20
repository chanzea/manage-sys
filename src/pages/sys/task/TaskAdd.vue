<template>
  <div class="page-task-add">
    <div class="task-add-content">
      <Form :model="formItem" ref="taskForm" :rules="ruleValidate" :label-width="100">
        <FormItem label="任务编号" prop="taskId">
          <Input v-model="formItem.taskId" placeholder="编号"></Input>
        </FormItem>
        <FormItem label="任务名称" prop="taskName">
          <Input v-model="formItem.taskName" placeholder="编号"></Input>
        </FormItem>
        <FormItem label="任务用途" prop="taskRemark">
          <Input
            v-model="formItem.taskRemark"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="描述"
          ></Input>
        </FormItem>
        <FormItem label="标注任务积分" prop="markPointType" inline="true">
          <!-- <div class="task-mark"> -->
            <span style="margin-right:12px">按</span>
            <Select class="task-mark-select" v-model="formItem.markPointType">
              <Option value="beijing">New York</Option>
              <Option value="shanghai">London</Option>
              <Option value="shenzhen">Sydney</Option>
            </Select>
            <span style="margin:0 12px">积分,每次</span>
            <!-- <Input
              class="task-mark-input"
              type="number"
              v-model="formItem.markPoint"
              placeholder="积分"
            ></Input> -->
          <!-- </div> -->
        </FormItem>
        <FormItem prop="markPoint" inline="true">
            <Input type="number" placeholder="积分" v-model="formItem.markPoint" />          
        </FormItem>

        <FormItem label="审核任务积分" prop="reviewPoint">
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
        <FormItem label="任务模版" prop="taskType">
          <Select v-model="formItem.taskType">
            <Option :key="item.id" v-for=" (item) in taskType" :value="item.id">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="数据源" prop="dataSetId">
          <Select v-model="formItem.dataSetId" placeholder="选择数据源">
            <Option value="beijing">New York</Option>
            <Option value="shanghai">London</Option>
            <Option value="shenzhen">Sydney</Option>
          </Select>
        </FormItem>
        <FormItem label="标注人员" prop="markUserIds">
          <Select v-model="formItem.markUserIds" multiple filterable clearable>
            <Option value="beijing">New York</Option>
            <Option value="shanghai">London</Option>
            <Option value="shenzhen">Sydney</Option>
          </Select>
        </FormItem>
        <FormItem label="审核人员" prop="reviewUserIds">
          <Select v-model="formItem.reviewUserIds" multiple filterable clearable>
            <Option value="beijing">New York</Option>
            <Option value="shanghai">London</Option>
            <Option value="shenzhen">Sydney</Option>
          </Select>
        </FormItem>
      </Form>
      <div class="btn-list">
        <Button class="btn-list-item" type="primary" @click="getFormData">提交</Button>
        <Button class="btn-list-item">取消</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserList } from "@/api/user";
import { taskAdd } from "@/api/task"
// import { }

export default {
  name: "TaskAdd",
  data() {
    return {
      isUpdate: false,
      formItem: {
        taskName: null,
        taskRemark: null,
        taskType: null,
        markPointType: null,
        markPoint: null,
        reviewPoint: null,
        dataSetId: null,
        markUserIds: [],
        reviewUserIds: []
      },

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
  },

  watch: {
    '$route.path': function() {
      this.isUpdate = this.$route.meta.isUpdate;
    }
  },

  methods: {
    getFormData() {
      console.log(this.formItem);
      this.$refs["taskForm"].validate(valid => {
        console.log("dd", valid);
        if (valid) {
          console.log(valid);
          let params = this.formItem;
          taskAdd(params).then(res => {
            this.$Message.success('添加成功');
          })
        }
      });
    },
    getRenderData() {
      getUserList({}).then(() => {});
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