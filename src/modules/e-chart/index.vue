<template>
  <ModuleLayout>
    <div class="e-chart">
      <ul class="e-chart-content">
        <li :id="chart.id" v-for="chart in chartList" :key="chart.id" class="chart-item"></li>
      </ul>
    </div>
  </ModuleLayout>
</template>

<script>
import ModuleLayout from "@/components/ModuleLayout";
import * as echarts from 'echarts';
export default {
  components: {
    ModuleLayout
  },
  data() {
    return {
      chartList: [
        {
          id: "chart-bar",
          option: {
            title: {
              text: ''
            },
            tooltip: {},
            xAxis: {
              data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
            },
            yAxis: {},
            series: [{
              name: '销量',
              type: 'bar',
              data: [5, 20, 36, 10, 10, 20]
            }]
          },
        },
        {
          id: "chart-pie",
          option: {
            series : [
              {
                name: '访问来源',
                type: 'pie',
                radius: '55%',
                data:[
                  {value:235, name:'视频广告'},
                  {value:274, name:'联盟广告'},
                  {value:310, name:'邮件营销'},
                  {value:335, name:'直接访问'},
                  {value:400, name:'搜索引擎'}
                ]
              }
            ]
          }
        }
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    })
  },
  methods: { 
    init() {
      this.chartList.forEach(item => {
        const chartDom = document.getElementById(item.id);
        const myChart = echarts.init(chartDom);
        myChart.setOption({ ...item.option });
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.e-chart {
  padding: 16px;
  &-content {
    display: flex;
    .chart-item {
      width: 350px;
      height: 350px;
      margin: 0 24px 24px 0;
    }
  }
}
</style>