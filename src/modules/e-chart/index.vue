<template>
  <ModuleLayout>
    <div class="e-chart">
      <ul class="e-chart-content">
        <li :id="key" v-for="(chart, key) in chartList" :key="key" class="chart-item"></li>
      </ul>
    </div>
  </ModuleLayout>
</template>

<script>
import ModuleLayout from "@/components/ModuleLayout";
import * as echarts from 'echarts';
import { chartList } from "./utils/examples";

export default {
  components: {
    ModuleLayout
  },
  data() {
    return {
      chartList: chartList
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    })
  },
  methods: { 
    init() {
      const charts = this.chartList;
      for (let key in charts) {
        const item = charts[key];
        const chartDom = document.getElementById(key);
        const myChart = echarts.init(chartDom);
        myChart.setOption({ ...item.option });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.e-chart {
  padding: 16px;
  &-content {
    display: flex;
    flex-wrap: wrap;
    .chart-item {
      width: 350px;
      height: 350px;
      margin: 0 24px 24px 0;
    }
  }
}
</style>