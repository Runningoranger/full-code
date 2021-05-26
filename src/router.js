import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
const router = new VueRouter({
  routes: [
    {
      path: "/",
      redirect: "/home"
    },
    { 
      name: "home",
      path: "/home",
      component: () => import("./modules/home")
    },
    {
      name: "demo",
      path: "/demo",
      component: () => import("./modules/demo")
    }
  ]
});
export default router;