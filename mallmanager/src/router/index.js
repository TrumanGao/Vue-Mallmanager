// 路由模块
import Vue from "vue";
import Router from "vue-router";

import Login from "@/components/login.vue";
import Home from "@/components/home.vue";
import Users from "@/components/users.vue"
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'
import Reports from '@/components/reports.vue'

// 按需引入message模块，用于全局前置路由守卫
import { Message } from "element-ui";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      name: "home",
      path: "/",
      component: Home,
      // children 属性定义在 Home 组件内部展示的组件
      children:[
        {
          name:"users",
          path:"/users",
          component: Users
        },{
          name:'rights',
          path:'/rights',
          component:Rights
        },{
          name:'roles',
          path:'/roles',
          component:Roles
        },{
          name:'reports,',
          path:'/reports',
          component:Reports
        }
      ]
    },
    {
      name: "login",
      path: "/login",
      component: Login
    },
  ]
});

router.beforeEach((to,from,next) => {
  if(to.name !== 'login'){
    if(!localStorage.getItem('token')){
      Message.warning('请先登录')
      next({
        name:'login'
      })
    }
  }
  next()
})

// router.beforeEach((to, from, next) => {
//   if (to.name === "login") {
//     next();
//   } else {
//     if (!localStorage.getItem("token")) {
//       next({
//         name: "login"
//       });
//     } else {
//       next();
//     }
//   }
// });

export default router;
