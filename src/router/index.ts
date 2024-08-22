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
    children:[
      {
        path: "",
        redirect: "/Home/User", // 当访问 /Home 时，重定向到 /Home/User
      },
      {
        path: "User",
        name: "User",
        component: () => import("../view/User.vue"),
      },
      {
        path: "Item",
        name: "Item",
        component: () => import("../view/Item.vue"),
      },
      {
        path: "Cart",
        name: "Cart",
        component: () => import("../view/Cart.vue"),
      },
      {
        path: "Order",
        name: "Order",
        component: () => import("../view/Order.vue"),
      },
    ]
  }
];
//路由创建
const router = createRouter({
  history: createWebHistory(),
  routes,
})
//路由导出
export default router;
