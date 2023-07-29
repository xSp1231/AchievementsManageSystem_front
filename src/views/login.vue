<!----login--->
<template>
  <div class="login">
    <div class="other">
      <div class="l-left">
        <h3 class="icon">SWUST</h3>
        <h1 class="title">{{ designString.title }}</h1>
        <h4 class="subtitle">{{ designString.subtitle }}</h4>
        <div class="thing1">
        </div>
        <div class="thing2">
        </div>
      </div>
      <div class="l-right">
        <el-switch
            size="default"
            style="margin-left: 92%;--el-switch-on-color: rgba(40,146,211,0.8); --el-switch-off-color: #cfd3cf"
            v-model="designString.flag"
            inline-prompt
            active-text="英"
            inactive-text="中"
            @change="changeData()"
        />
        <el-form :model="formdata" label-width="auto" label-position="top" style="margin-left: 20%;margin-right:38% ">
          <h1>Sign in</h1>
          <el-form-item label="用户名" style="margin-bottom: 0;margin-top: 6%">
            <el-input v-model="formdata.username" placeholder="学生用户名为学号,管理员为工号" clearable></el-input>
          </el-form-item>
          <el-form-item label="密码" style="margin-bottom: 0">
            <el-input v-model="formdata.password" placeholder="密码长度为3-10个字符" show-password type="password"
                      clearable></el-input>
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

<script setup>
import {ElMessage} from 'element-plus'
import api from "../api/index.js"
import {reactive} from "vue";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
const store=useStore();
const router = useRouter()
const formdata = reactive({
  username: "manager",
  password: "123",
  role: "管理员",
})
const designString = reactive({
  title: "Welcome Back!",
  subtitle: "Student Achievements Management System",
  flag: true
})

const login = () => {
  console.log("登录角色", formdata.role)
  //如果为管理员 =>header部分显示 成果信息后台管理系统
  api.post("/login", formdata).then(res => {
    console.log("登陆之后后端返回的数据是 ", res.data);
    if (res.data.flag === true) {
      store.commit("inittabList")//登录成功之后 初始化面包屑 和tag标签
      //存入token
      let tokenValue=res.data.data.tokenValue;
      let tokenName=res.data.data.tokenName;
      //存入角色
      if(tokenValue &&tokenName){
        let role=res.data.message;
        console.log("tokenValue is ",tokenValue)
        console.log("tokenName is ",tokenName)

        console.log("role is ",role)
        sessionStorage.setItem('saToken', tokenValue); //会话存储里面
        sessionStorage.setItem('tokenName', tokenName);
        sessionStorage.setItem('role', role);

      }

      if (formdata.role === "管理员") {  //调用函数 改变状态
        console.log("点击")
      } else {
         let token=res.data.jwttoken;
         console.log("得到的token is ",token)
         localStorage.setItem('jwtToken', token);//将用户令牌保存下来
      }
      ElMessage({
        message: '登录成功,欢迎回来! ' + formdata.username,
        type: 'success',
      })
      router.push("/home")
    } else {
      ElMessage({
        message: res.data.message,
        type: 'error',
      })
    }
  })
}
const changeData = () => {
  console.log("滑动的值", designString.flag)
  if (designString.flag) {
    designString.title = "欢迎回来!";
    designString.subtitle = "学生成果管理系统"
  } else {
    designString.title = "Welcome Back!";
    designString.subtitle = "Student Achievement Manage System"
  }
}
const toRegister = () => {
  router.push("/register")
}


</script>
<style lang="less" scoped>
.login {
  background: url("../assets/login/background.jpg") center no-repeat;
  background-size: 100% 100%;
  position: absolute;
  width: 100%;
  height: 100%;

  .other {
    border-radius: 10px;
    width: 60%;
    height: 70%;
    display: flex;
    position: absolute;
    top: 5%;
    transform: translate(30%, 20%);

    .l-left {
      border-radius: 10px;
      width: 40%;
      height: 470px;
      background: url("../assets/login/left1.png");

      .icon {
        color: #f0eee5;
        padding: 15px 15px;
      }

      .title {
        color: #f0eee5;
        text-align: center;
        padding-top: 15%;
      }

      .subtitle {
        color: #f0eee5;
        text-align: center;
      }

      .thing1 {
        width: 20px;
        height: 20px;
        background-color: #f0eee5;
        margin-left: 100px;
        margin-top: 100px;
        position: absolute;

        .new1 {
          color: #5287bc;
          font-weight: bold;
          text-align: center;
        }
      }

      .thing2 {
        width: 20px;
        height: 20px;
        background-color: #f0eee5;
        position: absolute;
        margin-left: 220px;
        margin-top: 170px;

        .new2 {
          color: #5287bc;
          font-weight: bold;
          text-align: center;
        }
      }
    }

    .l-right {
      border-radius: 10px;
      width: 60%;
      height: 470px;
      background: url("../assets/login/right.jpg");

      h1 {
        color: #5287bc;
        margin-top: 15%;
      }

      .btn {
        width: 100%;
        display: flex;
        justify-content: center;

        .el-button {
          width: 200px;
        }
      }

    }
  }
}

.el-card {
  padding: 0;
}
</style>
