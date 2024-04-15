<!---学生个人成果占比饼状图---->
<template>
  <div  id="line"  style="width: 100%;height: 100%"></div>
</template>
<script setup>
import { ElMessage } from 'element-plus'
import *  as echarts from "echarts" ; //这段代码使用了 JavaScript 的模块导入（import）语法，导入了 echarts 库的全部内容，并将其赋值给一个名为 echarts 的变量
import {onMounted, ref} from "vue";
import api from "../../../api/index.js";
onMounted(()=>{
  getData()
})
const x=[]
const y=[]
const getData = () => {
  api.get('/personalStatusPieData').then((res) => {
    var i = 0;
    for (i; i < res.data.data.length; i++) {
      console.log(res.data.data[i].name);
      console.log(res.data.data[i].value);
      x.push(res.data.data[i].name);
      y.push(res.data.data[i].value);
    }
    console.log(x);
    console.log(y);
    // 进行其他操作，如调用函数或进行数据可视化等
    initChart(x,y);
    // ...
  });
};
const initChart=(x,y)=>{
  let chart = echarts.init(document.getElementById("line")); // setup中使用echarts
  // 把配置和数据放这里
  chart.setOption(  {
    xAxis: {
      type: 'category',
      data: x
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: y,
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }
    ]
  })
  //
  // chart.setOption({
  //   color: ['rgba(47,149,178,0.88)'],
  //
  //   grid:{
  //     bottom:30,
  //     left:50,
  //     right:90
  //     // right:60
  //   },
  //   title: {
  //     left:10,
  //     top:10,
  //     textStyle:{
  //       color: 'grey', // 标题颜色
  //       fontSize: 18, // 标题字体大小
  //       fontWeight: 'bold' // 标题字体粗细
  //     },
  //     text: '近七天每日登录量实时统计'
  //   },
  //   tooltip: {
  //     trigger: 'axis'
  //   },
  //   legend: {},
  //   toolbox: {
  //     show: true,
  //     top:30,
  //     right:60,
  //     feature: {
  //       restore: {},
  //       saveAsImage: {}
  //     }
  //   },
  //   xAxis: {
  //     type: 'category',
  //     boundaryGap: false,
  //     data: x
  //   },
  //   yAxis: {
  //     type: 'value',
  //     axisLabel: {
  //       formatter: '{value}次'
  //     }
  //   },
  //   series: [
  //     {
  //       name: '数量',
  //       type: 'line',
  //       smooth: false,
  //       data: y,
  //       markPoint: {
  //         data: [
  //           { type: 'max', name: 'Max' },
  //           { type: 'min', name: 'Min' }
  //         ]
  //       },
  //       markLine: {
  //         data: [{ type: 'average', name: 'Avg' }]
  //       }
  //     },
  //   ]
  // })
  window.onresize = function() {
    //自适应大小
    chart.resize();
  };

}

</script>

<style scoped>

</style>
