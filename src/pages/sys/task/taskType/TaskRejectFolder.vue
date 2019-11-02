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
            <div class="item-isselect" @click="item.isSelected = !item.isSelected">
              <Icon type="ios-checkbox-outline" style="" v-if="!item.isSelected" />
              <Icon type="md-checkbox" style="color: #2d8cf0" v-else />
            </div>
          </div>
        </div>
      </div>
      <div class="task-reject-folder-content-opt">
        <Button class="opt-btn" type="primary" @click="taskItemMark" :disabled="!isSelected">下一题</Button>
      </div>
    </div>
    <Modal
      v-model="isShowModal"
      title="查看缩略图"
      @on-ok=""
      @on-cancel="">
      <div class="pic-list">
        <div class="pic-list-item" v-for="(item, index) in picList" :key="index" :style="{backgroundImage: 'url(' + BASEURL + item.thumbnailUrl + ')', 'background-size': 'cover'}">
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { taskItemAllotMark, taskItemMark, getFolderPic } from "@/api/task";
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
      picList: []
    }
  },
  created() {
    this.taskItemAllotMark()
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
        console.log('res', res)
        const {taskItemList, dataRecordList, userList} = res
        dataRecordList && Object.keys(dataRecordList).forEach(item => {
          dataRecordList[item].isSelected = false
          this.dataRecordList.push(dataRecordList[item])
          this.taskItemList = taskItemList
        })
        console.log('taskItemList', this.dataRecordList)
      })
    },

    // 提交剔除的图片
    taskItemMark () {
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
      console.log('data', data)
      taskItemMark(data).then(res => {
        this.taskItemAllotMark()
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