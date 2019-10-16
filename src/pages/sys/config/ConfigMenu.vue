<template>
  <div class="page-config-index">
    <Tree :data="data" :render="renderContent" ></Tree>
    <DeletePoptip/>  
  </div>
</template>
<script>
// import data from "@/mock/side.js";
import data from "@/mock/auth.js";
import DeletePoptip from '@/components/common/DeletePoptip.vue'
import {
    renderDeletePop
  } from 'utils/tool.js'
import {
  getListTree,
  permissonAdd,
  permissonUpdate,
  permissonDelete
} from 'api/sysConfig';
import ConfigRoleVue from './ConfigRole.vue';
export default {
  components:{
    DeletePoptip
  },
  data() {
    return {
      data: [
        {
          permissionName: "平台",
          expand: true,
          children: []
        }
      ],
      buttonProps: {
        type: "default",
        size: "small"
      },
      dragstartNode: "",
      dragstartData: ""
    };
  },

  mounted() {
    this.getList();
  },

  methods: {
    //获取数据
    getList(){
      let list = getListTree().then( (res) => {
          console.log(res);
          let list = res.list;
          console.log(list);
          list.forEach( item => {
            this.formatTreeData(item);
          })
          this.$set(this.data[0], 'children', list);
      });
    },

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
          },
          on: {
            dragstart: () => this.handleDragStart(root, node, data),
            dragover: () => this.handleDragOver(root, node, data),
            dragend: () => this.handleDragEnd(root, node, data),
            drop: () => this.handleDrop(root, node, data)
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
            h(
              "span",
              {
                style: {
                  display: data.isEdit ? "none" : "unset"
                }
              },
              `${data.permissionName}${ data.permissionUri ? ("(" + data.permissionUri + ")") : ""}`
            ),
            this.editRender(h, data, node, root)
          ]),
          h(
            "span",
            {
              style: {
                display: "inline-block",
                float: "right",
                marginRight: "32px"
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
              // h("Button", {
              //   props: Object.assign({}, this.buttonProps, {
              //     icon: "ios-remove",
              //     size: "small"
              //   }),
              //   on: {
              //     click: () => {
              //       this.remove(root, node, data);
              //     }
              //   }
              // })
              // renderDeletePop()
              h(
                DeletePoptip,
                {
                  props:{
                    content: "确定删除？",
                    size: "small"
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
      console.log(data);
      const children = data.children || [];
      children.push({
        permissionName: "",
        permissionType: 1,
        isAdd: true,
        permissionParent: data.permissionParent || 0,
        permissionUri: "",
        expand: true,
        isEdit: true
      });
      this.$set(data, "children", children);
    },
    remove(root, node, data) {
      const parentKey = root.find(el => el === node).parent;
      const parent = root.find(el => el.nodeKey === parentKey).node;
      const index = parent.children.indexOf(data);
      parent.children.splice(index, 1);
    },
    edit(root, node, data) {
      this.$set(data, "isEdit", true);
    },
    confirm(root, node, data, reviseData) {
      data.isEdit = false;
      data.permissionName = reviseData.reviseNameData;
      data.permissionUri = reviseData.reviseUriData;

      let params = {
        permissionName: data.permissionName,
        permissionUri: data.permissionUri,
        permissionParent: data.permissionParent,
        permissionType: 1,
        permissionSort: data.permissionSort || ""
      }

      if(data.isAdd){
        permissonAdd(params)
      } else {
        params.permissionId = data.id
        permissonUpdate(params)
      }
    },

    handleDragStart(root, node, data) {
      const event = window.event || arguments[0];
      this.dragstartNode = node;
      this.dragstartData = data;
    },
    handleDragOver(root, node, data) {
      const event = window.event || arguments[0];
      event.preventDefault();
    },
    handleDragEnd(root, node, data) {
      const event = window.event || arguments[0];
      event.preventDefault();
    },
    handleDrop(root, node, data) {
      event.preventDefault();
      if (node === this.dragstartNode) return;
      const target_parentKey = root.find(el => el === node).parent;
      const target_parent = root.find(el => el.nodeKey === target_parentKey)
        .node;
      const target_index = target_parent.children.indexOf(data);
      const target_children = data.children || [];
      target_children.push(this.dragstartData);
      this.$set(data, "children", target_children);
      const source_parentKey = root.find(el => el === this.dragstartNode)
        .parent;
      const source_parent = root.find(el => el.nodeKey === source_parentKey)
        .node;
      const source_index = source_parent.children.indexOf(this.dragstartData);
      source_parent.children.splice(source_index, 1);
      console.log(this.data, "data");
    },
    editRender(h, data, node, root) {
      let reviseNameData = data.permissionName;
      let reviseUriData = data.permissionUri;
      return h(
        "div",
        {
          style: {
            display: data.isEdit ? "inline-block" : "none",
            width: "300px"
          }
        },
        [
          h("Input", {
            props: {
              placeholder: "名称",
              type: "text",
              value: data.permissionName
            },
            style: {
              marginRight: "8px"
            },
            on: {
              "on-blur": val => {
                reviseNameData = val.target.value;
              }
            }
          }),
          h("Input", {
            props: {
              placeholder: "路径",
              type: "text",
              value: data.permissionUri
            },
            style: {
              marginRight: "8px"
            },
            on: {
              "on-blur": val => {
                reviseUriData = val.target.value;
              }
            }
          }),
          h("Button", {
            props: Object.assign({}, this.buttonProps, {
              icon: "ios-checkmark",
              type: "default"
            }),
            style: {
              marginRight: "8px"
            },
            on: {
              click: () => {
                this.confirm(root, node, data, {
                  reviseUriData,
                  reviseNameData
                });
              }
            }
          }),
          h("Button", {
            props: Object.assign({}, this.buttonProps, {
              icon: "ios-close",
              type: "default"
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
};
</script>
