<style scoped>
  .layout-content {
    min-width: 800px;
    margin: 15px 15px 5px 15px;
    min-height: calc(100vh - 130px);
    overflow-y: yes;
    display: flex;
    flex-direction: column;
    background-color: #f5f7f9;
  }

  .layout-content-main {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
</style>


<template>
  <div class="layout-content">
    <div class="layout-content-main">
      <transition name="fade" mode="out-in">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script>
  import config from '@/config';

  export default {
    name: 'content',
    props: ['menuSmall'],
    created () {

    },
    data () {
      return {
        footerText: config.footerText
      };
    },
    methods: {}
  };
</script>
