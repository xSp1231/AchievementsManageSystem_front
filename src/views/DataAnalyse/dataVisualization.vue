<template>
<h1> 数据分析页面</h1>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import *  as echarts from "echarts" ; //这段代码使用了 JavaScript 的模块导入（import）语法，导入了 echarts 库的全部内容，并将其赋值给一个名为 echarts 的变量
import {onMounted} from "vue";
import api from "../../api/index.js";
onMounted(()=>{
  getPieData();
  getStatusPieData();
})
const getPieData = () => {
  api.get('/personalPieData').then((res) => {
     console.log("获取到的个人信息是"+res);
     console.log(res);
  })
}
const getStatusPieData = () => {
  api.get('/personalStatusPieData').then((res) => {
    console.log("获取到的个人状态信息是"+res);
    console.log(res);
  })
}
</script>

<style scoped>

</style>
