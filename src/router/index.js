import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// const Login = () => import('../components/Login')
const Login = () => import(/* webpackChunkName: "login-home-welcome" */ '../components/Login')

// const Home = () => import('../components/Home')
const Home = () => import(/* webpackChunkName: "login-home-welcome" */ '../components/Home')

// const Welcome = () => import('../components/Welcome')
const Welcome = () => import(/* webpackChunkName: "login-home-welcome" */ '../components/Welcome')

// const Users = () => import('../components/user/Users')
const Users = () => import(/* webpackChunkName: "Users-Rights-Roles" */ '../components/user/Users')

// const Rights = () => import('../components/power/Rights')
const Rights = () => import(/* webpackChunkName: "Users-Rights-Roles" */ '../components/power/Rights')

// const Roles = () => import('../components/power/Roles')
const Roles = () => import(/* webpackChunkName: "Users-Rights-Roles" */ '../components/power/Roles')

// const Cate = () => import('../components/goods/Cate')
const Cate = () => import(/* webpackChunkName: "Cate-Params" */ '../components/goods/Cate')

// const Params = () => import('../components/goods/Params')
const Params = () => import(/* webpackChunkName: "Cate-Params" */ '../components/goods/Params')

// const GoodsList = () => import('../components/goods/List')
const GoodsList = () => import(/* webpackChunkName: "GoodsList-Add" */ '../components/goods/List')

// const Add = () => import('../components/goods/Add')
const Add = () => import(/* webpackChunkName: "GoodsList-Add" */ '../components/goods/Add')

// const Order = () => import('../components/order/Order')
const Order = () => import(/* webpackChunkName: "Order-Report" */ '../components/order/Order')

// const Report = () => import('../components/report/Report')
const Report = () => import(/* webpackChunkName: "Order-Report" */ '../components/report/Report')

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: '登录',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: GoodsList },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的目录
  // from 从哪个路径来的
  // next 是一个函数 表示放行
  //      next()放行 next('/login') 强制跳转到 login
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
