<template>
  <div class="page-task-reject-folder">
    <div class="task-reject-folder-content">
      <div class="task-reject-folder-content-meta">
        <div class="task-reject-folder-content-meta-item">
          <span class="item-label">任务名称:</span>
          <span class="item-value">{{detail.taskName}}</span>
        </div>
        <div class="task-reject-folder-content-meta-item">
          <span class="item-label">任务模版:</span>
          <span class="item-value">文件夹剔除任务</span>
        </div>
        <div class="task-reject-folder-content-meta-item">
          <span class="item-label">任务描述:</span>
          <span class="item-value"><strong>{{detail.taskRemark}}</strong></span>
        </div>
      </div>
      <div v-if="dataRecordList.length === 0" style="font-size: 24px; font-weight: bold">
        暂无题目
      </div>
      <div v-else class="task-reject-folder-content-list">
        <div class="task-reject-folder-content-list-item" v-for="(item, index) in dataRecordList" :key="index">
          <div class="item-folder">
            <div class="item-thumb" @click="getFolderPic(item)">
              <img :src="folderSrc" alt="">
            </div>
            <span style="margin: 8px 0 12px; color: #666;">{{item.fileName}}</span>
            <div class="item-isselect" @click="item.isSelected = !item.isSelected">
              <Icon type="ios-checkbox-outline" style="" v-if="!item.isSelected" />
              <Icon type="md-checkbox" style="color: #2d8cf0" v-else />
            </div>
          </div>
        </div>
      </div>
      <div class="task-reject-folder-content-meta">
        <div class="task-reject-folder-content-meta-item" v-if="reviewInfo.name">
          <span class="item-label">审核人:</span>
          <span class="item-value">{{reviewInfo.name}}</span>
        </div>
        <div class="task-reject-folder-content-meta-item" v-if="reviewInfo.advise">
          <span class="item-label">审核意见:</span>
          <span class="item-value">{{reviewInfo.advise}}</span>
        </div>
      </div>
      <div class="task-reject-folder-content-opt" v-if="!viewOnly && dataRecordList.length !== 0">
        <Button class="opt-btn" type="primary" @click="taskItemMark(false)" :disabled="!isSelected">保存</Button>
        <Button class="opt-btn" type="primary" @click="taskItemMark(true)" :disabled="!isSelected">下一题</Button>
      </div>
    </div>
    <Modal
      v-model="isShowModal"
      title="查看缩略图"
      width="620"
      @on-ok=""
      @on-cancel="">
      <div class="pic-list">
        <!-- <div class="pic-list-item" v-for="(item, index) in picList" :key="index" :style="{backgroundImage: 'url(\'' + BASEURL + item.thumbnailUrl + '\')', 'background-size': 'cover'}">
        </div> -->
        <div class="pic-list-item" v-for="(item, index) in picList" :key="index">
          <img class="v-lazy-img" v-lazy="BASEURL + item.thumbnailUrl" alt="">
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { taskItemAllotMark, taskItemMark, getFolderPic, taskItemDetail } from "@/api/task";
import { 
  BASEURL
 } from "@/api/config.js";
export default {
  name: 'TaskRejectFolder',
  data() {
    return {
      BASEURL,
      isShowModal: false,
      folderSrc: require('../../../../../static/assets/img/folder.png'),
      taskItemList: [],
      dataRecordList: [],
      picList: [], //预览图片列表
      viewOnly: false,
      reviewInfo: {

      }
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
    // 更新
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
        this.$Message.warning('请先点击文件夹选择与大多数文件夹不同的少数派');
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
    //图片预览
    getFolderPic (item) {
      this.picList = []
      getFolderPic({
        dataSetId: item.dataSetId,
        folderId: item.id
      }).then(res => {
        const {list} = res
        this.picList = list
        this.isShowModal = true
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
.page-task-reject-folder {
  .task-reject-folder-content {
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
        position: relative;
        margin-bottom: 12px;
        margin-right: 12px;
        box-sizing: border-box;
        &:hover {
          cursor: pointer;
          opacity: 0.8;
        }
        .item-folder {
          display: flex;
          flex-direction: column;
          align-items: center;
          .item-thumb {
            margin-bottom: 4px;
            width: 120px;
            img {
              width: 100%;
              height: 100%;
              display: block;
            }
          }
          .item-isselect {
            display: flex;
            justify-content: center;
            font-size: 36px !important;
            cursor: pointer;
            i {
              font-size: 36px !important;
            }
          }
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

<style lang="scss">
.pic-list {
  display: flex;
  flex-wrap: wrap;
  max-width: 800px;
  min-height: 100px;
  &-item {
    margin-bottom: 12px;
    margin-right: 20px;
    width: 120px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
    .v-lazy-img {
      max-width: 100%;
      max-height: 100%;
      display: inline-block;
    }
  }
}
</style>