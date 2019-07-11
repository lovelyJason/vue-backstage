import Vue from 'vue'
import Router from 'vue-router'
// 引入 userElement 组件

import Login from '../components/login/login.vue'
import Home from '../components/home/home.vue'
import Users from '../components/users/users.vue'
import Rights from '../components/rights/rights.vue'
import Role from '../components/rights/role.vue'
import Commoditylist from '../components/commodity/commoditylist.vue'
import Commoditycate from '../components/commodity/commoditycate.vue'
import Orderlist from '../components/order/orderlist.vue'
import GoodsAdd from '../components/goodsAdd/goodsAdd.vue'
import Reports from '../components/reports/reports.vue'
import Test from '../components/test/test.vue'

Vue.use(Router)
// 添加一个路由守卫
router.beforeEach((to, from, next) => {
  // 完成登录逻辑
  // 只要请求的路由不是 login 就需要进行登录验证
  if (to.path != '/login') {
    // 判断是否存在  token
    if (!window.localStorage.getItem('token')) {
      console.log(window.localStorage.getItem('token'))
      Message({
        type: 'error',
        message: '您还没有登录'
      })
      router.push('/login')
      return
    } 
  }
  next()
})

// export const constantRouterMap = [
//   { path:'/',component: Login }
// ]
// //异步挂载的路由
// export const asyncRouterMap = [
//   { path: '/text',component: Test,name:'权限测试',meta:{roles:['admin',super_editor]} }
// ]

export default new Router({
  routes: [
    { path: '/login', name: 'login', component: Login },// 登录的路由
    { path: '/', redirect:'/home' },
    {path:'/home',component: Home,
      children:[
        { path:'/users',name:'users',component:Users },
        { path: '/rights',component: Rights},
        { path: '/roles',component: Role },
        { path:'/goods',component: Commoditylist },
        { path: '/categories', component: Commoditycate },
        { path: '/orders',component: Orderlist },
        { path:'/goods/add',component: GoodsAdd },
        { path:'/reports',component:Reports }
      ]
    }
  ]

  // routes: constantRouterMap
})
