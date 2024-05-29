<template>
  <div class="totalDataVis">
    <div class="top">
      <div class="barChart">
          <students-grades-chart/>
      </div>
      <div class="pieChart">
        <PieChart></PieChart>
      </div>
      <div class="intro">
        <IntroPanel></IntroPanel>
      </div>
    </div>

    <div class="bottom">
      <div class="loginNumChart">
        <LoginStaticChart></LoginStaticChart>
      </div>
      <div class="student-map">
        <Map></Map>
      </div>
    </div>
  </div>
</template>

<script setup>
import StudentsGradesChart from "./totalChartsComponents/students-grades-Chart.vue";
import LoginStaticChart from "./totalChartsComponents/NumberOfDailySystemUsers.vue";
import PieChart from "./totalChartsComponents/PieChart.vue";
import IntroPanel from "./totalChartsComponents/intro.vue"
import Map from "./totalChartsComponents/Map.vue"
</script>

<style scoped>
.totalDataVis {
  width: 100%;
  height: 100%;
  min-height: 600px;
  min-width: 1400px;
  background-color: rgba(232, 232, 239, 0.9);
}
.top {
  display: flex;
  width: 100%;
  height: 45%;
  min-height: 300px;
  /*background-color: #ecefef;*/
}

.bottom {
  display: flex;
  margin-top: 20px;
  width: 100%;
  height: 45%;
  min-height: 350px;
  /*background-color: #d9f1d6;*/
}

.barChart {
  width: 33%;
  height: 100%;
  min-height: 300px;
  /*background-color: #2afadf;*/
}

.pieChart {
  margin-left: 10px;
  width: 33%;
  height: 100%;
  min-height: 300px;
  /*background-color: #2afadf;*/
}

.intro {
  margin-left: 10px;
  width: 33%;
  height: 100%;
  min-height: 300px;
  /*background-color: #adf6ec;*/
}

.loginNumChart {
  width: 47%;
  height: 100%;
  min-height: 330px;
  /*background-color: #2afadf;*/
}

.student-map {
  margin-left: 10px;
  width: 47%;
  height: 100%;
  min-height: 330px;
  /*background-color: #2afadf;*/
}


</style>
