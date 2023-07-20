<template>
  <div class="login">
    <div class="other">
        <div class="l-left">
          <h3 class="icon">SWUST</h3>
          <h1 class="title">{{this.designString.title}}</h1>
          <h4 class="subtitle">{{this.designString.subtitle}}</h4>
          <div class="thing1">
          </div>
          <div class="thing2">
          </div>
          <button style="margin-top: 67%;margin-left: 5%;color:#5287bc;font-size:17px" @click="changeData()">{{this.designString.flag ? "英文":"Chinese"}}</button>
        </div>
        <div class="l-right">
          <el-form :model="formdata" label-width="auto" label-position="top" style="margin-left: 20%;margin-right:38% ">
              <h1>Sign in</h1>
              <el-form-item label="用户名" style="margin-bottom: 0;margin-top: 6%">
                <el-input v-model="formdata.username" placeholder="学生用户名为学号,管理员为工号" clearable></el-input>
              </el-form-item>
              <el-form-item label="密码" style="margin-bottom: 0">
                <el-input v-model="formdata.password" placeholder="密码长度为3-10个字符" show-password  type="password" clearable></el-input>
              </el-form-item>
              <el-form-item label="身份选择" style="margin-bottom: 0">
                <el-select v-model="formdata.role" placeholder="身份选择" clearable>
                  <el-option label="本科生" value="学生"></el-option>
                  <el-option label="管理员" value="管理员"></el-option>
                </el-select>
              </el-form-item>
              <el-checkbox label="记住密码" name="" style=""></el-checkbox>
            <el-form-item>
              <div class="btn">
                <el-button round @click="login()" style="background-color: #5287bc;color:white;">登录</el-button>
                <el-button round @click="toRegister()" style="background-color: #5287bc;color:white;">注册</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.login{
  background: url("../assets/login/background.jpg") center no-repeat;
  background-size: 100% 100%;
  position:absolute;
  width:100%;
  height:100%;
  .other{
    border-radius: 10px;
    width:60%;
    height:70%;
    display: flex;
    position: absolute;
    top:5%;
    transform:translate(30% ,20%);
    .l-left{
      border-radius: 10px;
      width:40%;
      height:470px;
      background: url("../assets/login/left1.png");
      .icon{
        color:#f0eee5;
        padding:15px 15px;
      }
      .title{
        color:#f0eee5;
        text-align: center;
        padding-top:15%;
      }
      .subtitle{
        color:#f0eee5;
        text-align: center;
      }
      .thing1{
        width:20px;
        height: 20px;
        background-color: #f0eee5;
        margin-left:100px;
        margin-top: 100px;
        position: absolute;
        .new1{
          color:#5287bc;
          font-weight: bold;
          text-align: center;
        }
      }
      .thing2{
        width:20px;
        height: 20px;
        background-color: #f0eee5;
        position: absolute;
        margin-left:220px;
        margin-top: 170px;
        .new2{
          color:#5287bc;
          font-weight: bold;
          text-align: center;
        }
      }
    }
    .l-right{
      border-radius: 10px;
      width:60%;
      height:470px;
      background: url("../assets/login/right.jpg");
      h1{
        color:#5287bc;
        margin-top: 15%;
      }
      .btn{
        width:100%;
        display: flex;
        justify-content: center;
        .el-button{
          width:200px;
        }
      }

    }
  }
}
.el-card{
  padding: 0;
}
</style>
<script>
import { ElMessage } from 'element-plus'
import api from "../api/index.js"
import {mapMutations} from "vuex"
export default {
  data(){
    return {
      formdata: {
        username: "manager",
        password: "123",
        role: "管理员",
      },
      designString: {
        title: "Welcome Back!",
        subtitle: "Student Achievement Manage System",
        flag:true
      }
    }
  },
  methods:{
    ...mapMutations(['confirmManager','confirmStudent']),
    login(){

       console.log("登录角色",this.formdata.role)
      //如果为管理员 =>header部分显示 成果信息后台管理系统


      api.post("/login",this.formdata).then(res=>{
        console.log("后端返回的数据是 ",res.data);
        if(res.data.flag===true){
          if(this.formdata.role==="管理员"){  //调用函数 改变状态
            console.log("点击")
            this.confirmManager();
          }
          else{
            this.confirmStudent();
          }
          ElMessage({
            message: '登录成功,欢迎回来! '+this.formdata.username,
            type: 'success',
          })
          this.$router.push("/home");
        }
        else{
          ElMessage({
            message:res.data.message,
            type: 'error',
          })
        }
      })
    },
    changeData(){
      this.flag=!this.flag;
      if(this.flag)
      {
        this.designString.title="欢迎回来！";
        this.designString.subtitle="学生成果管理系统"
      }
      else{
        this.designString.title="Welcome Back!";
        this.designString.subtitle="Student Achievement Manage System"
      }
    },

    toRegister(){
      this.$router.push("/register");
    }
  }
}
</script>
