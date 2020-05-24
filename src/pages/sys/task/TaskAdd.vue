<template>
  <div class="page-task-add">
    <Spin size="large" fix v-if="fullLoading"></Spin>
    <div class="task-add-content">
      <Form :model="formItem" ref="taskForm" :rules="ruleValidate" :label-width="120">
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
          <FormItem label="检测框标注积分:" prop="markPointType" inline="true">
            <!-- <div class="task-mark"> -->
              <span style="margin-right:12px">按</span>
              <Select class="task-mark-select" v-model="formItem.markPointType">
                <Option :value="1">每一题</Option>
                <Option :value="2">每个标注</Option>
              </Select>
              <span style="margin:0 12px">积分</span>
          </FormItem>
          <FormItem prop="markPoint" inline="true" label="每次积分:">
            <div class="task-mark">
              <Input type="number" class="task-mark-input" placeholder="积分" v-model="formItem.markPoint" />          
            </div>
          </FormItem>
        </div>
        <FormItem label="审核任务积分:" prop="reviewPoint">
          <div class="task-mark">
            <span style="margin-right:12px">完成任务累计</span>
            <Input
              class="task-mark-input"
              type="number"
              v-model="formItem.reviewPoint"
              placeholder="积分"
            ></Input>
          </div>
        </FormItem>

        <FormItem label="审核比例:" prop="reviewScale" class="task-item">
          <Input
            type="number"
            class="task-item-input"
            v-model="formItem.reviewScale"
            placeholder="比例"
            :disabled="isDisabled"
          ></Input>%
        </FormItem>
        <FormItem label="任务模版:" prop="taskType">
          <Select v-model="formItem.taskType" :disabled="isDisabled">
            <Option :key="item.id" v-for=" (item) in taskType" :value="item.id">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="数据源:" prop="dataSetId">
          <Select v-model="formItem.dataSetId" placeholder="选择数据源" :disabled="isDisabled">
            <Option v-for=" item in dataSetList" :key="item.id"  :value="item.id">{{item.folderName}}({{item.folderDesc}})</Option>
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
        <Button class="btn-list-item" type="primary" :loading="loading" @click.native="submit">提交</Button>
        <Button class="btn-list-item" @click="cancel">返回</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserList } from "@/api/user";
import { taskAdd, taskDetail, taskUpdate } from "@/api/task"
import {getDatasetList} from "@/api/data"
// import { }

export default {
  name: "TaskAdd",
  data() {
    return {
      fullLoading: false,
      loading: false,
      formItem: {
        taskName: null,
        taskRemark: null,
        taskType: '',
        markPointType: null,
        markPoint: null,
        reviewPoint: null,
        dataSetId: null,
        reviewScale: null,
        markUserIds: [],
        reviewUserIds: [],
      },

      dataSetList: [],//数据源
      userList: [],//用户列表

      taskType: {
        CLASSIFY: {
          label: "分类任务",
          id: 1,
        }, 
        MARK:{
          label: "检测框标注",
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
      taskId: '',
      ruleValidate: {
        city: [
            { required: true, message: 'Please select the city', trigger: 'change' }
        ],
        taskName: [
          {
            required: true,
            message: "请输入任务名称",
            trigger: "blur"
          }
        ],
        taskRemark: [
          {
            required: true,
            message: "请输入任务描述",
            trigger: "blur"
          }
        ],
        markPointType: [
          {
            required: true,
            trigger: 'change',
            validator(rule, value, callback) {
              if (!value) {
                callback(new Error('请选择检测框标注积分'))
              } else {
                callback()
              }
            }
          }
        ],
        markPoint: [
          {
            required: true,
            trigger: "blur",
            validator(rule, value, callback) {
              if (!value) {
                callback(new Error('请输入积分'))
              } else {
                callback()
              }
            }
          }
        ],
        reviewPoint: [
          {
            required: true,
            trigger: "blur",
            validator(rule, value, callback) {
              if (!value) {
                callback(new Error('请输入审核任务积分'))
              } else {
                callback()
              }
            }
          }
        ],
        taskType: [
          {
            required: true,
            trigger: "change",
            validator(rule, value, callback) {
              if (!value) {
                callback(new Error('请选择任务模版'))
              } else {
                callback()
              }
            }
          }
        ],
        dataSetId: [
          {
            required: true,
            trigger: "change",
            validator(rule, value, callback) {
              if (!value) {
                callback(new Error('请选择数据源'))
              } else {
                callback()
              }
            }
          }
        ],
        markUserIds: [
          {
            required: true,
            trigger: "change",
            validator(rule, value, callback) {
              if (value.length === 0) {
                callback(new Error('请选择标注人员'))
              } else {
                callback()
              }
            }
          }
        ],
        reviewUserIds: [
          {
            required: true,
            trigger: "change",
            validator(rule, value, callback) {
              if (value.length === 0) {
                callback(new Error('请选择审核人员'))
              } else {
                callback()
              }
            }
          }
        ],
        reviewScale: [
          {
            trigger: "blur",
            validator (rule, value, callback) {
              if (!value) {
                callback(new Error('请输入审核比例'))
              } else {
                if (value < 0 || value > 100) {
                  callback(new Error('请输入0 - 100之间的数字'))
                } else {
                  callback()
                }
              }
            }
          }
        ]
      }
    };
  },

  created() {
    this.taskId = this.$route.query.id || ''
    document.title = this.taskId ? 'Tagging - 编辑任务' : 'Tagging - 新建任务'
    this.taskId && this.taskDetail(this.taskId)
    this.getRenderData();
  },

  computed: {
    isDisabled() {
      return !!this.taskId
    }
  },

  methods: {
    // 获取任务详情
    taskDetail (taskId) {
      this.fullLoading = true
      taskDetail({
        taskId
      }).then(res => {
        this.formItem = res;
        this.fullLoading = false
      }).catch(() => {
        this.fullLoading = false
      })
    },

    submit() {
      this.$refs["taskForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          let params = this.formItem;
          if (this.taskId) {
            Object.assign(params, {taskId: this.taskId})
            taskUpdate(params).then(res => {
              this.$Message.success('更新成功');
              this.$router.push('/task/list');
              this.loading = false;
            }).catch((e) => {
              this.loading = false
            })
          } else {
            taskAdd(params).then(res => {
              this.$Message.success('添加成功');
              this.$router.push('/task/list');
              this.loading = false;
            }).catch(() => {
              this.loading = false
            })
          }
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
        this.dataSetList = list[0].dataSetList
        this.userList = list[1].userList;
      }).catch( err => {
        console.error(err)
      })
    },
    
    // 返回
    cancel () {
      this.$router.go(-1)
    },
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
    .task-item {
      /deep/ .ivu-form-item-content {
        display: flex !important;
      }
      &-input {
        width: 85px;
        margin-right: 4px;
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