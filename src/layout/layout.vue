<template xmlns="">
  <div class="common-layout">
    <el-container class="main_container">
      <el-aside width="auto" style="max-width: 200px"><commonAside></commonAside></el-aside>  <!---------<el-aside></el-aside>默认300px------>
      <el-container>
        <el-header style="padding: 0"><topheader></topheader></el-header>
        <Tag></Tag>
        <el-main style="background-color: #fcfcfc;padding: 6px" >

          <router-view v-slot="{Component}">
<!--            <transition name="fade-transform" mode="out-in">-->

            <transition name="slide" mode="out-in">
<!--              <transition name="moveUp">-->
<!--              <transition name="fade" mode="out-in">-->
              <component :is="Component" :key="$route.path"></component>
            </transition>

          </router-view>
        </el-main>
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

<style scoped >
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

.slide-enter-active,
.slide-leave-active{
  transition: opacity 0.6s,transform 0.6s;
}
.slide-enter-from,
.slide-leave-to{
  opacity: 0;
  transform: translateX(-10%);
}

/**/
.moveUp-enter-active{
  animation: fadeIn 1s ease-in;
}
@keyframes fadeIn {
  0% {opacity: 0;}
  50% {opacity: 0.5;}
  100% {opacity: 1;}
}
.moveUp-leave-active{
  animation: moveUp 0.3s ease-in;
}
@keyframes moveUp {
  0% {transform:translateX(0);}
  100% {transform: translateY(-400px);}
}
/**/
.fade-enter-active,
.fade-leave-active{
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to{
  opacity: 0;

}


</style>
