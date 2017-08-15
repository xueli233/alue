import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/view/GoodsList'
import Cart from '@/components/Cart'

Vue.use(Router)

export default new Router({
  // 不显示'#'号
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: GoodsList
    },
    {
      path: '/cart',
      name: 'cart',
      component: Cart
    }
  ]
})
