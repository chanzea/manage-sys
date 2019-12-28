<template>
    <div>
        <!-- <div style="margin-bottom: 12px;">
            <Select class="form-item" v-model="markUserId" filterable style="width:160px" placeholder="根据标注人员搜索">
            <Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.userName }}</Option>
            </Select>
            <Select class="form-item" v-model="reviewUserId" filterable style="width:160px" placeholder="根据审核人员搜索">
            <Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.userName }}</Option>
            </Select>
            <Button type="primary" @click="getTaskSettleList">查询</Button>
            <Button type="primary" @click="resetFormData">重置</Button>
        </div> -->
        <div style="margin-bottom: 12px">
            <Table border :loading="loading" :columns="settleListColumns" :data="c_settleList"></Table>
        </div>
        <!-- <div class="content-middle-right-pages">
            <Page :total="total" size="small" show-elevator show-sizer @on-change="changePage" @on-page-size-change="changePageSize" />
        </div> -->
    </div>
</template>

<script>

import {
    getTaskSettleList
} from "@/api/task"

export default {
    props: [
        "taskId"
    ],
    data() {
        return {
            loading: true,
            settleList: [],
            userList: {},
            total: 0,
            markUserId: "",
            reviewUserId: "",
            settleListColumns: [
                {
                title: '用户名称',
                key: 'userName',
                },{
                title: '标注总积分',
                key: 'markPoint'
                },{
                title: '审核总积分',
                key: 'reviewPoint'
                },{
                title: '共计总积分',
                key: 'totalPoint'
                }
            ],
        }
    },

    created() {
        console.log("这里更新");
        this.getTaskSettleList();
    },

    destroyed() {
        console.log("这里触发destroy");
        this.settleList = [];
    },

    computed: {
        //计算
        c_settleList: function() {
            return this.settleList.map ( item => {
                return {
                    ...item,
                    userName: this.userList[item.userId].loginName,
                    totalPoint: item.markPoint + item.reviewPoint
                }
            })
        }
    },

    methods: {

        getTaskSettleList(){
            let params = {
                // page: this.page,
                taskId: this.taskId
            }
            getTaskSettleList(params).then( (res) => {
                this.loading = false;
                console.log(res);
                let {settleList, userList} = res;
                this.settleList = settleList || [];
                this.userList = userList || {}
            }).catch( err => {
                console.log("获取结算列表处理报错", err);
            })
        },

        //重置
        resetFormData() {

        },

        changePage(page) {
            this.page.pageNum = page
            this.getTaskSettleList()
        },
        changePageSize (pageSize) {
            this.page.pageSize = pageSize
            this.getTaskSettleList()
        },
    }
}
</script>

<style lang="scss">
    
</style>