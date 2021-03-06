export default {
    "code": "SUCCESS",
    "message": "success",
    "data": {
        "list": [
            {
                "id": 19,
                "permissionType": 1,
                "permissionName": "用户管理",
                "permissionParent": 0,
                "permissionUri": "",
                "sort": 1,
                "children": [
                    {
                        "id": 20,
                        "permissionType": 1,
                        "permissionName": "用户数据",
                        "permissionParent": 19,
                        "permissionUri": "/user/list",
                        "sort": 1,
                        "children": []
                    },
                    {
                        "id": 22,
                        "permissionType": 1,
                        "permissionName": "组织管理",
                        "permissionParent": 19,
                        "permissionUri": "/organization/list",
                        "sort": 2,
                        "children": []
                    },
                    {
                        "id": 21,
                        "permissionType": 1,
                        "permissionName": "新增用户",
                        "permissionParent": 19,
                        "permissionUri": "/user/create",
                        "sort": 2,
                        "children": []
                    }
                ]
            },
            {
                "id": 23,
                "permissionType": 1,
                "permissionName": "源数据管理",
                "permissionParent": 0,
                "permissionUri": "",
                "sort": 1,
                "children": [
                    {
                        "id": 24,
                        "permissionType": 1,
                        "permissionName": "源数据",
                        "permissionParent": 23,
                        "permissionUri": "/dataSet/list",
                        "sort": 1,
                        "children": []
                    },
                    {
                        "id": 25,
                        "permissionType": 1,
                        "permissionName": "上传数据",
                        "permissionParent": 23,
                        "permissionUri": "/dataSet/create",
                        "sort": 2,
                        "children": []
                    }
                ]
            },
            {
                "id": 26,
                "permissionType": 1,
                "permissionName": "任务管理",
                "permissionParent": 0,
                "permissionUri": "/task/list",
                "sort": 3,
                "children": [
                    {
                        "id": 27,
                        "permissionType": 1,
                        "permissionName": "任务数据",
                        "permissionParent": 26,
                        "permissionUri": "/task/list",
                        "sort": 1,
                        "children": []
                    },
                    {
                        "id": 28,
                        "permissionType": 1,
                        "permissionName": "题库列表",
                        "permissionParent": 26,
                        "permissionUri": "/taskItem/list",
                        "sort": 2,
                        "children": []
                    },
                    {
                        "id": 29,
                        "permissionType": 1,
                        "permissionName": "新建任务",
                        "permissionParent": 26,
                        "permissionUri": "/task/add",
                        "sort": 2,
                        "children": []
                    },
                    {
                        "id": 30,
                        "permissionType": 1,
                        "permissionName": "任务大厅",
                        "permissionParent": 26,
                        "permissionUri": "/task/list",
                        "sort": 4,
                        "children": []
                    },
                    {
                        "id": 31,
                        "permissionType": 1,
                        "permissionName": "审核大厅",
                        "permissionParent": 26,
                        "permissionUri": "/task/list",
                        "sort": 5,
                        "children": []
                    },
                    {
                        "id": 32,
                        "permissionType": 1,
                        "permissionName": "任务监控",
                        "permissionParent": 26,
                        "permissionUri": "/task/monitor",
                        "sort": 6,
                        "children": []
                    },
                    {
                        "id": 33,
                        "permissionType": 1,
                        "permissionName": "任务模版",
                        "permissionParent": 26,
                        "permissionUri": "/task/template",
                        "sort": 7,
                        "children": []
                    }
                ]
            },
            {
                "id": 34,
                "permissionType": 1,
                "permissionName": "标准数据管理",
                "permissionParent": 0,
                "permissionUri": "/taskData/list",
                "sort": 4,
                "children": [
                    {
                        "id": 35,
                        "permissionType": 1,
                        "permissionName": "标注数据",
                        "permissionParent": 34,
                        "permissionUri": "/taskData/list",
                        "sort": 1,
                        "children": []
                    },
                    {
                        "id": 36,
                        "permissionType": 1,
                        "permissionName": "退回任务",
                        "permissionParent": 34,
                        "permissionUri": "",
                        "sort": 2,
                        "children": []
                    }
                ]
            },
            {
                "id": 37,
                "permissionType": 1,
                "permissionName": "系统配置",
                "permissionParent": 0,
                "permissionUri": "",
                "sort": 5,
                "children": [
                    {
                        "id": 38,
                        "permissionType": 1,
                        "permissionName": "系统设置",
                        "permissionParent": 37,
                        "permissionUri": "",
                        "sort": 1,
                        "children": []
                    },
                    {
                        "id": 40,
                        "permissionType": 1,
                        "permissionName": "权限管理",
                        "permissionParent": 37,
                        "permissionUri": "/permission/list",
                        "sort": 2,
                        "children": []
                    },
                    {
                        "id": 39,
                        "permissionType": 1,
                        "permissionName": "角色管理",
                        "permissionParent": 37,
                        "permissionUri": "/role/list",
                        "sort": 2,
                        "children": []
                    }
                ]
            },
            {
                "id": 41,
                "permissionType": 1,
                "permissionName": "统计分析",
                "permissionParent": 0,
                "permissionUri": "",
                "sort": 9,
                "children": []
            },
            {
                "id": 43,
                "permissionType": 1,
                "permissionName": "系统日志",
                "permissionParent": 0,
                "permissionUri": "",
                "sort": 10,
                "children": []
            }
        ]
    }
}