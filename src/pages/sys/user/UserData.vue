<template>
  <div class="page-user-data">
    <div class="user-data-content">
      <div class="content-header">
        <div class="content-header-btn-lists">
          <Button>
            <router-link to="/user/group">新增组</router-link>
          </Button>
          <Button>
            <router-link to="/user/create">新增用户</router-link>
          </Button>
          <Button>
            <router-link to="/user/create">新增组用户</router-link>
          </Button>
        </div>
        <div class="content-header-search">
          <Input search enter-button="搜索" v-model="userName" @on-search="getUserList(1)" placeholder="关键字" />
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
  </div>
</template>

<script>
  import {
    getListTree,
    getUserList,
    deleteUser
  } from 'api/user';
  import {
    renderDeletePop
  } from 'utils/tool.js'
export default {
  name: 'UserData',
  data () {
    return {
      split: 0.15,
      treeOrganization: [],
      userName: '',
      enable: 1,
      organizationId: 0,
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
        pageSize: 20
      },
      total: null
    }
  },
  created () {
    this.getListTree()
  },
  methods: {
    // 获取组织树结构数据
    getListTree () {
      getListTree().then(res => {
        const { organization } = res
        this.treeOrganization = this.formatTreeData(organization)
        this.organizationId = this.treeOrganization[0].id
        this.getUserList()
      })
    },
    // 获取表格数据
    getUserList (enable = 1) {
      this.data = []
      getUserList({
        enable,
        searchTag: this.userName.trim() !== '' ? true : '',
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
      console.log('params', params)
      deleteUser({
        userId: params.row.id,
        organizationId: this.organizationId
      }).then(res => {
        this.getUserList()
      })
    },

    selectNode (data, node) {
      this.organizationId = node.id
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