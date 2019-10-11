<template>
  <div class="page-user-add">
    <div class="user-add-content">
      <form-component :formProp="formProp"></form-component>
      <div class="btn-list" v-if="!!userId">
        <Button class="btn-list-item" type="primary">保存</Button>
        <Button class="btn-list-item">返回</Button>
      </div>
      <div class="btn-list" v-else>
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
  getRoleList,
  getUserInfo
} from 'api/user'

export default {
  name: 'UserAdd',
  data() {
    return {
      userId: '',
      formProp: [
        {
          label: '状态',
          type: 'switch',
          value: null,
          key: 'enable'
        },{
          label: '所在组织',
          type: 'select',
          value: [],
          options: [],
          placeholder: '设置归属组织',
          isMultiple: true,
          key: 'organizationIds'
        },{
          label: '系统角色',
          type: 'select',
          value: [],
          options: [],
          isMultiple: true,
          placeholder: '系统角色',
          key: 'roleIds'
        },{
          label: '姓名',
          type: 'text',
          value: '',
          placeholder: '输入用户名',
          key: 'userName'
        },{
          label: '性别',
          type: 'radio',
          value: '',
          key: 'sex',
          options: [{
            label: 1,
            text: '男'
          },{
            label: 2,
            text: '女'
          },]
        },{
          label: '登录账号',
          type: 'text',
          value: '',
          placeholder: '登录名',
          key: 'loginName'
        },{
          label: '登录密码',
          type: 'password',
          value: '',
          placeholder: '登录密码',
          key: 'loginPassword'
        },{
          label: '手机号码',
          type: 'text',
          value: '',
          placeholder: '常用联系手机号码',
          key: 'phoneNum'
        },{
          label: '证件类型',
          type: 'select',
          value: '',
          options: [{
            value: 'ID_CARD',
            label: '身份证'
          }],
          key: 'certificateType'
        },{
          label: '证件号码',
          type: 'text',
          value: '',
          placeholder: '有效的证件号码',
          key: 'certificateId'
        },{
          label: '生日',
          type: 'datePicker',
          value: '',
          placeholder: '选择生日日期',
          key: 'birthday'
        },{
          label: 'QQ号',
          type: 'text',
          value: '',
          placeholder: '常用联系QQ',
          key: 'qq'
        },{
          label: '邮箱',
          type: 'text',
          value: '',
          placeholder: '常用联系邮箱',
          key: 'email',
        },{
          label: '婚姻状况',
          type: 'select',
          value: '',
          options: [{
            value: 0,
            label: '未婚'
          },{
            value: 1,
            label: '已婚'
          }],
          placeholder: '选择婚姻状况',
          key: 'maritalStatus'
        },{
          label: '地址',
          type: 'textarea',
          value: '',
          placeholder: '输入详细的地址，精确到门牌号码...',
          key: 'address'
        }
      ]   
    }
  },
  components: {
    FormComponent
  },
  created () {
    this.userId = this.$route.query.userId || ''
    this.getRoleList()
    console.log('this.$route.query', this.$route.query)
    if (this.userId) {
      this.getUserInfo()
    }
  },
  methods: {
    // 获取用户信息
    getUserInfo () {
      const userId = this.$route.query.userId
      getUserInfo({
        userId
      }).then(res => {
        console.log('res', res)
        const {user, organizationList, roleList} = res
        // 页面渲染
        this.formProp.forEach(item => {
          item.value = user[item.key]
          if (item.type === 'switch') {
            item.value = !!user[item.key]
          }
        })
      })
    },
    // 获取提交参数
    getFormData () {
      console.log('this.form', this.formProp)
      const params = {}
      this.formProp.forEach(item => {
        params[item.key] = item.value
      })
      console.log('params',params)
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
    width: 510px;
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