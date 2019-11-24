// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import iView from 'iView';
import 'iview/dist/styles/iview.css';
import App from './App';
import routes from './routes';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import store from './vuex/store';
import VueI18n from 'vue-i18n';
import Locales from './locale';
import zhLocale from 'iview/src/locale/lang/zh-CN';
import enLocale from 'iview/src/locale/lang/en-US';
import './styles/index.scss';
import config from './config';
import 'vue-fabric/dist/vue-fabric.min.css';
import verify from './plugins/gVerify';
import { Fabric } from 'vue-fabric';
import {
  getMessage
} from './utils/tool.js'
Vue.use(Fabric);
// import './styles/index.less';
// import mock from './mock/index.js';

iView.Message.config({duration: 2});
// iView.Notice.config({top: 55});
Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueI18n);
Vue.use(iView);
Vue.use(verify);
window.copyIview = iView
const router = new VueRouter({
  mode: 'history',
  routes
});

router.beforeEach((to, from, next) => {
  const tokenId = getMessage('tokenId')
  if (!tokenId) {
    if (to.path !== '/login') {
      next('/login')
    } else {
      next()
    }
  } else {
    // 如果存在token，通过回退回到登录页，则阻止后退
    if (to.path === '/login') {
      next(false)
    } else {
      next()
    }
  }
});


router.afterEach(transition => {
  document.title = "Tagging - " + transition.name;
});


// 自动设置语言
const navLang = navigator.language
const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false
const lang = window.sessionStorage.getItem('language') || localLang || 'zh-CN'

Vue.config.lang = lang

// 多语言配置
const locales = Locales
const mergeZH = Object.assign(zhLocale, locales['zh-CN'])
const mergeEN = Object.assign(enLocale, locales['en-US'])
Vue.locale('zh-CN', mergeZH)
Vue.locale('en-US', mergeEN)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
