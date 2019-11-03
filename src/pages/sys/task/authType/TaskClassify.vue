<template>
  <div class="page-task-classify">
    <div class="task-classify-content">
      <div class="task-reject-folder-content-meta" v-if = "!noMore">
        <div class="task-item">
          <span class="item-label">任务名称:</span>
          <span class="item-value">aaaa</span>
        </div>
        <div class="task-item">
          <span class="item-label">任务模版:</span>
          <span class="item-value">分类任务</span>
        </div>
        <div class="task-item">
          <span class="item-label">任务描述:</span>
          <span class="item-value">为图片打上分类标签</span>
        </div>
      </div>
      <div class="task-classify-content-list" v-if = "!noMore">
        <div class="task-classify-content-list-item"  v-for="(item, index) in taskItemList" :key="index" >
          <div class="item-thumb" :style="{backgroundImage: 'url(' + BASEURL + item.src + ')', 'background-size': 'cover'}">
            <!-- <img :src="BASEURL + item.src" alt=""> -->
          </div>
          <!-- <div class="desc" style="fontSize:20px;fontWeight: bold">标签：{{item.taskData}}</div> -->
          <span v-if="item.taskData" class="item-tag">
            <Tag color="success" size="medium">{{item.taskData}}</Tag>
          </span>
        </div>
      </div>
      <div v-if="noMore" style="font-size: 24px; font-weight: bold">
          暂无需要审核的题目
        </div>
      <div v-if = "!noMore">
          <div style="margin: 10px 0;">
            <RadioGroup v-model="taskItemStatus">
                <Radio  label="5">通过</Radio>
                <Radio  label="3">不通过</Radio>
            </RadioGroup>
          </div>
          
          <Input v-model="taskItemReviewAdivse" type="textarea" :rows="4" placeholder="审核意见" />

          <div class="m_actionBtn">
            <Button class="opt-btn" type="primary" @click="submit">提交</Button>
            <Button class="opt-btn" type="primary" @click="taskItemAllotReview" :disabled="noMore">下一题</Button>
            <!-- <Button class="opt-btn" type="primary" >返回审核大厅</Button> -->
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import FormComponent from 'components/form/FormComponent.vue'
import { taskItemAllotReview, taskItemReview, taskItemDetail } from "@/api/task";
import { 
  BASEURL
 } from "@/api/config.js";
export default {
  name: 'TaskClassify',
  data() {
    return {
      taskItemList: [],
      noMore: false,
      isShowModal: false,
      BASEURL,
      taskItemStatus: "5",
      taskItemReviewAdivse: "",
      formProp: [
        {
          label: '快捷',
          type: 'select',
          value: [],
          options: [],
          placeholder: '可以选择已标记过的标签',
          key: 'tags'
        },
        {
          label: '名称',
          type: 'text',
          value: '',
          key: 'name'
        },
        {
          label: '描述',
          type: 'textarea',
          value: '',
          key: 'dis'
        }
      ],
      formCustom: {},
      isNext: false //是否可点击下一题
    }
  },
  components: {
    FormComponent
  },
  created() {
    const taskId = this.$route.query.id
    const taskItemId = this.$route.query.taskItemId
    // 当前存在 taskItemId ，返工任务
    if (taskItemId) {
      this.taskItemDetail(taskId, taskItemId)
    } else {
      this.taskItemAllotReview();
    }
  },
  computed: {
    isSelected () {
      return this.taskItemList.some(item => {
        return item.isSelected === true
      })
    }
  },
  methods: {
    taskItemAllotReview () {
      const taskId = this.$route.query.id
      taskItemAllotReview({
        taskId
      }).then(res => {
        this.isNext = false
        let {taskItemList, dataRecordList, userList} = res;
        if(!taskItemList){
          this.$Message.info("任务审核完成");
          this.noMore = true;
          return;
        }
        taskItemList = taskItemList || [];//没有居然是null
        this.taskItemList = taskItemList.map(item => {
          item.src = dataRecordList[item.dataRecordId].fileUrl
          item.isSelected = false
          return item
        })
      })
    },
    cancel () {

    },

    taskItemDetail (taskId, taskItemId) {
      this.taskItemList = []
      taskItemDetail({
        taskId,
        taskItemId
      }).then(res => {
        console.log('res', res)
        const {taskItemList, dataRecordList} = res
        this.taskItemList = taskItemList ? taskItemList.map(item => {
          item.src = dataRecordList[item.dataRecordId].thumbnailUrl
          item.isSelected = false
          item.tag = item.taskData
          return item
        }) : []
        this.isNext = !!taskItemList
      })
    },

    submit () {
      let taskItemId = this.taskItemList.map( item => item.id)[0];
      const data = {
        taskId: this.$route.query.id,
        taskItemId: String(taskItemId),
        taskItemStatus: this.taskItemStatus,
        taskItemReviewAdivse: this.taskItemReviewAdivse
      }
      console.log('data', data)
      taskItemReview(data).then(res => {
        console.log('res', res)
      }).then( () => {
          // this.$message.success("提交成功，下一题");
          this.$Message.info('提交成功，下一题');
          this.taskItemReviewAdivse = ""
          // this.taskItemAllotReview();
        }).catch( () => {
          this.$Message.error("提交失败");
        })
    },
  },
}
</script>

<style lang="scss">
  .task-item{
    font-size: 16px;
    margin: 8px 0;
  }
  .m_actionBtn{
    margin-top: 10px;
  }
</style>

<style lang="scss" scoped>
.page-task-classify {
  .task-classify-content {
    &-list {
      display: flex;
      flex-wrap: wrap;
      // margin-bottom: 20px;
      &-item {
        display: flex;
        flex-direction: column;
        position: relative;
        margin-bottom: 12px;
        margin-right: 12px;
        box-sizing: border-box;
        width: 250px;
        height: 150px;
        &.selected-border {
          border: 2px solid #f00;
          box-sizing: border-box;
        }
        .item-thumb {
          width: 100%;
          height: 100%;
        }
        .item-isselect {
          position: absolute;
          font-size: 36px;
          left: -2px;
          top: -14px;
        }
        .item-opt {
          position: absolute;
          right: 20px;
          bottom: 20px;
        }
      }
    }
    &-opt {
      display: flex;
      justify-content: center;
      .opt-btn {
        margin: 0 12px;
      }
    }
  }
}
</style>