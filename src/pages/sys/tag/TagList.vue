<template>
  <div class="page-tag-list">
    <Spin size="large" fix v-if="fullLoading"></Spin>
    <table-page :columns="columns" :data="data" :total="total" @on-change-page="changePage" @on-change-pageSize="changePageSize">
      <div class="content-header" slot="form">
        <Input class="form-item" style="width:300px" v-model="searchKey" placeholder="关键字: 名称|文件|路径" />
        <DatePicker class="form-item" type="daterange" placeholder="选择查询时间范围" v-model="value" style="width: 200px"></DatePicker>
        <Button type="primary" @click="searchTaskList">查询</Button>
      </div>
    </table-page>
  </div>
</template>

<script>

import {getTaskList, taskDownload} from '@/api/task'

import TablePage from 'components/tablePage.vue';
import { 
  BASEURL
 } from "@/api/config.js";
export default {
  name: 'DataList',
  components: {
    TablePage
  },
  data () {
    return {
      fullLoading: false,
      searchKey: '',
      value: ['', ''],
      columns: [
        
        {
          title: '任务编号',
          key: 'id',
        },{
          title: '任务名称',
          key: 'taskName',
        },
        // {
        //   title: '标注积分',
        //   key: 'markPoint',
        // },{
        //   title: '审核积分',
        //   key: 'reviewPoint',
        // },{
        //   title: '标注人员',
        //   key: 'markUser',
        // },{
        //   title: '审核人员',
        //   key: 'reviewUser',
        // },
        {
          title: '创建人',
          key: 'creator'
        },
        {
          title: '创建时间',
          key: 'createdTime'
        },
        {
          title: '下载数据',
          key: 'action',
          width: 260,
          align: 'center',
          render: (h, {row}) => {
            return h('div', [
              h('span', {
                style: {
                  color: '#2d8cf0',
                  marginRight: '12px',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                      this.taskDownload(row)
                  }
                }
              }, '查看')
            ]);
          }
        }
      ],

      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: null,
      data: []
    }
  },

  created(){
    this.getTaskList();
  },

  methods: {
    getTaskList: function() {
      const params = {
        taskStatus: -3,
        startTime: this.value[0] !== '' ? new Date(this.value[0]).Format('yyyy-MM-dd') : '',
        endTime: this.value[1] !== '' ? new Date(this.value[1]).Format('yyyy-MM-dd') : '',
        searchKey: this.searchKey,
        page: {
          pageNum: this.page.pageNum,
          pageSize: this.page.pageSize,
        }
      }
      this.fullLoading = true
      getTaskList(params).then( res => {
        const {dataSetList, taskList, userList, count} = res;
        this.data = taskList.map(item => {
          // item.markUser = item.markUserIds ? item.markUserIds.map(id => {
          //   return userList[id].userName
          // }).join(',') : '暂无标注人员';
          // item.reviewUser = item.reviewUserIds ? item.reviewUserIds.map(id => {
          //   return userList[id].userName
          // }).join(',') : '暂无审核人员';
          item.creator = userList[item.creatorId].userName
          item.createdTime = new Date(dataSetList[item.dataSetId].createdTime).Format('yyyy-MM-dd hh:mm:ss')
          return item
        })
        this.total = count
        this.fullLoading = false
      }).catch(() => {
        this.fullLoading = false
      })
    },

    changePage (page) {
      this.page.pageNum = page
      this.getTaskList()
    },

    changePageSize (pageSize) {
      this.page.pageSize = pageSize
      this.getTaskList()
    },

    searchTaskList () {
      this.page.pageNum = 1
      this.getTaskList()
    },

    taskDownload (row) {
      // const params = {
      //   taskId: row.id
      // } 
      // console.log('params', params)
      // taskDownload(params).then(res => {
      //   console.log('res', res)
      // })
      window.open(`${BASEURL}/task/download?taskId=${row.id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.page-tag-list {
  .tag-list-content {
    .content-header {
      overflow: hidden;
      margin-bottom: 20px;
      .form-item {
        margin-right: 12px;
      }
    }
    .content-middle {
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