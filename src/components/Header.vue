<template>
  <div class="top-header" >
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
    <div class="blankArea" style="width: 13%;"></div>
    <div class="timeArea" style="width: 13%;min-width: 200px; display: flex;position: relative">
      <h4 style="width: 30px;top:30%;left: 5%;position:absolute; color: #676464">
        <el-icon size="21px">
          <Calendar/>
        </el-icon>
      </h4>
      <h4 style="position: absolute;top:30%;width:180px;left: 16%;color: #949393">{{ newTime }}</h4>
    </div>
    <div v-if="role==='student'" class="PersonalDataVisArea" style="width: 30px;">
      <el-tooltip
          content="个人可视化页面"
          effect="light"
          placement="top"
      > <el-icon size="22" style="position: absolute;top: 19px;color: #2573c9" @click="personalDatavis()">
        <DataAnalysis />
      </el-icon>
      </el-tooltip>


    </div>
    <div class="messageArea" style="width: 40px;margin-right: 36px;min-width:45px;margin-top: 7px;position: relative">
      <el-badge  :value=iSDot   :max="10"  style="position: absolute;top: 10px">
       <el-icon type="primary" size="26" color="grey" @click="gotoMessageList()" style="cursor: pointer"><BellFilled /></el-icon>
      </el-badge>
    </div>
    <div class="personalArea" style="width: 9%;min-width: 60px;margin-left:-1%;display: flex">
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
import {Fold, ArrowRight, Expand, Guide, ArrowDown, BellFilled} from "@element-plus/icons-vue";
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
const iSDot = ref(0);
onMounted(() => {
  // 在组件挂载时启动定时器，每秒钟更新一次时间
  setInterval(getNowTime, 1000);
  getUserAvtar();
  getMyMessage ();
});

const personalDatavis=()=>{
  router.push("/personalDataVis")
}
const getUserAvtar = () => {
  api.get("/getUserInfo").then(res => {
    avatr.value=res.data.data.avtar;
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
const getMyMessage = () => {
  api.get("Message/getUserMessage").then(res => {
    console.log("获取消息",res);
    console.log("用户获取的消息为",res.data.data);
    if(res.data.data.length!==0){
      iSDot.value=res.data.data.length;
    }
  })
}
//展示列表
const gotoMessageList = () => {
  router.push({name: "messages"})
  // router.push({name: "dataVisualization"})
  // router.push({name: "dataVisualization"})
}
</script>

<style scoped>
.top-header{
  width:100%;
  height:100%;
  min-width: 1300px;
  background-color: #e8e6e6;
  display:flex;
  justify-content: space-between;
}
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
