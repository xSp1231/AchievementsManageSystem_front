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

  chart.setOption({
    tooltip: {},
    title: {
      text: '个人填报成果占比',
      subtextStyle: {
        color: 'rgba(106,123,190,0.84)',
        fontSize: 12,
        fontWeight: 'normal'
      },
      textStyle: {
        color: '#9f9fa1',
        fontSize: 19,
        fontWeight: 'bold',
        align: 'left' // 设置标题居左对齐
      },
      left: 'center',
      top: 5
    },
    legend: {
      orient: 'vertical', // 将图例垂直排列
      left: 'left', // 将图例放置在左侧
      bottom: 6,
      itemGap: 58,// 设置图例项之间的间距
    },
    toolbox: {
      show: true,
      top: 20,
      right: 40,
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
          borderRadius: 6
        },
        label: {
          show: true,
          formatter: '{b}: {c} ({d}%)'
        },
        labelLine: {
          normal: {
            length1: 8, //第一条线
            length2: 8, //第二条线
            length3: 8, //第二条线
            length4: 8, //第二条线
            length5: 8, //第二条线
            lineStyle: {
              width: 1, // 线条的宽度
              color: "#000", //线的颜色设置， 如没有设置颜色则线条的颜色跟随饼状图的颜色
            }
          }
        },
        data: pData
      }
    ]
  });

  window.onresize = function () {
    chart.resize();
  };
};
</script>

<style scoped>

</style>
