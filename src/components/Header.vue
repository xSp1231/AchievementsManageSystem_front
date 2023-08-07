<template>
  <div class="top-header" style="width:100%;height:100%; background-color: #e8e6e6;display:flex">

    <div class="breadcrumbArea" style="width: 58%;display: flex">
      <div class="foldarea" style="width: 6%;position: relative;top:23%;left: 1%">

        <el-icon v-if="!isCollapse" style="font-size: 26px;color: #9f9fa1" @click="stretch()">
          <Fold/>
        </el-icon>
        <el-icon v-if="isCollapse" style="font-size: 26px;color: #9f9fa1" @click="stretch()">
          <Expand/>
        </el-icon>

      </div>


      <!---面包屑区域-->
      <div class="bread" style="width: 94%;">
        <el-breadcrumb :separator-icon="ArrowRight" style="position: relative;top:33%;font-size:15px;font-style:normal">
          <el-breadcrumb-item v-for="it in tabsList" :key="it.name" :to="{path:it.path}">{{ it.label }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="blankArea" style="width: 16%;"><h1 style="position: relative;top:26%;left: 10%;color: #949393">
      学生成果信息管理系统</h1></div>
    <div class="timeArea" style="width: 15%; display: flex;position: relative">
      <h4 style="width: 30px;top:30%;left: 9%;position:absolute; color: #676464">
        <el-icon size="21px">
          <Calendar/>
        </el-icon>
      </h4>
      <h4 style="position: absolute;top:30%;width:180px;left: 20%;color: #949393">{{ newTime }}</h4>
    </div>
    <div class="personalArea" style="width: 10%;">
      <el-dropdown @command="handleCommand" style="margin-left: 20%;width: 80px">

        <img v-if="role==='admin'" class="picture" style="margin-left: 30px;margin-top: 6px;height: 50px;width: 50px;border-radius: 50%;"
             src="../assets/images/managerAvator.jpg">
        <img v-if="role!=='admin'" class="picture" style="margin-left: 30px;margin-top: 6px;height: 50px;width: 50px;border-radius: 50%;"
             src="../assets/images/two.jpg">
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
import {Fold, ArrowRight, Expand,Guide} from "@element-plus/icons-vue";
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {useRouter} from "vue-router";
import api from "../api/index.js";

const router = useRouter()
const store = useStore()
const newTime = ref("");
const tabsList = computed(() => store.state.tabsList)
const isCollapse = computed(() => store.state.isCollapse)

onMounted(() => {
  // 在组件挂载时启动定时器，每秒钟更新一次时间
  setInterval(getNowTime, 1000);
});
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
