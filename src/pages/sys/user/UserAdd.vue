<template>
  <div class="page-user-add">
    <Spin size="large" fix v-if="fullLoading"></Spin>
    <div class="user-add-content">
      <form-component ref="formProp" :formProp="formProp" :ruleCustom="ruleCustom" :formCustom="formCustom"></form-component>
      <span class="user-point" v-if="user.point && user.point !==''">{{user.point}}分</span>
      <div class="btn-list" v-if="!!userId">
        <Button class="btn-list-item" type="primary" @click="UserUpdate">保存</Button>
        <Button class="btn-list-item" @click="goBack">返回</Button>
      </div>
      <div class="btn-list" v-else>
        <Button class="btn-list-item" type="primary" @click="UserAdd(false)">确定</Button>
        <Button class="btn-list-item" type="primary"  @click="UserAdd(true)">确定并继续添加</Button>
      </div>
    </div>
  </div>
</template>

<script>

import FormComponent from 'components/form/FormComponent.vue'
import {
  getListTree,
  getRoleList,
  getUserInfo,
  UserAdd,
  UserUpdate
} from 'api/user'
import {
  getMessage
} from 'utils/tool.js'
const reg = /^(?=.*?\d)(?=.*?[A-Za-z])[\dA-Za-z]{8,}$/ //检验密码
export default {
  name: 'UserAdd',
  data() {
    return {
      fullLoading: false,
      userId: '',
      user: {},
      organization: [],
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
          key: 'email'
        },{
          label: '婚姻状况',
          type: 'select',
          value: null,
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
            required: true,
            validator: (rule, value, callback) => {
              if (!reg.test(value)) {
                callback(new Error('要求至少8位数字加英文'))
              } else {
                callback()
              }
            }
          }
        ],
        loginName: [
          {
            trigger: 'blur',
            required: true,
            message: '请输入登录账号'
          }
        ],
        userName: [
          {
            trigger: 'blur',
            required: true,
            message: '请输入用户名'
          }
        ],
        email: [
          {
            trigger: 'blur',
            required: true,
            message: '请输入邮箱'
          }
        ],        
        phoneNum: [
          {
            trigger: 'blur',
            required: true,
            message: '请输入手机号码'
          }
        ]
      },
      formCustom: {}
    }
  },
  components: {
    FormComponent
  },
  created () {
    this.userId = this.$route.query.userId || ''
    if (this.userId) {
      this.init()
      this.getUserInfo()
    } else {
      this.getListTree()
    }
    this.getRoleList()
  },
  methods: {
    init () {
      const _userId = getMessage('userId')  //当前登录用户ID 
      const disabledData = ['organizationIds', 'roleIds', 'loginName', 'email']
      this.formProp.forEach(item => {
        if (this.userId === parseInt(_userId)) {
          this.$set(item, 'isDisabled', disabledData.includes(item.key))
        }
      })
    },
    // 获取用户信息
    getUserInfo () {
      this.fullLoading = true
      return new Promise((resolve) => {
        getUserInfo({
          userId: this.userId
        }).then(res => {
          const {user, organizationList, roleList} = res
          this.user = user
          return this.getListTree()
        }).then(data => {
          // 页面渲染
          this.formProp.forEach(item => {
            if (item.type === 'treeSelect') {
              const _data = this.formatTreeData(data, this.user[item.key])
              this.$set(this.formProp[1], 'options', _data)
            }
            this.$set(this.formCustom, item.key, this.user[item.key])
            if (item.type === 'switch') {
              this.$set(this.formCustom, item.key, !!this.user[item.key])
            }
          })
          this.fullLoading = false
        }).catch(() => {
          this.fullLoading = false
        })
      })
    },
    // 重置表单
    ResetFormData () {
      this.$set(this.formProp[1], 'options', this.formatTreeData(this.organization, []))
      this.formProp.forEach(item => {
        if (item.type === 'switch') {
          this.$set(this.formCustom, item.key, false)
        } else {
          this.$set(this.formCustom, item.key, '')
        }
      })
    },
    // 获取提交参数
    UserAdd (isReset = false) {
      this.$refs['formProp'].$refs['basicForm'].validate((valid) => {
        if (valid) {
          this.formCustom.birthday = this.formCustom.birthday ? this.formCustom.birthday.Format('yyyy-MM-dd') : ''
          const params = Object.assign({}, this.formCustom, {
            enable: this.formCustom.enable ? 1 : 0
          })
          UserAdd(params).then(res => {
            if(isReset) {
              this.$refs['formProp'].$refs['basicForm'].resetFields()
              this.ResetFormData()
            } else {
              this.$router.push('/user/list')
            }
            this.$Message.success('用户已成功注册');
          })
        }
      })
    },

    UserUpdate () {
      this.$refs['formProp'].$refs['basicForm'].validate((valid) => {
        if (valid) {
          this.formCustom.birthday = this.formCustom.birthday ? this.formCustom.birthday.Format('yyyy-MM-dd') : ''
          const params = Object.assign({}, this.formCustom, {
            enable: this.formCustom.enable ? 1 : 0,
            userId: this.userId
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
          this.organization = organization
          if (!this.userId) { //非編輯狀態時，需要格式化组织树
            this.formProp[1].options = this.formatTreeData(organization, [])
          }
          // 新增组用户过来
          if (this.$route.query.orgId !== '' && this.$route.query.orgId !== undefined) {
            this.$set(this.formCustom, 'organizationIds', [parseInt(this.$route.query.orgId)])
            this.$set(this.formProp[1], 'options', this.formatTreeData(organization, [parseInt(this.$route.query.orgId)]))
          }
          resolve(organization)
        })
      })
    },

    // 格式化数据
    formatTreeData (item, selectArr) {
      if (!item.children) {
        this.$set(item, 'selected', selectArr.includes(item.id))
        this.$set(item, 'checked', selectArr.includes(item.id))
        item.title = item.organizationName
        item.name = item.organizationName
        return [item]
      }
      this.$set(item, 'selected', selectArr.includes(item.id))
      this.$set(item, 'checked', selectArr.includes(item.id))
      item.name = item.organizationName
      item.title = item.organizationName
      item.children.forEach(subItem => {
        this.formatTreeData(subItem, selectArr)
      })
      return [item]
    },

    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.page-user-add {
  .user-add-content {
    width: 510px;
    padding: 8px;
    position: relative;
    .user-point {
      position: absolute;
      top: 16px;
      left: 160px;
      font-weight: bold;
      &::before {
        content: '积分:';
        margin-right: 12px;
      }
    }
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