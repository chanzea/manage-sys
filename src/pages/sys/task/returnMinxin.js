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
                    key: 'taskName'
                },
                {
                    title: '标注人员',
                    key: 'markUserIds',
                    render: (h, params) => {
                        // console.log("TCL: params", params)
                        let arr = params.row.markUserIds.map( item => {
                            let loginName = this.userList[item] ? this.userList[item].loginName : "";
                            return loginName
                        }); 
                        return h('div', arr.join());
                    }
                },
                {
                    title: '审核人员',
                    key: 'reviewUserIds'
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