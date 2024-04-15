<template>
  <div id="bar-chart" style="width: 100%; height: 100%;"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import { onMounted } from 'vue';
import api from '../../../api/index.js';

onMounted(() => {
  getData();
});

const getData = () => {
  api.get('/personalStatusPieData').then((res) => {
    const data = res.data.data.map((item) => ({
      name: item.name,
      value: item.value,
    }));
    initChart(data);
  });
};

const initChart = (data) => {
  const chart = echarts.init(document.getElementById('bar-chart'));

  chart.setOption({
    title: {
      text: '个人填报成果状态图',
      subtextStyle: {
        color: 'rgba(106, 123, 190, 0.84)',
        fontSize: 12,
        fontWeight: 'normal',
      },
      textStyle: {
        color: '#9f9fa1',
        fontSize: 19,
        fontWeight: 'bold',
        align: 'left', // 设置标题居左对齐
      },
      left: 'center',
      top: 5,
    },
    xAxis: {
      type: 'category',
      data: data.map((item) => item.name),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: data.map((item) => ({
          value: item.value,
          name: item.name,
          label: {
            show: true,
            position: 'top',
          },
        })),
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
  });

  window.onresize = function () {
    // 自适应大小
    chart.resize();
  };
};
</script>

<style scoped>

</style>
