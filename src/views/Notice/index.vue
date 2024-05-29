<!---使用了vue3 setup写法  因为wangEditor是setup写法---->

<template>
  <div class="notice" style="width: 100%;height: 100%;background-color:#f8f8f8;border-radius: 10px">
    <h2 style="text-align: center;margin-bottom: 0.5%;color: rgba(126,124,124,0.75)">公告管理(Powered By wangEditor)</h2>

    <div class="noticeTable" style="margin-left: 5%;margin-right: 5%;">
      <el-button type="text" plain :icon="Plus" @click="addNotice()">点击发布公告</el-button>
      <el-button type="text" plain :icon="ChatLineRound" style="margin-left: 4%;color: #5287bc" >如果公告过多，管理员可以选择删除一些不再使用的公告。公告支持链接,图片上传,字体样式设置等功能</el-button>
      <el-table v-loading="loading" :data="tableData"  stripe height=540   style="width: 90%;"  >
        <el-table-column sortable prop="id"   label="公告ID"  width="120"/>
        <el-table-column sortable prop="time" label="发布时间" width="180"/>
        <el-table-column prop="title" label="标题" width="180"/>
        <el-table-column sortable prop="status" label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="row.status === '紧急' ? 'danger' : 'info'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="公告内容" width="180">
          <template #default="scope">
            <el-button :icon="ZoomIn" size="small" @click="view(scope.row)">点击查看详细内容</el-button>
          </template>
        </el-table-column>
        <el-table-column label="Operations">
          <template #default="scope">
            <el-button :icon="Remove" size="small" type="danger" plain @click="deleteNotice(scope.row)">删除公告</el-button>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <div class="no-data">
            <el-empty description="管理员暂未发布公告" />
          </div>
        </template>
      </el-table>
    </div>
    <!---添加公告时的对话框-->
    <el-dialog v-model="AddDialogVisible" style="width: 800px;height: 610px;" draggable  title="发布公告信息(请不要选择发送表情包)">

      <el-form
          ref="ruleForms"
          :rules="rules"
          :inline="true"
          :label-position="labelPosition"
          label-width="60px"
          :model="AddNoticeData"
        >
        <el-form-item label="标题" prop="title">
          <el-input v-model="AddNoticeData.title" placeholder="请为此次公告起一个标题" />
        </el-form-item>
        <el-form-item label="时间" prop="time" >
          <el-date-picker

              v-model="AddNoticeData.time"
              :value-format="'YYYY-MM-DD'"
              type="date"
              placeholder="公告发布时间"
              clearable
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
              placeholder="选择公告的状态"
              v-model="AddNoticeData.status"
              clearable
          >
            <el-option label="紧急" value="紧急" />
            <el-option label="一般" value="一般" />
          </el-select>
        </el-form-item>

      </el-form>
      <div style="border: 1px solid #ccc;">
        <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="AddEditorRef"
            :defaultConfig="AddToolbarConfig"
            :mode="mode"
        />
        <Editor
            style="height: 310px; overflow-y: hidden;"
            v-model="AddValueHtml"
            :defaultConfig="AddEditorConfig"
            :mode="mode"
            @onCreated="AddHandleCreated"
        />
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button   @click="closeAddDialog()">关闭</el-button>
        <el-button   @click="confirmAdd()" type="primary" plain >添加公告</el-button>
      </div>

     </el-dialog>
    <!---查看公告时的对话框---->
    <el-dialog v-model="ViewDialogVisible" style="width: 820px;height: 530px;" draggable  title="公告内容">

      <div style="border: 1px solid #ccc;">
        <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="ViewEditorRef"
            :defaultConfig="ViewToolbarConfig"
            :mode="mode"
        />
        <Editor
            style="height: 310px; overflow-y: hidden;"
            v-model="ViewValueHtml"
            :defaultConfig="ViewEditorConfig"
            :mode="mode"
            @onCreated="ViewHandleCreated"
        />
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button   @click="closeViewDialog()">关闭</el-button>
      </div>

    </el-dialog>

  </div>

</template>
<script setup>

import '@wangeditor/editor/dist/css/style.css' // 引入 css
import {onBeforeUnmount, onMounted, reactive, ref, shallowRef} from 'vue'
import api from '../../api/index.js'
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import {Plus, Remove, ZoomIn,ChatLineRound} from '@element-plus/icons-vue';
import {ElMessage, ElMessageBox} from "element-plus";
// --------------------------------------增加时的编辑器实例，必须用 shallowRef
const AddEditorRef = shallowRef()
// 内容 HTML
const AddValueHtml = ref('<p>测试test</p>')
const AddToolbarConfig = {}//工具栏配置
const AddEditorConfig = reactive({
  placeholder: '请输入内容...',
  readOnly: false, //限制为只读状态  true为只读状态
  MENU_CONF: {
    uploadImage: {
      server: "http://47.109.143.177:8080/uploadToOss", //上传到oss
      fieldName: "file",
      allowedFileTypes: ['image/*'], //只允许图片 默认也是
      customInsert(res, insertFn) {
        if (res.flag === true) {
          console.log(res.message); //得到图片链接
          let url = res.message;
          insertFn(url)
        } else {
          ElMessage({
            type: 'warning',
            message: '图片插入失败',
          })
        }
      }
    }
  }
})

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const AddEditor = AddEditorRef.value
  if (AddEditor == null) return
  AddEditor.destroy()
})
const AddHandleCreated = (AddEditor) => {
  AddEditorRef.value = AddEditor // 记录 editor 实例，重要！
}
///---------------------------------------查看时的编辑器实例 不需要图片上传 只读状态，必须用 shallowRef
const ViewEditorRef = shallowRef()
// 内容 HTML
const ViewValueHtml = ref("")
const ViewToolbarConfig = {}//工具栏配置
const ViewEditorConfig = reactive({
  placeholder: '请输入内容...',
  readOnly: true, //限制为只读状态  true为只读状态
  MENU_CONF: {
    uploadImage: {
      server: "http://47.109.143.177:8080/uploadToOss", //上传到oss
      fieldName: "file",
      allowedFileTypes: ['image/*'], //只允许图片 默认也是
      customInsert(res, insertFn) {
        if (res.flag === true) {
          console.log(res.message); //得到图片链接
          let url = res.message;
          insertFn(url)
        } else {
          ElMessage({
            type: 'warning',
            message: '图片插入失败',
          })
        }
      }
    }
  }
})

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const ViewEditor = ViewEditorRef.value
  if (ViewEditor == null) return
  ViewEditor.destroy()
})
const ViewHandleCreated = (ViewEditor) => {
  ViewEditorRef.value = ViewEditor // 记录 editor 实例，重要！
}



/////----------------------------------------------表格函数
const labelPosition = ref('left') //对齐方式
const tableData = ref([

])

const loading=ref(true)
const AddDialogVisible = ref(false) //添加公告时 打开
const ViewDialogVisible = ref(false)//查看公告时打开

const AddNoticeData = ref({ //增加公告时候的信息
  id:"",
  time: "",
  status: "",
  title: "",
  comment: ""
})
ref({
  id:"",
  time: "",
  status: "",
  title: "",
  comment: ""
});
const rules = reactive({
  title: [
    { required: true, message: '标题不可为空', trigger: 'blur' },
    { min: 1, max: 60, message: 'Length should be 1 to 60', trigger: 'blur' },
  ],
  status:[
    {
      required: true,
      message: '请选择状态!',
      trigger: 'change',
    },
  ],
  time: [
    {
      type: 'date',
      required: true,
      message: '请选择时间',
      trigger: 'change',
    },
  ],
})

//mounted函数 //超级重要
onMounted(() => {
  getNotices();
})
const read = (raw) => {
  dialogVisible.value = true;
}
//获取所有公告
const getNotices = () => {

  loading.value=true
  api.get("/getNotices").then(res => {
    console.log("得到的公告数据 is ", res.data.data);
    tableData.value = res.data.data
    loading.value=false
  })
}
//删除公告：
const deleteNotice = (row) => {
  ElMessageBox.confirm(
      '确定删除这条数据吗?',
      'Warning',
      {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning',
      }
  )
      .then(() => {
        api.post("deleteNotice/" + row.id).then(res => {
          console.log("要删除的id is ", row.id);
          if (res.data.flag === true) { //成功删除
            ElMessage({
              type: 'success',
              message: '删除成功',
            })
          } else {
            ElMessage({
              type: 'warning',
              message: '删除失败,无此权限',
            })
          }
        }).finally(getNotices)
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })
}

//点击查看公告  = 赋值
const view=(row)=>{
  console.log("row is ",row.comment)
  ViewDialogVisible.value=true;
 // let comment="<h2>这是我的测试</h2><h2><span style=\"color: rgb(66, 144, 247);\"><strong>文本</strong></span><span style=\"color: rgb(66, 144, 247);\"><s><strong>内容</strong></s></span><span style=\"color: rgb(66, 144, 247);\"><strong>上传 &nbsp;</strong></span><span style=\"color: rgb(225, 60, 57);\"><strong>图片上传</strong></span></h2><p><img src=\"https://xsp-datastore.oss-cn-chengdu.aliyuncs.com/17b334704d544afb81dea6f999106c04.jpg\" alt=\"\" data-href=\"\" style=\"width: 349.00px;height: 196.31px;\"/></p><p>图片可以调整大小😁🤣😍</p>"
  ViewValueHtml.value=row.comment; //绑定后端发送的公告内容 //可以回显

}

const closeViewDialog=()=>{//关闭对话框
  ViewDialogVisible.value=false;
}

//添加一个公告
const addNotice=()=>{
  console.log('add')
  AddNoticeData.value = {
    id:"",
    time: "",
    status: "",
    title: "",
    comment: ""
  }; //原始数据清空
  AddValueHtml.value=""  //富文本内容清空
  AddDialogVisible.value=true //打开
}

const ruleForms = ref(null)  //创建对象 将其帮到el-form模板的ref 上面
const confirmAdd =  () => {
  //通过ref的值验证
  AddNoticeData.value.comment=AddValueHtml.value; //赋值
  AddDialogVisible.value=false //关闭
  ruleForms.value.validate((valid) => {
    if (valid) {
      console.log("通过");
      api.post("/addNotice",AddNoticeData.value).then(res=>{
        console.log(res);
        if(res.data.flag===true){
          ElMessage({
            type: 'success',
            message: res.data.message,
          })
        }
        else{
          ElMessage({
            type: 'error',
            message: res.data.message,
          })
        }

      }).finally(getNotices)
      //触发成功验证表单，调用接口；
    } else {
      console.log("未通过");
      ElMessage({
        type: 'info',
        message: "未通过表单校验 请检查表单字段",
      })
    }
  });
};
function closeAddDialog(){
  AddDialogVisible.value=false //关闭
}

</script>

<style scoped>

</style>
