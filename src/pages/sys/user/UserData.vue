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
          <Input search enter-button placeholder="Enter something..." />
        </div>
      </div>
      <div class="content-middle">
        <div class="content-middle-left">
          树形
        </div>
        <div class="content-middle-right">
          内容
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getListTree
  } from 'api/user';
export default {
  name: 'UserData',
  created () {
    this.getListTree()
  },
  methods: {
    getListTree () {
      getListTree({
        layerNumber: 5,
        tokenId: localStorage.getItem('token')
      }).then(res => {
        console.log('getListTree ===> ', res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-user-data {
  display: flex;
  flex-direction: column;
  flex: 1;
  .user-data-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    .content-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .content-middle {
      flex: 1;
      display: flex;
      &-left {
        margin-right: 6px;
        min-width: 200px;
        background-color: #fff;
        border: 1px solid #f7f7f7;
        box-sizing: border-box;
      }
      &-right {
        flex: 1;
        background-color: #fff;
        border: 1px solid #f7f7f7;
      }
    }
  }
}
</style>