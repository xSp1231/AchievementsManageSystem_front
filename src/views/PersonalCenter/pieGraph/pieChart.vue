<!---学生个人成果占比饼状图---->
<template>
  <div  id="myEcharts"  style="width: 100%;height: 100%"></div>
</template>

<script setup>
import *  as echarts from "echarts" ; //这段代码使用了 JavaScript 的模块导入（import）语法，导入了 echarts 库的全部内容，并将其赋值给一个名为 echarts 的变量
import {onMounted} from "vue";
onMounted(()=>{
  initChart()
})
const initChart=()=>{
  let chart = echarts.init(document.getElementById("myEcharts")); // setup中使用echarts
  // 把配置和数据放这里
  chart.setOption({

    title: {
      text: '个人成果占比',
      textStyle:{
        color:"grey",
        fontSize: 19, // 字体大小
        fontWeight: 'bold', // 字体粗细
      },
      left: 'center', // 标题居中
      top:10
    },
    legend: {
      bottom:6
    },
    toolbox: {
      show: true,
      top:10,
      right:20,
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
        radius: [65, 130],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8
        },
        data: [
          { value: 40, name: '科技论文成果' },
          { value: 38, name: '专著' },
          { value: 32, name: '专利软著' },
          { value: 30, name: '项目' },
          { value: 28, name: '奖励' },
        ]
      }
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
