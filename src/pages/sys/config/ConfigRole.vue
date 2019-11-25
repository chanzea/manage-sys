<template>
  <div class="page-config-role">
    <div class="config-role-content">
      <div class="content-header">
        <Button icon="md-add" @click="createRoleAction">新增角色</Button>
      </div>
      <div class="content-middle">
        <Table :columns="columns" :data="data"></Table>
      </div>
      <Modal v-model="isShowModal" fullscreen :title="modalContent.title">
        <!-- <div>{{modalContent.content}}</div> -->
        <div>
          <!-- <Button slot="append" icon="md-add" @click="getCheckedNodesIds">test</Button> -->
          <Tree :data="treeData" ref="tree" :render="renderContent" show-checkbox></Tree>
        </div>
        <div slot="footer">
          <Button type="text" size="large" @click="isShowModal=false">取消</Button>
          <Button type="primary" size="large" @click="updatePermission">确定</Button>
        </div>
      </Modal>

      <Modal v-model="createVisiAble" title="创建角色" width="300">
        <Form ref="createRoleData" :model="createRoleData" :rules="ruleInline">
          <FormItem prop="roleName" label="角色名称：">
            <Input type="text" v-model="createRoleData.roleName" placeholder="角色名称">
              <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" size="large" @click="createVisiAble=false">取消</Button>
          <Button type="primary" size="large" @click="handleCreateRole">确定</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import {
  getRoleList,
  getRoleListPermission,
  roleAddPermission,
  delRole,
  addRole
} from "api/role.js";

import { getListTree } from "api/sysConfig";

export default {
  name: "ConfigRole",
  data() {
    return {
      isShowModal: false,
      createVisiAble: false, //是否显示创建角色的弹窗
      permissionList: [], //权限id
      data: [],
      currentUpdateRole: null,
      createRoleData: {
        roleName: ""
      },
      ruleInline: {
        roleName: [
          { required: true, message: "角色名称不能为空！！", triggle: "blur" }
        ]
      },
      columns: [
        
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
          id: 0,
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
    getCheckedNodesIds() {
      let checkedNodes = this.$refs.tree.getCheckedNodes();
      let checkedId = checkedNodes.map(item => item.id);
      console.log(checkedId);
      return checkedId;
    },
    //删除角色
    delete(row) {
      delRole({ roleId: row.id }).then(() => {
        this.$Message.info("删除成功");
        this.getRoleList();
      });
    },
    async getRoleListPermission(row) {
      this.currentUpdateRole = row;
      this.modalContent.title = row.roleName;
      this.isShowModal = true;

      let dataList = await Promise.all([
        getListTree(),
        getRoleListPermission({ roleId: row.id })
      ]);
      let treeList = dataList[0].list;
      // console.log(treeList);
      let permissionList = (this.permissionList = dataList[1].list);
      console.log(this.permissionList, treeList);
      treeList.forEach(item => {
        this.formatTreeData(item);
      });

      this.$nextTick(() => {
        this.$set(this.treeData[0], "children", treeList);
      });
    },

    //新建角色弹窗
    createRoleAction() {
      this.createVisiAble = true;
    },

    //handleCreateRole确定提交创建
    handleCreateRole() {
      this.$refs["createRoleData"].validate(valid => {
        console.log(valid);
        if (valid) {
          addRole({ roleName: this.createRoleData.roleName })
            .then(res => {
              console.log(res);
              this.$Message.success("创建成功");
              this.createVisiAble = false;
              this.getRoleList();
            })
            .catch(() => {
              this.$Message.error("创建失败");
            });
        }
      });
    },

    getRoleList() {
      getRoleList().then(res => {
        console.log("res", res);
        const { list } = res;
        this.data = list;
      });
    },

    //更新权限
    updatePermission() {
      roleAddPermission({
        roleId: this.currentUpdateRole.id,
        permissionIds: this.getCheckedNodesIds()
      }).then(() => {
        
        this.$Message.success("修改权限成功");
        this.isShowModal = false;
        this.$set(this.treeData[0], "children", []);
      }).catch( () => {
        this.$Message.error("修改权限失败");
      });
    },

    formatTreeData(item) {
      if (!item.children) {
        item.isEdit = false;
        item.expand = true;
        item.checked = this.permissionList.includes(item.id); //在权限数组里就true
        return [item];
      }

      item.checked = this.permissionList.includes(item.id); //在权限数组里就true

      item.expand = !!item.children;
      item.children.forEach(subItem => {
        this.formatTreeData(subItem);
      });
      // return [item];
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
    }
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