<!---个人中心 进行密码 信息的修改---->
<template>
  <div class="personalInfo">
    <div class="infoTable" style="width: 50%;height: 97%;margin-left:2%;margin-top: 0.5%;border-radius: 10px">
      <el-card style="width: 100%;height: 100%;border-radius: 10px;padding: 0;background-color: #f1efef" shadow="hover">
        <h3 style="margin-left: 40%;margin-top: -20px;color: #9f9fa1">个人信息修改</h3>
        <el-form
            style="margin-top: 0.5%;max-width: 560px;"
            ref="ruleFormRefOne"
            :model="userInfo"
            status-icon
            label-width="150px"
            :rules="rulesOne"
        >
          <el-form-item label="password" prop="inputPasswordOne">
            <el-input v-model="userInfo.inputPasswordOne" show-password clearable :prefix-icon="Key" type="password"
                      autocomplete="off"
                      placeholder="修改个人信息时,请输入密码"/>
          </el-form-item>
          <el-form-item label="用户名" style="margin-bottom: 10px">
            <el-input
                v-model="userInfo.username"
                autocomplete="off"
                disabled
            />
          </el-form-item>
          <el-form-item label="账号状态" style="margin-bottom: 10px">
            <el-input v-model="userInfo.status" disabled/>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input clearable
                      v-model="userInfo.name"/>
          </el-form-item>
          <el-form-item label="专业班级" prop="major">
            <el-input clearable
                      v-model="userInfo.major"/>
          </el-form-item>
          <el-form-item label="qq号" prop="email">
            <el-input clearable v-model="userInfo.email"/>
          </el-form-item>
          <el-form-item label="地区" prop="area">
            <el-input clearable v-model="userInfo.area"/>
          </el-form-item>
          <!--          <el-form-item label="头像" prop="avtar">-->

          <!--          </el-form-item>-->
          <el-form-item label="头像" style="height: 100px; height: 100px" >
            <el-upload
                class="avatar-uploader"
                action="http://localhost:8080/upAvtar"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                accept=".jpg, .png"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" style="width: 100%; height: 150px"/>
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item style="margin-left: 40px; margin-top: 80px" >
            <el-button type="primary" @click="updateInfo()">确认修改个人信息</el-button>
            <el-button @click="resetFormOne()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>

    </div>


    <div class="other"
         style="width: 40%;height: 90%;margin-left: 1.5%;margin-top: 0.5%;background-color: #f3f3f3;border-radius: 10px">
      <div class="notification"
           style="width: 100%;height: 10%;background-color: #f1efef;border-radius: 10px;display: flex">
        <el-tooltip
            effect="dark"
            content="点击查看具体信息"
            placement="top-start"
        >
          <el-button style="margin-left: 2%;margin-top: 2%" plain @click="attention()" type="info"> 个人信息修改注意事项
          </el-button>

        </el-tooltip>
        <h4 style="margin-top: 2.8%;margin-left: 23px;font-size: 15px;font-style: italic;font-weight: normal;color: #d73c4c">
          用户修改信息时必看</h4>
        <el-button style="margin-top: 2.6%;margin-left: 10%;" type="danger" plain size="small" round :icon="Delete"
                   @click="deleteUser()"> 账号注销
        </el-button>
      </div>
      <div class="staticGraph"
           style="width: 100%;height: 87%;margin-top: 3%;background-color: #f1efef;border-radius: 10px">
        <h3 style="margin-left: 40%;margin-top:-18px;color: #9f9fa1">密码修改</h3>
        <el-form
            :rules="rulesTwo"
            ref="ruleFormRefTwo"
            style="margin-top: 1%;max-width: 560px;"
            :model="userInfo"
            status-icon
            label-width="150px"
        >
          <el-form-item label="原始密码" prop="inputPasswordTwo">
            <el-input v-model="userInfo.inputPasswordTwo" type="password" clearable :prefix-icon="Key"
                      autocomplete="off" placeholder="修改密码时,请输入原始密码"
                      show-password/>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword" style="margin-bottom: 15px">
            <el-input
                clearable :prefix-icon="Key"
                show-password
                placeholder="长度为6到10,建议包含大小写字母，数字"
                v-model="userInfo.newPassword"
                autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPassword" style="margin-bottom: 6px">
            <el-input v-model="userInfo.confirmPassword" clearable :prefix-icon="Key"
                      show-password/>
          </el-form-item>

          <el-form-item style="margin-left: 20%">
            <el-button type="primary" @click="updatePwd()"
            >确认修该密码
            </el-button
            >
            <el-button @click="resetFormTwo()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>


  </div>
</template>

<script  setup>
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
  Key
} from '@element-plus/icons-vue'
import {useRouter} from "vue-router";

const router = useRouter();
import {ElMessage, ElMessageBox, ElNotification} from "element-plus";
import {h, onMounted, reactive, ref} from "vue";
import { Plus } from '@element-plus/icons-vue'

import api from "../../api/index.js";
//上传图片
const imageUrl = ref('')

const handleAvatarSuccess= (
    response,
    uploadFile
) => {
  console.log("上传成功之后")
  console.log("response",response);
  console.log("uploadFile",uploadFile);
  imageUrl.value= response;
  userInfo.avtar = response;
}

const beforeAvatarUpload =(rawFile) => {
  console.log("上传之前 rawfile ",rawFile)
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}
const userInfo = reactive({
  "id": "",
  "username": "",
  "password": "",
  "name": "",
  "role": "",
  "major": "",
  "email": "",//邮箱号
  "status": "",
  "avtar":"",
  //-------------------------------
  "inputPasswordOne": "",   //个人信息修改时需要输入的密码
  "inputPasswordTwo": "",   //更改密码时需要输入的密码
  "newPassword": "",  //新密码
  "confirmPassword": "", //确认新密码
})
const updateInfo = () => {
  console.log("点击确认修改成功之后userinfo的信息 ", userInfo);
  let info = {
    "id": userInfo.id,
    "username": userInfo.username,
    "status": userInfo.status,
    "name": userInfo.name,
    'major': userInfo.major,
    'email': userInfo.email,
    'password': userInfo.password,  //还是之前密码
    'avtar':userInfo.avtar
  } //之后发出post请求
  ruleFormRefOne.value.validate((valid) => {

    if (userInfo.inputPasswordOne === "") {
      ElMessage({
        type: 'info',
        message: "未输入原始密码",
      })
      return;
    }
    if (userInfo.password !== userInfo.inputPasswordOne) {
      ElMessage({
        type: 'error',
        message: "原始密码输入错误!",
      })
      return;
    }
    if (valid) {
      console.log("通过");
      api.post("/editStudentInfo", info).then(res => {
        console.log(res);
        if (res.data.flag === true) {
          ElMessage({
            type: 'success',
            message: res.data.message,
          })
        } else {
          ElMessage({
            type: 'error',
            message: res.data.message,
          })
        }
      }).finally(getUserInfo)
      //触发成功验证表单，调用接口；
    } else {
      console.log("未通过");
      ElMessage({
        type: 'info',
        message: "未通过表单校验 请检查表单字段",
      })
    }
  });

}
const resetFormOne = () => {
  getUserInfo()
}
const resetFormTwo = () => {
  userInfo.inputPasswordTwo = ""
  userInfo.newPassword = ""
  userInfo.confirmPassword = ""
}
const updatePwd = () => {
  console.log("userinfo的信息 ", userInfo);
  let info = {
    "id": userInfo.id,
    "username": userInfo.username,
    "status": userInfo.status,
    "name": userInfo.name,
    'major': userInfo.major,
    'password': userInfo.newPassword //还是之前密码
  } //之后发出post请求
  ruleFormRefTwo.value.validate((valid) => {

    if (userInfo.inputPasswordTwo === "") {
      ElMessage({
        type: 'warning',
        message: "请输入原始密码",
      })
      return;
    }
    if (userInfo.newPassword !== userInfo.confirmPassword) {
      ElMessage({
        type: 'warning',
        message: "两次输入的密码不一致",
      })
      return;
    }
    if (userInfo.password !== userInfo.inputPasswordTwo) {
      ElMessage({
        type: 'error',
        message: "原始密码输入错误!",
      })
      return;
    }
    if (valid) {
      console.log("通过");
      api.post("/editStudentInfo", info).then(res => {
        console.log(res);
        if (res.data.flag === true) {
          ElMessage({
            type: 'success',
            message: res.data.message,
          })
          resetFormTwo()
        } else {
          ElMessage({
            type: 'error',
            message: res.data.message,
          })
        }
      }).finally(
          getUserInfo,
      )
      //触发成功验证表单，调用接口；
    } else {
      console.log("未通过");
      ElMessage({
        type: 'info',
        message: "未通过表单校验 请检查表单字段",
      })
    }
  });

}
const deleteUser = () => {
  ElMessageBox.confirm(
      '此操作将注销您的账号,后续将无法找回,且所填写的成果数据也将被删除,请慎重考虑',
      'Warning',
      {
        confirmButtonText: '确定注销',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        api.delete("/student/" + userInfo.username).then(res => {
          console.log("删除信息为", res)
          if (res.data.flag === true) {
            ElMessage({
              type: 'success',
              message: '账号注销成功',
            })
            sessionStorage.removeItem('saToken'); //会话存储里面
            sessionStorage.removeItem('tokenName');
            sessionStorage.removeItem('role');
            router.push("/login") //删除之后跳转到登录页面
          } else {
            ElMessage({
              type: 'success',
              message: res.data.data.message,
            })
          }
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '操作取消',
        })
      })

}

onMounted(() => {
  getUserInfo();
})
const getUserInfo = () => {
  api.get("/getUserInfo").then(res => {
    console.log("获取到的用户信息", res.data.data);
    Object.assign(userInfo, res.data.data)
    imageUrl.value=res.data.data.avtar;
  })
}
const attention = () => {
  ElNotification({
    title: 'Info',
    message: h('i', {style: 'color: teal;'}, '谨慎选择是否注销账号!注销之后后续将无法找回,且所填写的成果数据也将被删除,请慎重考虑。请保存好自己的账号密码，切勿将账号密码传递给他人，以防所填信息出现问题。如有，出现的后果将由本人承担。'),
    type: 'info',
    duration: 0,
  })
}

const ruleFormRefOne = ref(null)
const ruleFormRefTwo = ref(null)
const rulesOne = reactive({
  inputPasswordOne: [{
    required: true, message: "请填入原始密码", trigger: 'blur'
  }],
  name: [
    {required: true, message: '姓名不可为空', trigger: 'blur'},
  ],
  major: [
    {required: true, message: '专业不可为空', trigger: 'blur'},
  ],
  email: [
    {
      required: true,
      message: '不可为空,输入自己的QQ邮箱号,不需要加@qq.com后缀',
      trigger: 'blur',
    },
  ],
  area: [
    {required: true, message: '地区不可为空', trigger: 'blur'},
  ],
})
//校验密码安全性
const validatePassword=(rule,value,callback)=>{
  //正则表达式检验
  let hasUppercase = /[A-Z]/.test(value);
  let hasLowercase = /[a-z]/.test(value);
  let hasNumber = /[0-9]/.test(value);
  let hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value);

  if(!hasUppercase){
    callback(new Error('密码中需要包含大写字母!'))
    return false
  }
  if(!hasLowercase){
    callback(new Error('密码中需要包含小写字母!'))
    return
  }
  if(!hasNumber){
    callback(new Error('密码中需要包含数字!'))
    return
  }
  if(!hasSpecialChar){
    callback(new Error('密码中需要包含特殊字符!'))
    return
  }
  if(!(value.length>=6&&value.length<=10)){
    callback(new Error('密码中长度应该在6-10位!'))
  }
  callback()//最后一定要使用回调函数
}



const rulesTwo = reactive({
  inputPasswordTwo: [
    {required: true, message: "请填入原始密码", trigger: 'blur'}, {
      min: 3,
      max: 10,
      message: 'Length should be 3 to 10',
      trigger: 'blur'
    }],
  newPassword: [{ validator: validatePassword, trigger: 'blur' },
    {required: true, message: '密码不可为空', trigger: 'blur'},
  ],
  confirmPassword: [
    {
      required: true,
      message: '密码不可为空',
      trigger: 'blur',
    }, {min: 3, max: 10, message: 'Length should be 3 to 10', trigger: 'blur'}
  ],
})


</script>

<style scoped>
.personalInfo {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #f3f3f3;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  text-align: center;
}
</style>
