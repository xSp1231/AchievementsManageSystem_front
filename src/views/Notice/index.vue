<!---使用了vue3 setup写法  因为wangEditor是setup写法---->

<template>
  <div class="notice" style="width: 100%;height: 100%;background-color:#f8f8f8;border-radius: 10px">
    <h2 style="text-align: center;margin-bottom: 0.5%;color: #9f9fa1">公告管理(Powered By wangEditor)</h2>

    <div class="noticeTable" style="margin-left: 5%;margin-right: 5%;">
      <el-button type="text" plain :icon="Plus" @click="addNotice()">点击增加</el-button>
      <el-table :data="tableData" stripe height=540 style="width: 90%;">
        <el-table-column sortable prop="id" label="公告ID" width="120"/>
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
      </el-table>


    </div>
    <!---添加公告时的对话框-->
    <el-dialog v-model="AddDialogVisible" style="width: 820px;height: 630px;" draggable  title="发布公告信息">

      <el-form
          :inline="true"
          :label-position="labelPosition"
          label-width="60px"
          :model="AddNoticeData"
        >
        <el-form-item label="标题">
          <el-input v-model="AddNoticeData.title"  />
        </el-form-item>
        <el-form-item label="时间" >
          <el-date-picker
              v-model="AddNoticeData.time"
              :value-format="'YYYY-MM-DD'"
              type="date"
              placeholder="Pick a date"
              clearable
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
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
    <el-dialog v-model="ViewDialogVisible" style="width: 820px;height: 530px;" draggable  title="发布公告信息">

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
import {Plus, Remove, ZoomIn,} from '@element-plus/icons-vue';
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
      server: "http://localhost:8080/uploadToOss", //上传到oss
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
      server: "http://localhost:8080/uploadToOss", //上传到oss
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
  {
    time: '2016-05-03',
    title: 'Tom',
    status: "紧急",
    comment: 'No. 189, Grove St, Los Angeles',
  },
  {
    time: '2016-05-02',
    title: 'Tom',
    status: "一般",
    comment: 'No. 189, Grove St, Los Angeles',
  },
  {
    time: '2016-05-04',
    title: 'Tom',
    status: "一般",
    comment: 'No. 189, Grove St, Los Angeles',
  },
  {
    time: '2016-05-01',
    title: 'Tom',
    status: "一般",
    comment: 'No. 189, Grove St, Los Angeles',
  },
  {
    time: '2016-05-03',
    title: 'Tom',
    status: "紧急",
    comment: 'No. 189, Grove St, Los Angeles',
  },
  {
    time: '2016-05-02',
    title: 'Tom',
    status: "紧急",
    comment: 'No. 189, Grove St, Los Angeles',
  },
  {
    time: '2016-05-03',
    title: 'Tom',
    status: "紧急",
    comment: 'No. 189, Grove St, Los Angeles',
  },
  {
    time: '2016-05-02',
    title: 'Tom',
    status: "一般",
    comment: 'No. 189, Grove St, Los Angeles',
  },
  {
    time: '2016-05-04',
    title: 'Tom',
    status: "一般",
    comment: 'No. 189, Grove St, Los Angeles',
  },
  {
    time: '2016-05-01',
    title: 'Tom',
    status: "一般",
    comment: 'No. 189, Grove St, Los Angeles',
  },
  {
    time: '2016-05-03',
    title: 'Tom',
    status: "紧急",
    comment: 'No. 189, Grove St, Los Angeles',
  },
  {
    time: '2016-05-02',
    title: 'Tom',
    status: "紧急",
    comment: 'No. 189, Grove St, Los Angeles',
  },
  {
    time: '2016-05-03',
    title: 'Tom',
    status: "紧急",
    comment: 'No. 189, Grove St, Los Angeles',
  },
  {
    time: '2016-05-02',
    title: 'Tom',
    status: "一般",
    comment: 'No. 189, Grove St, Los Angeles',
  },
  {
    time: '2016-05-04',
    title: 'Tom',
    status: "一般",
    comment: 'No. 189, Grove St, Los Angeles',
  },
  {
    time: '2016-05-01',
    title: 'Tom',
    status: "一般",
    comment: 'No. 189, Grove St, Los Angeles',
  },
  {
    time: '2016-05-03',
    title: 'Tom',
    status: "紧急",
    comment: 'No. 189, Grove St, Los Angeles',
  },
  {
    time: '2016-05-02',
    title: 'Tom',
    status: "紧急",
    comment: 'No. 189, Grove St, Los Angeles',
  },
])

const AddDialogVisible = ref(false) //添加公告时 打开
const ViewDialogVisible = ref(false)//查看公告时打开

const AddNoticeData = ref({ //增加公告时候的信息
  id:"",
  time: "",
  status: "",
  title: "",
  comment: ""
})
const ViewNoticeData = ref({
  id:"",
  time: "",
  status: "",
  title: "",
  comment: ""
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
  api.get("/getNotices").then(res => {
    console.log("得到的公告数据 is ", res.data.data);
    tableData.value = res.data.data
  })
}
//删除公告：
const deleteNotice = (row) => {
  ElMessageBox.confirm(
      '确定删除这条数据吗?',
      'Warning',
      {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
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
              message: '删除失败',
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

function closeViewDialog(){//关闭对话框
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
function confirmAdd(){ //确定添加
  AddNoticeData.value.comment=AddValueHtml.value; //赋值
  //时间进行处理
//   const selectedDate = new Date(AddNoticeData.value.time);
// // 使用 Date 对象的 getFullYear()、getMonth() 和 getDate() 方法获取年月日信息
//   const year = selectedDate.getFullYear();
//   const month = selectedDate.getMonth() + 1;
//   const day = selectedDate.getDate();
//
// // 将年月日信息拼接成短时间格式（例如：2023-07-18）
//   AddNoticeData.value.time=`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  console.log("得到的内容结果是 ",AddNoticeData.value.comment)
  console.log("AddNoticeData (时间) is ",AddNoticeData.value.time)
   //发送请求
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

  AddDialogVisible.value=false //关闭
}
function closeAddDialog(){
  AddDialogVisible.value=false //关闭
}

</script>

<style scoped>

</style>
