<template>
  <div class="aside" >

    <el-menu
        :collapse="isFold"
        default-active="2"
        class="el-menu-vertical-demo"
        style="height: 100vh;"
        background-color=""
        active-text-color=""
    >
      <h2 class="menu-title" style="text-align: center; height: 4%;position: relative; top: 1%; color: #8e8e93;background-color: #ffffff">
        {{isFold ? 'M' : 'Menu' }}
      </h2>

      <el-menu-item @click="clickmenu(it)" v-for="it in noChildren" :key="it.name" :index="it.name" >
        <el-icon>
          <component :is="it.icon"/>
        </el-icon>
        <span>{{ it.label }}</span>
      </el-menu-item>


      <el-sub-menu @click="clickmenu(it)" v-for="it in hasChildren" :key="it.name" :index="it.name"
                   style="width:100%;background-color: #dbf5f5">
        <template #title>
          <el-icon>
            <component :is="it.icon"/>
          </el-icon>
          {{ it.name }}
        </template>
        <el-menu-item @click="clickmenu(subit)" v-for="subit in it.children" :key="subit.name" :index="subit.name">
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
import {
  Document,
  Location,
  Setting,
} from '@element-plus/icons-vue'
export default {
  name: "aside",
  components: {Location, Setting, Document},
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
          path: "/main/home",
          name: "home",
          label: "地震总体概览",
          icon: "HomeFilled",
        },
        {
          path: "/main/area",
          name: "area",
          label: "地区可视化分析",
          icon: "Histogram",
        },
        {
          path: "/main/history",
          name: "history",
          label: "历史时间线",
          icon: "Share",
        },
        {
          label: "更多",
          icon: "Menu",
          children: [
            {
              path: "/main/news",
              name: "news",
              label: "地震新闻网",
              icon: "Document",
            },
            {
              path: "/main/video",
              name: "video",
              label: "视频",
              icon: "VideoPlay",
            },
            {
              path: "/main/team",
              name: "team",
              label: "关于我们",
              icon: "Avatar",
            },
          ]
        },
      ]
    }
  },

}
</script>

<style scoped>
.aside{
  overflow: hidden;
}
.el-menu{
  border-right:none;
  overflow: hidden;
}
</style>
