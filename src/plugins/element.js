import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'
// 1、不是为了vue写的插件(插件内要处理)不支持Vue.use()加载方式
// 2、非vue官方库不支持new Vue()方式
// 3、每一个vue组件都是Vue的实例，所以组件内this可以拿到Vue.prototype上添加的属性和方法。

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 挂载到vue的全局对象中
Vue.prototype.$message = Message
