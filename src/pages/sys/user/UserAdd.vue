<template>
  <div class="page-user-add">
    <Split v-model="split1">
            <div slot="left" class="demo-split-pane">
                Left Pane
            </div>
            <div slot="right" class="demo-split-pane">
                Right Pane
            </div>
        </Split>
  </div>
</template>

<script>
export default {
  name: 'UserAdd',
  data () {
            return {
                split1: 0.5
            }
        },
}
</script>

<style lang="scss" scoped>
.page-user-add {
        height: 200px;
        border: 1px solid #dcdee2;
    .demo-split-pane{
        padding: 10px;
    }
}
</style>