<template>
  <div class="page-user-group">
    <div class="user-group-content">
      <Tree :data="treeOrganization" :render="renderContent"></Tree>
    </div>
  </div>
</template>

<script>
import {
  getListTree,
  organizationAdd,
  organizationDelete
} from 'api/user';
export default {
  name: 'UserGroup',
  data () {
    return {
      treeOrganization: [],
      organizationName: ''
    }
  },
  created () {
    this.getListTree()
  },
  methods: {
    getListTree () {
      return new Promise((resolve) => {
        getListTree().then(res => {
          console.log('getListTree ===> ', res)
          const { organization } = res
          this.treeOrganization = this.formatTreeData(organization)
          console.log('treeOrganization', this.treeOrganization)
          resolve()
        })
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
    renderContent (h, { root, node, data }) {
      return h('span', {
        style: {
          display: 'inline-block',
          width: '100%'
        }
      }, [
        h('span', [
          h('Icon', {
            props: {
              type: 'ios-paper-outline'
            },
            style: {
              marginRight: '8px'
            }
          }),
          h('span', data.title)
        ]),
        h('span', {
          style: {
            display: 'inline-block',
            float: 'right',
            marginRight: '32px'
          }
        }, [
          h('Button', {
            props: Object.assign({}, this.buttonProps, {
              icon: 'ios-create-outline',
              size: 'small'
            }),
            style: {
              marginRight: '8px'
            },
            on: {
              click: () => { this.edit(root, node, data) }
            }
          }),
          h('Button', {
            props: Object.assign({}, this.buttonProps, {
              icon: 'ios-add',
              size: 'small'
            }),
            style: {
              marginRight: '8px'
            },
            on: {
              click: () => { this.append(data) }
            }
          }),
          h('Button', {
            props: Object.assign({}, this.buttonProps, {
              icon: 'ios-remove',
              size: 'small'
            }),
            on: {
              click: () => { this.remove(root, node, data) }
            }
          }),
        ])
      ]);
    },
    // 编辑节点
    edit (root, node, data) {
      console.log('root',root)
      console.log('node',node)
      console.log('data',data)
    },
    append (data) {
      const children = data.children || [];
      children.push({
        expand: true,
        render: (h, { data, node, root}) => {
          return h('div', {
              style: {
                display: 'inline-block',
                width: '300px'
              }
          }, [
              h('Input', {
                props: {
                  placeholder: '组织名称',
                  type: 'text'
                },
                style: {
                  marginRight: '8px'
                },
                on: {
                  'on-blur': (val) => {
                    this.organizationName = val.target.value
                  }
                }
              }),
              h('Button', {
                  props: Object.assign({}, this.buttonProps, {
                    icon: 'ios-checkmark',
                    type: 'default'
                  }),
                  style: {
                    marginRight: '8px'
                  },
                  on: {
                    click: () => { this.confirm( node, root) }
                  }
              }),
              h('Button', {
                  props: Object.assign({}, this.buttonProps, {
                    icon: 'ios-close',
                    type: 'default'
                  }),
                  on: {
                      click: () => { this.delete(data, node, root) }
                  }
              })
          ]);
      },
      });
      this.$set(data, 'children', children);
    },
    remove (root, node, data) {
      organizationDelete({
        deleted: true,
        organizationId: data.id
      }).then(res => {
        const parentKey = root.find(el => el === node).parent;
        const parent = root.find(el => el.nodeKey === parentKey).node;
        const index = parent.children.indexOf(data);
        parent.children.splice(index, 1);
      })
    },

    // 获取父节点ID
    getParentId (node, root) {
      let item = root.find(item => {
        return item.nodeKey === node.parent
      })
      return item && item.node.id
    },
    confirm (node, root) {
      let parentId = this.getParentId(node, root)
      console.log('parentId', parentId)
      organizationAdd({
        organizationName: this.organizationName,
        parentId
      }).then(res => {
        this.getListTree().then(() => {
          this.$Message.success('添加成功');
        })
      })
    },

    delete (data, node, root) {
      const parentKey = root.find(el => el === node).parent;
      const parent = root.find(el => el.nodeKey === parentKey).node;
      const index = parent.children.indexOf(data);
      parent.children.splice(index, 1);

    }
  }
}
</script>

<style lang="scss" scoped>
.page-user-group {
  display: flex;
  flex-direction: column;
  flex: 1;
  .user-group-content {
    width: 100%;
    flex: 1;
    background: #fff;
    padding: 8px;
  }
}
</style>