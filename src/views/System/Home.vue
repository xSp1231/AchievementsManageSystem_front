<template>
  <div class="home" style="width: 100%;height: 100%;">
    <div class="homeArea" style="width: 100%;height:100%;background-color: #faf7f7;border-radius: 15px">

      <div id="box-one" style="width: 100%;height:49%;display: flex">

        <div class="one">
          <div class="intro" style="width:100%;height: 8%;background-color: #ffffff;border-radius: 10px">
            <h3 style="text-align: center;color: grey;">公告栏 </h3>
          </div>
          <div class="notice" style="width: 100%;height: 92%;background-color:#f6f4f4;border-radius: 10px">

            <el-table :data="tableData" stripe height="100%" style="width: 100%">
              <el-table-column sortable prop="time" label="发布时间" width="160"/>
              <el-table-column prop="title" label="标题" width="180"/>
              <el-table-column sortable prop="status" label="状态" width="130">
                <template #default="{ row }">
                  <el-tag :type="row.status === '紧急' ? 'danger' : 'info'">
                    {{ row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="Operations">
                <template #default="scope">
                  <el-button :icon="ZoomIn" size="small" @click="read(scope.row)">点击查看详细内容</el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-dialog v-model="dialogVisible" style="width: 820px;height: 530px;" draggable title="公告内容详细信息">
              <div style="border: 1px solid #ccc">
                <Toolbar
                    style="border-bottom: 1px solid #ccc"
                    :editor="editorRef"
                    :defaultConfig="toolbarConfig"
                    :mode="mode"
                />
                <Editor
                    style="height: 310px; overflow-y: hidden;"
                    v-model="valueHtml"
                    :defaultConfig="editorConfig"
                    :mode="mode"
                    @onCreated="handleCreated"
                />
              </div>

              <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog()">关闭</el-button>
              </div>
            </el-dialog>

          </div>
        </div>

        <div class="two">

          <div class="top" style="width: 100%;height: 30%;display: flex;">
            <el-card shadow="hover"
                     style="width:30%;height: 80%;margin-top: 1%;margin-left: 1%;border-radius: 10px;background-color:rgba(246,242,242,0.63);"
                    >
              <div class="item" style="display: flex;margin-top: -2%">
                <div
                    style="width:40px;height: 30%; background:rgba(9,141,189,0.66);border-radius: 5px;margin-right: 5%">
                  <el-icon style="font-size: 30px;color: #eae9e9;margin-left: 12%;margin-top: 10%">
                   <UserFilled/>
                  </el-icon>
                </div>
                <div class="detail">
                  <h4 class="describe">学生使用人数:</h4>
                  <h4 class="price" style="color:#02638a">{{userNumber}}</h4>
                </div>

              </div>
            </el-card>
            <el-card shadow="hover"
                     style="width:30%;height: 80%;margin-top: 1%;margin-left: 1%;border-radius: 10px;background-color:rgba(246,242,242,0.63);"
            >
              <div class="item" style="display: flex;margin-top: -2%">
                <div
                    style="width:40px;height: 30%; background:rgba(9,141,189,0.66);border-radius: 5px;margin-right: 5%">
                  <el-icon style="font-size: 30px;color: #eae9e9;margin-left: 12%;margin-top: 10%">
                    <Avatar/>
                  </el-icon>
                </div>
                <div class="detail">
                  <h4 class="describe">管理员人数:</h4>
                  <h4 class="price" style="color:#d55503">{{adminNumber}}</h4>
                </div>

              </div>
            </el-card>
            <el-card shadow="hover"
                     style="width:30%;height: 80%;margin-top: 1%;margin-left: 1%;border-radius: 10px;background-color:rgba(246,242,242,0.63);"
            >
              <div class="item" style="display: flex;margin-top: -2%">
                <div
                    style="width:40px;height: 30%; background:rgba(9,141,189,0.66);border-radius: 5px;margin-right: 5%">
                  <el-icon style="font-size: 30px;color: #eae9e9;margin-left: 12%;margin-top: 10%">
                    <Management/>
                  </el-icon>
                </div>
                <div class="detail">
                  <h4 class="describe">成果填报总数</h4>
                  <h4 class="price" style="color:#02638a">{{achievementNumber}}</h4>
                </div>

              </div>
            </el-card>
          </div>
          <el-card shadow="hover"
                   style="width: 93%;margin-left:1%;height: 65%;border-radius: 10px;background-color: rgba(246,242,242,0.63)">
            <h3>系统介绍</h3>
          </el-card>
        </div>

      </div>

      <div id="box-two" style="width: 100%;height:49%;margin-top:0.5% ;display: flex">
        <div class="three">
          <line-chart></line-chart>
        </div>

        <div class="four">
          <pie-chart></pie-chart> <!---别用el-card了-->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import pieChart from "../GraphsOfHome/PieChart.vue";
import lineChart from "../GraphsOfHome/NumberOfDailySystemUsers.vue"
import {
  Avatar,
  ZoomIn,
} from '@element-plus/icons-vue';
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import {onBeforeUnmount, onMounted, reactive, ref, shallowRef} from 'vue'
import api from "../../api/index.js";

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
//-------------------------------------------------------------------------
//对象 数组 创建时使用reactive 不需要使用value访问  而ref用于创建基本数据类型 需要.value访问
const userNumber=ref(0)
const adminNumber=ref(0)
const achievementNumber=ref(0)
//统计数量
const getCountNum=()=>{
  api.get('/countNum').then(res=>{
    console.log("统计面板数据 ",res.data.data);
    userNumber.value=res.data.data[0]
    adminNumber.value=res.data.data[1]
    achievementNumber.value=res.data.data[2]
  })

}



const tableData = reactive([
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
])
const dialogVisible = ref(false)
const dialogData = reactive({
  "time": "",
  "title": "",
  "status": "",
  "comment": "" //内容
})

onMounted(() => {
  console.log('home')
  getNotices()
  getCountNum()
})



const getNotices = () => {
  api.get("/getNotices").then(res => {
    console.log("notice res ", res)
    Object.assign(tableData, res.data.data);
  })
}


const read = (row) => {
  console.log("row is ", row)
  // Object.assign(dialogData, row); //将row的值赋值给dialogData   不能直接使用dialogData=row
  valueHtml.value = row.comment
  dialogVisible.value = true;
}
const closeDialog = () => {
  valueHtml.value = "";
  dialogVisible.value = false
}


</script>

<style lang="less" scoped>

.one {
  width: 49%;
  height: 100%;
  border-radius: 15px;
  background-color: #ffffff;
  margin-left: 0.5%;
}

.two {
  //display: flex;
  //flex-wrap: wrap;
  width: 49%;
  height: 100%;
  border-radius: 15px;
  background-color: #ffffff;
  margin-left: 0.5%;
}

.three {
  width: 49%;
  height: 100%;
  border-radius: 15px;
  background-color: #ffffff;
  margin-left: 0.5%;
}

.four {
  width: 49%;
  height: 100%;
  border-radius: 15px;
  background-color: #ffffff;
  margin-left: 0.5%;
}

.home {
  overflow-x: hidden;
}

</style>
