<template>
  <div id="app" :key="appKey">
    <transition name="bounce">
      <router-view></router-view>
    </transition>
  </div>
</template>



<script>
export default {
  name: 'app',
  data(){
    return {
      appKey: 1,
    }
  },
  watch: {
    '$route': function() {
      this.appKey = new Date().getTime();
    }
  }
}
</script>

<style>
#app {
height: 100vh;
}
</style>
