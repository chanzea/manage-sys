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
const PsDraw2 = resolve => require(['pages/sys/ps/ps1'], resolve);

// 消息中心
const MyselfPage = resolve => require(['pages/sys/myself/myself'], resolve);
const MessageCenter = resolve => require(['pages/sys/myself/MessageCenter'], resolve);
const UserInfoCenter = resolve => require(['pages/sys/myself/UserInfo'], resolve);


const TaskRemark = resolve => require(['pages/sys/task/taskType/TaskRemark.vue'], resolve);


const routes = [
  {
    path: '/',
    component: Main,
    hidden: true,
    // name: '首页',
    children: [
      { path: '/index', component: IndexPage, name: '首页' },
      { path: '/404', component: Err404Page, hidden: true, name: '找不到页面' },
      { 
        path: 'user',
        component: UserPage,
        name: '用户管理',
        id: 1,
        redirect: '/user/list',
        children: [
          {
            path: 'list',
            component: UserData,
            name: '用户数据',
            id: 11,
          },{
            path: 'create',
            component: UserAdd,
            name: '新增用户',
            id: 12,
          },{
            path: 'group',
            component: UserGroup,
            name: '组织管理',
            id: 13,
          },{
            path: 'data',
            component: UserData,
            name: '用户列表',
            id: 14,
          },
        ]
      },{
        path: 'dataSet',
        component: DataPage,
        name: '源数据管理',
        redirect: '/dataSet/list',
        id: 2,
        children: [{
          path: 'list',
          component: DataList,
          name: '源数据',
          id: 21,
        },{
          path: 'create',
          component: DataAdd,
          name: '上传源数据',
          id: 22,
        }]
      },
      { 
        path: 'task',
        component: TaskPage,
        name: '任务管理',
        redirect: '/task/list',
        id: 3,
        children: [
          {
            path: 'list',
            component: TaskList,
            name: '任务数据',
            id: 31,
          },{
            path: 'itembank',
            component: TaskItembank,
            name: '题库列表',
            id: 32,
          },{
            path: 'add',
            component: TaskAdd,
            name: '新建任务',
            id: 33,
          },{
            path: 'mission',
            component: TaskMission,
            name: '任务大厅',
            id: 34,
          },{
            path: 'auth',
            component: TaskAuth,
            name: '审核大厅',
            id: 35,
          },{
            path: 'monitor',
            component: TaskMonitor,
            name: '任务监控',
            id: 36,
          },{
            path: 'template',
            component: TaskTemplate,
            name: '任务模版',
            id: 37,
          },{
            path: 'info',
            component: Taskinfo,
            name: '任务详情'
          },{
            path: 'type',
            component: TaskType,
            name: '任务分类'
          },
          {
            path: 'review',
            component: AuthType,
            name: "审核分类"
          },
          { 
            path: 'psdrawtool',
            component: PsDraw2,
            name: '标记插件',
          },
          { 
            path: 'test', 
            component: TaskRemark 
          },
        ]
      },{
        path: 'tag',
        component: TagPage,
        name: '标注数据管理',
        redirect: '/tag/list',
        id: 4,
        children: [{
          path: 'list',
          component: TagList,
          name: '标注数据',
          id: 41,
        },{
          path: 'add',
          component: TagAdd,
          name: '退回任务',
          id: 42,
        }]
      },{
        path: 'config',
        component: ConfigPage,
        name: '系统主页',
        redirect: '/config/role',
        id: 5,
        children: [{
          path: 'index',
          component: ConfigIndex,
          name: '系统配置',
          id: 51,
        },{
          path: 'role',
          component: ConfigRole,
          name: '角色管理',
          id: 52,
        },{
          path: 'menu',
          component: ConfigMenu,
          name: '权限配置',
          id: 53,
        },]
      },
      { 
        path: 'psdraw',
        component: PsDraw,
        name: '标记',
      },
      { 
        path: 'myself',
        component: MyselfPage,
        name: '消息中心主页',
        redirect: '/myself/message',
        children: [{
          path: 'message',
          component: MessageCenter,
          name: '消息中心'
        },{
          path: 'info',
          component: UserInfoCenter,
          name: '个人中心'
        }]
      },
    ]
  },
  {
    path: '/login',
    name: '登录',
    component: LoginPage
  },
   
  { path: '*', redirect: '/404', hidden: true },
];

export default routes;
