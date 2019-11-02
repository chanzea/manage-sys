<template>
  <div class="task-type">
    <component :is="'Task'+type"></component>
  </div>
</template>

<script>
import TaskClassify from './TaskClassify'
import TaskRejectPic from './TaskRejectPic'
import TaskRejectFolder from './TaskRejectFolder'
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
    TaskRejectFolder
  }
}
</script>