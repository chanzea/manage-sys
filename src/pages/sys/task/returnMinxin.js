
import { TASKTYPE } from 'utils/tool.js'

const mixin = {
    data: function () {
        return {
            actionText: "返工审核",
            returnColumns: [
                {
                    title: '任务编号',
                    key: 'id',
                    sortable: true
                },
                {
                    title: '任务名称',
                    key: 'taskName',
                    render: (h, params) => {
                        return h('div', this.taskList[params.row.taskId] ? this.taskList[params.row.taskId].taskName : "");
                    }
                },
                {
                    title: '任务类型',
                    key: 'taskType',
                    render: (h, params) => {
                        let type;
                        if(this.taskList[params.row.taskId]) {
                            type = TASKTYPE[this.taskList[params.row.taskId].taskType].label;
                        } else {
                            type = ""
                        }
                        return h('div', type);
                    }
                },
                {
                    title: '标注人员',
                    key: 'markUserIds',
                    render: (h, params) => {
                        return h('div', this.userList[params.row.markUserId] ? this.userList[params.row.markUserId].loginName : "");
                    }
                },
                {
                    title: '审核人员',
                    key: 'reviewUserIds',
                    render: (h, params) => {
                        return h('div', this.userList[params.row.reviewUserId] ? this.userList[params.row.reviewUserId].loginName : "");
                    }
                },
                {
                    title: '获得积分',
                    key: this.$route.path.indexOf('auth') > 0 ? 'reviewPoint' : 'markPoint',
                    // render: (h, params) => {
                    //     return h('div', this.userList[params.row.reviewUserId] ? this.userList[params.row.reviewUserId].loginName : "");
                    // }
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
                                        this.actionCallFn(params)
                                    }
                                }
                            }, this.actionText || "审核")
                        ]);
                    }
                }
            ]
        }
    },

    created() {
        
    },

    computed: {
        computeCol: function(){
            let columns = [];
            if(this.currentTab == 'taskRework'){
                columns = this.returnColumns.filter( col => col.title != '获得积分')
            } else {
                columns = this.returnColumns
            }
            return columns
        }
    },
    

}
export default mixin;