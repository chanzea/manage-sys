import { Main } from 'pages/layout/';

const Err404Page = resolve => require(['pages/error/404'], resolve);
const LoginPage = resolve => require(['pages/login'], resolve);
const IndexPage = resolve => require(['pages/index/index'], resolve);

// 用户管理
const UserPage = resolve => require(['pages/sys/user/user'], resolve);
const UserData = resolve => require(['pages/sys/user/UserData'], resolve);
const UserAdd = resolve => require(['pages/sys/user/UserAdd'], resolve);
const UserGroup = resolve => require(['pages/sys/user/UserGroup'], resolve);

// 源数据
const DataPage = resolve => require(['pages/sys/data/data'], resolve);
const DataList = resolve => require(['pages/sys/data/DataList'], resolve);
const DataAdd = resolve => require(['pages/sys/data/DataAdd'], resolve);

// 任务管理
const TaskPage = resolve => require(['pages/sys/task/task'], resolve);
const TaskList = resolve => require(['pages/sys/task/TaskList'], resolve);
const TaskItembank = resolve => require(['pages/sys/task/TaskItembank'], resolve);
const TaskAdd = resolve => require(['pages/sys/task/TaskAdd'], resolve);
const TaskMission = resolve => require(['pages/sys/task/TaskMission'], resolve);
// const TaskAuth = resolve => require(['pages/sys/task/TaskAuth'], resolve);
const TaskAuth = resolve => require(['pages/sys/task/TaskAuthMission'], resolve);
const TaskMonitor = resolve => require(['pages/sys/task/TaskMonitor'], resolve);
const TaskTemplate = resolve => require(['pages/sys/task/TaskTemplate'], resolve);
const Taskinfo = resolve => require(['pages/sys/task/Taskinfo'], resolve);
const TaskType = resolve => require(['pages/sys/task/taskType/TaskType'], resolve);
const AuthType = resolve => require(['pages/sys/task/authType/TaskType'], resolve);

// 标注数据管理
const TagPage = resolve => require(['pages/sys/tag/tag'], resolve);
const TagList = resolve => require(['pages/sys/tag/TagList'], resolve);
const TagAdd = resolve => require(['pages/sys/tag/TagAdd'], resolve);

// 系统配置
const ConfigPage = resolve => require(['pages/sys/config/config'], resolve);
const ConfigIndex = resolve => require(['pages/sys/config/ConfigIndex'], resolve);
const ConfigRole = resolve => require(['pages/sys/config/ConfigRole'], resolve);
const ConfigMenu = resolve => require(['pages/sys/config/ConfigMenu'], resolve);

//ps模块
const PsDraw = resolve => require(['pages/sys/ps/ps'], resolve);

// 消息中心
const MyselfPage = resolve => require(['pages/sys/myself/myself'], resolve);
const MessageCenter = resolve => require(['pages/sys/myself/MessageCenter'], resolve);
const UserInfoCenter = resolve => require(['pages/sys/myself/UserInfo'], resolve);

const routes = [
  {
    path: '/',
    component: Main,
    hidden: true,
    name: '首页',
    children: [
      { path: '/index', component: IndexPage, name: '首页' },
      { path: '/404', component: Err404Page, hidden: true, name: '找不到页面' },
      { 
        path: 'user',
        name: 'user',
        component: UserPage,
        meta: {
          title: '用户管理',
        },
        id: 1,
        redirect: '/user/data',
        children: [
          {
            path: 'data',
            component: UserData,
            name: 'userData',
            meta: {
              title: '用户数据',
            },
            id: 11,
          },{
            path: 'add',
            name: 'userAdd',
            component: UserAdd,
            meta: {
              title: '新增用户',
            },
            id: 12,
          },{
            path: 'group',
            name: 'userGroup',
            component: UserGroup,
            meta: {
              title: '组织管理',
            },
            id: 13,
          },
        ]
      },{
        path: 'data',
        name: 'data',
        component: DataPage,
        meta: {
          title: '源数据管理',
        },
        redirect: '/data/list',
        id: 2,
        children: [{
          path: 'list',
          name: 'dataList',
          component: DataList,
          meta: {
            title: '源数据',
          },
          id: 21,
        },{
          path: 'add',
          name: 'dataAdd',
          component: DataAdd,
          meta: {
            title: '上传源数据',
          },
          id: 22,
        }]
      },
      { 
        path: 'task',
        name: 'task',
        component: TaskPage,
        meta: {
          title: '任务管理',
        },
        redirect: '/task/list',
        id: 3,
        children: [
          {
            path: 'list',
            name: 'taskList',
            component: TaskList,
            meta: {
              title: '任务数据',
            },
            id: 31,
          },{
            path: 'itembank',
            name: 'taskItembank',
            component: TaskItembank,
            meta: {
              title: '题库列表',
            },
            id: 32,
          },{
            path: 'add',
            name: 'taskAdd',
            component: TaskAdd,
            meta: {
              title: '新建任务',
            },
            id: 33,
          },{
            path: 'update',
            name: 'taskUpdate',
            component: TaskAdd,
            id: 33,
            meta: {
              isUpdate: true,
              title: '查看任务'
            }
          },{
            path: 'mission',
            name: 'taskMission',
            component: TaskMission,
            meta: {
              title: '任务大厅',
            },
            id: 34,
          },{
            path: 'auth',
            name: 'taskAuth',
            component: TaskAuth,
            meta: {
              title: '审核大厅',
            },
            id: 35,
          },{
            path: 'monitor',
            name: 'taskMonitor',
            component: TaskMonitor,
            meta: {
              title: '任务监控',
            },
            id: 36,
          },{
            path: 'template',
            name: 'taskTemplate',
            component: TaskTemplate,
            meta: {
              title: '任务模版',
            },
            id: 37,
          },{
            path: 'info',
            name: 'taskInfo',
            component: Taskinfo,
            meta: {
              title: '任务详情'
            }
          },{
            path: 'type',
            name: 'taskType',
            component: TaskType,
            meta: {
              title: '任务分类'
            }
          },
          {
            path: 'review',
            name: 'taskReview',
            component: AuthType,
            meta: {
              title: "审核分类"
            }
          }
        ]
      },{
        path: 'tag',
        name: 'tag',
        component: TagPage,
        meta: {
          title: '标注数据管理',
        },
        redirect: '/tag/list',
        id: 4,
        children: [{
          path: 'list',
          name: 'tagList',
          component: TagList,
          meta: {
            title: '标注数据',
          },
          id: 41,
        },{
          path: 'add',
          name: 'tagAdd',
          component: TagAdd,
          meta: {
            title: '退回任务',
          },
          id: 42,
        }]
      },{
        path: 'config',
        name: 'config',
        component: ConfigPage,
        meta: {
          title: '源数据管理',
        },
        redirect: '/config/role',
        id: 5,
        children: [{
          path: 'index',
          name: 'configIndex',
          component: ConfigIndex,
          meta: {
            title: '系统配置',
          },
          id: 51,
        },{
          path: 'role',
          name: 'configRole',
          component: ConfigRole,
          meta: {
            title: '角色管理',
          },
          id: 52,
        },{
          path: 'menu',
          name: 'configMenu',
          component: ConfigMenu,
          meta: {
            title: '权限配置',
          },
          id: 53,
        },]
      },
      { 
        path: 'psdraw',
        name: 'psdraw',
        component: PsDraw,
        meta: {
          title: '标记',
        }
      },
      { 
        path: 'myself',
        name: 'myself',
        component: MyselfPage,
        meta: {
          title: '消息中心',
        },
        redirect: '/myself/message',
        children: [{
          path: 'message',
          name: 'myselfMessage',
          component: MessageCenter,
          meta: {
            title: '消息中心'
          }
        },{
          path: 'info',
          name: 'myselfInfo',
          component: UserInfoCenter,
          meta: {
            title: '个人中心'
          }
        }]
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: {
      title: '登录'
    }
  },
  { path: '*', redirect: '/404', hidden: true }
];

export default routes;
