import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        roles: [],
        routers: constantRouterMap,//可访问路由
        addRouters: []
    },
    getters: {
        roles: state => state.roles,
        permission_routers: state => state.routers,
        addRouters: state => state.addRouters
    },
    mutations: {
        SET_ROUTERS: (state, payload) => {
            state.addRouters = payload
            state.routers = constantRouterMap.concat(payload)
            console.log('state.routers', state.routers)
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        }
    },
    actions: {
        // 获取用户信息
        GetInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                getInfo(state.token).then(response => {
                    const data = response
                    if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                        commit('SET_ROLES', data.roles)
                    } else {
                        reject('getInfo: roles must be a non-null array !')
                    }

                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GenerateRoutes({ commit }, data) {
            return new Promise(resolve => {
                const { roles } = data
                let accessedRouters
                if (roles.indexOf('admin') >= 0) {
                    console.log('admin>=0')
                    accessedRouters = asyncRouterMap
                } else {
                    console.log('admin<0')
                    accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
                    // accessedRouters = ''
                    // accessedRouters = asyncRouterMap
                }
                console.log('accessedRouters', accessedRouters)
                commit('SET_ROUTERS', accessedRouters)
                resolve()
            })
        }
    }
})

export default store