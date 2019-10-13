<template>
  <div class="page-config-role">
    <div class="config-role-content">
      <div class="content-header">
        <Input placeholder="输入角色名称" >
          <Button slot="append" icon="md-add">新增角色</Button>
        </Input>
      </div>
      <div class="content-middle">
        <Table :columns="columns" :data="data"></Table>
      </div>
      <Modal v-model="isShowModal" fullscreen :title="modalContent.title">
        <div>{{modalContent.content}}</div>
        <div>
          <Tree :data="data" show-checkbox></Tree>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import {
  getRoleList,
  getRoleListPermission
} from 'api/role.js';
export default {
  name: 'ConfigRole',
  data() {
    return {
      isShowModal: false,
      columns: [{
        type: 'selection',
        width: 60,
        align: 'center'
      },{
        title: '角色',
        key: 'roleName'
      },
      {
        title: '权限',
        key: 'permission',
        width: 400,
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
                    this.getRoleListPermission(params.row)
                }
              }
            }, '配置权限')
          ]);
        }
      },
      {
        title: '操作',
        key: 'action',
        width: 200,
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
                    this.delete(params.row)
                }
              }
            }, '删除')
          ]);
        }
      }],
      data: [],
      modalContent: {
        title: '',
        content: null
      }
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    delete (row) {
      console.log('row', row)
    },
    getRoleListPermission (row) {
      console.log('row', row)
      this.modalContent.title = row.roleName
      this.isShowModal = true
      getRoleListPermission({
        roleId: row.id
      }).then(res => {
        console.log('res', res)
        const {list} = res
        this.modalContent.content = list
      })
    },
    getRoleList () {
      getRoleList().then(res => {
        console.log('res', res)
        const { list } = res
        this.data = list
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.page-config-role {
  .config-role-content {
    .content-header {
      width: 300px;
      margin-bottom: 20px;
    }
  }
}
</style>