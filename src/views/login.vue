<template>
  <div class="loginpage">
    <div class="loginarea">
      <div class="imgarea">
        <h1 style="position: absolute;top:28%;left: 25%;color: #efeded;font-size: 36px">学生成果管理系统</h1>
        <h1 style="position:absolute;top:43%;left: 35%;color: #efeded;font-size: 36px">SWUST</h1>
      </div>
      <div class="loginform">
        <h2 style="position: absolute;left: 40%;top:12%;">欢迎登录</h2>
        <div class="form" style="position:absolute;top:2%;">
        <el-form
            label-width="200px"
            :model="formdata"
            style="max-width: 500px;margin-top: 100px"
        >
          <el-form-item label="用户名">
            <el-input clearable  placeholder="学生用户名为学号,管理员为工号" v-model="formdata.username" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input  show-password  type="password" clearable
                       placeholder="密码长度为3-10个字符" v-model="formdata.password" />
          </el-form-item>
          <el-form-item label="身份">
            <el-select
                style="width: 400px"
                v-model="formdata.role"
                placeholder="身份选择"
                clearable
            >
              <el-option label="管理员" value="管理员" />
              <el-option label="学生用户" value="学生" />
            </el-select>
          </el-form-item>
          <el-form-item >
            <el-button type="primary"  style="position: relative;left: 25%; width: 150px; height: 38px; " @click="login()">登录</el-button>
          </el-form-item>
        </el-form>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import { ElMessage } from 'element-plus'
export default {
  data(){
    return {
    formdata:{
      username:"",
      password:"",
      role:"",
      }
    }
  },
  methods:{
    login(){
      console.log("登录表单信息",this.formdata.role)
      ElMessage({
        message: '登录成功,欢迎回来! '+this.formdata.username,
        type: 'success',
      })
      this.$router.push("/home");//路由跳转
    }
  }
}
</script>
<style scoped>

.loginpage {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #535bf2;
  background-image: url('../assets/loginImgs/bg.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
}

.loginarea {
  display: flex;
  border-radius: 8px;
  position: absolute;
  width: 70%;
  height: 47%;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f8f5f5;
}
.imgarea{
  border-radius: 8px;
  position: relative;
  width: 51%;
  height: 100%;
  background-image: linear-gradient(rgba(86, 172, 208, 0.8), rgba(30, 194, 227, 0.9)), url('../assets/loginImgs/left.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
}
.loginform{
  position: relative;
  width: 49%;
  height: 100%;
  background-color: #fcfcfc;
}
</style>
