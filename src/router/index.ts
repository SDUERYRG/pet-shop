// Composables
import { createRouter, createWebHistory } from "vue-router";
//路由表
const routes = [
  //当路由为空时，重定向到登录页面
  {
    path: "/",
    redirect: "/Login",
  },
  //登录页面
  {
    path: "/Login",
    name: "Login",
    component: () => import("../components/Login.vue"),
  },
  {
    path: "/Home",
    name: "Home",
    component: () => import("../components/Home.vue"),
  }
];
//路由创建
const router = createRouter({
  history: createWebHistory(),
  routes,
})
//路由导出
export default router;
