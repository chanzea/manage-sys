<template>
  <Poptip 
  title="您确定删除这条记录" 
  :content="content || contentDefault" 
  placement="right" 
  :confirm="true" 
  popper-class="delete-pop"
  @on-ok="ok"
  @on-cancel="cancel"
  >
    <Button :class="className" :icon = "icon" :size="size || ''">
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