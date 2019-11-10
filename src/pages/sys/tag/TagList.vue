<template>
  <div class="page-tag-list">
    <table-page :columns="columns" :data="data" :total="total" @on-change-page="changePage" @on-change-pageSize="changePageSize">
      <div class="content-header" slot="form">
        <Input class="form-item" style="width:300px" v-model="searchValue" placeholder="关键字: 名称|文件|路径" />
        <DatePicker class="form-item" type="date" placeholder="选择查询时间范围" style="width: 200px"></DatePicker>
        <Button type="primary">查询</Button>
        <Button style="float: right" type="primary" icon="md-add">新建数据源</Button>
      </div>
    </table-page>
  </div>
</template>

<script>

import {getTaskList, taskDownload} from '@/api/task'

import TablePage from 'components/tablePage.vue';

export default {
  name: 'DataList',
  components: {
    TablePage
  },
  data () {
    return {
      searchValue: '',
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '任务编号',
          key: 'id',
        },{
          title: '任务名称',
          key: 'taskName',
        },{
          title: '标注积分',
          key: 'markPoint',
        },{
          title: '审核积分',
          key: 'reviewPoint',
        },{
          title: '标注人员',
          key: 'markUser',
        },{
          title: '审核人员',
          key: 'reviewUser',
        },{
          title: '创建人',
          key: 'creator'
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
      data: [
        // {
        //   taskId: 'QD0001',
        //   taskName: '任务拉框',
        //   creator: '张三',
        //   createtime: '2019-09-15',
        //   count: '1000',
        //   mark: '500',
        //   verify: '800',
        //   status: '草稿'
        // },
      ]
    }
  },

  created(){
    this.getTaskList();
  },

  methods: {
    getTaskList: function() {
      let page = this.page;
      let params = { page, taskStatus: -3 }
      getTaskList(params).then( res => {
        let {dataSetList, taskList, userList} = res;
        this.data = taskList.map(item => {
          item.markUser = item.markUserIds ? item.markUserIds.map(id => {
            return userList[id].userName
          }).join(',') : '暂无标注人员';
          item.reviewUser = item.reviewUserIds ? item.reviewUserIds.map(id => {
            return userList[id].userName
          }).join(',') : '暂无审核人员';
          item.creator = userList[item.creatorId].userName
          return item
        })
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

    taskDownload (row) {
      // const params = new URLSearchParams();
      // params.append('taskId', row.id)
      const params = {
        taskId: row.id
      } 
      console.log('params', params)
      taskDownload(params).then(res => {
        console.log('res', res)
      })
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