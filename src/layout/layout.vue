<template xmlns="">
  <div class="common-layout">
    <el-container class="main_container">
      <el-aside width="auto" style="max-width: 200px"><commonAside></commonAside></el-aside>  <!---------<el-aside></el-aside>默认300px------>
      <el-container>
        <el-header style="padding: 0"><topheader></topheader></el-header>
        <Tag></Tag>
        <el-main style="background-color: #fcfcfc" ><router-view></router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import commonAside from "../components/CommonAside.vue";
import topheader from "../components/Header.vue";
import Tag from "../components/Tag.vue"
export default {
  name: "layout",
  components:{
    commonAside,
    topheader,
    Tag
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
