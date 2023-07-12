<template>
  <div class="commonaside" >

    <el-menu
        :collapse="isFold"
        class="el-menu-vertical-demo"
        style="height: 100vh;"
        background-color="rgb(52,73,94)"
        active-text-color="white"
        text-color=" #e3e1e1"
    >
      <h2 class="menu-title" style="text-align: center; height: 5%;position: relative; top: 1%; color:  #e3e1e1;background-color: rgb(52,73,94)">
        {{isFold ? 'M' : 'Menu' }}
      </h2>

      <el-menu-item @click="clickmenu(it)" v-for="it in noChildren" :key="it.name" :index="it.name">
        <el-icon>
          <component :is="it.icon"/>
        </el-icon>
        <span style="color: #e3e1e1" >{{ it.label }}</span>
      </el-menu-item>

      <el-sub-menu  v-for="it in hasChildren" :key="it.name" :index="it.name"
                   style="width:100%;">
        <template #title>
          <el-icon>
            <component :is="it.icon"/>
          </el-icon>
          <span v-if="isFold===false">{{ it.label }}</span>
        </template>
        <el-menu-item  @click="clickmenu(subit)" v-for="subit in it.children" :key="subit.name" :index="subit.name">
          <el-icon>
            <component :is="subit.icon"/>
          </el-icon>
          <span>{{ subit.label }}</span>
        </el-menu-item>
      </el-sub-menu>

    </el-menu>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mapMutations } from "vuex";
import {
  Document,
  DocumentAdd,
  Location,
  Setting,
  DataAnalysis,
  UserFilled,
  Avatar
} from '@element-plus/icons-vue'
export default {
  name: "aside",
  components: {Location, Setting, Document,DataAnalysis,UserFilled,Avatar,DocumentAdd},
  computed: {
    ...mapState(['isCollapse']),
    isFold() {
      console.log("接收到的值",this.isCollapse)
      return this.isCollapse;
    },
    noChildren() {
      this.a = this.menudata.filter(item => !item.children)
      return this.menudata.filter(item => !item.children)//无子页面
    },
    hasChildren() {
      this.b = this.menudata.filter(item => item.children)
      return this.menudata.filter(item => item.children)//有子页面
    },
  },
  data(){
    return{
      flag:true,
      menudata: [//菜单栏里面的数据
        {
          path: "/home",
          name: "home",
          label: "主页",
          icon: "HomeFilled",
        },
        {
          path: "/userManage",
          name: "userManage",
          label: "用户管理",
          icon: "UserFilled",
        },
        {
          path: "/notice",
          name: "notice",
          label: "公告管理",
          icon: "Share",
        },
        {
          path: "/personalCenter",
          name: "personalCenter",
          label: "个人中心",
          icon: "Avatar",
        },
        {
          label: "成果信息表",
          name:  "成果信息表",
          icon: "Menu",
          children: [
            {
              path: "/scientificPapers",
              name: "scientificPapers",
              label: "科技论文表",
              icon: "Document",
            },
            {
              path: "/monograph",
              name: "monograph",
              label: "专著表",
              icon: "Document",
            },
            {
              path: "/patentSoft",
              name: "patentSoft",
              label: "专利软著表",
              icon: "Document",
            },
            {
              path: "/projects",
              name: "projects",
              label: "项目表",
              icon: "Document",
            },
            {
              path: "/reward",
              name: "reward",
              label: "奖励表",
              icon: "Document",
            },
          ]
        },

      ]
    }
  },
  methods:{
    ...mapMutations(['updateBread']),
    clickmenu(it){
      if(it.path!==this.$route.path){
        this.$router.push(it.path);
      }
      this.updateBread(it);
     // this.$router.push(it.path)
      console.log("点击的菜单路由是",it.path);
    }
  }
}
</script>

<style scoped>
.commonaside{
  overflow: hidden;
}
.el-menu{
  border-right:none;
  overflow: hidden;
}
</style>
