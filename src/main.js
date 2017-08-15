// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
// import Cart from '@/components/Cart'
// import axios from 'axios'


import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll) //使用插件
// Vue.use(axios)
import '../static/css/base'
import '../static/css/login'
import '../static/css/product'
import '../static/css/checkout'

Vue.config.productionTip = false


Vue.use(VueLazyLoad, {
  loading: '/static/img/ok-2.png'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})