<template>
  <div class="page-config-role">
    <div class="config-role-content">
      <div class="content-header">
        <Input placeholder="输入角色名称">
          <Button slot="append" icon="md-add">新增角色</Button>
        </Input>
      </div>
      <div class="content-middle">
        <Table :columns="columns" :data="data"></Table>
      </div>
      <Modal v-model="isShowModal" fullscreen :title="modalContent.title">
        <!-- <div>{{modalContent.content}}</div> -->
        <div>
          <Button slot="append" icon="md-add" @click="getdd">test</Button>
          <Tree :data="treeData" ref="tree" :render="renderContent" show-checkbox></Tree>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import { getRoleList, getRoleListPermission } from "api/role.js";

import {
  getListTree
} from "api/sysConfig";

export default {
  name: "ConfigRole",
  data() {
    return {
      isShowModal: false,
      data: [],
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "角色",
          key: "roleName"
        },
        {
          title: "权限",
          key: "permission",
          width: 400,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    color: "#2d8cf0",
                    marginRight: "12px",
                    cursor: "pointer"
                  },
                  on: {
                    click: () => {
                      this.getRoleListPermission(params.row);
                    }
                  }
                },
                "配置权限"
              )
            ]);
          }
        },
        {
          title: "操作",
          key: "action",
          width: 200,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    color: "#2d8cf0",
                    marginRight: "12px",
                    cursor: "pointer"
                  },
                  on: {
                    click: () => {
                      this.delete(params.row);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      modalContent: {
        title: "",
        content: null
      },
      //树形
      treeData: [
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
  created() {
    this.getRoleList();
    // this.getList();
  },
  methods: {
    getdd(){
      let checkedNodes = this.$refs.tree.getCheckedNodes();
      let checkedId = checkedNodes.map( item => item.id);
      console.log(checkedId);
    },
    delete(row) {
      console.log("row", row);
    },
    async getRoleListPermission(row) {
      console.log("row", row);
      this.modalContent.title = row.roleName;
      this.isShowModal = true;

      let dataList = await Promise.all([getListTree(),getRoleListPermission()]);

      let treeList = dataList[0].list;

      treeList.forEach(item => {
        this.formatTreeData(item);
      });
      this.$set(this.treeData[0], "children", treeList);
      let permissionList = dataList[1].list;

      console.log("permissionList", permissionList);
      console.log("treeList", "treeList");

    },
    getRoleList() {
      getRoleList().then(res => {
        console.log("res", res);
        const { list } = res;
        this.data = list;
      });
    },

    // async getList() {
    //   let list = getListTree().then(res => {
    //     console.log(res);
    //     let list = res.list;
    //     console.log(list);
    //     list.forEach(item => {
    //       this.formatTreeData(item);
    //     });
    //     this.$set(this.treeData[0], "children", list);
    //   });

    //   let permissionList = await Promise.all([getListTree(),getRoleList()]);
      
    //   console.log("permissionList" ,permissionList)

    // },

    formatTreeData(item) {
      if (!item.childs) {
        item.isEdit = false;
        item.expand = true;
        
        return [item];
      }
      item.checked = true;
      item.children = item.childs;
      item.expand = !!item.childs;
      item.childs.forEach(subItem => {
        this.formatTreeData(subItem);
      });
      return [item];
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
            h(
              "span",
              {
                style: {
                  display: "unset"
                }
              },
              `${data.permissionName}${
                data.permissionUri ? "(" + data.permissionUri + ")" : ""
              }`
            )
          ])
        ]
      );
    },
  }
};
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