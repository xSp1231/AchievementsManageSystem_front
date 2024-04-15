<template>
  <div id="myEcharts" style="width: 100%; height: 100%;"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import { onMounted } from 'vue';
import api from '../../../api/index.js';

onMounted(() => {
  getPersonalPieData();
});

let pieData = [];

const getPersonalPieData = () => {
  api.get('/personalPieData').then((res) => {
    pieData = res.data.data;
    initChart(pieData);
  });
};

const initChart = (pData) => {
  let chart = echarts.init(document.getElementById('myEcharts'));

  option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: pData
      }
    ]
  };

  window.onresize = function () {
    chart.resize();
  };
};
</script>

<style scoped>

</style>
