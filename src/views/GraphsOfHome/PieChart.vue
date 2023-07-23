<template>
  <div ref="pie" style="width: 100%; height: 100%;"></div>
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
      this.myChart = echarts.init(this.$refs.pie);
      this.myChart.setOption({
        title:{
          text: '各项成果占比',
          top:15,
          left:30,
          textStyle:{
            color: 'grey', // 标题颜色
            fontSize: 18, // 标题字体大小
            fontWeight: 'bold' // 标题字体粗细
          }
        },
        legend: {
          orient: 'vertical', // 设置图例的排列方向为竖直方向
          left: 50, // 设置图例在容器右侧
          top: 60, // 设置图例在容器中央
        },
        toolbox: {
          top:15,
          right:50,
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: 'Nightingale Chart',
            type: 'pie',
            radius: [50, 130],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 10
            },
            data: [
              { value: 40, name: '科技论文' },
              { value: 38, name: '专著' },
              { value: 32, name: '专利软著' },
              { value: 30, name: '项目' },
              { value: 28, name: '奖励' },
            ]
          }
        ]

      });
    },
  }
};
</script>
