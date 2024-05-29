<!---学生个人成果占比饼状图---->
<template>
  <div  id="intro"  style="width: 98%;height: 100%"></div>
</template>

<script setup>
import *  as echarts from "echarts" ; //这段代码使用了 JavaScript 的模块导入（import）语法，导入了 echarts 库的全部内容，并将其赋值给一个名为 echarts 的变量
import {onMounted, ref} from "vue";
import api from "../../../api/index.js";
onMounted(()=>{
  getTotalPieData()
})
let pieData=[]
const getTotalPieData=()=>{
  api.get('/totalStatusPieData').then(res=>{
    pieData=res.data.data;
    initChart(pieData)
  })
}
const initChart=(pData)=>{
  let chart = echarts.init(document.getElementById("intro")); // setup中使用echarts
  // 把配置和数据放这里
  chart.setOption({
    color: ['rgba(222,126,103,0.93)', 'rgba(120,232,139,0.93)', '#1694dc'],
    tooltip:{},
    // color:['#81d5d2', 'rgba(23,142,175,0.84)', '#deb797', '#50a6e0', '#0098ba'],
    title:{
      text: '成果审核状态占比',
      subtext: '——当前状态',
      subtextStyle: {
        color:'rgba(106,123,190,0.84)',
        fontSize: 12,
        fontWeight: 'normal'
      }, // 副标题样式
      top:25,
      left:30,
      textStyle:{
        color: 'grey', // 标题颜色
        fontSize: 18, // 标题字体大小
        fontWeight: 'bold' // 标题字体粗细
      }
    },

    legend: {
      //设置位置   文字在右，图例在左（图例纵向排列在图表右侧的时候）
      align:'left',
      x: 'left', // 'center' | 'left' | {number},
      y: 'center', // 'center' | 'bottom' | {number}
      icon: "circle",//图例样式
      orient: 'vertical',
      itemHeight: 17,
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
        type: 'pie',
        radius: [40, 120],
        center: ['50%', '50%'],
        roseType: 'area',

        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'outside', // 标签显示在扇区外部
          alignTo: 'none', // 不对齐扇区边界
          bleedMargin: 5 // 扇区与标签之间的间距
        },
        labelLine: {
          show: true,
          length: 20,
          lineStyle: {
            color: '#8ba4a4' // 指示线颜色
          }
        },
        data: pData
      }
    ]
  });

}

</script>

<style scoped>
#intro {
  background-color: #f8f5f5;
  border-radius: 7px;
  transition: all 0.3s ease;
}
#intro:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}
</style>





