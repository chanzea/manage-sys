<template>
  <div class="page-user-data">
    <div class="user-data-content">
      <div class="content-header">
        <div class="content-header-btn-lists">
          <Button>新增组</Button>
          <Button>新增用户</Button>
          <Button>新增组用户</Button>
        </div>
        <div class="content-header-search">
          <Input search enter-button="搜索" placeholder="Enter something..." />
        </div>
      </div>
      <div class="content-middle">
        <Split v-model="split" min="200px">
          <div  slot="left" class="content-middle-left">
            <Tree :data="treeOrganization"></Tree>
          </div>
          <div  slot="right" class="content-middle-right">
            <Table border :columns="columns" :data="data"></Table>
          </div>
        </Split>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getListTree
  } from 'api/user';
export default {
  name: 'UserData',
  data () {
    return {
      split: 0.15,
      treeOrganization: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'name',
          sortable: true
        },
        {
          title: '登录名',
          key: 'username'
        },
        {
          title: '手机',
          key: 'phone',
          sortable: true
        },
        {
          title: '权限',
          key: 'permission'
        },
        {
          title: '所在组织',
          key: 'organization'
        },
        {
          title: '创建时间',
          key: 'createtime'
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
                  marginRight: '12px'
                },
                on: {
                  click: () => {
                      this.show(params)
                  }
                }
              }, '查看'),
              h('span', {
                style: {
                  color: '#2d8cf0'
                },
                on: {
                  click: () => {
                    this.remove(params)
                  }
                }
              }, '删除')
            ]);
          }
        }
      ],
      data: [
        {
          name: 'John Brown',
          username: 'admin',
          phone: '12345678978',
          permission: '组织管理员',
          organization: '未分组',
          createtime: ''
        },
      ]
    }
  },
  created () {
    this.getListTree()
  },
  methods: {
    getListTree () {
      getListTree({
        layerNumber: 5,
      }).then(res => {
        const { organization } = res
        console.log('getListTree ===> ', organization)
        this.treeOrganization = this.formatTreeData(organization)
        console.log('treeOrganization', this.treeOrganization)
      })
    },
    // 格式化数据
    formatTreeData (item) {
      if (!item.childs) {
        item.title = item.organizationName
        return [item]
      }
      item.title = item.organizationName
      item.children = item.childs
      item.expand = !!item.childs
      item.childs.forEach(subItem => {
        this.formatTreeData(subItem)
      })
      return [item]
    },

    show (params) {
      console.log('params', params)
    },

    remove(params) {
      console.log('params', params)
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
      }
    }
  }
}
</style>