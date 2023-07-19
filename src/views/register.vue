<template>

  <div class="login">
    <div class="other">
      <div class="l-left">
        <h3 class="icon">SWUST</h3>
        <h1 class="title">Welcome Back!</h1>
        <h4 class="subtitle">Student Achievement</h4>
        <h5 class="subtitle1">  Management System</h5>
        <!--          <div class="thing1">-->
        <!--            <p class="new1"></p>-->
        <!--          </div>-->
        <!--          <div class="thing2">-->
        <!--            <p class="new2"></p>-->
        <!--          </div>-->
      </div>
      <div class="l-right">

        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="auto" label-position="left" style="margin-left: 15%;margin-right: 25%" class="demo-ruleForm">
          <h1>Register</h1>
          <el-form-item label="用户名" style="margin-bottom: 20px;margin-top: 3%" prop="username">
            <el-input v-model="ruleForm.username" placeholder="请输入学号" clearable></el-input>
          </el-form-item>
          <el-form-item label="密码" style="margin-bottom: 5px;margin-top: 0%" prop="password" >
            <el-input  type="password" placeholder="请输入密码" v-model="ruleForm.password" autocomplete="off" maxlength="10" ></el-input>
          </el-form-item>
          <div class="_progress">
            <el-progress :percentage="percentage" :stroke-width="5" :color="customColorMethod" :format="format"></el-progress>
          </div>
          <el-form-item label="确认密码" style="margin-bottom: 20px;margin-top: 10px" prop="checkPass">
            <el-input type="password" placeholder="请输入相同密码" v-model="ruleForm.checkPass" autocomplete="off" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label="姓名" style="margin-bottom: 20px;margin-top: 0%" prop="name" >
            <el-input v-model.number="ruleForm.name" placeholder="请输入姓名" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="身份选择" style="margin-bottom: 20px">
            <el-select v-model="ruleForm.major" placeholder="专业" clearable>
              <el-option label="计算机科学与技术" value="计算机科学与技术"></el-option>
              <el-option label="软件工程" value="软件工程"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="btn" style="margin-left: 70px;margin-right: 60px;margin-bottom: 0px">
              <el-button type="primary" round @click="submitForm('ruleForm')" style="width: 110px">注册</el-button>
              <el-button @click="resetForm('ruleForm')" round style="width: 110px">重置</el-button>
            </div>


          </el-form-item>
          <router-link :style='{"cursor":"pointer","padding":"0 70%","color":"#278bd5","display":"inline-block","width":"100%","lineHeight":"1","fontSize":"12px","textDecoration":"none"}' to="/login">已有账户登录</router-link>

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
      .subtitle1{
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
      ._progress{
        margin-left: 47%;
        width:190px;
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
import {mapMutations} from "vuex";
import api from "../api";
import {ElMessage} from "element-plus";
import {reactive,ref} from 'vue';

// import type { FormInstance, FormRules } from 'element-plus'
export default {
  function:true,
  
  data() {

    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('年龄不能为空'));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'));
        } else {
          if (value < 18) {
            callback(new Error('必须年满18岁'));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    var validatePass = (rule, value, callback) => {

      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        let str = value;
        this.percentage=str.length*10;
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {

      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    var checkUser = (rule,value,callback)=>{
      if (value === '') {
        callback(new Error('请输入姓名'));
      }else{
        callback();
      }
    };
    return {

      customColor: '#9589E6',
      percentage:0,
      customColors:[
        {},
        {}
      ],

      ruleForm: {
        username:"",
        password: '',
        role: "学生",
        name:"",
        major:'',
        checkPass: '',
        status:1
      },
      rules: {
        password: [
          { validator: validatePass, trigger: 'change' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        name: [{ }],
        username: [
          { validator:checkUser,trigger:'blur'}
        ],
        major: [
            {}
        ]
      }
    };
  },

  methods: {
    format(percentage) {
      if (percentage < 30) {
        return '弱';
      } else if (percentage < 70) {
        return '中';
      } else {
        return '强';
      }
    },
    customColorMethod(percentage) {

      if (percentage < 30) {
        return '#909399';
      } else if (percentage < 70) {
        return '#e6a23c';
      } else {
        return '#67c23a';
      }
    },

    submitForm(formName) {

      api.post("/register",this.ruleForm).then(res=>{
        console.log("后端返回的数据为",res.data);
        if(res.data.flag==true){
          this.$message({
            message:'注册成功',
            type:'success',
            duration:1500,
          })
        }else{
          this.$message({
            message:'注册失败',
            type:'false',
            duration:1500,
          })
        }
      })
      this.$refs[formName].validate((valid) => {
        if (valid) {


        } else {
          console.log('error submit!!');
          return false;
        }

      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}

</script>


