<template>
  <div class="page-user-add">
    <div class="user-add-content">
      <form-component ref="formProp" :formProp="formProp" :ruleCustom="ruleCustom" :formCustom="formCustom"></form-component>
      <div class="btn-list" v-if="!!userId">
        <Button class="btn-list-item" type="primary" @click="UserUpdate">保存</Button>
        <Button class="btn-list-item">返回</Button>
      </div>
      <div class="btn-list" v-else>
        <Button class="btn-list-item" type="primary" @click="UserRegister">确定</Button>
        <Button class="btn-list-item" type="primary"  @click="UserRegister(true)">确定并继续添加</Button>
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
  UserRegister,
  UserUpdate
} from 'api/user'
const reg = /^(?=.*?\d)(?=.*?[A-Za-z])[\dA-Za-z]{8,}$/ //检验密码
export default {
  name: 'UserAdd',
  data() {
    return {
      userId: '',
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
          }}
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
    this.getRoleList()
    this.getListTree()
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
        const {user, organizationList, roleList} = res
        // 页面渲染
        this.formProp.forEach(item => {
          this.formCustom[item.key] = user[item.key]
          if (item.type === 'switch') {
            this.formCustom[item.key] = !!user[item.key]
          }
        })
      })
    },
    // 重置表单
    ResetFormData () {
      this.formProp.map(item => {
        if (item.ref) {
          this.$refs['formProp'].$refs[item.ref][0].selectedText = ''
          this.$refs['formProp'].$refs[item.ref][0].selected = null
        } else {
          if (item.type === 'switch') {
            item.value = false
          } else {
            item.value = ''
          }
        }
        return item
      })
    },
    // 获取提交参数
    UserRegister (isReset = false) {
      // 测试参数
      // const params = {"birthday":"2019-10-16T16:00:00.000Z","loginName":"abaaa","enable":1,"organizationIds":[21,40,41],"roleIds":[11,12],"userName":"aaaaa","sex":1,"loginPassword":"asdfqbwe123","phoneNum":"15912313212","certificateType":"ID_CARD","certificateId":"445124159123132129","qq":"159123132","email":"159123132@qq.com","maritalStatus":0,"address":"sss"}
      this.$refs['formProp'].$refs['basicForm'].validate((valid) => {
        if (valid) {
          this.formCustom.birthday = this.formCustom.birthday.Format('yyyy-MM-dd')
          const params = Object.assign({}, this.formCustom, {
            enable: this.formCustom.enable ? 1 : 0
          })
          console.log('提交参数', params)
          UserRegister(params).then(res => {
            if(isReset) {
              this.$refs['formProp'].$refs['basicForm'].resetFields()
            }
            this.$Message.success('用户已成功注册');
          })
        }
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
      getRoleList().then(res => {
        this.formProp[2].options = res.list.map(item => {
          item.value = item.id
          item.label = item.roleName
          return item
        })
      })
    },

    // 获取组织树
    getListTree () {
      getListTree().then(res => {
        const { organization } = res
        this.formProp[1].options = this.formatTreeData(organization)
      })
    },

    // 格式化数据
    formatTreeData (item) {
      if (!item.childs) {
        item.title = item.organizationName
        item.name = item.organizationName
        return [item]
      }
      item.name = item.organizationName
      item.title = item.organizationName
      item.children = item.childs
      item.childs.forEach(subItem => {
        this.formatTreeData(subItem)
      })
      return [item]
    },
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