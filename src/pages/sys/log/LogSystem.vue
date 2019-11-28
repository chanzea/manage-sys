<template>
  <div class="page-data-list">
    <Spin size="large" fix v-if="fullLoading"></Spin>
    <table-page :columns="columns" :data="data" :total="total" @on-change-page="changePage" @on-change-pageSize="changePageSize">
      <div class="content-header" slot="form">
        <Input class="form-item" style="width:300px" v-model="operator" placeholder="操作人" />
        <!-- <Input class="form-item" style="width:300px" v-model="actionType" placeholder="操作类型" /> -->
        <Select class="form-item" v-model="actionType" placeholder="操作类型" style="width:200px">
            <Option v-for="item in actionTypeList" :value="item" :key="item">{{ item }}</Option>
        </Select>
        
        <DatePicker class="form-item" type="daterange" @on-change="handleDateRangeChange" placeholder="选择查询时间范围" v-model="value" style="width: 200px"></DatePicker>
        <Button type="primary" size="small" @click="searchDatasetList">查询</Button>
      </div>
    </table-page>
  </div>
</template>

<script>
var moment = require('moment') ;
import TablePage from 'components/tablePage.vue';
import { 
  BASEURL
 } from "@/api/config.js";
import {
  getSystemLogList,
  getListActionType
} from 'api/systemLog.js'
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
      operator: "",
      actionType: "",
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
      // organizationList: [
        
      // ],
      actionTypeList: [],//操作类型
      formItem: {},
      value: ['', ''],
      columns: [
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
                return h('Input', {
                    props: {
                        "value": params.row.operateData,
                        "type": "textarea",
                        // "disabled": true
                    }
                })
            }
        },
        {
          title: '请求接口',
          key: 'uri',
          sortable: true,
          width: 300
        },
        {
          title: '请求名称',
          key: 'operateName'
        },
        {
          title: '请求者',
          key: 'operatorId',
          render: (h, params) => {
              return h('div', this.userList[params.row.operatorId].loginName);
          }
        },
        {
          title: '请求数据',
          key: 'operateData'
        }
      ],
      data: [],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      userList: [],
      total: null,
    }
  },
  created () {
    this.value = [moment().subtract('days', 6).format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
    this.getListActionType();
    this.getSystemLogList();
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
    getSystemLogList() {
      this.fullLoading = true
      const params = {
        operator: this.operator,
        actionType: this.actionType,
        startTime: this.value[0] !== '' ? this.value[0]: '',
        endTime: this.value[1] !== '' ? this.value[1] : '',
        page: {
          pageNum: this.page.pageNum,
          pageSize: this.page.pageSize,
        }
      }
      getSystemLogList(params).then(res => {
        const {systemLogList,userList,count} = res;
        this.userList = userList;
        this.data = systemLogList.map(item => {
          item.createdTime = new Date(item.createdTime).Format('yyyy-MM-dd');

          return item
        })
        this.total = count
        this.fullLoading = false
      }).catch(() => {
        this.fullLoading = false
      })
    },

    //获取操作类型字典
    getListActionType() {
        getListActionType({}).then((res) => {
          let {code, data} = res;
          if(code == 0){
            this.actionTypeList = data;
          }
          
        })
    },

    handleDateRangeChange(value){
      this.value = value;
    },

    getDate(day){
      var today = new Date();  
      var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;          
      today.setTime(targetday_milliseconds); //注意，这行是关键代码
      var tYear = today.getFullYear();  
      var tMonth = today.getMonth();  
      var tDate = today.getDate();  
      tMonth = this.doHandleMonth(tMonth + 1);  
      tDate = this.doHandleMonth(tDate);  
      return tYear+"-"+tMonth+"-"+tDate;  
    },

    doHandleMonth(month){  

        var m = month;  
        if(month.toString().length == 1){  
          m = "0" + month;  
        }  
        return m;  
    },

    searchDatasetList () {
      this.page.pageNum = 1
      this.getSystemLogList()
    },

    changePage (page) {
      this.page.pageNum = page
      this.getSystemLogList()
    },

    changePageSize (pageSize) {
      this.page.pageSize = pageSize
      this.getSystemLogList()
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
      margin-bottom: 12px;
      margin-right: 20px;
      width: 120px;
      box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
      &.not-allow {
        cursor: not-allowed;
      }
      &.allow {
        cursor: pointer;
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
