<template>
  <div class="MessageArea" >
    <div class="intro" style="background-image: linear-gradient(135deg, #2afadf 10%, #4c83ff);
        border-radius: 4px;height: 40px;display: flex; align-items: center; justify-content: center;">
      <el-icon style="color: white;" size="19"><Promotion /></el-icon>
      <h3 style="color: #eee7e7">消息中心</h3>
    </div>
    <div v-for="message in messageList" :key="message.id"
         :class="{'success': message.status === '接收', 'warning': message.status === '拒绝', 'message': true}">
      <el-button link type="danger" size="large" @click="open(message.id)" style="margin-left: 93%">
        <el-icon color="white">
          <DeleteFilled />
        </el-icon>
        <span style="color: white;margin-top: 4px">删除消息</span>
      </el-button>
      <h2>{{ message.status }}</h2>
      <h4>{{ message.audittime }}</h4>
      <div style="display: flex;justify-content: space-between;">
        <p>{{ message.message }}</p>
        <p style="font-size: large;font-weight: bold">{{message.project}} ———— {{message.name}}</p>
      </div>
    </div>

  </div>
</template>
<script setup>

import {markRaw, onMounted, ref} from "vue";
import api from "../../api/index.js";
import {ElMessage, ElMessageBox, ElNotification} from 'element-plus'
import {Delete} from "@element-plus/icons-vue";
const messageList=ref([]);
onMounted( ()=>{
  getUserMessage();
})
const getUserMessage=()=>{
  api.get("Message/getUserMessage").then(res => {
    messageList.value=res.data.data;
    console.log("用户获取的消息为",messageList.value);
  })
}
const open=(num)=>{
  ElMessageBox.confirm(
      '删除后该消息将不会出现在消息列表之中. 确定删除吗?',
      'Warning',
      {
        type: 'warning',
        icon: markRaw(Delete),
      }
  ) .then(() => {
        deleteMessage(num);
  })
}
const deleteMessage = (id) => {
  api.delete(`Message/${id}`).then(res => {
    if(res.data.flag===true){
      ElNotification({
        title: 'Success',
        message: '消息删除成功',
        type: 'success',
      })
    }
    else{
      ElNotification({
        title: 'Error',
        message: '消息删除失败',
        type: 'error',
      })
    }
  }).finally(getUserMessage);
}
</script>

<style scoped>
* {
  font-family: Roboto;
}

.MessageArea{
  margin: auto;
  width: 80%;
  /*background-color: #ffffff;*/
}
h2 {
  font-weight: 100;
  font-size: 30pt;
  line-height: 1.3em;
  margin: 1px 0;
}
h4{
  font-weight:100;
  font-size: 15pt;
  line-height: 1.2em;
  margin: 6px 0;
}

div.message {
  position: relative;
  border-radius: 10px;
  padding: 20px;
  padding-left: 35px;
  margin: 30px 10px;
  box-shadow:0 2px 5px rgba(0,0,0,.3);
  background: #BBB;
  color: #FFF;
  -webkit-transition: all .5s ease;
  -moz-transition: all .5s ease;
  -ms-transition: all .5s ease;
  -o-transition: all .5s ease;
  transition: all .5s ease;
}
div.message:hover{
  box-shadow: 0 15px 20px rgba(10,0,10,.3);
  -webkit-filter: brightness(110%);
}

div.message:before{
  content: '';
  font-family: FontAwesome;
  position: absolute;
  display: block;
  top: -21px;
  left: 50%;
  margin:0 -21px;
  font-size: 20px;
  line-height: 24px;
  text-align: center;
  width: 24px;
  padding:10px;
  background: inherit;
  box-shadow:0 5px 10px rgba(0,0,0,.25);
  color: rgba(255,255,255,.75);
  border-radius:50%;
  border: 2px solid transparent;
  z-index: 2;
}

div.message.information:before{content:'\f129';}
div.message.announcement:before{content:'\f0f3';}
div.message.success:before{content:'\f00c';}
div.message.warning:before{content:'\f12a';}
div.message.error:before{content:'\f00d';}

div.message.information{background: #39B;}
div.message.warning{background: #E74;}
div.message.success{background: #5A6;}
div.message.announcement{background: #EA0;}
div.message.error{background: #C43;}
</style>
