<template>
<div class="top-header" style="width:100%;height:100%; background-color: #e8e6e6;display:flex">
  <div class="breadcrumbArea" style="width: 50%;display: flex">
    <div class="foldarea" style="width: 8%;position: relative;top:20%;left: 1%">
      <el-icon style="font-size: 28px;color: #9f9fa1" @click="strentch()">
        <Fold />
      </el-icon></div>
    <div class="bread" style="width: 90%"></div>
  </div>

  <div class="blankArea"   style="width: 25%;">空白</div>
  <div class="timeArea" style="width: 20%;display: flex;position: relative">
    <h4 style="width: 30%;top:25%;left: 20%;position:absolute; color: #676464">
      <el-icon size="21px">
        <Calendar/>
      </el-icon>
    </h4>
    <h4 style="position: absolute;top:25%;width:70%;left: 30%;color: #949393">{{ newTime }}</h4>
  </div>

  <div class="personalArea"   style="width: 5%;">
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        <img class="picture" style="position:relative;left: 0%;top:10% ;height: 50px;width: 50px;border-radius: 50%;" src="../assets/loginImgs/left.jpg">
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="personalArea" divided>个人中心</el-dropdown-item>
          <el-dropdown-item command="logOff">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { mapMutations } from 'vuex';
import {Fold} from "@element-plus/icons-vue";
export default {
  components:{
    Fold,
  },
  data(){
    return{
      newTime: "",
    }
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
