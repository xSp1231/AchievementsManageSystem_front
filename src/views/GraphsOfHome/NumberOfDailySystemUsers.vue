<!---学生个人成果占比饼状图---->
<template>
  <div  id="line"  style="width: 100%;height: 100%"></div>
</template>

<script setup>
import *  as echarts from "echarts" ; //这段代码使用了 JavaScript 的模块导入（import）语法，导入了 echarts 库的全部内容，并将其赋值给一个名为 echarts 的变量
import {onMounted} from "vue";
onMounted(()=>{
  initChart()
})
const initChart=()=>{
  let chart = echarts.init(document.getElementById("line")); // setup中使用echarts
  // 把配置和数据放这里
  chart.setOption({
    color:['rgb(21,181,201)'],
    title: {
      text: '系统近七天活跃度',
      textStyle:{
        color: 'grey', // 标题颜色-->
        fontSize: 17, // 标题字体大小-->
        fontWeight: 'bold' // 标题字体粗细-->
         }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      }
    },
    legend: {
      data: ['活跃度']
    },
    toolbox: {
      right:'8%',
      feature: {
        saveAsImage: {}
      }
    },
    grid: {
      left: '3%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '活跃度',
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 0
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.6,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(29,103,239)'
            },
            {
              offset: 1,
              color: 'rgb(51,117,164)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        data: [140, 232, 101, 264, 90, 340, 250]
      },
    ]
  });
  window.onresize = function() {
    //自适应大小
    chart.resize();
  };
}

</script>

<style scoped>

</style>




















<!--<template>-->
<!--  <div ref="line" style="width: 100%; height: 100%;"></div>-->
<!--</template>-->
<!--<script>-->
<!--import * as echarts from 'echarts';-->
<!--export default {-->
<!--  data(){-->
<!--    return{-->
<!--    }-->
<!--  },-->
<!--  mounted() {-->
<!--    this.draw()-->
<!--  },-->
<!--  methods: {-->

<!--    draw() {-->
<!--      this.myChart = echarts.init(this.$refs.line);-->
<!--      this.myChart.setOption({-->
<!--        grid: {-->
<!--          left: 60, // 将图表向右移动50像素-->
<!--          right: 70,-->
<!--          bottom: 30,-->
<!--          top:80-->
<!--        },-->
<!--        title: {-->
<!--          text: '系统近七天使用人数',-->
<!--          top:15,-->
<!--          left:10,-->
<!--          textStyle:{-->
<!--            color: 'grey', // 标题颜色-->
<!--            fontSize: 18, // 标题字体大小-->
<!--            fontWeight: 'bold' // 标题字体粗细-->
<!--          }-->
<!--        },-->
<!--        tooltip: {-->
<!--          trigger: 'axis'-->
<!--        },-->
<!--        legend: {},-->
<!--        toolbox: {-->
<!--          top:15,-->
<!--          right:50,-->
<!--          show: true,-->
<!--          feature: {-->
<!--            magicType: { type: ['line', 'bar'] },-->
<!--            restore: {},-->
<!--            saveAsImage: {}-->
<!--          }-->
<!--        },-->
<!--        xAxis: {-->
<!--          type: 'category',-->
<!--          boundaryGap: false,-->
<!--          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']-->
<!--        },-->
<!--        yAxis: {-->
<!--          type: 'value',-->
<!--          axisLabel: {-->
<!--            formatter: '{value}人'-->
<!--          }-->
<!--        },-->
<!--        series: [-->
<!--          {-->
<!--            name: '每日流量',-->
<!--            type: 'line',-->
<!--            data: [10, 11, 13, 11, 12, 12, 9],-->
<!--            markPoint: {-->
<!--              data: [-->
<!--                { type: 'max', name: 'Max' },-->
<!--                { type: 'min', name: 'Min' }-->
<!--              ]-->
<!--            },-->
<!--            markLine: {-->
<!--              data: [{ type: 'average', name: 'Avg' }]-->
<!--            }-->
<!--          },-->
<!--        ]-->
<!--      });-->
<!--      //  随外层div的大小变化自适应-->



<!--    },-->
<!--  }-->
<!--};-->
<!--</script>-->
