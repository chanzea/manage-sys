<template>
  <div class="page-task-remark">
    <tag-tool ref="tool"
      @on-data-change="saveTagData"
      :tag-data="tagData"></tag-tool>
  </div>
</template>

<script>
import tagTool from 'components/tagtool'
export default {
  name: 'TaskRemark',
  components: {
    tagTool
  },
  data () {
    return {
      tagData: [
        {
          'title': '箭头',
          'desc': '箭头标注',
          'selected': false
        },
        {
          'title': '马',
          'desc': '动物世界马',
          'selected': false
        },
        {
          'title': '轮船',
          'desc': '世界轮船',
          'selected': false
        },
        {
          'title': '航空母舰',
          'desc': '军事图片识别',
          'selected': false
        }
      ]
    }
  },
  methods: {
    saveTagData () {

    }
  },
  mounted () {
    this.$refs.tool.setImage('http://sc.68design.net/qita7/HappyChildhood/images/RTYD_1003.jpg')
  }
}
</script>