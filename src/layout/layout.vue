<template>
  <div class="common-layout">
    <el-container class="main_container">
      <el-aside width="auto" style="max-width: 180px"><Aside></Aside></el-aside>  <!---------<el-aside></el-aside>默认300px------>
      <el-container>
        <el-header style="padding: 0"><topheader></topheader></el-header>
        <el-main style="background-color: #efeded" ><router-view></router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Aside from "../components/Aside.vue";
import topheader from "../components/Header.vue";
export default {
  name: "layout",
  components:{
    Aside,
    topheader
  }
}
</script>

<style scoped>
.common-layout {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.main_container {
  height: 100%;
}
</style>
