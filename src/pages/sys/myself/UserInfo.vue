<template>
  <div class="page-user-info">
    <Tabs :value="name">
      <TabPane label="基本信息" name="info">
        <div class="user-form">
          <form-component ref="formProp" :formProp="formProp" :ruleCustom="ruleCustom" :formCustom="formCustom"></form-component>
          <span class="user-point" v-if="user.point">{{user.point}}分</span>
        </div>
        <div class="btn-list">
          <Button class="btn-list-item" type="primary" :loading="loading" @click="UserUpdate">保存</Button>
          <Button class="btn-list-item">返回</Button>
        </div>
      </TabPane>
      <TabPane label="头像" name="avatar">头像</TabPane>
    </Tabs>
  </div>
</template>

<script>
import FormComponent from 'components/form/FormComponent.vue'
import {
  getUserInfo,
  UserUpdate
} from 'api/user'
import {
  getMessage
} from 'utils/tool.js'
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
          type: 'text',
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
          type: 'text',
          value: '',
          isMultiple: true,
          placeholder: '系统角色',
          key: 'roleIds',
          isDisabled: true
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
          key: 'loginName',
          isDisabled: true
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
          isDisabled: true
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

      loading: false
    }
  },
  created () {
    this.getUserInfo()
  },
  components: {
    FormComponent
  },
  methods: {
    // 获取用户信息
    getUserInfo () {
      const userId = getMessage('userId')
      return new Promise((resolve) => {
        getUserInfo({
          userId
        }).then(res => {
          const {user, organizationList, roleList} = res
          this.user = user
          this.formProp.forEach(item => {
            this.$set(this.formCustom, item.key, user[item.key])
            if (item.type === 'switch') {
              this.$set(this.formCustom, item.key, !!user[item.key])
            }
            if (item.key === 'organizationIds' ) {
              this.$set(this.formCustom, 'organizationIds', user['organizationIds'] ? user['organizationIds'].map(item => {
                return organizationList[item].organizationName
              }).join(',') : '未分组')
            }
            if (item.key === 'roleIds' ) {
              this.$set(this.formCustom, 'roleIds', user['roleIds'] ? user['roleIds'].map(item => {
                return roleList[item].roleName
              }).join(',') : '暂无')
            }
          })
        })
      })
    },
    UserUpdate () {
      this.$refs['formProp'].$refs['basicForm'].validate((valid) => {
        if (valid) {
          const userId = getMessage('userId')
          this.formCustom.birthday = this.formCustom.birthday ?this.formCustom.birthday.Format('yyyy-MM-dd') : ''
          const params = Object.assign({}, this.formCustom, {
            enable: this.formCustom.enable ? 1 : 0,
            userId
          })
          UserUpdate(params).then(res => {
            this.$Message.success('用户信息更新成功');
          })
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
    position: relative;
    .user-point {
      position: absolute;
      top: 8px;
      left: 160px;
      font-weight: bold;
      &::before {
        content: '积分:';
        margin-right: 12px;
      }
    }
  }
  .reset-pwd-form {
    width: 320px;
  }
}
</style>