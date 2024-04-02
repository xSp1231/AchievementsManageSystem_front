<template>
  <div class="commonaside" >

    <el-menu
        :collapse="isFold"
        class="el-menu-vertical-demo"
        style="height: 100vh;"
        background-color="rgb(52,73,94)"
        active-text-color="rgba(31,170,189,0.91)"
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
                   style="width:100%;background-color: rgba(31,170,189,0.91)">
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

<script setup>
import {
  Document,
  DocumentAdd,
  Location,
  Setting,
  DataAnalysis,
  UserFilled,
  Avatar
} from '@element-plus/icons-vue'
import {computed, onMounted, reactive, ref} from "vue";
import {useStore} from 'vuex';
import {useRouter,useRoute} from "vue-router";
const store = useStore()
const router = useRouter();
const route=useRoute();
const isFold=computed(()=>store.state.isCollapse )
const role=computed(()=>store.state.role)
const noChildren=computed(()=>menudata.filter(item => !item.children))
const hasChildren=computed(()=>menudata.filter(item => item.children))
const flag =ref(true)
const menudata=reactive([])

onMounted(()=>{
  console.log("aside aside aside")
  store.commit("getRole")     //获得登陆者角色
  store.commit("getUsername")
  //findUsername()
  console.log("当前的角色是 ",role.value)
  changeMenu()
})
const findUsername=()=>{
  //是学生才找用户名
  if(store.state.role==="student"){
    store.commit("getUsername") //获得用户名 方便之后用户登录之后  展现表的信息
  }

}

//动态改变菜单
const changeMenu=()=>{
  if(role.value==="admin"){
  const t= [//菜单栏里面的数据
    {
      path: "/home",
      name: "home",
      label: "系统公告",
      icon: "HomeFilled",
    },
    {
      path: "/dataVisualization",
      name: "dataVisualization",
      label: "数据可视化",
      icon: "Histogram",
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
  }
] //将一个数组赋值给响应式数组变量
  menudata.length=0;
  menudata.push(...t)
  console.log("menudata is ",menudata);
}
  if(role.value==="student"){
    const t= [//菜单栏里面的数据
      {
        path: "/home",
        name: "home",
        label: "系统公告",
        icon: "HomeFilled",
      },
      {
        path: "/dataVisualization",
        name: "dataVisualization",
        label: "数据可视化",
        icon: "Histogram",
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
      }
    ] //将一个数组赋值给响应式数组变量
    menudata.length=0;
    menudata.push(...t)
    console.log("menudata is ",menudata);
  }
}


const clickmenu=(it)=>{
  if(it.path!==route.path){ //route.path是当前所在的path  it.path是点击要去的path
    console.log("route is ",route.path)
    console.log("it.path is ",it.path)
    router.push(it.path);
  }
  store.commit('updateBread',it)
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
