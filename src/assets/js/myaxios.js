// 自己封装的一个 axios 插件
// 导入 axios
import axios from 'axios'
// 创建插件对象
var myaxios = {}
// 添加 install 方法
myaxios.install = function(Vue) {
    // 统一设置请求的 API
    axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
    // axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
    axios.interceptors.request.use(config => {
        // console.log(config)
        config.headers.common['Authorization'] = localStorage.getItem('token')
        return config
    })
    // 给 Vue 实例对象添加方法
    Vue.prototype.$http = axios
}
// 将对象暴露出去
export default myaxios