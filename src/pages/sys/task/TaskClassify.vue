<template>
  <div class="page-task-classify">
    <div class="task-classify-content">
      <div class="task-classify-content-list">
        <div class="task-classify-content-list-item" :class="item.isSelected ? 'selected-border' : ''" v-for="(item, index) in taskItemList" :key="index" @click="item.isSelected = !item.isSelected">
          <div class="item-thumb" :style="{backgroundImage: 'url(' + BASEURL + item.src + ')', 'background-size': 'cover'}">
            <!-- <img :src="BASEURL + item.src" alt=""> -->
          </div>
          <div class="item-isselect">
            <Icon type="ios-checkbox-outline" style="color: #fff" v-if="!item.isSelected" />
            <Icon type="md-checkbox" style="color: #2d8cf0" v-else />
          </div>
        </div>
      </div>
      <div class="task-classify-content-opt">
        <Button class="opt-btn" type="primary" :disabled="!isSelected">批量添加标注</Button>
        <Button class="opt-btn" type="primary">下一题</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { taskItemAllotMark } from "@/api/task";
import { 
  BASEURL
 } from "@/api/config.js";
export default {
  name: 'TaskClassify',
  data() {
    return {
      taskItemList: [],
      BASEURL
    }
  },
  created() {
    const taskId = this.$route.query.id
    this.taskItemAllotMark(taskId)
  },
  computed: {
    isSelected () {
      return this.taskItemList.some(item => {
        return item.isSelected === true
      })
    }
  },
  methods: {
    taskItemAllotMark (taskId) {
      taskItemAllotMark({
        taskId
      }).then(res => {
        const {taskItemList, dataRecordList, userList} = res
        this.taskItemList = taskItemList.map(item => {
          item.src = dataRecordList[item.dataRecordId].fileUrl
          item.isSelected = false
          return item
        })
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.page-task-classify {
  .task-classify-content {
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