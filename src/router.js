import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/login'
import Home from './components/home'
import Welcome from './components/welcome'
import Users from './components/user/users'
import Rights from './components/power/rights'
import Roles from './components/power/roles'
import Categories from './components/goods/categories'
import Params from './components/goods/params'
import GoodsList from './components/goods/list'
import GoodsAdd from './components/goods/add'
import Order from './components/order/order'

Vue.use(Router)

const router = new Router({
    routes: [
        {path: '/', redirect: '/login'},
        {path: '/login', component: Login},
        {
            path: '/home', component: Home,
            redirect: '/welcome',
            children:
                [
                    {path: '/welcome', component: Welcome},
                    {path: '/users', component: Users},
                    {path: '/rights', component: Rights},
                    {path: '/roles', component: Roles},
                    {path: '/categories', component: Categories},
                    {path: '/params', component: Params},
                    {path: '/goods', component: GoodsList},
                    {path: '/goods/add', component: GoodsAdd},
                    {path: '/orders', component: Order},
                ]
        },
    ]
})
router.beforeEach((to, from, next) => {
    // to 将要访问的路径
    // from 代表从哪个路径跳转而来
    // next 是一个函数 表示放行
    // next() 放行  强制跳转
    if (to.path === '/login') return next();
    const token = window.sessionStorage.getItem('token');
    if (!token) return next('/login');
    next()
})

export default router


