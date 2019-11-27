<template>
  <div class="task-type">
    <component :is="'Task'+type" :detail="detail"></component>
  </div>
</template>

<script>
import TaskClassify from './TaskClassify'
import TaskRejectPic from './TaskRejectPic'
import TaskRejectFolder from './TaskRejectFolder'

import TaskMark from '../tagtool/src/views/ReviewMark'
import TaskLasso from '../tagtool/src/views/ReviewMark'
import { taskDetail } from "@/api/task"

export default {
  name: 'TaskType',
  data: {
    type: '',
    detail: {}
  },
  created() {
    this.type = this.$route.query.type
    const taskId = this.$route.query.id
    taskId && this.taskDetail(taskId)
  },
  methods: {
    // 获取任务详情
    taskDetail (taskId) {
      taskDetail({
        taskId
      }).then(res => {
        this.detail = res;
      })
    },
  },
  components: {
    TaskClassify,
    TaskRejectPic,
    TaskRejectFolder,
    TaskMark,
    TaskLasso
  }
}
</script>