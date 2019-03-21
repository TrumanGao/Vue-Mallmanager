// 入口文件：引入的东西在所有文件都可以用
// 主要作用：初始化vue实例并使用需要的插件
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/App'
import router from '@/router'

// 完整导入element-ui插件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 使用element-ui插件
Vue.use(ElementUI)

// 导入moment模块
import moment from 'moment'

// 导入自己开发的Http插件
import Http from '@/plugins/http'
// 使用自己开发的axios插件
Vue.use(Http)

// 导入外部样式文件
import '@/assets/index.css'

Vue.config.productionTip = false

// 导入自己封装的面包屑组件
import BreadCrumb from '@/components/breadcrumb.vue'
// 自定义全局组件（组件名，组件选项所在对象）
// 组件名应该由组件本身提供，在breadcrumb.vue里定义name
Vue.component(BreadCrumb.name, BreadCrumb);

// 自定义全局过滤器
Vue.filter('formatTime',(time)=>{
  return moment(time).format('YYYY-MM-DD')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // 注册根组件
  components: { App },
  template: '<App/>'
})
