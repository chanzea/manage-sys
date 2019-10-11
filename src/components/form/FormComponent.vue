<template>
  <div class="component-form">
    <Form :label-width="80">
      <FormItem :label="item.label" v-for="(item, index) in formProp" :key="index">
        <Input v-if="['text', 'textarea', 'password'].includes(item.type)" :type="item.type" v-model="item.value" :placeholder="item.placeholder"></Input>

        <Select v-if="item.type === 'select'" :multiple="item.isMultiple" v-model="item.value" :placeholder="item.placeholder">
          <Option :value="subItem.value" v-for="(subItem, index) in item.options" :key="index">{{subItem.label}}</Option>
        </Select>

        <RadioGroup v-if="item.type === 'radio'" v-model="item.value">
          <Radio :label="subItem.label" v-for="(subItem, index) in item.options" :key="index">{{subItem.text}}</Radio>
        </RadioGroup>

        <DatePicker v-if="item.type === 'datePicker'" type="date" :placeholder="item.placeholder" v-model="item.value"></DatePicker>

        <i-switch  v-if="item.type === 'switch'" v-model="item.value" size="large">
          <span slot="open"></span>
          <span slot="close"></span>
        </i-switch>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  name: 'ComponentForm',
  props: {
    formProp: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      formItem: {
        // input: '',
        // select: '',
        // radio: 'male',
        // checkbox: [],
        // switch: true,
        // date: '',
        // time: '',
        // slider: [20, 50],
        // textarea: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.component-form {

}
</style>