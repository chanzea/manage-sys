<style scoped>
  .layout-header {
    height: 64px;
    background: #fff;
    box-shadow: 4px 4px 40px 0 rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .user-panel {
    margin-left: 10px;
    padding: 0px 10px;
  }

  .layout-header-left {
    display: flex;
    align-items: center;
  }

  .layout-header-right {
    float: right;
    display: block;
    padding-right: 36px;
    color: #5c6b77;
    padding-top: 1px;
    line-height: 60px;
  }

  .list-panel:hover {
    box-sizing: border-box;
    border-bottom: 2px solid #5c6b77;
  }

  .msg-list {
    padding: 0 10px;
  }

  .tabs {
    width: 340px;
  }

  .msg-tabpane {
    min-height: 260px;
  }

  .msg-tabpane .list {
    min-height: 260px;
  }

  .msg-tabpane ul {
    padding-bottom: 35px;
  }

  .msg-tabpane .more {
    position: absolute;
    bottom: 0px;
    height: 36px;
    width: 100%
  }

  .msg-tabpane ul li {
    height: 70px;
    padding: 5px;
    border-bottom: 1px solid #e9eaec;
    cursor: pointer;
    list-style-type: none;
  }

  .msg-tabpane ul li:hover {
    background-color: #ebf7ff
  }

  .msg-tabpane .empty {
    font-size: 14px;
    text-align: center;
    color: #80848f;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 40%;
  }

  .user-name {
    font-size: 14px;
    padding-left: 3px;
  }

  .backlog-content{
    color: #657180;font-size: 13px
  }

</style>
<style>
  .msg-list .ivu-poptip-body {
    padding: 0px;
  }

  .msg-list .ivu-tabs-nav-scroll {
    padding: 10px 50px 0px 50px;
  }

  .msg-list .ivu-tabs-bar {
    margin-bottom: 0px;
  }
</style>
<template>

  <div class="layout-header">

    <div class="layout-header-left">
      <div style="padding: 6px 15px;float: left;cursor: pointer;" @click="toggleClick">
        <Icon type="navicon" size="34"></Icon>
      </div>
      <div class="path">
        <!-- <Breadcrumb>
          <BreadcrumbItem v-for="(item, index) in currentMenu" :key="index" :to="item.url">
            {{item.title}}
          </BreadcrumbItem>
        </Breadcrumb> -->
      </div>
    </div>

    <div class="layout-header-right">
      <Dropdown class="user-panel list-panel" v-if="userData">
        <Avatar icon="person" size="small" style="background-color: #5c6b77"/>
        <span class="user-name">{{userData.userName}}</span>
        <DropdownMenu slot="list">
          <DropdownItem name="1" @click.native="messageCenter">消息中心</DropdownItem>
          <DropdownItem name="1" @click.native="userInfoCenter">用户中心</DropdownItem>
          <DropdownItem name="2" @click.native="logout">退出登录</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <!--弹出式编辑框-->
      <PopupEdit ref="tablePopupEdit"
                 :width="tableRefOptions.width"
                 :dynamic="tableRefOptions.dynamic"
                 :label-width="tableRefOptions.labelWidth">
      </PopupEdit>
    </div>
  </div>
</template>

<script>
  import DateUtils from 'utils/DateUtils';
  import config from '@/config';
  import Emitter from '@/utils/mixins/emitter';
  import {PopupEdit} from 'components/';
  import { mapGetters } from 'vuex'
  import {
    getUserInfo
  } from 'api/user'
  import {
    getMessage,
    saveMessage
  } from 'utils/tool.js'
  /**
   * 弹出式表单参数
   */
  const tableRefOptions = {
    width: 420,
    labelWidth: 80,
    dynamic: [
      [
        {name: 'userName', hidden: true},
        {name: 'pwd', type: 'text', span: 24, label: '旧密码', rules: {required: true}},
        {name: 'newpwd', type: 'text', span: 24, label: '新密码', rules: {required: true, group: 'pwd'}},
        {name: 'newpwd2', type: 'text', span: 24, label: '再次输入新密码', rules: {required: true, group: 'pwd'}}
      ]
    ]
  };
  export default {
    name: 'navbar',
    mixins: [Emitter],
    props: ['toggleClick'],
    data () {
      return {
        label1: (h) => {
          return h('div', [
            h('Badge', {
              props: {
                dot: this.$store.state.warning.length > 0
              }
            }, [h('span', '报 警')])
          ]);
        },
        label2: (h) => {
          return h('div', [
            h('Badge', {
              props: {
                dot: this.$store.state.backlog.length > 0
              }
            }, [h('span', '待 办')])
          ]);
        },
        label3: (h) => {
          return h('div', [
            h('Badge', {
              props: {
                dot: false
              }
            }, [h('span', '消 息')])
          ]);
        },
        userData: '',
        tableRefOptions,
        tabIndex: 0,
        DateUtils
      };
    },
    computed: {
      warningList () {
        return this.$store.state.warning;
      },
      backlogList () {
        if (this.$store.state.backlog != null) {
          return this.$store.state.backlog.slice(0, 4);
        }
        return this.$store.state.backlog;
      },
      isNewMsg () {
        if (this.$store.state.backlog.length > 0 || this.$store.state.warning.length > 0) {
          return true;
        } else {
          return false;
        }
      },
      // ...mapGetters([
      //   'currentMenu',
      // ])
    },
    created () {
      const userId = getMessage('userId')
      this.getUserInfo(userId)
    },
    methods: {
      getUserInfo(userId) {
        getUserInfo({
          userId
        }).then(res => {
          this.userData = res.user
          this.$store.dispatch('setUserData', res.user)
        })
      },
      gotoBacklog (item) {
        this.$router.push({
          path: '/work/backlog',
          name: '待办事项',
          params: {
            backLog: item
          }
        });
      },
      gotoWarning (warning) {

      },
      tabPopperShow () {
        if (this.$store.state.warning.length > 0) {
          this.tabIndex = 'name1';
        } else if (this.$store.state.backlog.length > 0) {
          this.tabIndex = 'name2';
        }
      },
      passwd () {
        this.$refs.tablePopupEdit.dynamic[0][0].value = this.userData.userName;
        this.$refs.tablePopupEdit.open({
          title: '修改密码',
          postUrl: '/sys/user/respwd'
        });
      },
      logout () {
        setTimeout(() => {
          saveMessage('tokenId', '')
          this.$router.push('/login')  
        }, 500);
      },
      messageCenter () {
        // this.$store.dispatch('setCurrentMenu', [{
        //   url: '/myself',
        //   title: '我的'
        // },{
        //   url: '/myself/message',
        //   title: '消息中心'
        // }])
        this.$router.push('/myself')
      },

      userInfoCenter () {
        // this.$store.dispatch('setCurrentMenu', [{
        //   url: '/myself',
        //   title: '我的'
        // },{
        //   url: '/myself/info',
        //   title: '个人中心'
        // }])
        this.$router.push('/myself/info')
      },
    },
    components: {
      tableRefOptions,
      PopupEdit
    }
  };
</script>


