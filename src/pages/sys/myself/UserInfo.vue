<template>
  <div class="page-user-info">
    <Tabs :value="name">
      <TabPane label="基本信息" name="info">
        <div class="user-form">
          <form-component ref="formProp" :formProp="formProp" :ruleCustom="ruleCustom" :formCustom="formCustom"></form-component>
        </div>
        <div class="btn-list">
          <Button class="btn-list-item" type="primary" :loading="loading" @click="UserUpdate">保存</Button>
          <Button class="btn-list-item">返回</Button>
        </div>
      </TabPane>
      <TabPane label="头像" name="avatar">头像</TabPane>
      <TabPane label="修改密码" name="pwd">
        <div class="reset-pwd-form">
          <form-component ref="resetPwdForm" :formProp="resetPwdForm" :ruleCustom="ruleResetPwd" :formCustom="formResetPwd"></form-component>
        </div>
        <div class="btn-list">
          <Button class="btn-list-item" type="primary" :loading="loading" :disabled="loading" @click="resetPwd">确定</Button>
          <Button class="btn-list-item">取消</Button>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import FormComponent from 'components/form/FormComponent.vue'
import {
  getListTree,
  getRoleList,
  getUserInfo,
  UserUpdate
} from 'api/user'
const reg = /^(?=.*?\d)(?=.*?[A-Za-z])[\dA-Za-z]{8,}$/ //检验密码
export default {
  name: 'pageUserInfo',
  data () {
    return {
      name: 'info',
      formProp: [
        {
          label: '状态',
          type: 'switch',
          value: false,
          key: 'enable'
        },{
          label: '所在组织',
          type: 'treeSelect',
          value: '',
          options: [],
          placeholder: '设置归属组织',
          isMultiple: true,
          showCheckbox: true,
          ref: 'organization',
          key: 'organizationIds',
          isDisabled: true
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
          placeholder: '登录密码,要求至少8位数字加英文',
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
      ],
      // 验证规则
      ruleCustom: {
        loginPassword: [
          { 
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!reg.test(value)) {
                callback(new Error('要求至少8位数字加英文'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      formCustom: {},
      user: {},


      loading: false,
      resetPwdForm: [{
        label: '原密码',
        type: 'password',
        value: '',
        placeholder: '请输入原密码',
        key: 'originPassword'
      },{
        label: '新密码',
        type: 'password',
        value: '',
        placeholder: '请输入新密码',
        key: 'newPassword'
      },{
        label: '确认密码',
        type: 'password',
        value: '',
        placeholder: '请再次输入新密码',
        key: 'comfirmPassword'
      }],

      ruleResetPwd: {
        originPassword: [{
          required: true,
          trigger: 'blur'
        }],
        newPassword: [{
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (!reg.test(value)) {
              callback(new Error('要求至少8位数字加英文'))
            } else {
              callback()
            }
          }
        }],
        comfirmPassword: [{
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (!reg.test(value)) {
              callback(new Error('要求至少8位数字加英文'))
            } else {
              if (value !== this.formResetPwd['newPassword']) {
                callback(new Error('新密码输入不一致，请重新确认'))
              } else {
                callback()
              }
            }
          }
        }],
      },
      formResetPwd: {}
    }
  },
  created () {
    this.getRoleList()
    this.getUserInfo()
  },
  components: {
    FormComponent
  },
  methods: {
    // 获取用户信息
    getUserInfo () {
      const userId = localStorage.getItem('userId')
      return new Promise((resolve) => {
        getUserInfo({
          userId
        }).then(res => {
          const {user, organizationList, roleList} = res
          this.user = user
          return this.getListTree()
        }).then(data => {
          // 页面渲染
          this.formProp.forEach(item => {
            this.formCustom[item.key] = this.user[item.key]
            if (item.type === 'switch') {
              this.formCustom[item.key] = !!this.user[item.key]
            }
            if (item.type === 'treeSelect') {
              this.formProp[1].options = this.formatTreeData(data, this.formCustom[item.key])
            }
          })
        })
      })
    },
    UserUpdate () {
      this.$refs['formProp'].$refs['basicForm'].validate((valid) => {
        if (valid) {
          this.formCustom.birthday = this.formCustom.birthday.Format('yyyy-MM-dd')
          const params = Object.assign({}, this.formCustom, {
            enable: this.formCustom.enable ? 1 : 0
          })
          UserUpdate(params).then(res => {
            this.$Message.success('用户信息更新成功');
          })
        }
      })
    },
    // 获取角色列表
    getRoleList () {
      return new Promise((resolve) => {
        getRoleList().then(res => {
          this.formProp[2].options = res.list.map(item => {
            item.value = item.id
            item.label = item.roleName
            return item
          })
          resolve()
        })
      })
    },

    // 获取组织树
    getListTree () {
      return new Promise((resolve) => {
        getListTree().then(res => {
          const { organization } = res
          resolve(organization)
        })
      })
    },

    // 格式化数据
    formatTreeData (item, selectArr) {
      if (!item.children) {
        item.selected = selectArr.includes(item.id)
        item.checked = selectArr.includes(item.id)
        item.title = item.organizationName
        item.name = item.organizationName
        return [item]
      }
      item.selected = selectArr.includes(item.id)
      item.checked = selectArr.includes(item.id)
      item.name = item.organizationName
      item.title = item.organizationName
      item.children.forEach(subItem => {
        this.formatTreeData(subItem, selectArr)
      })
      return [item]
    },

    //重置密码
    resetPwd () {
      this.$refs['resetPwdForm'].$refs['basicForm'].validate((valid) => {
        if (valid) {
          console.log('重置密码')
          this.loading = true
          setTimeout(() => {
            this.loading = false
          }, 2000);
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-user-info {
  .btn-list {
    padding-left: 80px;
    display: flex;
    &-item {
      margin-right: 8px;
    }
  }
  .user-form {
    width: 550px;
  }
  .reset-pwd-form {
    width: 320px;
  }
}
</style>