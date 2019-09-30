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
      treeOrganization: []
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
              icon: 'ios-add'
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
              icon: 'ios-remove'
            }),
            on: {
              click: () => { this.remove(root, node, data) }
            }
          })
        ])
      ]);
    },
    append (data) {
      const children = data.children || [];
      children.push({
        title: 'appended node',
        expand: true
      });
      this.$set(data, 'children', children);
    },
    remove (root, node, data) {
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