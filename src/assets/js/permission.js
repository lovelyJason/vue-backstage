import router from '../../router/index'
import store from './store/index'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.indexOf(role) >= 0)
    } else {
        return true//没有meta情况下 => 公用路由
    }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表数组
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
    const accessedRouters = asyncRouterMap.filter(route => {
        if (hasPermission(roles, route)) {
            if (route.children && route.children.length) {
                route.children = filterAsyncRouter(route.children, roles)
            }
            return true
        }
        return false
    })
    return accessedRouters
}

router.beforeEach((to, from, next) => {

    if (to.path === '/login') {
        next({ path: '/' })
        // NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
        if (store.getters.roles.length === 0) {
            store.dispatch('GetInfo').then(res => { // 拉取用户信息
                const roles = res.roles // note: roles must be a array! such as: ['editor','develop']
                store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
                    router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                    next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                })
            }).catch((err) => {
                store.dispatch('FedLogOut').then(() => {
                    Message.error(err || 'Verification failed, please login again')
                    next({ path: '/' })
                })
            })
        } else {
            // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
            if (hasPermission(store.getters.roles, to.meta.roles)) {
                next()//
            } else {
                next({ path: '/401', replace: true, query: { noGoBack: true } })
            }
        }
    }

})

