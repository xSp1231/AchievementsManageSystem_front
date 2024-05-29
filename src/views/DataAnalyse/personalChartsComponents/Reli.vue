<template>
  <div id="chart-container" style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; margin-top: 20px;">
    <div id="myReLi" style="width: 86%; height: 90%;"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
import { onMounted } from 'vue';
import api from '../../../api/index.js';

onMounted(() => {
  initChart(); // 初始化热力图
  getLoginMessage(); // 获取数据并填充到热力图中
});

const x = [];
const y = [];

const getLoginMessage = () => {
  api.get('/getLoginMessage').then((res) => {
    for (let i = 0; i < res.data.data.length; i++) {
      x.push(res.data.data[i].loginTime);
      y.push(res.data.data[i].num);
    }
    updateChart(); // 数据更新后更新热力图
  });
};

const getVirtualData = (year) => {
  const date = +echarts.time.parse(year + '-01-01');
  const end = +echarts.time.parse(+year + 1 + '-01-01');
  const dayTime = 3600 * 24 * 1000;
  const data = [];
  for (let time = date; time < end; time += dayTime) {
    data.push([
      echarts.time.format(time, '{yyyy}-{MM}-{dd}', false),
      Math.floor(Math.random() * 100)
    ]);
  }
  return data;
};

let chart = null;

const initChart = () => {
  chart = echarts.init(document.getElementById('myReLi'));

  chart.setOption({
    title: {
      left:500,
      top:10,
      textStyle:{
        color: 'grey', // 标题颜色
        fontSize: 18, // 标题字体大小
        fontWeight: 'bold' // 标题字体粗细
      },
      text: '个人登录量统计'
    },
    tooltip: {
      position: 'top',
      formatter: function (p) {
        const format = echarts.time.format(p.data[0], '{yyyy}-{MM}-{dd}', false);
        return "时间:"+format + ': ' + "登录"+p.data[1]+"次";
      }
    },
    visualMap: {
      min: 10,
      max: 0,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      color: ['#339f18', '#FFFFFF']
    },
    calendar: [
      {
        orient: 'horizontal',
        range: new Date().getFullYear(),
      }
    ],
    series: [
      {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        calendarIndex: 0,
        data: getVirtualData(new Date().getFullYear()) // 将初始数据替换为虚拟数据
      }
    ]
  });

  window.onresize = function () {
    chart.resize();
  };
};

const updateChart = () => {
  const data = []; // 创建空数组用于存储二维数据
  for (let i = 0; i < x.length; i++) {
    data.push([x[i], y[i]]);
  }

  chart.setOption({
    series: [
      {
        data: data // 使用获取的数据更新热力图
      }
    ]
  });
};
</script>

<style scoped>
#myReLi {
  margin-top: 2%;
  margin-left: 3%;
  background-color: #f8f5f5;
  border-radius: 7px;
  transition: all 0.3s ease;
}
#myReLi:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

</style>
