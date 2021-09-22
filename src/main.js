import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import store from "./store";
import ElementUI from 'element-ui';
import * as echarts from 'echarts';

import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/style/index.scss';
// ECharts
// 按需
// import * as echarts from 'echarts/core';
// import {
//   BarChart
// } from 'echarts/charts';
// import {
//   TitleComponent,
//   TooltipComponent,
//   GridComponent
// } from 'echarts/components';
// import {
//   CanvasRenderer
// } from 'echarts/renderers';
// // 注册必须的组件
// echarts.use(
//   [
//     TitleComponent, 
//     TooltipComponent, 
//     GridComponent, 
//     BarChart, 
//     CanvasRenderer
//   ]
// );

import directives from "@/directives";
import vuedraggable from 'vuedraggable';

Vue.use(echarts);
Vue.use(directives);
Vue.use(vuedraggable);
Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
