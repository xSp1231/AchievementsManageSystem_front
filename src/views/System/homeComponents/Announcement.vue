<template>
  <div class="announcement-panel">
    <div class="announcements">
      <div class="announcement-header">
        <p>系统公告栏</p>
        <p>{{(new Date()).toDateString()}}</p>
      </div>
      <div class="announcement-statistics">
        <el-statistic title="Important Announcements" :value=importantNum />
        <el-statistic title="Ordinary Announcements" :value= ordinaryNum />
      </div>
      <el-scrollbar max-height="610">
        <div class="announcement-body">
          <div v-for="notice in  tableData" :key="notice.id" class="announcement-card">
            <el-card class="box-card" shadow="hover" :style="{backgroundColor: notice.status==='一般'?'#e9e7fd':'#fee4cb'}">
              <template #header>
                <div class="card-header">
                  <div class="card-header-date">
                    <el-badge  :value="notice.status==='一般'?'公告':'重要公告'" class="item" :type="notice.status==='一般'?'success':'warning'">
                    </el-badge>
                    <el-button type="primary" @click="read(notice)"><el-icon><MoreFilled /></el-icon></el-button>
                  </div>
                  <div class="el-header-title">
                    <p>{{ notice.title }}</p>
                  </div>
                </div>
              </template>

              <div class="card-body">
                <p>点击查看详情....</p>
              </div>
              <el-divider />
              <div class="card-footer">
                <div class="card-footer-info">
                  <div class="info-author">
                    <el-avatar src="https://xspfile.yougi.top/86939413ecc78c466b04363bd1a7f6d21c9dc40.jpg" size="small" />
                    <p>公告发布者:&nbsp;&nbsp;&nbsp;manager</p>
                  </div>
                  <div class="info-time">
                    <el-icon><Clock /></el-icon>&nbsp;
                    <span>{{ notice.time}}</span>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </el-scrollbar>
      <el-drawer
          v-model="drawer"
          :direction="direction"
          size="40%"
      >
        <h2 style="color: #484545;;text-align: center;margin-bottom: 8px">{{noticeTitle}}</h2>
        <el-divider border-style="double" style="margin-bottom: 3px;margin-top: 3px"/>
        <Editor
            style="height: 600px; overflow-y: hidden;"
            v-model="valueHtml"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="handleCreated"
        />
      </el-drawer>
    </div>
  </div>
</template>

<script setup>
import {
  Avatar,
  ZoomIn,
} from '@element-plus/icons-vue';
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import {onBeforeUnmount, onMounted, reactive, ref, shallowRef} from 'vue'
import {ElMessage, ElMessageBox} from "element-plus";
import api from "../../../api/index.js";
//-----------------------------------wangEditor实例
const editorRef = shallowRef()
// 内容 HTML
const valueHtml = ref('')
const toolbarConfig = {}
const editorConfig = {placeholder: '请输入内容...', readOnly: true} //只读状态
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}
onMounted(() => {
  notice()
  getNotices()
})
const importantNum=ref(0);
const ordinaryNum=ref(0);
//每次先显示通告 提醒作用
const notice = () => {
  ElMessage({
    showClose:true,
    dangerouslyUseHTMLString: true,
    message: '<strong>重要提醒!进入系统一定要<span style="color: rgba(227,13,52,0.86); font-weight: bold;">查看公告栏</span>。看是否有新的公告</strong>',
    duration:5000,
  })
}
const tableData = reactive([
  {
    time: '2016-05-03',
    title: 'test',
    status: "紧急",
    comment: 'No. 189, Grove St, Los Angeles',
  },
  {
    time: '2016-05-02',
    title: 'test',
    status: "一般",
    comment: 'No. 189, Grove St, Los Angeles',
  },
  {
    time: '2016-05-04',
    title: 'test',
    status: "一般",
    comment: 'No. 189, Grove St, Los Angeles',
  },
])
const getNotices = () => {
  api.get("/getNotices").then(res => {
    console.log("notice res ", res)
    Object.assign(tableData, res.data.data);
    for (const item of tableData) {
      if (item.status === "一般") {
        ordinaryNum.value++;
      }
    }
    importantNum.value=tableData.length-ordinaryNum.value;
  })
  console.log("得到的公告信息",tableData)
}
const direction = ref('rtl')
const drawer = ref(false);
const noticeTitle=ref("")
const read = (row) => {
  drawer.value=true;
  noticeTitle.value=row.title
  console.log("row is ", row)
  // Object.assign(dialogData, row); //将row的值赋值给dialogData   不能直接使用dialogData=row
  valueHtml.value = row.comment
  dialogVisible.value = true;
}
</script>

<style scoped>
.announcement-panel{
  height: 100%;
}
.announcements {
  background-color: #f9f9fc;
  border-radius: 10px;
  padding-left: 6px;
  padding-right: 6px;

  /*padding: 1px 1px 0 32px;*/
  display: flex;
  flex-direction: column;
  flex: 2;
  height: calc(100vh - 120px);
}

.announcement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  color: black;
}

@media screen and (max-width: 768px) {
  .announcement-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .announcement-header p:first-child {
    width: 100%;
    text-align: center;
  }

  .announcement-header p:nth-child(2) {
    width: 100%;
    text-align: right;
  }
}

.announcement-header p {
  font-size: 24px;
  line-height: 32px;
  font-weight: 600;
  opacity: 0.9;
  margin: 0;
}

.announcement-statistics {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.announcement-body {
  display: flex;
  flex-wrap: wrap;
}

.announcement-card {
  width: calc(100% / 3 - 16px);
  text-align: left;
  transition: 0.2s;
  padding: 8px;
}
@media screen and (max-width: 1300px) {
  .announcement-card {
    width: calc(100% / 2 - 16px)
  }
}
@media screen and (max-width: 1100px) {
  .announcement-card {
    width: calc(100% - 16px)
  }
}

.el-card {
  border-radius: 30px !important;
}

.card-header {
  color: #4A4A4A;
  opacity: 0.7;
  font-size: 14px;
  line-height: 16px;
}

.el-header-title {
  font-size: 20px;
  line-height: 24px;
  font-weight: 700;
  opacity: 0.7;
  margin-bottom: 5px;
}

.card-header-date {
  line-height: 2em;
  display: flex;
  justify-content: space-between;
  color: #4A4A4A;
}

.card-header-date button {
  background-color: transparent;
  border: none;
  color: #4A4A4A;
}

.card-body {
  color: #4A4A4A;
  font-size: 15px;
  line-height: 24px;
  font-weight: 700;
  opacity: 0.8;
}

.card-footer-info {
  color: #4A4A4A;
  font-size: 14px;
  line-height: 24px;
  font-weight: 500;
  opacity: 1;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-author {
  display: flex;
  align-items: center;
  font-weight: 700;
}

.info-author p {
  margin-left: 10px;
}

.info-time {
  opacity: 0.5;
}

.el-divider {
  width: 100%;
  margin-left: 0;
}
</style>
