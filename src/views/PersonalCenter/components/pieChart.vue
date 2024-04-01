<!---学生个人成果占比饼状图---->
<template>
  <div  id="myEcharts"  style="width: 100%;height: 100%"></div>
</template>

<script setup>
import *  as echarts from "echarts" ; //这段代码使用了 JavaScript 的模块导入（import）语法，导入了 echarts 库的全部内容，并将其赋值给一个名为 echarts 的变量
import {onMounted} from "vue";
import api from "../../../api/index.js";
onMounted(()=>{
  getPersonalPieData();

})

let pieData=[]
const getPersonalPieData=()=>{
  api.get('/personalPieData').then(res=>{
    pieData=res.data.data;
    initChart(pieData)
  })
}

const initChart=(pData)=>{
  let chart = echarts.init(document.getElementById("myEcharts")); // setup中使用echarts
  // 把配置和数据放这里
  chart.setOption({
    tooltip: {
    },
    title: {
      text: '个人填报成果占比',
      subtext: '——所有状态(接收,审核，拒绝)',
      subtextStyle: {
        color:'rgba(106,123,190,0.84)',
        fontSize: 12,
        fontWeight: 'normal'
      }, // 副标题样式
      textStyle:{
        color:"#9f9fa1",
        fontSize: 19, // 字体大小
        fontWeight: 'bold', // 字体粗细
      },
      left: 'center', // 标题居中
      top:20
    },
    legend: {
      bottom:6
    },
    toolbox: {
      show: true,
      top:20,
      right:40,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    series: [
      {
        name: '个人成果数量统计',
        type: 'pie',
        radius: [65, 130],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8
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
