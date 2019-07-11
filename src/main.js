// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
// 引入 element-ui
import ElementUI from 'element-ui'
import ElTreeGrid from'element-tree-grid'
import axios from './assets/js/myaxios.js'
import moment from './assets/js/mymoment.js'
// 富文本编辑框
import VueQuillEditor from 'vue-quill-editor' 

// 引入 element ui 的样式
import '../node_modules/element-ui/lib/theme-chalk/index.css'
import './assets/css/index.css'
//富文本编辑框样式
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//仓库
// import store from './assets/js/store/index'


//注册axios插件'
Vue.use(axios)
Vue.use(ElementUI)
Vue.use(VueQuillEditor, /* { default global options } */)
// 引入element-tree-grid
Vue.component(ElTreeGrid.name,ElTreeGrid)
Vue.use(moment)

new Vue({
  el: '#app',
  router,
  // store,
  components: { App },
  template: '<App/>' // 将 App 渲染到视图容器中
})
