<template>
  <div class="page-task-classify">
    <div class="task-classify-content">
      <div class="task-classify-content-meta">
        <div class="task-classify-content-meta-item">
          <span class="item-label">任务名称:</span>
          <span class="item-value">{{detail.taskName}}</span>
        </div>
        <div class="task-classify-content-meta-item">
          <span class="item-label">任务模版:</span>
          <span class="item-value">分类任务</span>
        </div>
        <div class="task-classify-content-meta-item">
          <span class="item-label">任务描述:</span>
          <span class="item-value"><strong>{{detail.taskRemark}}</strong></span>
        </div>
      </div>
      <div class="task-classify-content-list" v-if = "!noMore">
        <div class="task-classify-content-list-item"  v-for="(item, index) in taskItemList" :key="index" >
          <Poptip placement="right" width="800">
            <div slot="content" class="prev-content">
              <img class="prev-img" :src="BASEURL + item.src" alt="" oncontextmenu="return false;">
            </div>
            <!-- <div class="item-thumb" :style="{backgroundImage: 'url(\'' + BASEURL + item.src + '\')'}">
              <img :src="BASEURL + item.src" alt="">
            </div> -->
            <div class="item-thumb">
              <img :src="BASEURL + item.src" alt="" oncontextmenu="return false;">
            </div>
          </Poptip>
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
            <RadioGroup v-model="taskItemStatus" :disabled="viewOnly">
                <Radio :disabled="viewOnly" label="5">通过</Radio>
                <Radio :disabled="viewOnly" label="3">不通过</Radio>
            </RadioGroup>
          </div>
          
          <Input v-model="taskItemReviewAdvise" type="textarea" :rows="4" placeholder="审核意见" />

          <div class="m_actionBtn" v-if="!viewOnly">
            <Button class="opt-btn" type="primary" @click="submit">提交</Button>
            <Button v-if="!isReturnItem" class="opt-btn" type="primary" @click="submit(true)" :disabled="noMore">下一题</Button>
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
 import minxin from "./minxin";
export default {
  name: 'TaskClassify',
  mixins: [minxin],
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      taskItemList: [],
      noMore: false,
      isShowModal: false,
      BASEURL,
      taskItemStatus: "5",
      taskItemReviewAdvise: "",
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
      isNext: false,//是否可点击下一题
      viewOnly: false, //查看详情
    }
  },
  components: {
    FormComponent
  },
  created() {
    const taskId = this.$route.query.id
    const taskItemId = this.$route.query.taskItemId
    this.viewOnly = this.$route.query.viewOnly;
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
        const {taskItemList, dataRecordList} = res;
        if(this.viewOnly && taskItemList.length > 0) {
          this.taskItemReviewAdvise = taskItemList[0].reviewAdvise
        }
        this.taskItemList = taskItemList ? taskItemList.map(item => {
          item.src = dataRecordList[item.dataRecordId].thumbnailUrl
          item.isSelected = false
          item.tag = item.taskData
          return item
        }) : []
        this.isNext = !!taskItemList
      })
    },

    submit(next) {
      let taskItemId = this.taskItemList.map( item => item.id)[0];
      const data = {
        taskId: this.$route.query.id,
        taskItemId: String(taskItemId),
        taskItemStatus: this.taskItemStatus,
        taskItemReviewAdvise: this.taskItemReviewAdvise
      }
      taskItemReview(data).then(res => {
      }).then( () => {
          // this.$message.success("提交成功，下一题");
          this.$Message.info('提交成功');
          if(next){
            this.taskItemReviewAdvise = ""
            this.taskItemAllotReview();
          }
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
    &-meta {
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;
      width: 60%;
      &-item {
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        font-size: 14px;
        .item-label {
          color: #333;
          min-width: 80px;
          margin-right: 20px;
        }
        .item-value {
          flex: 1;
          line-height: 17px;
          color: #666;
        }
      }
    }
    &-list {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 40px;
      &-item {
        display: flex;
        flex-direction: column;
        position: relative;
        margin-bottom: 12px;
        margin-right: 12px;
        box-sizing: border-box;
        width: 250px;
        height: 200px;
        &.selected-border {
          border: 2px solid #f00;
          box-sizing: border-box;
        }
        .item-thumb {
          width: 250px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          // background-size: contain;
          // background-repeat: no-repeat;
          // background-position: center;
          box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
          img {
            max-width: 100%;
            max-height: 100%;
            display: inline-block;
          }
        }
        .item-tag {
          display: flex;
          justify-content: center;
          margin-top: 12px;
        }
        .item-isselect {
          position: absolute;
          font-size: 36px !important;
          left: -2px;
          top: -14px;
          i {
            font-size: 36px !important;
          }
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
.prev-content {
  //height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  .prev-img {
    max-width: 100%;
    max-height: 100%;
    display: inline-block;
  }
}
</style>