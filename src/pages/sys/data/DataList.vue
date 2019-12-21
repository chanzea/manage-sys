<template>
  <div class="page-data-list">
    <Spin size="large" fix v-if="fullLoading"></Spin>
    <table-page :columns="columns" :data="data" :total="total" @on-change-page="changePage" @on-change-pageSize="changePageSize">
      <div class="content-header" slot="form">
        <Input class="form-item" style="width:300px" v-model="searchKey" placeholder="关键字: 名称|文件|路径" />
        <DatePicker class="form-item" type="daterange" placeholder="选择查询时间范围" v-model="value" style="width: 200px"></DatePicker>
        <Button type="primary" @click="searchDatasetList">查询</Button>
        <Button type="primary" icon="md-add" @click="jumpToPage">新建数据源</Button>
      </div>
    </table-page>
    <Modal
      v-model="isShowModal"
      title="修改"
      @on-ok="confirm"
      @on-cancel="isShowModal=false">
      <Form ref="formItem" :rules="ruleValidate" :model="formItem" :label-width="100">
        <FormItem label="文件夹名称" prop="folderName">
          <Input v-model="formItem.folderName" placeholder="名称" :disabled="true"></Input>
        </FormItem>
        <FormItem label="文件夹描述" prop="folderDesc">
          <Input v-model="formItem.folderDesc" type="textarea" placeholder="描述"></Input>
        </FormItem>
        <FormItem label="归属组织" prop="organizations">
          <CheckboxGroup v-model="formItem.organizationIds">
            <Checkbox v-for="(item) in organizationList" :label="item.id" :key="item.id">{{item.organizationName}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="isShowFileModal"
      title="查看源文件"
      width="620">
      <div class="modal-content">
        <div class="modal-content-list" v-if="fileList.length !== 0">
          <div class="modal-content-list-item" :class="item.fileType === 1 ? 'not-allow' : 'allow'" :style="{
            'margin-bottom': item.fileType === 3 ? '40px' : '12px'
          }" v-for="(item, index) in fileList" :key="index" @click="listDataRecord(item.fileType, item.dataSetId, item.id)">
            <img v-lazy="item.fileType === 1 ? BASEURL + item.thumbnailUrl : src[item.fileType]" alt="">
            <span class="item-filename" v-if="item.fileType === 3">{{item.fileName}}</span>
          </div>
        </div>
        <div v-else style="text-align:center;padding: 8px 0;">
          暂无数据
        </div>
      </div>
      <div class="modal-footer" slot="footer">
        <Button type="primary" @click="isNext ? preView() : closeModal()">{{isNext ? '返回' : '关闭'}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import TablePage from 'components/tablePage.vue';
import { 
  BASEURL
 } from "@/api/config.js";
import {
  getDatasetList,
  dataSetUpdate,
  dataSetDelete,
  listDataRecord
} from 'api/data.js';
import {
  orgainzationList
} from 'api/organization.js'
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
      BASEURL,
      fullLoading: false,
      isShowModal: false,
      isShowFileModal: false,
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
        organizationIds: [
          {
            required: true,
            message: '请选择归属组织'
          }
        ],
      },
      organizationList: [],
      formItem: {},
      searchKey: '',
      value: ['', ''],
      columns: [
        
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
          key: 'createdTime'
        },
        {
          title: '文件大小',
          key: 'fileSizeFormat'
        },
        {
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
                      this.edit(params)
                  }
                }
              }, '编辑'),
              renderDeletePop(h, '您确定要删除吗', {
                confirmFn: () => {
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
        pageSize: 10
      },
      total: null,
      src: {
        2: require('../../../../static/assets/img/zip.png'),
        3: require('../../../../static/assets/img/folder.png'),
      },
      fileList: [],
      preFileList: [] //上一级的文件列表
    }
  },
  created () {
    this.getDatasetList()
    this.orgainzationList ()
  },
  computed: {
    isNext () {
      return this.preFileList.length > 1
    }
  },
  methods: {
    // 获取用户详情,所属平台组织
    orgainzationList () {
      orgainzationList({
        layerNumber: 2
      }).then(res => {
        const {organizationList} = res
        this.organizationList = organizationList.map(item => {
          item.id = parseInt(item.id)
          return item
        })
      })
    },
    jumpToPage () {
      this.$router.push('/dataSet/create')
    },
    getOrganizationName (organizationIds) {
      const organizationList = [...this.organizationList]
      const path = organizationList.filter(item => {
        return organizationIds.includes(item.id)
      }).map(item => {
        return item.organizationName
      }).join(',')
      return path
    },
    confirm () {
      dataSetUpdate({
        dataSetId: this.formItem.id,
        folderName: this.formItem.folderName,
        folderDesc: this.formItem.folderDesc,
        organizationIds:this.formItem.organizationIds
      }).then(res => {
        this.data.forEach(item => {
          if (item.id === this.formItem.id) {
            item.folderName = this.formItem.folderName
            item.folderDesc = this.formItem.folderDesc
            item.dataPath = this.getOrganizationName(this.formItem.organizationIds)
          }
        })
        this.$Message.success('信息更新成功');
      })
    },
    getDatasetList () {
      this.fullLoading = true
      const params = {
        searchKey: this.searchKey,
        startTime: this.value[0] !== '' ? new Date(this.value[0]).Format('yyyy-MM-dd') : '',
        endTime: this.value[1] !== '' ? new Date(this.value[1]).Format('yyyy-MM-dd') : '',
        page: {
          pageNum: this.page.pageNum,
          pageSize: this.page.pageSize,
        }
      }
      getDatasetList(params).then(res => {
        const {organizationList,dataSetList,userList,count} = res
        this.data = dataSetList.map(item => {
          item.userName = userList[item.creatorId].userName
          item.dataPath = item.organizationIds ? item.organizationIds.map(item => {
            return organizationList[item].organizationName
          }).join(',') : '未分组'
          item.createdTime = new Date(item.createdTime).Format('yyyy-MM-dd hh:mm:ss')
          return item
        })
        this.total = count
        this.fullLoading = false
      }).catch(() => {
        this.fullLoading = false
      })
    },

    searchDatasetList () {
      this.page.pageNum = 1
      this.getDatasetList()
    },

    changePage (page) {
      this.page.pageNum = page
      this.getDatasetList()
    },

    changePageSize (pageSize) {
      this.page.pageSize = pageSize
      this.getDatasetList()
    },

    edit(params) {
      this.$set(this, 'formItem', params.row);
      this.isShowModal = true
    },

    show(params, folderId = '') {
      this.preFileList = [] //清空
      this.listDataRecord('a' ,params.row.id) //只要不为1就行
    },
    
    listDataRecord (fileType, dataSetId, folderId = '') {
      if (fileType === 1) {
        return
      }
      listDataRecord({
        dataSetId,
        folderId
      }).then(res => {
        this.fileList = res.list
        this.preFileList.push(this.fileList)
        this.isShowFileModal = true
      })
    },

    deleteData (params) {
      dataSetDelete({
        dataSetId: params.row.id
      }).then(() => {
        this.$Message.success('删除成功');
        this.getDatasetList()
      })
    },

    preView () {
      let len = this.preFileList.length
      this.$set(this, 'fileList', this.preFileList[len - 2])
      this.preFileList.pop()
    },

    closeModal () {
      this.isShowFileModal = false
    }
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
.modal-content {
  &-list {
    max-height: 400px;
    overflow: auto;
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    &-item {
      position: relative;
      margin-right: 20px;
      width: 120px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
      img {
        max-width: 100%;
        max-height: 100%;
        display: block;
      }
      &.not-allow {
        cursor: not-allowed;
      }
      &.allow {
        cursor: pointer;
      }
      .item-filename {
        position: absolute;
        bottom: -30px;
        left: 0;
        right: 0;
        margin: auto;
        color: #333;
        display: inline-block;
        text-align: center;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.ivu-modal-body {
  display: flex;
  justify-content: center;
}
</style>
