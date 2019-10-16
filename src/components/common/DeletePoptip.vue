<template>
  <Poptip 
  title="删除提示" 
  :content="content || contentDefault" 
  placement="right" 
  :confirm="true" 
  popper-class="delete-pop"
  @on-ok="ok"
  @on-cancel="cancel"
  >
    <Button :class="className || classDefault" :icon = "icon || 'ios-remove'" :size="size || ''">
        {{buttonText || ""}}
    </Button>
  </Poptip>
</template>

<script>
export default {
    name: "DeletePoptip",
    props:["content", "className", "icon", "size", "buttonText"],
    data(){
        return{
            contentDefault: "确定要删除？",
            classDefault:  "ios-remove",
        }
    },
    methods: {
        ok: function() {
            this.$emit("onOK");
        },
        cancel: function (){
            this.$emit("onCancel");
        }
    }
}
</script>