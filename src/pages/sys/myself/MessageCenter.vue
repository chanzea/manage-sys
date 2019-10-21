<template>
  <div class="page-message-center">
    <Tabs :value="name">
      <TabPane label="未读消息" name="unread">未读消息</TabPane>
      <TabPane label="已读消息" name="read">已读消息</TabPane>
      <TabPane label="回收站" name="recycle">回收站</TabPane>
    </Tabs>
  </div>
</template>

<script>
export default {
  name: 'pageMessageCenter',
  data () {
    return {
      name: 'unread'
    }
  }
}
</script>

<style lang="scss" scoped>
.page-message-center {

}
</style>