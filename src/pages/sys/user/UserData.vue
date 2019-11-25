<template>
  <div class="page-user-data">
    <Spin size="large" fix v-if="fullLoading"></Spin>
    <div class="user-data-content">
      <div class="content-header">
        <div class="content-header-btn-lists">
          <Button>
            <router-link to="/user/group">新增组</router-link>
          </Button>
          <Button>
            <router-link to="/user/create">新增用户</router-link>
          </Button>
          <Button @click="getOrgGroup">
            <span style="color: #2d8cf0">新增组用户</span>
          </Button>
        </div>
        <div class="content-header-search">
          <Input search enter-button="搜索" v-model="userName" @on-search="searchUserList" placeholder="关键字" />
        </div>
      </div>
      <div class="content-middle">
        <Split v-model="split" min="200px">
          <div  slot="left" class="content-middle-left">
            <Tree :data="treeOrganization" @on-select-change="selectNode"></Tree>
          </div>
          <div  slot="right" class="content-middle-right">
            <div class="content-middle-right-table">
              <Table border :columns="columns" :data="data"></Table>
            </div>
            <div class="content-middle-right-pages">
              <Page :total="total" size="small" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changePageSize" />
            </div>
          </div>
        </Split>
      </div>
    </div>
    <Modal v-model="isShowmodal" fullscreen :title="'当前组织名称: ' + organizationName" ok-text="确定添加" @on-ok="addToGroup">
      <div style="margin-bottom: 12px;width: 300px">
          <Input search enter-button="搜索" v-model="orgUserName" @on-search="searchOrgUserList" placeholder="关键字" />
        </div>
      <div style="margin-bottom: 12px">
        <Table border :loading="loading" :columns="orgColumns" :data="orgData" @on-select="selectUser" @on-select-all="selectAll" @on-select-cancel="cancelSelectUser" @on-select-all-cancel="cancelSelectAll"></Table>
      </div>
      <div class="content-middle-right-pages">
        <Page :total="orgTotal" size="small" show-elevator show-sizer @on-change="changeOrgPage" @on-page-size-change="changeOrgPage" />
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    getListTree,
    getUserList,
    deleteUser,
    organizationAddUser
  } from 'api/user';
  import {
    renderDeletePop
  } from 'utils/tool.js'
export default {
  name: 'UserData',
  data () {
    return {
      fullLoading: false,
      split: 0.15,
      treeOrganization: [],
      isSelectGroup: false,
      userName: '',
      enable: '',
      organizationId: '',
      organizationName: '',
      isShowmodal: false,
      columns: [
        
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
      total: null,
      orgColumns: [
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
          title: '创建时间',
          key: 'createdTime'
        }
      ],
      orgData: [],
      orgTotal: null,
      orgPage: {
        pageNum: 1,
        pageSize: 10
      },
      orgUserName: '',
      selection: [],
      loading: false,
    }
  },
  created () {
    this.getListTree()
  },
  methods: {
    // 获取组织树结构数据
    getListTree () {
      this.fullLoading = true
      getListTree().then(res => {
        const { organization } = res
        this.treeOrganization = this.formatTreeData(organization)
        this.organizationId = this.treeOrganization[0].id
        this.organizationName = this.treeOrganization[0].organizationName
        this.getUserList()
      }).catch(() => {
        this.fullLoading = false
      })
    },
    // 获取表格数据
    getUserList () {
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
    // 格式化数据
    formatTreeData (item) {
      if (!item.children) {
        item.title = item.organizationName
        return [item]
      }
      item.title = item.organizationName
      item.children = item.children
      item.expand = !!item.children
      item.children.forEach(subItem => {
        this.formatTreeData(subItem)
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
        userId: params.row.id,
        organizationId: this.organizationId
      }).then(res => {
        this.getUserList()
      })
    },

    selectNode (data, node) {
      this.organizationId = node.id
      this.organizationName = node.organizationName
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

    // 添加组用户
    getOrgGroup () {
      this.orgData = []
      getUserList({
        enable: this.enable,
        nonOrganizationId: this.organizationId,
        userName: this.orgUserName,
        page: {
          pageNum: this.orgPage.pageNum,
          pageSize: this.orgPage.pageSize,
        }
      }).then(res => {
        const {organizationList,roleList,userList,count} = res
        this.orgData = userList.map(item => {
          item.createdTime = new Date(item.createdTime).Format('yyyy-MM-dd')
          item.roleName = item.roleIds && item.roleIds.map(item => {
            return roleList[item].roleName
          }).join(',')
          return item
        })
        this.orgTotal = count
        this.isShowmodal = true
        this.selection = []
      })
    },
    // getOrgGroup () {
    //   this.$router.push({
    //     path: '/user/create',
    //     query: {
    //       orgId: this.organizationId
    //     }
    //   })
    // },
    
    // 改变页码
    changeOrgPage (page) {
      this.orgPage.pageNum = page
      this.getUserList()
    },
    // 改变页面条数
    changeOrgPageSize (pageSize) {
      this.orgPage.pageSize = pageSize
      this.getUserList()
    },

    searchOrgUserList () {
      this.orgPage.pageNum = 1
      this.getOrgGroup()
    },

    // 选择用户
    selectUser (selection) {
      this.selection = selection
    },

    // 全选
    selectAll (selection) {
      this.selection = selection
    },

    // 取消选择用户
    cancelSelectUser (selection) {
      this.selection = selection
    },

    // 取消多选
    cancelSelectAll (selection) {
      this.selection = []
    },
    
    addToGroup () {
      if (this.selection.length === 0) {
        return
      }
      this.loading = true
      Promise.all(this.selection.forEach(item => {
        organizationAddUser({
          organizationId: this.organizationId,
          userId: item.id
        })
      })).then((res) => {
        this.loading = false
        this.isShowmodal = false
        this.getUserList() //重新更新用户列表
      }).catch(() => {
        this.loading = false
        this.isShowmodal = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-user-data {
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
      justify-content: space-between;
      margin-bottom: 12px;
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