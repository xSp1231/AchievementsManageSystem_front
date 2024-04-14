<template>
  <div class="intro">
    <div class="notification-header">
      <p>校园动态</p>
    </div>

      <div class="notification-items">
        <div class="notification-item" v-for=" intro in introList" :key="intro.id">
          <div class="notification-avatar">
            <el-avatar :src=intro.picture size="default"></el-avatar>
          </div>
          <div class="notification-item-content">
            <div class="notification-item-content-title" style="margin-top: 17px">
              <el-link :href=intro.link type="primary">{{intro.intro}}</el-link>
            </div>
          </div>

        </div>
      </div>
  </div>
</template>

<script  setup>
import {onMounted, reactive} from "vue";
onMounted(()=>{
  console.log("introLIST IS ",introList)
})
const introList = [
  {
    id:1,
    picture:"https://pic4.zhimg.com/v2-2928f3c5218f6c42e759880263cc2234_1440w.jpg?source=172ae18b",
    intro: '计算机科学与技术学院官网',
    link: "https://codepen.io/search/pens?q=announce&cursor=ZD0xJm89MCZwPTc=",
  },
  {
    id:2,
    picture:"https://avatars.githubusercontent.com/u/68583457?s=400&v=4",
    intro: 'element-Plus',
    link: "https://codepen.io/search/pens?q=announce&cursor=ZD0xJm89MCZwPTc=",
  },{
    id:3,
    picture:"https://is1-ssl.mzstatic.com/image/thumb/Purple114/v4/89/12/bc/8912bcc5-f610-8eb3-2238-e4664e83fa4b/source/512x512bb.jpg",
    intro: 'leetCode',
    link: "https://codepen.io/search/pens?q=announce&cursor=ZD0xJm89MCZwPTc=",
  },{
    id:4,
    picture:"https://www.bing.com/th?id=OIP.4soj80b01U0y1FpZWqXYlAHaHa&w=185&h=185&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
    intro: 'codeOpen',
    link: "https://codepen.io/search/pens?q=announce&cursor=ZD0xJm89MCZwPTc=",
  },{
    id:5,
    picture:"https://th.bing.com/th/id/OIP.OfElg64D9b7xoLAjHaUXowAAAA?rs=1&pid=ImgDetMain",
    intro: 'CCF-CSP',
    link: "http://118.190.20.162/",
  },{
    id:6,
    picture:"https://www.bing.com/th?id=OIP.c0iIyE2V0os2corDMYbKswHaHg&w=150&h=152&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
    intro: 'Github',
    link: "https://github.com/",
  },
]
</script>

<style scoped>
.intro {
  width: 100%;
  background-color: #f9f9fc;
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  height: calc(100vh - 120px);
  transition: all 300ms cubic-bezier(0.19, 1, 0.56, 1);
}
.notification-header {
  display: flex;
  width:100%;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 24px;
  padding: 32px 24px 0 24px;
  color: #9f9fa1;
}

.notification-header p {
  font-size: 24px;
  line-height: 32px;
  font-weight: 600;
  opacity: 0.9;
  margin: 0;
}

.notification-item {
  border-top: 1px solid ;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  width: 100%;
}

.notification-item-content {
  padding-left: 16px;
  width: 100%;
}

.notification-item-content-title {
  font-size: 16px;
  line-height: 4px;
  font-weight: 600;
  margin-bottom: 5px;
  display: flex;
  justify-content: left;
}

.notification-item-content-line p,
.notification-item-date p{
  font-size: 14px;
  line-height: 20px;
  margin: 8px 0;
  color: #fff;
  opacity: 0.7;
  display: flex;
  text-align: left;
  width: 100%;
}

.notification-item-date p {
  flex-direction: row-reverse;
}
</style>
