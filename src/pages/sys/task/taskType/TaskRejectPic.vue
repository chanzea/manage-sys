<template>
  <div class="page-task-reject-pic">
    <div class="task-reject-pic-content">
      <div class="task-reject-pic-content-meta">
        <div class="task-reject-pic-content-meta-item">
          <span class="item-label">任务名称:</span>
          <span class="item-value">{{detail.taskName}}</span>
        </div>
        <div class="task-reject-pic-content-meta-item">
          <span class="item-label">任务模版:</span>
          <span class="item-value">图片剔除任务</span>
        </div>
        <div class="task-reject-pic-content-meta-item">
          <span class="item-label">任务描述:</span>
          <span class="item-value"><strong>{{detail.taskRemark}}</strong></span>
        </div>
      </div>
      <div v-if="dataRecordList.length === 0" style="font-size: 24px; font-weight: bold">
          暂无题目
      </div>
      <div v-else class="task-reject-pic-content-list">
        <div class="task-reject-pic-content-list-item" :class="item.isSelected ? 'selected-border' : ''" v-for="(item, index) in dataRecordList" :key="index" @click="item.isSelected = !item.isSelected">
          <!-- <div class="item-thumb" :style="{backgroundImage: 'url(\'' + BASEURL + item.thumbnailUrl + '\')'}" /> -->
          <Poptip placement="right" width="1000">
            <div class="item-thumb" :style="{backgroundImage: 'url(\'' + BASEURL + item.thumbnailUrl + '\')'}" />
            <div slot="content" class="prev-content">
              <img class="prev-img" :src="BASEURL + item.fileUrl" alt="">
            </div>
          </Poptip>
          <div class="item-isselect">
            <Icon type="ios-checkbox-outline" style="color: #fff" v-if="!item.isSelected" />
            <Icon type="md-checkbox" style="color: #2d8cf0" v-else />
          </div>
        </div>
      </div>
      <div class="task-reject-pic-content-meta">
        <div class="task-reject-pic-content-meta-item" v-if="reviewInfo.name">
          <span class="item-label">审核人:</span>
          <span class="item-value">{{reviewInfo.name}}</span>
        </div>
        <div class="task-reject-pic-content-meta-item" v-if="reviewInfo.advise">
          <span class="item-label">审核意见:</span>
          <span class="item-value">{{reviewInfo.advise}}</span>
        </div>
      </div>
      <div class="task-reject-pic-content-opt" v-if="!viewOnly && dataRecordList.length !== 0">
        <Button class="opt-btn" type="primary" @click="taskItemMark(false)" :disabled="!isSelected">保存</Button>
        <Button class="opt-btn" type="primary" @click="taskItemMark(true)" :disabled="!isSelected">下一题</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { taskItemAllotMark, taskItemMark, taskItemDetail } from "@/api/task";
import { 
  BASEURL
 } from "@/api/config.js";
export default {
  name: 'TaskRejectPic',
  data() {
    return {
      currentUrl: 'http://img2.imgtn.bdimg.com/it/u=392420269,1275548773&fm=26&gp=0.jpg',
      taskItemList: [],
      dataRecordList: [],
      BASEURL,
      viewOnly: false,
      reviewInfo: {

      },
      // nodata: require('../../../../../static/assets/img/nodata.png')
    }
  },
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  created() {
    const taskId = this.$route.query.id;
    const taskItemId = this.$route.query.taskItemId
    this.viewOnly = this.$route.query.viewOnly
    // 当前存在 taskItemId ，返工任务
    if (taskItemId) {
      this.taskItemDetail(taskId, taskItemId)
    } else {
      this.taskItemAllotMark()
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
    taskItemAllotMark () {
      this.dataRecordList = []
      const taskId = this.$route.query.id
      taskItemAllotMark({
        taskId
      }).then(res => {
        const {taskItemList, dataRecordList, userList} = res
        dataRecordList && Object.keys(dataRecordList).forEach(item => {
          dataRecordList[item].isSelected = false
          this.dataRecordList.push(dataRecordList[item])
          this.taskItemList = taskItemList
        })
      })
    },

    // 提交剔除的图片
    taskItemMark (next) {
      const isNext = this.dataRecordList.some(item => {
        return item.isSelected !== true
      })
      if (!isNext) {
        this.$Message.warning('请先点击图片选择与大多数图片不同的少数派');
        return
      }
      const data = {
        taskId: this.$route.query.id,
        markData: {
          taskItemId: this.taskItemList[0].id,
          markData: this.dataRecordList.filter(item => {
            return item.isSelected === true
          }).map(item => {
            return item.id
          }).join(',')
        }
      }
      taskItemMark(data).then(res => {
        if (next) {
          this.taskItemAllotMark()
        }
      })
    },

    taskItemDetail (taskId, taskItemId) {
      this.dataRecordList = []
      taskItemDetail({
        taskId,
        taskItemId
      }).then(res => {
        const {taskItemList, dataRecordList, userList} = res
        dataRecordList && Object.keys(dataRecordList).forEach(item => {
          dataRecordList[item].isSelected = taskItemList[0].taskData.split(",").includes(item);
          this.dataRecordList.push(dataRecordList[item])
          this.taskItemList = taskItemList
        })
        taskItemList && taskItemList.forEach(item => {
          this.reviewInfo = {
            name: userList[item.reviewUserId].userName,
            advise: item.reviewAdvise
          }
        })
      })
    }
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
      margin-bottom: 20px;
      width: 60%;
      &-item {
        display: flex;
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
      margin-bottom: 20px;
      &-item {
        display: flex;
        flex-direction: column;
        position: relative;
        margin-bottom: 12px;
        margin-right: 12px;
        box-sizing: border-box;
        width: 250px;
        height: 200px;
        box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
        /deep/ .ivu-poptip {
          width: 100%;
          height: 100%;
          .ivu-poptip-rel {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
        &.selected-border {
          border: 2px solid #f00;
          box-sizing: border-box;
        }
        .item-thumb {
          width: 100%;
          height: 100%;
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
        .item-isselect {
          position: absolute;
          left: -2px;
          top: -14px;
          font-size: 36px !important;
          cursor: pointer;
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