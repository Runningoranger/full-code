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
    },
    {
      name: "e-chart",
      path: "/e-chart",
      component: () => import("./modules/e-chart"),
      meta: {
        crumbs: [
          {
            name: "e-chart",
            route: {
              name: "e-chart",
              path: "/e-chart"
            }
          }
        ]
      }
    }
  ]
});
export default router;