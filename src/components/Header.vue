<template>
  <div class="top-header" style="width:100%;height:100%; background-color: #e8e6e6;display:flex">
    <div class="breadcrumbArea" style="width: 58%;min-width: 300px;display: flex">
      <div class="foldarea" style="width: 6% ; min-width: 20px;position: relative;top:23%;left: 1%">
        <el-icon v-if="!isCollapse" style="font-size: 26px;color: #9f9fa1" @click="stretch()">
          <Fold/>
        </el-icon>
        <el-icon v-if="isCollapse" style="font-size: 26px;color: #9f9fa1" @click="stretch()">
          <Expand/>
        </el-icon>
      </div>
      <!---面包屑区域-->
      <div class="bread" style="width: 94%;min-width:600px ">
        <el-breadcrumb :separator-icon="ArrowRight" style="position: relative;top:33%;font-size:15px;font-style:normal">
          <el-breadcrumb-item v-for="it in tabsList" :key="it.name" :to="{path:it.path}">{{ it.label }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="blankArea" style="width: 16%;"></div>
    <div class="timeArea" style="width: 15%;min-width: 200px; display: flex;position: relative">
      <h4 style="width: 30px;top:30%;left: 5%;position:absolute; color: #676464">
        <el-icon size="21px">
          <Calendar/>
        </el-icon>
      </h4>
      <h4 style="position: absolute;top:30%;width:180px;left: 16%;color: #949393">{{ newTime }}</h4>
    </div>
    <div style="width: 80px; height: 50px;  margin-top: 15px">
      <el-badge :is-dot="iSDot" class="item">
       <el-icon type="primary" size="28" color="blue" @click="gotoList()" style="cursor: pointer"><Bell /></el-icon>
      </el-badge>
    </div>
    <div class="personalArea" style="width: 9%;margin-left:-1%;display: flex">
      <img v-if="role==='admin'" class="picture" style="margin-left: 0px;margin-top: 8px;height: 40px;width: 40px;border-radius: 50%;"
           src="../assets/images/two.jpg">
      <img v-if="role!=='admin'" class="picture" style="margin-left: 00px;margin-top: 8px;height: 40px;width: 40px;border-radius: 50%;"
           :src="avatr">
      <el-dropdown @command="handleCommand" style="margin-left: 3%;width: 80px">
        <span style="width: 80px;height: 30%;margin-top: 25%" >
      {{role}}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logOff" :icon="Guide" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup>
import {ElMessage, ElMessageBox} from 'element-plus'
import {useStore} from 'vuex';
import {Fold, ArrowRight, Expand,Guide,ArrowDown} from "@element-plus/icons-vue";
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {useRouter} from "vue-router";
import api from "../api/index.js";
const router = useRouter()
const store = useStore()
const newTime = ref("");
const tabsList = computed(() => store.state.tabsList)
const isCollapse = computed(() => store.state.isCollapse)
//图片的信息
const avatr=ref("")
//isdot的信息
const iSDot = ref(false);
onMounted(() => {
  // 在组件挂载时启动定时器，每秒钟更新一次时间
  setInterval(getNowTime, 1000);
  getUserAvtar();
  getSelfAll();
});

const getUserAvtar = () => {
  api.get("/getUserInfo").then(res => {
    console.log(res);
    console.log("获取到的头像", res.data.data.avtar);
    avatr.value=res.data.data.avtar;
    console.log("avtar is ",avatr.value)
  })
}
const role = computed(() => {
  return sessionStorage.getItem('role');
});

const getNowTime = () => {
  let date = new Date();
  newTime.value = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + addZero(date.getMinutes()) + ':' + addZero(date.getSeconds());
};

const addZero = (s) => {
  return s < 10 ? ('0' + s) : s;
};

const stretch = () => {
  store.commit('collapseMenu')
}
const handleCommand = (command) => {//////注意dropdown里面时间的触发
  if (command === 'logOff') {
    sessionStorage.removeItem('saToken'); //会话存储里面
    sessionStorage.removeItem('tokenName');
    sessionStorage.removeItem('role');
    ElMessage({
      showClose: true,
      message: '退出登录',
      type: 'success',
    })
    router.push('/loginandregister')
  }
}
const getSelfAll = () => {
  api.get("Message/getUserInfo").then(res => {
    console.log(res);
    console.log(res.data.data);
    if(res.data.data.length!=0){
      iSDot.value=true;
    }
    console.log("获取到所有拒绝的信息");
  })
}
//展示列表
const gotoList = () => {
   console.log("666");
}
</script>

<style scoped>
.example-showcase .el-dropdown + .el-dropdown {
  margin-left: 15px;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
