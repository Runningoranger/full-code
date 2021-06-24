import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// element Ui
import ElementUi from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUi);
// style
import '@/style/reset.scss';
// directive
import directives from "@/directives";
Vue.use(directives);
// plug
import vuedraggable from 'vuedraggable';
Vue.use(vuedraggable);

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
