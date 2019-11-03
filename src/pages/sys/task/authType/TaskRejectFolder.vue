<template>
  <div class="page-task-reject-folder">
    <div class="task-reject-folder-content">
      <div class="task-reject-folder-content-meta">
        <div class="task-reject-folder-content-meta-item">
          <span class="item-label">任务名称:</span>
          <span class="item-value">aaaa</span>
        </div>
        <div class="task-reject-folder-content-meta-item">
          <span class="item-label">任务模版:</span>
          <span class="item-value">图片剔除模版</span>
        </div>
        <div class="task-reject-folder-content-meta-item">
          <span class="item-label">任务描述:</span>
          <span class="item-value"><strong>请选择与大多数文件夹不同的少数派,在文件夹下面打勾</strong></span>
        </div>
      </div>
      <div class="task-reject-folder-content-list">
        <div class="task-reject-folder-content-list-item" v-for="(item, index) in dataRecordList" :key="index">
          <div class="item-folder">
            <div class="item-thumb" @click="getFolderPic(item)">
              <img :src="folderSrc" alt="">
            </div>
            <span style="margin: 8px 0 12px; color: #666;">查看缩略图</span>
            <div class="item-isselect">
              <Icon type="ios-checkbox-outline" style="" v-if="!item.isSelected" />
              <Icon type="md-checkbox" style="color: #2d8cf0" v-else />
            </div>
          </div>
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
            <span class="item-value" style="color: red;vertical-align: middle;"><strong>(打勾的为剔除的文件)</strong></span>
          </div>

          <Input v-model="taskItemReviewAdvise" type="textarea" :rows="4" placeholder="审核意见" />

          <div class="task-classify-content-opt">
            <Button class="opt-btn" type="primary" @click="submit">提交</Button>
            <Button v-if="!isReturnItem" class="opt-btn" type="primary" @click="submit(true)" :disabled="noMore">下一题</Button>
          </div>
      </div>
    </div>
    <Modal
      v-model="isShowModal"
      title="查看缩略图"
    >
      <div class="pic-list">
        <div class="pic-list-item" v-for="(item, index) in picList" :key="index" :style="{backgroundImage: 'url(' + BASEURL + item.fileUrl + ')', 'background-size': 'cover'}">
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { taskItemAllotReview, taskItemReview, getFolderPic, taskItemDetail } from "@/api/task";
import { 
  BASEURL
 } from "@/api/config.js";
import minxin from "./minxin";
export default {
  name: 'TaskRejectFolder',
  mixins: [minxin],
  data() {
    return {
      BASEURL,
      isShowModal: false,
      noMore: false,
      taskItemStatus: "5",
      taskItemReviewAdvise: "",
      folderSrc: require('../../../../../static/assets/img/folder.png'),
      taskItemList: [],
      dataRecordList: [],
      picList: []
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
    // 更新
    taskItemAllotReview () {
      this.dataRecordList = []
      const taskId = this.$route.query.id
      taskItemAllotReview({
        taskId
      }).then(res => {
        console.log('res', res)
        const {taskItemList, dataRecordList, userList} = res;
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
        console.log('taskItemList', this.dataRecordList)
      })
    },

    submit (next) {
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
          next || this.taskItemAllotReview();
        }).catch( () => {
          this.$Message.error("提交失败");
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
        //   // item.src = dataRecordList[item.dataRecordId].thumbnailUrl
        //   item.isSelected = false
        //   item.tag = item.taskData
        //   return item
        // }) : []

        dataRecordList && Object.keys(dataRecordList).forEach(item => {
          dataRecordList[item].isSelected = taskItemList[0].taskData.split(",").includes(item);
          this.dataRecordList.push(dataRecordList[item])
          this.taskItemList = taskItemList
        })
        this.isNext = !!taskItemList
      })
    },

    getFolderPic (item) {
      this.picList = []
      getFolderPic({
        dataSetId: item.dataSetId,
        folderId: item.id
      }).then(res => {
        console.log('getFolderPic' ,res)
        const {list} = res
        this.picList = list
        this.isShowModal = true
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
      &-item {
        display: flex;
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
            font-size: 36px;
            cursor: pointer;
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
  max-width: 660px;
  min-height: 100px;
  &-item {
    border: 1px solid #eee;
    width: 150px;
    margin-right: 12px;
  }
}
</style>