<template>
  <div class="page-data-list">
    <table-page :columns="columns" :data="data" :total="total" @on-change-page="changePage" @on-change-pageSize="changePageSize">
      <div class="content-header" slot="form">
        <Input class="form-item" style="width:300px" v-model="searchKey" placeholder="关键字: 名称|文件|路径" />
        <DatePicker class="form-item" type="date" placeholder="选择查询时间范围" style="width: 200px"></DatePicker>
        <Button type="primary">查询</Button>
        <Button style="float: right" type="primary" icon="md-add">新建数据源</Button>
      </div>
    </table-page>
  </div>
</template>

<script>
import TablePage from 'components/tablePage.vue';
import {
  getDatasetList
} from 'api/data.js';
export default {
  name: 'DataList',
  components: {
    TablePage
  },
  data () {
    return {
      searchKey: '',
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
          key: 'createdTime'
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
                  marginRight: '12px'
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
                  marginRight: '12px'
                },
                on: {
                  click: () => {
                      this.show(params)
                  }
                }
              }, '编辑'),
              h({
                template: `<Poptip
                  popper-class="delete-pop"
                  confirm
                  placement="right"
                  @on-ok="deleteData"
                >
                  <div slot="title">
                    <span>你确定要删除吗</span>
                  </div>
                  <span class="opt-item">删除</span>
                </Poptip>`,
                methods: {
                  deleteData: () => {
                    this.deleteData(params)
                  },
                },
              }),
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
  },
  methods: {
    getDatasetList () {
      getDatasetList({
        searchKey: this.searchKey,
        searchType: '',
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

    deleteData (params) {
      console.log('params', params)
    }
  }
}
</script>

<style lang="scss">
  @import './../../../styles/pop.scss';
</style>

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
