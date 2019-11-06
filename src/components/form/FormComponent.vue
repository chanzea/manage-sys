<template>
  <div class="component-form">
    <Form :label-width="80" ref="basicForm" :rules="ruleCustom" :model="formCustom">
      <FormItem :label="item.label" v-for="(item, index) in formProp" :key="index" :prop="item.key">
        <Input v-if="['text', 'textarea', 'password'].includes(item.type)" :type="item.type" v-model="formCustom[item.key]" :placeholder="item.placeholder" :disabled="item.isDisabled"></Input>

        <TreeSelect v-if="item.type==='treeSelect'" :disabled="item.isDisabled" :ref="item.ref" v-model="formCustom[item.key]"
          :data="item.options"
          :multiple="item.isMultiple"
          :showCheckbox="item.showCheckbox"
          @on-change="(val)=>{if(item.onChange!=null){item.onChange(val,data,fromData,mData)}}">
        </TreeSelect>

        <Select v-if="item.type === 'select'" :multiple="item.isMultiple" v-model="formCustom[item.key]" :placeholder="item.placeholder" @on-change="selectValue" :disabled="item.isDisabled">
          <Option :value="subItem.value" v-for="(subItem, index) in item.options" :key="index">{{subItem.label}}</Option>
        </Select>

        <RadioGroup v-if="item.type === 'radio'" v-model="formCustom[item.key]">
          <Radio :label="subItem.label" v-for="(subItem, index) in item.options" :key="index">{{subItem.text}}</Radio>
        </RadioGroup>

        <DatePicker v-if="item.type === 'datePicker'" format="yyyy年MM月dd日" type="date" :placeholder="item.placeholder" v-model="formCustom[item.key]"></DatePicker>

        <i-switch  v-if="item.type === 'switch'" v-model="formCustom[item.key]" size="large">
          <span slot="open"></span>
          <span slot="close"></span>
        </i-switch>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import TreeSelect from './TreeSelect'
export default {
  name: 'ComponentForm',
  props: {
    formProp: {
      type: Array,
      default: () => {
        return []
      }
    },
    ruleCustom: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formCustom: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data () {
    return {
    }
  },
  components: {
    TreeSelect
  },
  methods: {
    selectValue(val) {
      this.$emit('on-change', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.component-form {

}
</style>