<template>
  <div class="page-user-group">
    <div class="user-group-content">
      <Tree :data="data" :render="renderContent"></Tree>
    </div>
  </div>
</template>

<script>
import {
  getListTree,
  organizationAdd,
  organizationUpdate,
  organizationDelete
} from 'api/user';
import DeletePoptip from '@/components/common/DeletePoptip.vue'
export default {
  name: 'UserGroup',
  data () {
    return {
      data: [
        {
          permissionName: "平台",
          expand: true,
          children: []
        }
      ],
      // data: [],
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
          const { organization } = res
          this.data = this.formatTreeData(organization)
          resolve()
        })
      })
    },
    // 格式化数据
    formatTreeData (item) {
      if (!item.children) {
        item.isEdit = false;
        item.expand = true;
        return [item]
      }
      item.expand = !!item.children
      item.children.forEach(subItem => {
        this.formatTreeData(subItem)
      })
      return [item]

    },
    renderContent(h, { root, node, data }) {
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            width: "100%"
          }
        },
        [
          h("span", [
            h("Icon", {
              props: {
                type: "ios-paper-outline"
              },
              style: {
                marginRight: "8px"
              }
            }),
            h("span", {
                style: {
                  display: data.isEdit ? "none" : "unset",
                  // display: data.isEdit ? "none" : "inline-block",
                  // width: '120px',
                  // 'white-space': 'nowrap',
                  // 'overflow': 'hidden',
                  // 'text-overflow': 'ellipsis',
                  // 'vertical-align': 'middle'
                },
                props: Object.assign({},{
                  title: `${data.organizationName}` 
                })
              },
              `${data.organizationName}`
            ),
            this.editRender(h, data, node, root)
          ]),
          h(
            "span",
            {
              style: {
                display: "inline-block",
                float: "right",
                marginRight: "30px"
              }
            },
            [
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-create-outline",
                  size: "small"
                }),
                style: {
                  marginRight: "8px"
                },
                on: {
                  click: () => {
                    this.edit(root, node, data);
                  }
                }
              }),
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-add",
                  size: "small"
                }),
                style: {
                  marginRight: "8px"
                },
                on: {
                  click: () => {
                    this.append(data);
                  }
                }
              }),
              h(
                DeletePoptip,
                {
                  props:{
                    content: "确定删除？",
                    size: "small", 
                    icon: 'ios-remove'
                  },
                  on: {
                    onOK: () => {
                      this.remove(root, node, data);
                    },
                    onCancel: () => {
                      
                    }
                  }
                }
              )
            ]
          )
        ]
      );
    },
    append(data) {
      const children = data.children || [];
      children.push({
        organizationName: "",
        permissionType: 1,
        isAdd: true,
        permissionParent: data.permissionParent || 0,
        expand: true,
        isEdit: true
      });
      this.$set(data, "children", children);
    },
    remove(root, node, data) {
      if(data.id){
        organizationDelete({organizationId: data.id}).then((res)=>{
          const parentKey = root.find(el => el === node).parent;
          const parent = root.find(el => el.nodeKey === parentKey).node;
          const index = parent.children.indexOf(data);
          parent.children.splice(index, 1);
        })
        return;
      } else {
        const parentKey = root.find(el => el === node).parent;
        const parent = root.find(el => el.nodeKey === parentKey).node;
        const index = parent.children.indexOf(data);
        parent.children.splice(index, 1);
      }
      
    },
    edit(root, node, data) {
      this.$set(data, "isEdit", true);
    },
    confirm(root, node, data, reviseData) {
      data.isEdit = false;
      data.organizationName = reviseData.organizationName;

      const parentKey = root.find(el => el === node).parent;
      const parent = root.find(el => el.nodeKey === parentKey).node;

      let params = {
        organizationName: data.organizationName,
        parentId: parent.id || 0,
      }

      if(data.isAdd){
        organizationAdd(params).then( (res) => {
          this.getListTree();
        })
      } else {
        params.organizationId = data.id
        organizationUpdate(params)
      }
    },
    editRender(h, data, node, root) {
      let organizationName = data.organizationName;
      return h(
        "div",
        {
          style: {
            display: data.isEdit ? "inline-block" : "none",
            width: "200px"
          }
        },
        [
          h("Input", {
            props: {
              placeholder: "名称",
              type: "text",
              value: data.organizationName
            },
            style: {
              marginRight: "8px"
            },
            on: {
              "on-blur": val => {
                organizationName = val.target.value;
              }
            }
          }),
          h("Button", {
            props: Object.assign({}, this.buttonProps, {
              icon: "ios-checkmark",
              type: "default",
              size: "small"
            }),
            style: {
              marginRight: "8px"
            },
            on: {
              click: () => {
                this.confirm(root, node, data, {
                  organizationName
                });
              }
            }
          }),
          h("Button", {
            props: Object.assign({}, this.buttonProps, {
              icon: "ios-close",
              type: "default",
              size: "small"
            }),
            on: {
              click: () => {
                data.isEdit = false;
              }
            }
          })
        ]
      );
    }
  }
}
</script>

<style lang="scss" scoped>
.page-user-group {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: #fff;
  .user-group-content {
    width: 60%;
    flex: 1;
    padding: 8px;
  }
}
</style>