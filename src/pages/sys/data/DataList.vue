<template>
  <div class="page-data-list">
    <table-page :columns="columns" :data="data" :total="total" @on-change-page="changePage" @on-change-pageSize="changePageSize">
      <div class="content-header" slot="form">
        <Input class="form-item" style="width:300px" v-model="searchKey" placeholder="关键字: 名称|文件|路径" />
        <DatePicker class="form-item" type="daterange" placeholder="选择查询时间范围" v-model="value" style="width: 200px"></DatePicker>
        <Button type="primary" @click="getDatasetList">查询</Button>
        <Button style="float: right" type="primary" icon="md-add" @click="jumpToPage">新建数据源</Button>
      </div>
    </table-page>
    <Modal
      v-model="isShowModal"
      title="修改"
      @on-ok="confirm"
      @on-cancel="isShowModal=false">
      <Form ref="formItem" :rules="ruleValidate" :model="formItem" :label-width="100">
        <FormItem label="文件夹名称" prop="folderName">
          <Input v-model="formItem.folderName" placeholder="名称"></Input>
        </FormItem>
        <FormItem label="文件夹描述" prop="folderDesc">
          <Input v-model="formItem.folderDesc" type="textarea" placeholder="描述"></Input>
        </FormItem>
        <FormItem label="归属组织" prop="organizations">
          <CheckboxGroup v-model="formItem.organizationIds">
            <Checkbox v-for="(item, index) in organizationsList" :label="item.id" :key="item.id">{{item.organizationName}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import TablePage from 'components/tablePage.vue';
import {
  getDatasetList,
  dataSetUpdate
} from 'api/data.js';
import {
  getUserInfo
} from 'api/user'
import {
  renderDeletePop
} from 'utils/tool.js'
export default {
  name: 'DataList',
  components: {
    TablePage
  },
  data () {
    return {
      isShowModal: false,
      ruleValidate: {
        folderName: [
          {
            required: true,
            message: '请输入文件名称'
          }
        ],
        folderDesc: [
          {
            required: true,
            message: '请输入文件描述'
          }
        ],
        organizations: [
          {
            required: true,
            message: '请选择归属组织'
          }
        ],
      },
      organizationsList: [],
      formItem: {},
      searchKey: '',
      value: '',
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          key: 'id',
          sortable: true,
          width: 100
        },
        {
          title: '文件夹名称',
          key: 'folderName'
        },
        {
          title: '数据集文件路径',
          key: 'dataPath'
        },
        {
          title: '上传人员',
          key: 'userName'
        },
        {
          title: '创建时间',
          key: '_createdTime'
        },{
          title: '操作',
          key: 'action',
          width: 260,
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
              }, '编辑'),
              renderDeletePop(h, '您确定要删除吗', {
                confirmFn: function(){
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
    this.getDatasetList()
    this.getUserInfo ()
  },
  methods: {
    // 获取用户详情,所属平台组织
    getUserInfo () {
      const userId = localStorage.getItem('userId')
      getUserInfo({
        userId
      }).then(res => {
        const {organizationList} = res
        Object.keys(organizationList).forEach(item => {
          this.organizationsList.push({
            id: parseInt(item),
            organizationName: organizationList[item].organizationName
          })
        })
      })
    },
    jumpToPage () {
      this.$router.push('/data/add')
    },
    confirm () {
      dataSetUpdate({
        dataSetId: this.formItem.id,
        folderName: this.formItem.folderName,
        folderDesc: this.formItem.folderName,
        organizationIds:this.formItem.organizationIds
      }).then(res => {
        this.data.forEach(item => {
          if (item.id === this.formItem.id) {
            item.folderName = this.formItem.folderName
          }
        })
        this.$Message.success('信息更新成功');
      })
    },
    getDatasetList () {
      getDatasetList({
        searchKey: this.searchKey,
        startTime: this.value.length !== 0 ? new Date(this.value[0]).Format('yyyy-MM-dd') : '',
        endTime: this.value.length !== 0 ? new Date(this.value[1]).Format('yyyy-MM-dd') : '',
        page: {
          pageNum: this.page.pageNum,
          pageSize: this.page.pageSize,
        }
      }).then(res => {
        const {organizationList,dataSetList,userList,count} = res
        this.data = dataSetList.map(item => {
          item.userName = userList[item.creatorId].userName
          item.dataPath = item.organizationIds ? item.organizationIds.map(item => {
            return organizationList[item].organizationName
          }).join(',') : '未分组'
          item._createdTime = new Date(item.createdTime).Format('yyyy-MM-dd')
          return item
        })
        this.total = count
      })
    },

    changePage (page) {
      this.page.pageNum = page
      this.getDatasetList()
    },

    changePageSize (pageSize) {
      this.page.pageSize = pageSize
      this.getDatasetList()
    },

    show(params) {
      console.log('params', params)
      this.$set(this, 'formItem', params.row);
      this.isShowModal = true
    },

    deleteData (params) {
      console.log('params', params)
    },
  }
}
</script>

<style lang="scss" scoped>
.page-data-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  .data-list-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    .content-header {
      overflow: hidden;
      margin-bottom: 20px;
      .form-item {
        margin-right: 12px;
      }
    }
    .content-middle {
      flex: 1;
      margin-bottom: 12px;
      &-btns {
        margin-bottom: 12px;
      }
      &-table {
        margin-bottom: 12px;
      }
    }
  }
}
</style>
