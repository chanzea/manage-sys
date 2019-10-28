<template>
  <div class="page-task-classify">
    <div class="task-classify-content">
      <div class="task-classify-content-list">
        <div class="task-classify-content-list-item" v-for="(item, index) in taskItemList" :key="index">
          <div class="item-thumb">
            <img :src="BASEURL + item.thumbnailUrl" alt="">
          </div>
          <div class="item-opt">
            <Button type="primary" size="small">标签分类</Button>
          </div>
        </div>
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
  methods: {
    taskItemAllotMark (taskId) {
      taskItemAllotMark({
        taskId
      }).then(res => {
        console.log('res', res)
        const {taskItemList, dataRecordList, userList} = res
        this.taskItemList = dataRecordList
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
      &-item {
        display: flex;
        flex-direction: column;
        position: relative;
        .item-thumb {
          // width: 250;
        }
        .item-opt {
          position: absolute;
          right: 20px;
          bottom: 20px;
        }
      }
    }
  }
}
</style>