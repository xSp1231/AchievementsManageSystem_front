<template>
<div class="totalDataVis">
<div class="top">
  <div class="lineChart">

  </div>
  <div class="pieChart">
     <self-pie-compoent></self-pie-compoent>
  </div>
  <div class="intro">

  </div>
</div>

<div class="bottom">

</div>

</div>
</template>

<script setup>
</script>

<style scoped>
.totalDataVis{
  width: 100%;
  height: 100%;
  min-height: 600px;
  min-width: 1400px;
  background-color: #ebebef;
}
.top{
  display: flex;
  width: 100%;
  height: 45%;
  min-height: 300px;
  background-color: #ecefef;
}

.bottom{
  margin-top: 20px;
  width: 100%;
  height: 45%;
  min-height: 300px;
  background-color: #d9f1d6;
}
.lineChart{
  width: 33%;
  height: 100%;
  min-height: 300px;
  background-color: #2afadf;
}
.pieChart{
  margin-left: 10px;
  width: 33%;
  height: 100%;
  min-height: 300px;
  background-color: #2afadf;
}
.intro{
  margin-left: 10px;
  width: 33%;
  height: 100%;
  min-height: 300px;
  background-color: #2afadf;
}
</style>
