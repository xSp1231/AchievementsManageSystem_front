<template>
  <div class="base">
    <!-- 注册登录界面 -->
    <div class="loginAndRegist">
      <!--登录表单-->
      <div class="loginArea">
        <transition name="animate__animated animate__bounce" enter-active-class="animate__fadeInUp"
                    leave-active-class="animate__zoomOut" appear>
          <!-- 标语 -->
          <div v-show="isShow" class="title">
            LOGIN
          </div>
        </transition>
        <transition name="animate__animated animate__bounce" enter-active-class="animate__fadeInUp"
                    leave-active-class="animate__zoomOut" appear>
          <!--登录框-->
          <div v-show="isShow" class="pwdArea">
            <div style="flex: 1;justify-content: center;align-items: center">
              <el-form :model="formData" label-width="auto" label-position="top"
                       style="margin-left: 22%;margin-right:30% ">
                <el-form-item label="用户名" style="margin-bottom: 0;margin-top: 6%">
                  <el-input v-model="formData.username" placeholder="学生用户名为学号,管理员为工号" clearable></el-input>
                </el-form-item>
                <el-form-item label="密码" style="margin-bottom: 0">
                  <el-input v-model="formData.password" placeholder="密码长度为3-10个字符" show-password type="password"
                            clearable></el-input>
                </el-form-item>
                <el-form-item label="身份选择" style="margin-bottom: 0">
                  <el-select v-model="formData.role" placeholder="身份选择" clearable>
                    <el-option label="本科生" value="学生"></el-option>
                    <el-option label="管理员" value="管理员"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="验证码(看不清?点击刷新)">
                  <el-input
                      name="verify"
                      style="width: 48%"
                      type="text"
                      v-model="formData.verifyCode"
                      placeholder="请输入验证码"></el-input>&nbsp;&nbsp;
                  <img src="http://localhost:8080/getCode"
                       id="code"
                       style="width: 120px;height: 30px"
                       @click="refresh()"
                  />
                </el-form-item>

              </el-form>
            </div>

          </div>
        </transition>
        <transition name="animate__animated animate__bounce" enter-active-class="animate__fadeInUp"
                    leave-active-class="animate__zoomOut" appear>
          <!-- 登录按钮 -->
          <div v-show="isShow" class="btnArea">
            <el-button type="success" round
                       style="width: 100px;margin-left: 25%;background-color:rgba(97,116,131,0.22);border: 1px solid #ccc8c8;letter-spacing: 2px"
                       @click="login">登录
            </el-button>
            <el-link type="info"  underline style="color: #808894;margin-left: 3%;height: 30px" @click="findPwd()" >忘记密码?点我找回</el-link>
          </div>
        </transition>
      </div>


      <!-- 注册表单 -->
      <div class="registArea">
        <transition name="animate__animated animate__bounce" enter-active-class="animate__fadeInUp"
                    leave-active-class="animate__zoomOut" appear>
          <!--  注册表头-->
          <div v-show="!isShow" class="rigestTitle" >
            REGISTER
          </div>
        </transition>
        <transition name="animate__animated animate__bounce" enter-active-class="animate__fadeInUp"
                    leave-active-class="animate__zoomOut" appear>
          <!--            注册表单-->
          <div v-show="!isShow" class="registForm">
            <el-form :model="ruleForm" :rules="rules" ref="checkForm" status-icon  label-width="auto" >
              <el-form-item label="用户名" style="margin-bottom: 17px;margin-top: 3%" prop="username">
                <el-input v-model="ruleForm.username" placeholder="请输入学号" clearable></el-input>
              </el-form-item>
              <el-form-item   label="密码" style="margin-bottom: 10px;margin-top: 0" prop="password">
                <el-input show-password type="password" placeholder="请输入密码" v-model="ruleForm.password" autocomplete="off"
                          maxlength="10"></el-input>
              </el-form-item>
              <div class="demo-progress" style="margin-left:25%;height: 15px;margin-top: 13px">
                <el-progress striped striped-flow :duration="8"  style="width: 240px;"  :percentage="progressLength" :format="format" :color="getColor" />
              </div>
              <el-form-item label="确认密码" style="margin-bottom: 17px;margin-top: 3px" prop="checkPass">
                <el-input show-password type="password" placeholder="请输入相同密码" v-model="ruleForm.checkPass" autocomplete="off" maxlength="10"></el-input>
              </el-form-item>
              <el-form-item label="姓名" style="margin-bottom: 17px;margin-top: 0" prop="name" >
                <el-input v-model="ruleForm.name" placeholder="请输入姓名" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="专业班级" style="margin-bottom: 17px;margin-top: 0" prop="major" >
                <el-input v-model="ruleForm.major" placeholder="xx专业xx班(如计科2002)" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="qq邮箱号" style="margin-bottom: 17px;margin-top: 0" prop="email" >
                <el-input v-model="ruleForm.email" placeholder="不需要加上@qq.com" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </transition>
        <transition name="animate__animated animate__bounce" enter-active-class="animate__fadeInUp"
                    leave-active-class="animate__zoomOut" appear>
          <!--            注册按钮-->
          <div v-show="!isShow" class="registBtn">
            <el-button type="success" round
                       style="width: 100px;margin-left:37%;background-color: rgba(97,116,131,0.22);border: 1px solid #ccc8c8;letter-spacing: 2px"
                       @click="register">注册
            </el-button>
            <el-button type="success" round
                       style="background-color: rgba(97,116,131,0.22);width: 100px;border: 1px solid #ccc8c8;letter-spacing: 2px"
                       @click="reSetForm">重置表格
            </el-button>
          </div>
        </transition>
      </div>
      <!-- 信息展示界面 -->
      <div id="aaa" class="showInfo" :style="{
                borderTopRightRadius: styleObj.bordertoprightradius,
                borderBottomRightRadius: styleObj.borderbottomrightradius,
                borderTopLeftRadius: styleObj.bordertopleftradius,
                borderBottomLeftRadius: styleObj.borderbottomleftradius,
                right: styleObj.rightDis
            }" ref="showInfoView">

        <transition name="animate__animated animate__bounce" enter-active-class="animate__fadeInUp"
                    leave-active-class="animate__zoomOut" appear>
          <!-- 没有用户输入用户名或者找不到用户名的时候 -->
          <div v-show="isShow"
               style="display: flex;flex-direction: column;align-items: center;justify-content: center;width: 100%;height: 100%">
            <!-- 欢迎语 -->
            <div
                style="flex: 2;display: flex;align-items: center;font-size: 22px;color: #eeebeb;font-weight: bold">
              欢迎登录SWUST学生成果管理系统
            </div>
            <!-- 欢迎图片 -->
            <div style="flex: 2">
              <el-button type="success" style="background-color: rgba(97,116,131,0.66);border: 1px solid #ccc8c8;" round
                         @click="changeToRegiest">还没有账户？点击注册
              </el-button>
            </div>
          </div>
        </transition>
        <!-- 用户输入用户名时展示头像以及姓名 -->
        <transition name="animate__animated animate__bounce" enter-active-class="animate__fadeInUp"
                    leave-active-class="animate__zoomOut" appear>
          <!-- 用户注册的时候展示信息 -->
          <div v-show="!isShow"
               style="display: flex;flex-direction: column;align-items: center;justify-content: center;width: 100%;height: 100%">
            <!-- 欢迎语 -->
            <div
                style="flex: 2;display: flex;align-items: center;font-size: 22px;color: #FFFFFF;font-weight: bold">
              欢迎注册
            </div>
            <!-- 欢迎图片 -->
            <div style="flex: 2">
              <el-button type="success" style="background-color:rgba(97,116,131,0.66);border: 1px solid #ccc8c8;" round
                         @click="changeToLogin">已有账户？点击登录
              </el-button>
            </div>
          </div>
        </transition>
      </div>
    </div>

  </div>
</template>

<script setup>
import {reactive, ref, watch} from "vue";
import api from "../../api/index.js";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
const store=useStore();
const router = useRouter()
const formData = reactive({
  username: "manager",
  password: "123",
  role: "管理员",
  verifyCode: ""
})
const login = () => {
  console.log("登录角色", formData.role)
  //如果为管理员 =>header部分显示 成果信息后台管理系统
  api.post("/login", formData).then(res => {
    console.log("登陆之后后端返回的数据是 ", res.data);
    if (res.data.flag === true) {
      store.commit("inittabList")//登录成功之后 初始化面包屑 和tag标签
      //存入token
      let tokenValue = res.data.data.tokenValue;
      let tokenName = res.data.data.tokenName;
      //存入角色
      if (tokenValue && tokenName) {
        let role = res.data.message;
        console.log("tokenValue is ", tokenValue)
        console.log("tokenName is ", tokenName)

        console.log("role is ", role)
        sessionStorage.setItem('saToken', tokenValue); //会话存储里面
        sessionStorage.setItem('tokenName', tokenName);
        sessionStorage.setItem('role', role);
        ElMessage({
          message: '登录成功,欢迎回来! ' + formData.username,
          type: 'success',
        })
        router.push("/home")
      }
    } else {
      ElMessage({
        message: res.data.message,
        type: 'error',
      })
    }
  })
}
const refresh=()=>{
  //为什么后面要加时间呢？
  //在某些情况下，浏览器可能会缓存从服务器获取的图片。如果验证码图片被缓存，那么每次刷新页面时，页面上显示的验证码图片就不会变化，这样就会影响验证码的安全性和有效性。
  // 为了避免这种情况，可以在请求验证码图片的 URL 后面添加一个随机参数，使得每次请求的 URL 都不同。这样，即使图片被缓存，每次请求的 URL 也会不同，浏览器就会重新获取验证码图片。这个随机参数可以是当前时间的毫秒数，或者是一个随机数等。
  document.getElementById("code").src="http://localhost:8080/getCode?time="+new Date().getTime();
}
const styleObj = reactive({
  bordertoprightradius: '15px',
  borderbottomrightradius: '15px',
  bordertopleftradius: '0px',
  borderbottomleftradius: '0px',
  rightDis: '0px'
})
const isShow = ref(true);

const changeToRegiest = () => {
  styleObj.bordertoprightradius = '0px'
  styleObj.borderbottomrightradius = '0px'
  styleObj.bordertopleftradius = '15px'
  styleObj.borderbottomleftradius = '15px'
  styleObj.rightDis = '50%'
  isShow.value = !isShow.value
};
const changeToLogin = () => {
  styleObj.bordertoprightradius = '15px'
  styleObj.borderbottomrightradius = '15px'
  styleObj.bordertopleftradius = '0px'
  styleObj.borderbottomleftradius = '0px'
  styleObj.rightDis = '0px'
  isShow.value = !isShow.value
}

const checkForm = ref(null) //ref对象
//自定义校验规则  校验两次输入的密码
const validatecheckPass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入确认的密码!'))
  } else if (value !== ruleForm.password) {
    callback(new Error("两次输入的密码不一致,请重新尝试"))
  } else {
    callback()
  }
}
const rules = reactive({//校验规则
  username: [{required: true, message: 'username为学号', trigger: 'blur'}, {
    min: 3,
    max: 10,
    message: '用户名在 3 到 10 个字符之间',
    trigger: 'blur'
  }],
  password:[{required: true, message: '注意密码安全性', trigger: 'blur'}, {
    min: 3,
    max: 10,
    message: '密码应该在 3 到 10 个字符之间',
    trigger: 'blur'
  }],
  name:[{required: true, message: '姓名为必填项', trigger: 'blur'}],
  email:[{required: true, message: 'qq邮箱号为必填项', trigger: 'blur'}],
  major:[{required: true, message: '注意专业填写格式,如计科2101', trigger: 'blur'}],
   checkPass:[{ validator: validatecheckPass, trigger: 'blur' }],

})
const ruleForm=reactive({
      username:"",
      password: '',
      role: "学生",
      name:"",
      major:'',
      email:"",
      checkPass: '',
      status:1,
})
const progressLength=ref(0)
//进度条
//监听对象数据
watch(()=>ruleForm.password,(newValue,oldValue)=>{
  console.log('old',oldValue);
  console.log('new',newValue);
  progressLength.value=newValue.length*10;
})
const format=(percentage)=> {
  if (percentage <=30) {
    return '密码安全性弱';
  } else if (percentage>30&&percentage<=60 ) {
    return '密码安全性中';
  }
  else  if(percentage>60&&percentage<=80){
    return '密码安全性较强';
  }
  else{
    return"密码安全性强"
  }
}
const getColor=(percentage)=>{
  if (percentage <=30) {
    return '#f56c6c';
  } else if (percentage<=60 &&percentage>30) {
    return '#e6a23c';
  }
  else  if(percentage>60&&percentage<80){
    return '#1989fa';
  }
  else {
    return '#5cb87a';
  }

}

//用户注册
const register=()=>{
  checkForm.value.validate((valid) => {
    if(valid){
      console.log("校验结果",valid)
      console.log("表单内容",ruleForm)

      api.post("/register" , ruleForm).then(res => {
        console.log("编辑之后的 res is ",res);
        if (res.data.flag === true) {
          ElMessage({
            type: 'success',
            message: res.data.message,
          })
        } else {
          ElMessage({
            type: 'warning',
            message: res.data.message,
          })
        }
      })
    }
    else{
      ElMessage({
        type: 'warning',
        message: '请检查所填表单字段是否有效',
      })
    }
  })
}
const reSetForm=()=>{
  ruleForm.username="";
  ruleForm.password= ''
  ruleForm.role= "学生"
  ruleForm.name=""
  ruleForm.major=''
  ruleForm.checkPass= ''
  ruleForm.status=1
}
//找回密码
const findPwd=()=>{
  router.push({name:'passwordRecovery'})
  //跳转到找回密码的页面
}
</script>

<style scoped>
.base {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("../../assets/images/two.jpg");

  background-size: 100% 100%;
}

.loginAndRegist {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.loginArea {
  background-color: rgba(239, 233, 233, 0.8);
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
  height: 400px;
  width: 540px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.registArea {
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  height: 400px;
  width: 540px;
  background-color: rgba(239, 233, 233, 0.8);
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.showInfo {
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  position: absolute;
  z-index: 2;
  height: 400px;
  width: 540px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("../../assets/images/inside.jpg");
  background-size: 80% 85%;
}

.showInfo:hover {
  background-size: 100%;
  background-position: -80px -70px;
}
.title {
  width: 70%;
  flex: 1;
  border-bottom: 1px solid rgba(97, 116, 131, 0.97);
  display: flex;
  align-items: center;
  color: rgba(97, 116, 131, 0.97);
  font-weight: bold;
  font-size: 24px;
  display: flex;
  justify-content: center;
}

#aaa {
  transition: 0.3s linear;
}

.pwdArea {
  width: 100%;
  flex: 2;
  display: flex;
  flex-direction: column;
  display: flex;
  flex-direction: column;


}

.pwdArea input {
  outline: none;
  height: 30%;
  border-radius: 13px;
  padding-left: 10px;
  font-size: 12px;
  border: 1px solid gray;
}

.pwdArea input:focus {
  border: 2px solid rgba(97, 116, 131, 0.97);
}

.btnArea {
  display: flex;
  flex: 1;
  width: 100%;
  display: flex;
  /*justify-content: space-around; !*水平居中*!*/
}

.rigestTitle {
  margin-left: 10%;
  width: 70%;
  flex: 1;
  color: rgba(97, 116, 131, 0.97);
  font-weight: bold;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgba(97, 116, 131, 0.97);
}

.registForm {
  flex: 2;
  width: 60%;
  flex-direction: column;
  color: rgba(97, 116, 131, 0.97);
  font-size: 16px;
}
.registBtn {
  width: 100%;
  flex: 1;
  display: flex;
  margin-top: 1px;
}
</style>
