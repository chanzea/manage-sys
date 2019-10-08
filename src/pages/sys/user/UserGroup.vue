<template>
  <div class="page-user-group">
    <div class="user-group-content">
      <Tree :data="treeOrganization" :render="renderContent"></Tree>
    </div>
  </div>
</template>

<script>
import {
  getListTree
} from 'api/user';
export default {
  name: 'UserGroup',
  data () {
    return {
      treeOrganization: [],
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
        console.log('getListTree ===> ', res)
        const { organization } = res
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
    edit (root, node, data) {
      console.log('root',root)
      console.log('node',node)
      console.log('data',data)
    },
    append (data) {
      console.log('data', data)
      const children = data.children || [];
      children.push({
        expand: true,
        render: (h, { subData }) => {
          return h('div', {
              style: {
                display: 'inline-block',
                width: '300px'
              }
          }, [
              h('Input', {
                props: {
                  placeholder: '组织名称',
                  type: 'text',
                  value: ''
                },
                style: {
                  marginRight: '8px'
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
                      click: () => { this.confirm(subData) }
                  }
              }),
              h('Button', {
                  props: Object.assign({}, this.buttonProps, {
                    icon: 'ios-close',
                    type: 'default'
                  }),
                  on: {
                      click: () => { this.append(data) }
                  }
              })
          ]);
      },
      });
      this.$set(data, 'children', children);
    },
    remove (root, node, data) {
      const parentKey = root.find(el => el === node).parent;
      const parent = root.find(el => el.nodeKey === parentKey).node;
      const index = parent.children.indexOf(data);
      parent.children.splice(index, 1);
    },

    confirm (subData) {
      console.log('subData', subData)
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