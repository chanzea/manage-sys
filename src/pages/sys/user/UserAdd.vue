<template>
  <div class="page-user-add">
    <div class="user-add-content">
      <form-component :formProp="formProp"></form-component>
      <div class="btn-list">
        <Button class="btn-list-item" type="primary" @click="getFormData">确定</Button>
        <Button class="btn-list-item" type="primary">确定并继续添加</Button>
        <Button class="btn-list-item">取消</Button>
      </div>
    </div>
  </div>
</template>

<script>

import FormComponent from 'components/form/FormComponent.vue'
import {
  getRoleList
} from 'api/user'

export default {
  name: 'UserAdd',
  data() {
    return {
      formProp: [
        {
          label: '状态',
          type: 'switch',
          value: ''
        },{
          label: '所在组织',
          type: 'select',
          value: '',
          options: [],
          placeholder: '设置归属组织'
        },{
          label: '系统角色',
          type: 'select',
          value: '',
          options: [],
          placeholder: '系统角色'
        },{
          label: '姓名',
          type: 'input',
          value: '',
          placeholder: '输入用户名'
        },{
          label: '性别',
          type: 'radio',
          value: '',
          options: [{
            label: '男'
          },{
            label: '女'
          },]
        },{
          label: '登录账号',
          type: 'input',
          value: '',
          placeholder: '登录名'
        },{
          label: '登录密码',
          type: 'input',
          value: '',
          placeholder: '登录密码'
        },{
          label: '手机号码',
          type: 'input',
          value: '',
          placeholder: '常用联系手机号码'
        },{
          label: '证件类型',
          type: 'select',
          value: '',
          options: []
        },{
          label: '证件号码',
          type: 'input',
          value: '',
          placeholder: '有效的证件号码'
        },{
          label: '生日',
          type: 'datePicker',
          value: '',
          placeholder: '选择生日日期'
        },{
          label: 'QQ号',
          type: 'input',
          value: '',
          placeholder: '常用联系QQ'
        },{
          label: '邮箱',
          type: 'input',
          value: '',
          placeholder: '常用联系邮箱'
        },{
          label: '婚姻状况',
          type: 'select',
          value: '',
          options: [],
          placeholder: '选择婚姻状况'
        },{
          label: '地址',
          type: 'textarea',
          value: '',
          placeholder: '输入详细的地址，精确到门牌号码...'
        }
      ]   
    }
  },
  components: {
    FormComponent
  },
  created () {
    this.getRoleList()
  },
  methods: {
    getFormData () {
      console.log('this.form', this.formProp)
    },
    // 获取角色列表
    getRoleList () {
      getRoleList().then(res => {
        console.log('getRoleList', res)
        this.formProp[2].options = res.list.map(item => {
          item.value = item.id
          item.label = item.roleName
          return item
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-user-add {
  .user-add-content {
    padding: 8px;
    .btn-list {
      padding-left: 80px;
      display: flex;
      &-item {
        margin-right: 8px;
      }
    }
  }
}
</style>