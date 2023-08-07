<template>
  <div class="resetPassword">
    <div class="container">
      <el-steps :active="active" align-center finish-status="success" >
        <el-step title="Step 1" description="验证用户名和邮箱" :icon="Edit"/>
        <el-step title="Step 2" description="输入验证码" :icon="Promotion"/>
        <el-step title="Step 3" description="设置新密码" :icon="Key"/>
      </el-steps>
      <div v-if="active === 0" class="common_div"><!---输入用户名-邮箱号-->
        <el-form :model="Form" class="user-container" :rules="stepOneRules" ref="stepOne" label-position="left"
                 label-width="70px" size="default">
          <el-form-item style="float:right; width: 80%" label="用户名" prop="username">
            <el-input type="text" v-model="Form.username" autofocus ref="username" auto-complete="off"
                      placeholder="请输入要找回密码的用户名" :prefix-icon="UserFilled" spellcheck="false" clearable>
            </el-input>
          </el-form-item>
          <el-form-item style="float: right; width: 80%" label="邮箱号" prop="email">
            <el-input v-model="Form.email" autofocus ref="email" auto-complete="off"
                      placeholder="请输入用来找回密码的邮箱(不需要加@qq.com后缀)" :prefix-icon="Message" spellcheck="false" clearable>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="active === 1" class="common_div2"><!--获得验证码---->
        <el-form :model="codeForm" style="width: 67%;margin-top: 2%" label-position="left" label-width="60px"
                 size="medium">
          <el-form-item style="float: right; width: 70%;margin-left:8px" label="验证码">
            <el-input type="text" v-model="codeForm.code" autofocus ref="code" auto-complete="off"
                      placeholder="请输入邮箱验证码" :suffix-icon="Key" spellcheck="false">
            </el-input>
            <el-button style="margin-top: 5px" :disabled="buttonContent.disabled" @click="getVerifyCode()">
              {{ buttonContent.text }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="active === 2" class="common_div">
        <el-form :model="passwordForm" class="user-container" :rules="updatePwdRules" ref="passwordFormRef"
                 label-position="left" label-width="70px" size="medium">
          <el-form-item :rules="updatePwdRules" prop="password" style="float: right; width: 80%" label="新密码">
            <el-input :suffix-icon="Key" type="password" v-model="passwordForm.password" autofocus
                      clearable
                      maxlength="10"
                      auto-complete="off" placeholder="请输入新密码(注意密码安全性)">
            </el-input>
            <div class="demo-progress" style="margin-left:25%;height: 15px;margin-top: 13px">
              <el-progress striped striped-flow :duration="8" style="width: 240px;" :percentage="progressLength"
                           :format="format" :color="getColor"/>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="common_div" style="display: flex">
        <el-button :disabled="active===3" :icon="Pointer" style="margin-left: 32%" @click="next()"  class="action_button">下一步</el-button>
        <el-button style="margin-left: 6%" @click="toLoginAndRegister()" :disabled="disabled" class="action_button">
          回到登陆页面
        </el-button>
      </div>
      <div class="tips" style="margin-top: 3%">
        <el-link type="info"  underline style="color: #666b75;margin-left: 35%;height: 30px" >tips:操作过程中不要刷新页面</el-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import {Edit,Pointer, Key, UserFilled, Message, Promotion} from '@element-plus/icons-vue'
import {onMounted, reactive, ref, watch} from "vue";
import api from "../../api/index.js";
import {ElMessage, ElMessageBox, ElNotification} from "element-plus";
import {useRouter} from "vue-router";
const active = ref(0)
const Form = reactive({
  username: '',
  email: '',
})
const codeForm = reactive({
  code: '',
})
const passwordForm = reactive({
  password: '',
})
const disabled = ref(false)

const stepOne = ref(null);
const stepOneRules = reactive({//校验规则
  username: [{required: true, message: 'username为学号', trigger: 'blur'}],
  email: [{required: true, message: '邮箱号为必填项，确保与自己账号所绑定的邮箱号一致', trigger: 'blur'}]
})
const updatePwdRules = reactive({
  password: [{required: true, message: 'username为学号', trigger: 'blur'}, {
    min: 3,
    max: 10,
    message: '密码应在 3 到 10 个字符之间',
    trigger: 'blur'
  }],
})
const passwordFormRef = ref(null)
//按钮绑定的属性
const buttonContent = reactive({
  disabled: false,//按钮的状态 是否可以点击
  text: "点击获取验证码",
  duration: 60,
  timer: null,//存储定时器的引用
})
//进度条
const progressLength = ref(0)
//进度条
//监听对象数据
watch(() => passwordForm.password, (newValue, oldValue) => {
  console.log('old', oldValue);
  console.log('new', newValue);
  progressLength.value = newValue.length * 10;
})
const format = (percentage) => {
  if (percentage <= 30) {
    return '密码安全性弱';
  } else if (percentage > 30 && percentage <= 60) {
    return '密码安全性中';
  } else if (percentage > 60 && percentage <= 80) {
    return '密码安全性较强';
  } else {
    return "密码安全性强"
  }
}
const getColor = (percentage) => {
  if (percentage <= 30) {
    return '#f56c6c';
  } else if (percentage <= 60 && percentage > 30) {
    return '#e6a23c';
  } else if (percentage > 60 && percentage < 80) {
    return '#1989fa';
  } else {
    return '#5cb87a';
  }

}
const getVerifyCode = () => {//请求后端发送验证码 6分钟有效  同时开启倒计时 60s  期间 按钮设置为不可点击状态。

  if (buttonContent.duration === 60) {
    buttonContent.disabled = true;//发送状态 按钮不可以点击
    //发送邮件
    api.get("/sendMail/" + Form.email).then(res => {
      if (res.data.flag === true) {
        ElNotification({
          title: 'success',
          message: "邮件已发送至" + Form.username + "用户的qq邮箱,请注意查收,验证码6分钟有效 ",
          type: 'success',
        })
      } else {
        ElNotification({
          title: 'Something wrong',
          message: "邮件发送失败,请稍后再试(或者联系管理员)",
          type: 'error',
        })
      }

    })

  }

  if (buttonContent.timer) {
    clearInterval(buttonContent.timer) //如果定时器存在 就先清除
  }
  buttonContent.timer = setInterval(() => {
    console.log(buttonContent.text)
    const temp = buttonContent.duration--;
    buttonContent.text = `${temp}秒`
    if (temp <= 0) {
      clearInterval(buttonContent.timer)//清除定时器
      buttonContent.duration = 60
      buttonContent.text = '重新获取'
      // 设置按钮可以单击
      buttonContent.disabled = false
    }

  }, 1000)


}
const next = () => {
  console.log("此时的active is ", active.value)
  // 当面板为0时，先判断用户名和邮箱是否输入，进行相关的验证
  if (active.value === 0) {
    stepOne.value.validate((valid) => {
      if (valid) {
        api.post("/checkUsernameAndEmail", Form).then(res => {
          console.log("第一次之后的 res is ", res);
          if (res.data.flag === true) {
            ElNotification({
              title: 'Success',
              message: res.data.message,
              type: 'success',
            })
            active.value++; //第一步成功 active++
          } else {
            ElNotification({
              title: 'Error',
              message: res.data.message,
              type: 'error',
            })
          }
        })
      } else {
        ElMessage({
          type: 'warning',
          message: '请检查所填表单字段是否有效',
        })
      }
    })
  }

  // 当面板为1时，则到了用户输入验证码的时候, 将验证码传入后台
  if (active.value === 1) {
    // 如果验证码未输入，提示用户
    if (codeForm.code === '') {
      ElNotification({
        title: 'warning',
        message: "验证码未输入,请到邮箱里面查看",
        type: 'warning',
      })
    } else if (codeForm.code.length !== 6) {
      ElNotification({
        title: 'warning',
        message: "请输入6位长度验证码",
        type: 'warning',
      })
    }
    //六位长度的情况  进行验证码的校验
    else { //校验验证码
      api.post("/checkEmailVerifyCode", {code: codeForm.code},
          {
            headers: {'Content-Type': 'multipart/form-data'} //设置响应类型form-data  因为是post请求 requestParam接收
          }).then(res => {
        if (res.data.flag === true) {//验证成功 状态改变
          ElNotification({
            title: 'Success',
            message: res.data.message,
            type: 'success',
          })
          active.value++;
        } else {
          ElNotification({
            title: 'error',
            message: res.data.message,
            type: 'error',
          })
        }
      })
    }


  }
  // 当面板为2时，则到了用户输入密码的时候, 将密码传入后台
  if (active.value === 2) {
    //在发送密码之前，先校验一下是否输入了，不能让用户不小心输入了空密码
    passwordFormRef.value.validate((valid) => {
      console.log("校验结果", valid)
      if (valid) {
        let student = {
          "username": Form.username,
          "email": Form.email,
          "password": passwordForm.password
        }
        api.post("/ResetPassword", student, {
          params: {
            code: codeForm.code
          }
        }).then(res => {
          if (res.data.flag === true) {
            ElNotification({
              title: 'Success',
              message: res.data.message,
              type: 'success',
            })
            active.value++;
          } else {
            ElNotification({
              title: 'error',
              message: res.data.message,
              type: 'error',
            })
          }
        })
      } else {
        ElNotification({
          title: 'error',
          message: "请检查重置密码是否符合要求",
          type: 'error',
        })

      }

    })


  }
}
const router=useRouter();
const toLoginAndRegister=()=>{
  ElMessageBox.confirm(
      '确定退出当前操作吗?如果中途放弃找回密码操作，之后再进行密码找回时,将重新开始',
      '提示',
      {
        confirmButtonText: '是',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        ElMessage({
          type: 'success',
          message: '回到登陆页面',
        })
        router.push("/LoginAndRegister")
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '操作取消',
        })
      })
}
</script>

<style scoped>
.resetPassword {
  background-image: url("../../assets/images/two.jpg");
  background-position: center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
}

.container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 12% auto;
  width: 750px;
  height: 320px;
  padding: 25px 30px;
  background: #e3dddd;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  opacity: 0.8;
}

.common_div {
  margin-top: 5%;
  width: 660px;
}

.user-container {
  width: 90%;
  background: #fff;

}

.action_button {
  width: 20%;
  margin-top: 3%;
  text-align: center;
}

</style>

