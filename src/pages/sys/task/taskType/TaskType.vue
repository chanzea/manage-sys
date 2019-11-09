<template>
  <div class="task-type">
    <component :is="'Task'+type"></component>
  </div>
</template>

<script>
import TaskClassify from './TaskClassify'
import TaskRejectPic from './TaskRejectPic'
import TaskRejectFolder from './TaskRejectFolder'
import TaskMark from '../../ps/ps1'
export default {
  name: 'TaskType',
  data() {
    return {
      type: ''
    }
  },
  created() {
    this.type = this.$route.query.type
  },
  components: {
    TaskClassify,
    TaskRejectPic,
    TaskRejectFolder,
    TaskMark
  }
}
</script>