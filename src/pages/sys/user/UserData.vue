<template>
  <div class="page-user-data">
    <div class="user-data-content">
      <div class="content-header">
        <div class="content-header-btn-lists">
          <Button>新增组</Button>
          <Button>新增用户</Button>
          <Button>新增组用户</Button>
        </div>
        <div class="content-header-search">
          <Input search enter-button="Search" placeholder="Enter something..." />
        </div>
      </div>
      <div class="content-middle">

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserData'
}
</script>

<style lang="scss" scoped>
.page-user-data {
  .user-data-content {
    display: flex;
    flex-direction: column;
    .content-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .content-middle {

    }
  }
}
</style>