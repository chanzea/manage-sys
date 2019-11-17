<template>
  <div class="task-type">
    <component :is="'Task'+type"></component>
  </div>
</template>

<script>
import TaskClassify from './TaskClassify'
import TaskRejectPic from './TaskRejectPic'
import TaskRejectFolder from './TaskRejectFolder'

import TaskMark from '../tagtool/src/views/ReviewMark'
import TaskLasso from '../tagtool/src/views/ReviewMark'


export default {
  name: 'TaskType',
  data: {
    type: ''
  },
  created() {
    this.type = this.$route.query.type
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