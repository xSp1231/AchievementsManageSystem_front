<!---学生个人成果占比饼状图---->
<template>
  <div  id="pie"  style="width: 100%;height: 100%"></div>
</template>

<script setup>
import *  as echarts from "echarts" ; //这段代码使用了 JavaScript 的模块导入（import）语法，导入了 echarts 库的全部内容，并将其赋值给一个名为 echarts 的变量
import {onMounted, ref} from "vue";
import api from "../../api/index.js";
onMounted(()=>{
  getTotalPieData()

})
let pieData=[]
const getTotalPieData=()=>{
  api.get('/totalPieData').then(res=>{
    pieData=res.data.data;
    initChart(pieData)
  })
}
const initChart=(pData)=>{
  let chart = echarts.init(document.getElementById("pie")); // setup中使用echarts
  // 把配置和数据放这里
  chart.setOption({
    tooltip:{},
    // color:['#81d5d2', 'rgba(23,142,175,0.84)', '#deb797', '#50a6e0', '#0098ba'],
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
        name: '总体成果数量统计',
        type: 'pie',
        radius: [50, 130],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 10
        },
        data: pData
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





