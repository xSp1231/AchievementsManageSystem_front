<template>
  <div ref="line" style="width: 100%; height: 100%;"></div>
</template>
<script>
import * as echarts from 'echarts';
export default {
  data(){
    return{
    }
  },
  mounted() {
    this.draw()
  },
  methods: {
    draw() {
      this.myChart = echarts.init(this.$refs.line);
      this.myChart.setOption({
        title: {
          text: '系统近七天使用人数',
          top:15,
          left:10,
          textStyle:{
            color: 'grey', // 标题颜色
            fontSize: 18, // 标题字体大小
            fontWeight: 'bold' // 标题字体粗细
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {},
        toolbox: {
          top:15,
          right:30,
          show: true,
          feature: {
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}人'
          }
        },
        series: [
          {
            name: '每日流量',
            type: 'line',
            data: [10, 11, 13, 11, 12, 12, 9],
            markPoint: {
              data: [
                { type: 'max', name: 'Max' },
                { type: 'min', name: 'Min' }
              ]
            },
            markLine: {
              data: [{ type: 'average', name: 'Avg' }]
            }
          },
        ]
      });
    },
  }
};
</script>
