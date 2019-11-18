<template>
  <div class="page-user-list">
    <Spin size="large" fix v-if="fullLoading"></Spin>
    <div class="user-data-content">
      <div class="content-header">
        <div class="content-header-select">
          <Select v-model="enable" style="width:200px" placeholder="选择用户状态">
            <Option v-for="item in status" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="content-header-tree-select">
          <TreeSelect :disabled="false" ref="TreeSelect" v-model="organizationId"
            :data="treeOrganization"
            :multiple="false"
            :showCheckbox="false"
            placeholder="选择组织"
            @on-change="selectOrg">
          </TreeSelect>
        </div>
        <div class="content-header-search">
          <Input v-model="userName" placeholder="关键字" />
        </div>
        <Button type="primary" @click="searchUserList" style="margin-right: 8px">搜索</Button>
        <Button type="primary" @click="reset">重置</Button>
      </div>
      <div class="content-middle">
        <div class="content-middle-right">
          <div class="content-middle-right-table">
            <Table border :columns="columns" :data="data"></Table>
          </div>
          <div class="content-middle-right-pages">
            <Page :total="total" size="small" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changePageSize" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TreeSelect from './../../../components/form/TreeSelect'
  import {
    getListTree,
    getUserList,
    deleteUser
  } from 'api/user';
  import {
    renderDeletePop
  } from 'utils/tool.js'
export default {
  name: 'UserList',
  data () {
    return {
      fullLoading: false,
      treeOrganization: [],
      userName: '',
      enable: '',
      status: [{
        value: 1,
        label: '开启'
      },{
        value: 0,
        label: '关闭'
      },],
      organizationId: '',
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'userName',
          sortable: true
        },
        {
          title: '登录名',
          key: 'loginName'
        },
        {
          title: '手机',
          key: 'phoneNum',
          sortable: true
        },
        {
          title: '权限',
          key: 'roleName'
        },
        {
          title: '所在组织',
          key: 'organization'
        },
        {
          title: '创建时间',
          key: 'createdTime'
        },{
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  color: '#2d8cf0',
                  marginRight: '12px',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                      this.show(params)
                  }
                }
              }, '查看'),
              renderDeletePop(h, '您确定要删除该用户吗', {
                confirmFn: () => {
                  this.deleteData(params)
                } 
              })
            ]);
          }
        }
      ],
      data: [],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: null
    }
  },
  components: {
    TreeSelect
  },
  created () {
    this.getListTree()
    this.getUserList()
  },
  methods: {
    // 获取组织树结构数据
    getListTree () {
      getListTree().then(res => {
        const { organization } = res
        this.treeOrganization = this.formatTreeData(organization, [])
      })
    },
    // 获取表格数据
    getUserList () {
      this.fullLoading = true
      this.data = []
      getUserList({
        enable: this.enable,
        userName: this.userName,
        organizationId: this.organizationId,
        page: {
          pageNum: this.page.pageNum,
          pageSize: this.page.pageSize,
        }
      }).then(res => {
        const {organizationList,roleList,userList,count} = res
        this.data = userList.map(item => {
          item.createdTime = new Date(item.createdTime).Format('yyyy-MM-dd')
          item.roleName = item.roleIds && item.roleIds.map(item => {
            return roleList[item].roleName
          }).join(',')
          item.organization = item.organizationIds ? item.organizationIds.map(item => {
            return organizationList[item].organizationName
          }).join(',') : '未分组'
          return item
        })
        this.total = count
        this.fullLoading = false
      }).catch(() => {
        this.fullLoading = false
      })
    },

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

    show (params) {
      this.$router.push({
        path: '/user/create',
        query: {
          userId: params.row.id
        }
      })
    },

    deleteData(params) {
      deleteUser({
        userId: params.row.id
      }).then(res => {
        this.getUserList()
      })
    },

    selectOrg (data) {
      this.organizationId = data.id
      this.getUserList()
    },
    // 改变页码
    changePage (page) {
      this.page.pageNum = page
      this.getUserList()
    },
    // 改变页面条数
    changePageSize (pageSize) {
      this.page.pageSize = pageSize
      this.getUserList()
    },

    searchUserList () {
      this.page.pageNum = 1
      this.getUserList()
    },

    reset () {
      this.enable = false;
      this.userName = ''
      this.organizationId = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.page-user-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  .user-data-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    .content-header {
      display: flex;
      align-items: center;
      // justify-content: space-between;
      margin-bottom: 12px;
      &-select {
        margin-right: 12px;
      }
      &-tree-select {
        width: 400px;
        margin-right: 12px;
        & /deep/ .ivu-select-dropdown {
          width: 400px;
        }
      }
      &-search {
        margin-right: 12px;
      }
    }
    .content-middle {
      flex: 1;
      display: flex;
      flex-direction: column;
      .ivu-split-wrapper {
        flex: 1;
      }
      &-left {
        background-color: #fff;
        border: 1px solid #f7f7f7;
        box-sizing: border-box;
        height: 100%;
        padding: 10px 8px;
      }
      &-right {
        background-color: #fff;
        border: 1px solid #f7f7f7;
        height: 100%;
        padding: 8px;
        &-table {
          margin-bottom: 12px;
        }
      }
    }
  }
}
</style>