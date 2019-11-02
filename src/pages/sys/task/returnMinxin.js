const mixin = {
    data: function () {
        return {
            actionText: "返工审核",
            returnColumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '任务编号',
                    key: 'id',
                    sortable: true
                },
                {
                    title: '任务名称',
                    key: 'taskName',
                    render: (h, params) => {
                        // console.log("TCL: params", params)
                        // let arr = params.row.markUserIds.map( item => {
                        //     let loginName = this.userList[item] ? this.userList[item].loginName : "";
                        //     return loginName
                        // }); 
                        return h('div', this.taskList[params.row.taskId] ? this.taskList[params.row.taskId].taskName : "");
                    }
                },
                {
                    title: '标注人员',
                    key: 'markUserIds',
                    render: (h, params) => {
                        // console.log("TCL: params", params)
                        // let arr = params.row.markUserIds.map( item => {
                        //     let loginName = this.userList[item] ? this.userList[item].loginName : "";
                        //     return loginName
                        // }); 
                        return h('div', this.userList[params.row.markUserId] ? this.userList[params.row.markUserId].loginName : "");
                    }
                },
                {
                    title: '审核人员',
                    key: 'reviewUserIds',
                    render: (h, params) => {
                        // console.log("TCL: params", params)
                        // let arr = params.row.markUserIds.map( item => {
                        //     let loginName = this.userList[item] ? this.userList[item].loginName : "";
                        //     return loginName
                        // }); 
                        // return h('div', arr.join(','))
                        // return params.row.markUserIds
                        return h('div', this.userList[params.row.reviewUserId] ? this.userList[params.row.reviewUserId].loginName : "");
                    }
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
}
export default mixin;