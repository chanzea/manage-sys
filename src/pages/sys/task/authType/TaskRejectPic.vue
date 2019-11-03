<template>
  <div class="page-task-reject-pic">
    <div class="task-reject-pic-content">
      <div class="task-reject-pic-content-meta">
        <div class="task-reject-pic-content-meta-item">
          <span class="item-label">任务名称:</span>
          <span class="item-value">aaaa</span>
        </div>
        <div class="task-reject-pic-content-meta-item">
          <span class="item-label">任务模版:</span>
          <span class="item-value">图片剔除模版</span>
        </div>
        <div class="task-reject-pic-content-meta-item">
          <span class="item-label">任务描述:</span>
          <span class="item-value"><strong>点击图片选择与大多数图片不同的少数派</strong></span>
        </div>
      </div>
      <div class="task-reject-pic-content-list">
        <div class="task-reject-pic-content-list-item" :class="item.isSelected ? 'selected-border' : ''" v-for="(item, index) in dataRecordList" :key="index" >
          <div class="item-thumb" :style="{backgroundImage: 'url(' + BASEURL + item.fileUrl + ')', 'background-size': 'cover'}" />
          <div class="item-isselect">
              <Icon type="ios-checkbox-outline" style="color: #fff" v-if="!item.isSelected" />
              <Icon type="md-checkbox" style="color: #2d8cf0" v-else />
          </div>
        </div>
      </div>
      <div v-if = "!noMore">
          <div style="margin: 10px 0;">
            <RadioGroup v-model="taskItemStatus">
                <Radio  label="5">通过</Radio>
                <Radio  label="3">不通过</Radio>
            </RadioGroup>
            <span class="item-value" style="color: red;vertical-align: middle;"><strong>(打勾的为剔除的图片)</strong></span>
          </div>
          <Input v-model="taskItemReviewAdvise" type="textarea" :rows="4" placeholder="审核意见" />
          <div class="task-classify-content-opt">
            <Button class="opt-btn" type="primary" @click="submit">提交</Button>
            <Button class="opt-btn" type="primary" @click="taskItemAllotReview" :disabled="noMore">下一题</Button>
          </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import { taskItemAllotReview, taskItemReview, taskItemDetail } from "@/api/task";
import { 
  BASEURL
 } from "@/api/config.js";
export default {
  name: 'TaskRejectPic',
  data() {
    return {
      taskItemList: [],
      dataRecordList: [],
      BASEURL,
      taskItemStatus: "5",
      taskItemReviewAdvise: "",
      noMore: false
    }
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
      return this.dataRecordList.some(item => {
        return item.isSelected === true
      })
    }
  },
  methods: {
    taskItemAllotReview () {
      this.dataRecordList = []
      const taskId = this.$route.query.id
      taskItemAllotReview({
        taskId
      }).then(res => {
        console.log('res', res)

        
        const {taskItemList, dataRecordList, userList} = res
        if(!taskItemList){
          this.$Message.info("任务审核完成，没有下一题了");
          this.noMore = true;
          return;
        }

        dataRecordList && Object.keys(dataRecordList).forEach(item => {
          dataRecordList[item].isSelected = taskItemList[0].taskData.split(",").includes(item); 
          this.dataRecordList.push(dataRecordList[item])
          this.taskItemList = taskItemList
        })
        console.log('dataRecordList', this.dataRecordList)
      })
    },

    taskItemDetail (taskId, taskItemId) {
      this.taskItemList = []
      taskItemDetail({
        taskId,
        taskItemId
      }).then(res => {
        console.log('res', res)
        const {taskItemList, dataRecordList} = res
        // this.taskItemList = taskItemList ? taskItemList.map(item => {
        //   item.src = dataRecordList[item.dataRecordId].thumbnailUrl
        //   item.isSelected = false
        //   item.tag = item.taskData
        //   return item
        // }) : []
        // this.isNext = !!taskItemList
        dataRecordList && Object.keys(dataRecordList).forEach(item => {
          dataRecordList[item].isSelected = taskItemList[0].taskData.split(",").includes(item); 
          this.dataRecordList.push(dataRecordList[item])
          this.taskItemList = taskItemList
        })
      })
    },

    submit () {
      let taskItemId = this.taskItemList.map( item => item.id)[0];
      const data = {
        taskId: this.$route.query.id,
        taskItemId: String(taskItemId),
        taskItemStatus: this.taskItemStatus,
        taskItemReviewAdvise: this.taskItemReviewAdvise
      }
      console.log('data', data)
      taskItemReview(data).then(res => {
        console.log('res', res)
      }).then( () => {
          // this.$message.success("提交成功，下一题");
          this.$Message.info('提交成功，下一题');
          this.taskItemAllotReview();
        }).catch( () => {
          this.$Message.error("提交失败");
        })
    },
  }
}
</script>

<style lang="scss" scoped>
.page-task-reject-pic {
  .task-reject-pic-content {
    padding: 0 28px;
    &-meta {
      display: flex;
      flex-direction: column;
      // margin-bottom: 20px;
      &-item {
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        font-size: 14px;
        .item-label {
          color: #333;
          margin-right: 20px;
        }
        .item-value {
          color: #666;
        }
      }
    }
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