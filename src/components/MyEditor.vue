<template>
<!--  <el-button type="success" @click="change()">样式</el-button>-->
  <div style="border: 1px solid #ccc;">
    <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
    />
    <Editor
        style="height: 360px; overflow-y: hidden;"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
    />
  </div>
</template>
<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { computed } from 'vue';
    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef()
    // 内容 HTML
    const valueHtml = ref('<p>测试</p>')
    const toolbarConfig = {}//工具栏配置
    const editorConfig = { placeholder: '请输入内容...',
                           readOnly:false, //限制为只读状态
                           MENU_CONF:{
                           uploadImage:{
                             server:"http://localhost:8080/uploadToOss", //上传到oss
                             fieldName:"file",
                             allowedFileTypes: ['image/*'], //只允许图片 默认也是
                             customInsert(res,insertFn){
                               if(res.flag===true){
                               console.log(res.message); //得到图片链接
                               let url=res.message;
                               insertFn(url)
                               }
                               else{
                                 this.$message.error("图片插入失败!")
                               }
                             }
                           }
                        }
         }//编辑器配置 包含图片上传
    // 模拟 ajax 异步获取内容
    const myComputed = computed(() => {
      // 计算逻辑
      return  valueHtml.value;
    });
    function  change(){
      let comment="<h2>这是我的测试</h2><h2><span style=\"color: rgb(66, 144, 247);\"><strong>文本</strong></span><span style=\"color: rgb(66, 144, 247);\"><s><strong>内容</strong></s></span><span style=\"color: rgb(66, 144, 247);\"><strong>上传 &nbsp;</strong></span><span style=\"color: rgb(225, 60, 57);\"><strong>图片上传</strong></span></h2><p><img src=\"https://xsp-datastore.oss-cn-chengdu.aliyuncs.com/17b334704d544afb81dea6f999106c04.jpg\" alt=\"\" data-href=\"\" style=\"width: 349.00px;height: 196.31px;\"/></p><p>图片可以调整大小😁🤣😍</p>"
      valueHtml.value=comment
    }
    onMounted(() => {

    })
    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor = editorRef.value
      if (editor == null) return
      editor.destroy()
    })

    const handleCreated = (editor) => {
      editorRef.value = editor // 记录 editor 实例，重要！
    }
</script>
