<template>
  <div class="ease-in-out layout-menu-left" :class="{'layout-menu-left-small': menuSmall && !menuHover}"
       v-on:mouseleave="()=>{setMenuHover(false)}" v-on:mouseenter="()=>{setMenuHover(true)}">
    <Menu theme="dark" width="auto" :accordion="true" :active-name="activeName" :open-names="openNames" ref="menu">
      <div class="layout-logo-left"></div>
      <Submenu v-for="item in menuData" :name="item.id" :key="item.id">
        <template slot="title">
          <Icon :type="item.icon"></Icon>
          <span>{{item.title}}</span>
        </template>
        <div v-for="childrenItem in item.children" :key="childrenItem.id">
          <MenuItem :name="childrenItem.id" :key="childrenItem.id" @click.native="jumpToPage(item,childrenItem)">
            <span>{{childrenItem.title}}</span>
          </MenuItem>
        </div>
      </Submenu>
    </Menu>
  </div>
</template>


<script>

  import common from '@/utils/common';
  import {
    mapGetters
  } from 'vuex'
  import data from '@/mock/side.js'
  import {
    getMessage
  } from 'utils/tool.js'
  window.data = data
  export default {
    name: 'sidebar',
    props: ['menuSmall'],
    data () {
      return {
        menuHover: false,
        menuData: [],
        activeName: '',
        openNames: []
      };
    },
    created() {
      this.upDateSideBar()
      this.updatePath()
    },
    computed: {},
    methods: {
      upDateSideBar () {
        const permissionList = getMessage('permissionList');
        const pathArr = permissionList && JSON.parse(permissionList).map(item => {
          return item.uiPath
        })
        this.menuData = data.filter(item => {
          return permissionList.includes(item.url)
        });
      },
      // 获取当前路径信息
      updatePath () {
        const currentPath = this.getCurrentPath(window.routes[0].children, this.$route.path)
        this.$store.dispatch('setCurrentMenu', currentPath)
        this.activeName = currentPath[1].id
        this.openNames = [currentPath[0].id]
      },

      setMenuHover (hover) {
        if (this.menuSmall) {
          this.menuHover = hover;
        }
      },

      jumpToPage (item, subItem) {
        this.$router.push(subItem.url)
        this.$store.dispatch('setCurrentMenu', [item, subItem])
      },

      getCurrentPath(data, path) {
        const obj = data.find(item => {
          return path.indexOf(item.path) !== -1
        })
        console.log('obj', obj)
        const subObj = obj.children.filter(item => {
          return path.indexOf(item.path) !== -1
        })
        console.log('subObj', subObj)
        return [{
          url: obj.url,
          title: obj.name,
          id: obj.id
        }, {
          url: subObj.url,
          title: subObj[0].name,
          id: subObj[0].id
        }]
      }
    },
    watch: {
      $route () {
        this.updatePath()
      }
    },
    computed: {
      ...mapGetters([
        'currentMenu'
      ])
    },
    components: {}
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  $sidebarWidth: 200px;
  $sidebarSmallWidth: 42px;

  .layout-menu-left {
    background: #3e3e3e;
    height: 100vh;
    width: $sidebarWidth;
    position: absolute;
    z-index: 100;
    overflow-y: hidden;
    overflow-x: hidden;
  }

  .layout-menu-left:hover {
    overflow-y: auto;
  }

  .layout-menu-left-small {
    width: $sidebarSmallWidth;
  }

  .layout-menu-left-small .ivu-menu ul {
    display: none;
  }

  .layout-logo-left {
    height: 45px;
    margin: 20px;
    background: url("../../../static/assets/img/logo.png") no-repeat;
    background-size: contain;
  }

  .layout-menu-left-small .layout-logo-left {
    background-position-x: 0%;
    background-size: cover;
    height: 38px;
    margin: 23px 0px;
  }

  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened {
    background-color: #333 !important;
  }

  .layout-ceiling-main a {
    color: #9ba7b5;
  }

  .layout-menu-left-small .ivu-menu span {
    display: none !important;
  }

  .layout-menu-left .ivu-menu span, .layout-menu-left .ivu-menu-item {
    transition: opacity 2s linear;
    font-size: 12px;
  }

  .layout-menu-left .ivu-menu-item {
    font-size: 10px;
  }

  .layout-menu-left-small .ivu-menu .ivu-icon {
    font-size: 20px;
  }

  .layout-menu-left:hover {
    box-shadow: 0 0px 20px rgba(0, 0, 0, .5);
  }

  .layout-menu-left::-webkit-scrollbar {
    width: 6px;
  }

  .layout-menu-left::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.25);
  }
</style>

<style>
  .layout-menu-left-small .ivu-menu .ivu-menu-submenu-title-icon {
    display: none !important;
  }

  .layout-menu-left .ivu-menu-submenu-title {
    padding: 12px 16px;
    overflow: visible;
  }

  .layout-menu-left-small .ivu-menu-submenu-title {
    padding: 14px 13px !important;
  }

  .layout-menu-left-small .ivu-menu ul {
    display: none;
  }

  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened .ivu-menu-submenu-title {
    background: #3E3E3E !important;
  }

  .ivu-menu-dark {
    background: #3e3e3e !important;
  }

  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active:hover {
    background: #494949 !important;
  }

  .layout-menu-left .ivu-menu-submenu-title, .layout-menu-left .ivu-menu {
    width: 200px;
  }
</style>