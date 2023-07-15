<template>
<div class="top-header" style="width:100%;height:100%; background-color: #e8e6e6;display:flex">

  <div class="breadcrumbArea" style="width: 58%;display: flex">
    <div class="foldarea" style="width: 6%;position: relative;top:23%;left: 1%">
      <el-icon style="font-size: 26px;color: #9f9fa1" @click="strentch()">
        <Fold />
      </el-icon></div>
    <!---面包屑区域-->
    <div class="bread" style="width: 94%;">
      <el-breadcrumb :separator-icon="ArrowRight" style="position: relative;top:33%;font-size:15px;font-style:normal">
        <el-breadcrumb-item v-for="it in tabsList" :key="it.name" :to="{path:it.path}">{{it.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>

  <div class="blankArea"   style="width: 16%;"><h1 style="position: relative;top:26%;left: 10%;color: #949393" >学生成果信息管理后台</h1></div>
  <div class="timeArea" style="width: 18%; display: flex;position: relative">
    <h4 style="width: 30%;top:30%;left: 10%;position:absolute; color: #676464">
      <el-icon size="21px">
        <Calendar/>
      </el-icon>
    </h4>
    <h4 style="position: absolute;top:30%;width:70%;left: 20%;color: #949393">{{ newTime }}</h4>
  </div>
  <div class="personalArea"   style="width: 5%;">
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        <img class="picture" style="position:relative;left: 0%;top:10% ;height: 50px;width: 50px;border-radius: 50%;" src="../assets/login/left.jpg">
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="personalArea" divided>注销账号</el-dropdown-item>
          <el-dropdown-item command="logOff">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</div>
</template>

<script>


import { ElMessage } from 'element-plus'
import { mapState } from 'vuex';
import {mapMutations} from 'vuex'
import {Fold,ArrowRight} from "@element-plus/icons-vue";
export default {
  components:{
    Fold,
    ArrowRight,

  },

  data(){
    return{
      newTime: "",
      ArrowRight,
      Fold,

    }
  },
  computed:{
    ...mapState(['isManager','tabsList']),  //tablist 面包屑数据
  },
  mounted() {
    this.getNowTime();
    clearInterval(myTimeDisplay);
    var myTimeDisplay = setInterval(() => {
      this.getNowTime();
    }, 1000)
  },
  methods:{
    ...mapMutations(['collapseMenu']),
    strentch(){
      this.collapseMenu();
    },
    handleCommand(command) {//////注意dropdown里面时间的触发
      if (command === 'logOff') {
        this.$message({
          message: '退出成功',
          type: 'success'
        });
        this.$router.push('/login')
      }
      else if(command ==="personalArea"){
        ElMessage({
          message: '进入个人中心',
          type: 'info',
        })
      }

    },
    getNowTime() {
      var date = new Date();
      this.newTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + this.addZero(date.getMinutes()) + ':' + this.addZero(date.getSeconds());
    },
    addZero(s) {
      return s < 10 ? ('0' + s) : s;
    },
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
