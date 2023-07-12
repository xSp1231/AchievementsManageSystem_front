<template>
<div class="tagArea" >
  <el-tag
      v-for="(item,index) in tabsList"
      :key="item.name"
      :closable="item.name!=='home'"
      :effect="item.name===$route.name? 'dark':'light'"
      size="default"
      style="margin-left: 5px;margin-top: 8px;"
      type="info"
      @click="changeTag(item)"
      @close="deletetag(item,index)"
  >
    {{ item.label}}
  </el-tag>
</div>
</template>

<script>
import { mapState ,mapMutations} from 'vuex';
export default {
  name: "Tag",
  data(){
    return{

    }
  },
  computed:{
    ...mapState(['tabsList'])
  },
  methods:{
    changeTag(item){//点击标签 进入页面
      this.$router.push(item.path)
    },
    //点击删除标签
    ...mapMutations(['closetag']),   //将store里面的closetag映射到Tag组件里面 那么我就可以直接在现在的组件里面使用closetag()函数
    deletetag(item,index){//删除标签；   ///index为当前所点击的tag的索引
      console.log("index is ",index);
      this.closetag(item);//调用mutation里面的closetag()
      //this.$store.commit("closetag",item)//也可以使用这种方法
      const length=this.tabsList.length;//最后一个标签的下标
      //删除了标签之后 那么网页也应该跳转
      if(this.$route.path!==item.path){//当前网页所在的链接 和我要删除的网页连接不一样的话 那么就不需要跳转网页
        return;
      }
      if(index===length){//如果删除的是最后一个标签 那么就回到上一个网页
        this.$router.push(this.tabsList[index-1].path);
      }
      else{//当前网页所在的链接 和我要删除的网页连接一样 并且不是最后一个标签 那么我就可以跳到往后一个标签网页哪里
        this.$router.push(this.tabsList[index].path);
      }
    }

  }
}
</script>

<style scoped>
.tagArea{
  width: 100%;
  height: 40px;
  background-color: #e1e0e0;
}

</style>
