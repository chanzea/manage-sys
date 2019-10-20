export default [
    {
        "id": 1,
        "name": "用户管理",
        "icon": "",
        "url": "/user",
        "children": [
            {
                "id": 11,
                "name": "用户数据",
                "icon": "gear-b",
                "url": "/user/data",
                "parentId": 1,
                "title": "用户数据"
            },
            {
                "id": 12,
                "name": "新增用户",
                "icon": "gear-b",
                "url": "/user/add",
                "parentId": 1,
                "title": "新增用户"
            },
            {
                "id": 13,
                "name": "组织管理",
                "icon": "gear-b",
                "url": "/user/group",
                "parentId": 1,
                "title": "组织管理"
            }
        ],
        "title": "用户管理"
    },
    {
        "id": 2,
        "name": "源数据管理",
        "icon": "",
        "url": "/data",
        "children": [
            {
                "id": 21,
                "name": "源数据",
                "icon": "help-buoy",
                "url": "/data/list",
                "parentId": 2,
                "title": "源数据"
            },
            {
                "id": 22,
                "name": "上传源数据",
                "icon": "help-buoy",
                "url": "/data/add",
                "parentId": 2,
                "title": "上传源数据"
            }
        ],
        "title": "源数据管理"
    },
    {
        "id": 3,
        "name": "任务管理",
        "icon": "",
        "url": "/task",
        "children": [
            {
                "id": 31,
                "name": "任务数据",
                "icon": "",
                "url": "/task/list",
                "parentId": 3,
                "title": "任务数据"
            },
            {
                "id": 32,
                "name": "题库列表",
                "icon": "",
                "url": "/task/itembank",
                "parentId": 3,
                "title": "题库列表"
            },
            {
                "id": 33,
                "name": "新建任务",
                "icon": "",
                "url": "/task/add",
                "parentId": 3,
                "title": "新建任务"
            },
            {
                "id": 34,
                "name": "任务大厅",
                "icon": "",
                "url": "/task/mission",
                "parentId": 3,
                "title": "任务大厅"
            },
            {
                "id": 35,
                "name": "审核大厅",
                "icon": "",
                "url": "/task/auth",
                "parentId": 3,
                "title": "审核大厅"
            },
            {
                "id": 36,
                "name": "任务监控",
                "icon": "",
                "url": "/task/monitor",
                "parentId": 3,
                "title": "任务监控"
            },
            {
                "id": 37,
                "name": "任务模版",
                "icon": "",
                "url": "/task/template",
                "parentId": 3,
                "title": "任务模版"
            }
        ],
        "title": "任务管理"
    },
    {
        "id": 4,
        "name": "标注数据管理",
        "icon": "",
        "url": "/tag",
        "children": [
            {
                "id": 41,
                "name": "标注数据",
                "icon": "",
                "url": "/tag/list",
                "parentId": 4,
                "title": "标注数据"
            },
            {
                "id": 42,
                "name": "退回任务",
                "icon": "",
                "url": "/tag/add",
                "parentId": 4,
                "title": "退回任务"
            }
        ],
        "title": "标注数据管理"
    },
    {
        "id": 5,
        "name": "系统配置",
        "icon": "",
        "url": "/config",
        "children": [
            // {
            //     "id": 51,
            //     "name": "系统设置",
            //     "icon": "",
            //     "url": "/config/index",
            //     "parentId": 5,
            //     "title": "系统设置"
            // },
            {
                "id": 52,
                "name": "角色管理",
                "icon": "",
                "url": "/config/role",
                "parentId": 5,
                "title": "角色管理"
            },
            {
                "id": 53,
                "name": "权限配置",
                "icon": "",
                "url": "/config/menu",
                "parentId": 5,
                "title": "权限配置"
            }
        ],
        "title": "系统配置"
    },
    {
        "id": 6,
        "name": "统计分析",
        "icon": "",
        "url": "/example/dataSelect",
        "title": "统计分析"
    },
    {
        "id": 7,
        "name": "系统日志",
        "url": "/sysLog",
        "title": "系统日志"
    },
    {
        "id": 8,
        "name": "画图工具",
        "url": "/psdraw",
        "children": [
            {
                "id": 100,
                "name": "画图",
                "icon": "",
                "url": "/psdraw",
                "parentId": 8,
                "title": "画图"
            }
        ],
        "title": "画图工具"
    }
]
