<template>
  <Poptip placement="right" v-model="visible">
    <div class="pop-content" slot="content">
      <span class="pop-content-title"><Icon type="ios-help-circle" />你确定要删除吗</span>
      <div class="pop-content-footer">
        <span class="btn-cancel" @click="toggle(false)">取消</span>
        <Button class="btn-confirm" type="primary" size="small" @click="deleteData">确定</Button>
      </div>
    </div>
    <span class="opt-item">删除</span>
  </Poptip>
</template>

<script>
export default {
  name: 'DeletePop',
  methods: {
    deleteData() {
      this.$emit('on-delete', this.params)
    },
    toggle(val) {
      this.$emit('on-toggle', val)
    }
  },
  props: {
    visible: {
      type: Boolean
    },
    params: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      copy_visible: this.visible
    }
  },
  watch: {
    // "visible"() {
    //   console.log('visible', this.visible)
    //   this.copy_visible = this.visible
    // },
    "copy_visible" () {
      this.$emit('on-toggle', this.copy_visible)
    }
  }
}
</script>

<style lang="scss">
  .pop-content {
    display: flex;
    flex-direction: column;
    &-title {
      padding-top: 8px;
      i {
        color: #f90;
        margin-right: 6px;
      }
    }
    &-footer {
      padding: 16px 0 6px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .btn-cancel {
        color: #2d8cf0;
        cursor: pointer;
      }
      .btn-confirm {
        margin-left: 16px;
      }
    }
  }
  .opt-item {
    color: #2d8cf0;
    cursor: pointer;
  }
</style>