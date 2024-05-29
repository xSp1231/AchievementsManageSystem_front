<template>
    <div id="bar" style="width: 100%;height: 100%"></div>
</template>

<script setup>
import  'echarts/theme/vintage'
import { ElMessage } from 'element-plus'
import *  as echarts from "echarts" ; //这段代码使用了 JavaScript 的模块导入（import）语法，导入了 echarts 库的全部内容，并将其赋值给一个名为 echarts 的变量
import {onMounted} from "vue";
import api from "../../../api/index.js";
import {color} from "echarts";
onMounted(()=>{
  getData()
})
let x=[]
let y=[]
const getData=()=>{
  api.get("/gradesNumData").then(res=>{
    if(res.data.flag===true){
      console.log("近七天登录数据 is ",res);
      let data=res.data.data
      initBar(data);
    }
    else{
      ElMessage.error('登录次数数据获取失效')
    }
  })

}
const initBar=(datalist)=>{
  let chart = echarts.init(document.getElementById("bar")); // setup中使用echarts
  // 把配置和数据放这里

  chart.setOption({
    // color:['#0c8cd3'],
    grid:{
      bottom:30,
      left:80,
      right:90
      // right:60
    },
    xAxis: {
      type: 'category',
      data: ['大一', '大二', '大三', '大四', '其他']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: datalist,
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }
    ],
    title: {
      left:10,
      top:10,
      textStyle:{
        color: 'grey', // 标题颜色
        fontSize: 18, // 标题字体大小
        fontWeight: 'bold' // 标题字体粗细
      },
      text: '各年级学生占比(大一~大四)'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {},
    toolbox: {
      show: true,
      top:30,
      right:60,
      feature: {
        restore: {},
        saveAsImage: {}
      }
    },
  })
}



</script>

<style scoped>
#bar {
  margin-left: 2%;
  background-color: #f8f5f5;
  border-radius: 7px;
  transition: all 0.3s ease;
}
#bar:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}
</style>
