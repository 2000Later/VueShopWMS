import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入Element-UI
// import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入字体图标样式
import './assets/fonts/iconfont.css'

// 导入进度条的依赖包和样式
import Nprogress from 'nprogress'
// import 'nprogress/nprogress.css'

import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式
// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow theme
// import 'quill/dist/quill.bubble.css' // for bubble theme

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截器
axios.interceptors.request.use(config => {
  // request拦截器中展示进度条
  Nprogress.start()
  // 请求头对象，添加token验证的 Authorization 字段
  // 每次使用axios发送请求 都要携带token验证
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在response拦截器中，隐藏进度条 Nprogress.done()
axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

// 将富文本编辑器注册成为全局可用组件
Vue.use(VueQuillEditor)

Vue.filter('dataFormat', (value) => {
  const dt = new Date(value)
  const y = dt.getFullYear()
  // padStart(2, '0') 字符串长度不够两位 用 0 补齐
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
