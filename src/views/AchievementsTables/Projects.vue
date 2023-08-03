<!--专著（monograph）是指一本完整的、系统性的、独立出版的书，通常由一个或多个作者撰写，涵盖某个特定主题、领域或学科的全部或大部分内容--->
<!--用户管理页面--->
<template>

  <div class="userManage" style="width: 100%;height: 100%;background-color: #ffffff;position: relative;">


    <div style="margin-left: 2%">
      <div class="findarea" style="">
        <el-input clearable v-if="store.state.role==='admin'" class="filter-item" v-model="queryInfo.username" placeholder="学生用户名"
                  style="width: 140px;margin-right: 8px"></el-input>
        <el-input clearable class="filter-item" v-model="queryInfo.projectName" placeholder="项目名称"
                  style="width: 130px;margin-right: 8px"></el-input>

        <el-input clearable class="filter-item" v-model="queryInfo.category" placeholder="项目类别(如科技创新...)"
                  style="width: 170px;margin-right: 8px"></el-input>
        <el-select clearable v-model="queryInfo.status" placeholder="成果填报状态" style="margin-right:0.3%;width: 130px">
          <el-option label="审核" value="审核" />
          <el-option label="接收" value="接收" />
          <el-option label="拒绝" value="拒绝" />
        </el-select>
        <el-button @click="getAll()" :icon="Search" class="search">查询</el-button>

          <el-button @click="reback()" :icon="Refresh" class="renew">重置</el-button>

        <el-button @click="deleteBatch()" :icon="DeleteFilled" type="danger" class="dels">批量删除</el-button>

        <el-button v-if="store.state.role==='admin'" type="primary" plain :icon="Download" style="margin-left: 10px" @click="exportAll()">导出全部项目数据
        </el-button>
        <el-button  v-if="store.state.role==='admin'" type="" plain :icon="Download" style="width: 100px" @click="exportPart()">批量导出</el-button>
        <el-upload  v-if="store.state.role==='admin'"
            action="http://localhost:8080/Project/importData"
                   :show-file-list="false" accept="xlsx"
                   :on-success="handleImportSuccess"
                   :before-upload="beforeUpload"
                   style="display: inline-block;position: absolute;right: 0.5%"
        >
          <el-button type="success" :icon="UploadFilled" plain>Excel数据导入</el-button>
        </el-upload>

      </div>
      <div class="addInfo" style="margin-top: 10px">
        <el-button type="text" plain size="default" :icon="Plus"
                   @click="addInfo()">点击进行填报
        </el-button>
        <el-dialog
            draggable
            v-model="dialogVisible"
            :title="dialogTitle"
            width="70%"
            :before-close="handleClose"
        >
          <el-form :model="formData" style="width: 80%" ref="rulesForm" :rules="rules" :inline="true">
            <el-form-item  label="用户名" label-width="150" prop="username">
              <el-input :disabled="isStudent||isAdd===false" v-model="formData.username" placeholder="用户名" clearable autocomplete="off"/>
            </el-form-item>
            <el-form-item label="项目名称" label-width="150" prop="projectName">
              <el-input v-model="formData.projectName" placeholder="项目名称" clearable autocomplete="off"/>
            </el-form-item>
            <el-form-item label="项目类别" label-width="150" prop="category">
              <el-input v-model="formData.category" placeholder="请填写项目类别" clearable autocomplete="off"/>
            </el-form-item>
            <el-form-item label="项目负责人" label-width="150" prop="leader">
              <el-input v-model="formData.leader" placeholder="项目负责人" clearable autocomplete="off"/>
            </el-form-item>
            <el-form-item label="指导教师" label-width="150" prop="teacher">
              <el-input v-model="formData.teacher" placeholder="指导教师" clearable autocomplete="off"/>
            </el-form-item>
            <el-form-item label="研究周期" label-width="150" prop="period">
              <el-input v-model="formData.period" placeholder="研究周期" clearable autocomplete="off"/>
            </el-form-item>
            <el-form-item label="本人位次" label-width="150" prop="place">
              <el-select v-model="formData.place" placeholder="本人位次">
                <el-option label="1" value="1"/>
                <el-option label="2" value="2"/>
                <el-option label="3" value="3"/>
                <el-option label="4" value="4"/>
                <el-option label="5" value="5"/>
              </el-select>
            </el-form-item>

            <el-form-item label="项目全体成员" label-width="150" prop="members">
              <el-input v-model="formData.members" placeholder="填写参加的人员(填写主要参与的即可)" clearable autocomplete="off"/>
            </el-form-item>

            <el-form-item label="项目积分" label-width="150" prop="score">
              <el-input v-model="formData.score" placeholder="输入项目的得分(没有,则写0)" clearable autocomplete="off"/>
            </el-form-item>
            <el-form-item label="本人贡献" label-width="150" prop="contribution">
              <el-input v-model="formData.contribution" placeholder="使用简洁文字进行描述" clearable autocomplete="off"/>
            </el-form-item>
            <el-form-item label="结题时间" label-width="150" prop="endingTime">
              <el-date-picker
                  v-model="formData.endingTime"
                  :value-format="'YYYY-MM-DD'"
                  type="date"
                  placeholder="结题时间(或获奖时间)"
                  clearable
              />
            </el-form-item>
            <el-form-item label="填报结果状态" label-width="150" prop="status">
              <el-select :disabled="isStudent" v-model="formData.status" placeholder="成果填报状态">
                <el-option label="审核" value="审核"/>
                <el-option label="接收" value="接收"/>
                <el-option label="拒绝" value="拒绝"/>
              </el-select>

            </el-form-item>


          </el-form>

          <template #footer >
      <span class="dialog-footer" style="margin-right: 30%">
        <el-button @click="cancelOption()">取消</el-button>
        <el-button v-if="isAdd===true" type="primary" @click="confirmAdd()">
          上传填报信息
        </el-button>
        <el-button v-if="isAdd===false" type="success" @click="confirmUpdate()">
          确定更改信息
        </el-button>
      </span>
          </template>
        </el-dialog>
      </div>
      <div class="table" style="width: 100%;margin-top: 0px ">
        <el-table :data="dataList" style="width: 120%" height="480" size="large"
                  @selection-change="handleSelectionChange">
          <el-table-column
              fixed
              type="selection"
              width="60">
          </el-table-column>
          <el-table-column prop="username" label="用户名" width="130">
          </el-table-column>
          <el-table-column prop="projectName" label="项目名称" width="150">
          </el-table-column>
          <el-table-column prop="category" label="项目类别" width="130">
          </el-table-column>
          <el-table-column prop="leader" label="项目负责人" width="130">
          </el-table-column>
          <el-table-column prop="teacher" label="指导教师" width="130">
          </el-table-column>
          <el-table-column prop="period" label="项目周期(进行时间)" width="180">
          </el-table-column>
          <el-table-column prop="place" label="本人位次" width="90">
          </el-table-column>
          <el-table-column prop="members" label="项目所有成员" width="180">
          </el-table-column>
          <el-table-column prop="score" label="项目所得分" width="110">
          </el-table-column>
          <el-table-column prop="contribution" label="本人贡献" width="150">
          </el-table-column>
          <el-table-column prop="endingTime" label="项目截止时间" width="120">
          </el-table-column>
          <el-table-column prop="status" label="填报状态" width="120" sortable>
            <template #default="{ row }">
              <el-tag :type="row.status === '审核' ? 'primary' : row.status === '接收' ? 'success' : 'danger'">
                {{ row.status === '审核' ? '审核' : row.status === '接收' ? '接收' : '拒绝' }}
              </el-tag>
            </template>

          </el-table-column>

          <el-table-column fixed="right" label="Operations" width="120">
            <template #default="scope">
              <el-button link type="primary" size="large" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button link type="danger" size="large"  @click="deleteOne(scope.row)"  >删除</el-button>
            </template>
          </el-table-column>
          <template v-slot:empty>
            <div class="no-data">
              <el-empty description="暂未填写,这里空空如也www" />
            </div>
          </template>
        </el-table>
      </div>
      <div class="page" style="width: 40%;margin-top:1%;margin-left: 30px">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="queryInfo.currentPage"
                       :page-sizes="[5, 10, 15, 20,100]" :page-size="queryInfo.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="queryInfo.total">
        </el-pagination>
      </div>
    </div>


  </div>

</template>

<script setup>
import {DeleteFilled, Edit, Plus, Search, UploadFilled, Refresh, Download} from '@element-plus/icons-vue'
import api from "../../api/index.js"
import {ElMessage, ElMessageBox} from 'element-plus'
import {computed, onMounted, reactive, ref} from "vue";
import store from "../../store/index.js";
const dialogTitle = ref("test")
const isAdd = ref(true)//true 添加  false 关闭
const dataList = ref([])//当前页要展示的列表数据
const dialogVisible = ref(false)
const formData = reactive({ //对话框里面要填写的表单数据
  "id": 0,
  "username": "",
  "projectName":"",
  "leader": "",
  "teacher": "",
  "category": "",
  "period": "",
  "place":0,
  "members": "",
  "score": 0,
  "contribution": "",
  "endingTime": "",
  "status": "审核", //状态只有三种  审核  拒绝 接收
})
const rulesForm = ref(null)
const rules = reactive({//校验规则
  username: [{required: true, message: 'username为学号', trigger: 'blur'}, {
    min: 3,
    max: 10,
    message: '用户名在 3 到 10 个字符之间',
    trigger: 'blur'
  }],
  projectName:[{required: true, message: '负责人为必填项', trigger: 'blur'}],
  leader: [{required: true, message: '负责人为必填项', trigger: 'blur'}],
  teacher: [{required: true, message: '指导老师必填', trigger: 'blur'}],
  category: [{required: true, message: '项目类别必填', trigger: 'blur'}],
  period: [{required: true, message: '项目周期(时间)', trigger: 'blur'}],
  place: [{required: true, message: '本人位次', trigger: 'blur'}],
  members: [{required: true, message: '总成员必填', trigger: 'blur'}],
  score: [{required: true, message: '项目所得分数必填项', trigger: 'blur'}],
  contribution: [{required: true, message: '本人贡献必填', trigger: 'blur'}],
  endingTime: [{required: true, message: '必填项', trigger: 'blur'}],
  status: [{required: true, message: '必填项', trigger: 'blur'}]
})
//分页请求体params
const queryInfo = reactive({
  currentPage: 1,
  pageSize: 5,
  total: 0,
  username: "",
  category: "",
  projectName:"",
  status: "",
})
let ids = [];  //let定义变量 const定义常量
onMounted(() => {
  store.commit("getUsername")
  getAll()
})
const resetFormData = () => {
  formData.id = 0;
  formData.username="";
  formData.projectName="";
  formData.leader = "";
  formData.teacher = "";
  formData.category = "";
  formData.period = "";
  formData.place = 0;
  formData.members = "";
  formData.score = 0;
  formData.contribution ="";
  formData.enndingTime ="";
  formData.status = "审核"; //在退出操作之后 将表格清空
}
//重置函数
const reback = () => {
  if (sessionStorage.getItem('role') === 'student') {
    queryInfo.currentPage = 1;
    queryInfo.pageSize = 5;
    queryInfo.projectName="";
    queryInfo.category="";
    queryInfo.status=""
    getAll();
  }
  else{
  api.get('/Project/1/5').then((res) => {
    dataList.value = res.data.data.records;
    queryInfo.currentPage = 1;
    queryInfo.pageSize = 5;
    queryInfo.total = res.data.data.total;
    queryInfo.username = ""
    queryInfo.projectName = ""
    queryInfo.category = ""
    queryInfo.status = ""
  })
  }
}
const handleSizeChange = (newsize) => {
  console.log(`每页 ${newsize} 条`);
  queryInfo.currentPage = 1 //每次点击切换数据条数 就默认回到第一页
  queryInfo.pageSize = newsize
  getAll()
}
const handleCurrentChange = (newpage) => {//显示跳转到多少页
  console.log(`当前跳转到的页码为: ${newpage}`);
  queryInfo.currentPage = newpage
  getAll()
}
const username = ref("");
const getAll = () => { //分页+条件查询
  if (sessionStorage.getItem('role') === "student") {//如果为学生  那么就发请求 获得他的username 之后再发送请求   //vuex
    api.get("/getUserInfo").then(res => {
      console.log("获取到的用户姓名", res.data.data.username);
      username.value = res.data.data.username
      queryInfo.username = username.value
    }).finally(get)
  } else { //管理员
    get();
  }
}
const get = () => {
  let param;
  param = "?username=" + queryInfo.username
  param += "&projectName=" + queryInfo.projectName
  param += "&category=" + queryInfo.category
  param += "&status=" + queryInfo.status
  console.log("param is ", param)
  api.get("/Project/" + queryInfo.currentPage + "/" + queryInfo.pageSize + param).then(res => {
    console.log("后端返回的数据是 ", res);
    dataList.value = res.data.data.records;
    console.log("datalist is ", dataList.value)
    queryInfo.currentPage = res.data.data.current;
    queryInfo.pageSize = res.data.data.size;
    queryInfo.total = res.data.data.total;
  })
}
//点击el-diaglog右上角的x按钮(叉叉)
const handleClose = (done) => {
  ElMessageBox.confirm('确定退出相应操作?')
      .then(() => {
        resetFormData()
        //在退出操作之后 将表格清空
        console.log("退出操作之后的formdata ", formData)
        done();
      })
      .catch(() => {
      })
}
//取消增加操作
const cancelOption = () => {
  dialogVisible.value = false;
}
const isStudent=ref(false)
//点击进行填报
const addInfo = () => {
  resetFormData()//清空表单数据
  if(sessionStorage.getItem("role")==="student"){ //如果是学生  那么就让dialog对话框的用户名  填报状态不能够编辑
    isStudent.value=true
  }
  //之后姓名赋值  让其不能编辑
  formData.username=store.state.username  //获取登陆者用户
  console.log("刷新之后formdata is ", formData)
  dialogVisible.value=true;
  isAdd.value=true;
  dialogTitle.value="专著信息填报-请事先查看公告里面的填报要求"
}
//增加成果 + 表单校验
const confirmAdd = () => {
  console.log("上传的formData is ",formData)
  // 表单校验 上传
  rulesForm.value.validate((valid) => {
    if (valid) {
      console.log("通过");
      api.post("/Project/add/",formData).then(res=>{
        console.log(res);
        if(res.data.flag===true){
          ElMessage({
            type: 'success',
            message: res.data.message,
          })
          dialogVisible.value=false;
        }
        else{
          ElMessage({
            type: 'error',
            message: res.data.message,
          })
        }
      }).finally(getAll)
      //触发成功验证表单，调用接口；
    } else {
      console.log("未通过");
      ElMessage({
        type: 'warning',
        message: "未通过表单校验 请检查表单字段",
      })
    }
  });
}
//删除单个
const deleteOne = (row) => {
  ElMessageBox.confirm(
      '确定删除这条成果信息吗?',
      'Warning',
      {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning',
      }
  )
      .then(() => {
        console.log("要删除的成果id是", row.id);
        api.post("/Project/deleteOne/" + row.id).then(res => {
          console.log("删除单个返回的信息为 ",res);
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
        }).finally(getAll)
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })
}
//批量选择
const handleSelectionChange=(val)=>{
  ids = val.map(row => row.id);
}
//批量删除
const deleteBatch=()=>{
  if (ids.length === 0) {
    ElMessage({
      type: 'warning',
      message:"请勾选想要删除的数据!",
    })
    return ;
  }

  ElMessageBox.confirm(
      '确定删除选中的成果信息吗?',
      'Warning',
      {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning',
      }
  )
      .then(() => {
        console.log("要删除的成果id是",ids);
        api.post("/Project/deleteBatch" ,ids).then(res => {
          console.log("删除单个返回的信息为 ",res);
          if (res.data.flag === true) { //成功删除
            ElMessage({
              type: 'success',
              message: res.data.message,
            })
          } else {
            ElMessage({
              type: 'warning',
              message: '批量删除失败',
            })
          }
        }).finally(getAll)
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消批量删除',
        })
      })




}
//点击编辑

const handleUpdate = (row) => {
  if(sessionStorage.getItem("role")==="student"){ //如果是学生  那么就让dialog对话框的用户名  填报状态不能够编辑
    isStudent.value=true
  }
  dialogTitle.value = "更改成果信息";
  dialogVisible.value = true; //弹出窗口
  isAdd.value = false//开始编辑 改变表格按键
  api.get("/Project/getProjectById/" + row.id).then(res => {
    console.log("通过科技论文id搜索到的信息是", res.data.data);
    if (res.data.flag === true) {
      Object.assign(formData,res.data.data)
    } else {
      ElMessage({
        type: 'warning',
        message: '数据同步失败,自动刷新',
      })
    }
  }).finally(getAll)
}
//点击
const confirmUpdate=()=>{
  //用户修改 变为审核
  //管理员自己定义
  //formData.status="审核"  //编辑后 状态变为 审核
  rulesForm.value.validate((valid) => {
    if(valid){
      api.post("/Project/update" , formData).then(res => {
        console.log("传递过来的formdata is ",formData)
        console.log("编辑之后的 res is ",res);
        if (res.data.flag === true) {
          ElMessage({
            type: 'success',
            message: res.data.message,
          })
        } else {
          ElMessage({
            type: 'warning',
            message: '编辑失败',
          })
        }
      }).finally(getAll)
    }
    else{
      ElMessage({
        type: 'warning',
        message: '请检查所填表单字段是否有效',
      })
    }


  })
  dialogVisible.value = false; //关闭窗口
}
//导出全部
const exportAll=()=>{
  window.location.href = "http://localhost:8080/Project/exportAll";
}
//批量导出
const exportPart=()=>{
  console.log("选择的用户名为", ids)
  if (ids.length === 0) {
    ElMessage({
      type: 'warning',
      message:"请勾选想要导出的用户!",
    })
  }
  else {
    api.post('/Project/exportByIds', ids, {
      responseType: 'blob' // 指定响应数据的类型为 Blob 对象
    }).then(response => {
      // 获取响应头中的文件名
      const header = response.headers['content-disposition']
      console.log("响应的文件名",header)
      const filename = header ? header.split('=')[1] : '项目成果数据.xlsx'
      // 创建一个新的 Blob 对象，将响应体的数据保存到其中
      const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' })
      // 创建一个 URL 对象，用于生成文件的下载链接
      const url = window.URL.createObjectURL(blob)
      // 创建一个 <a> 元素，设置下载链接和文件名，模拟用户点击下载链接
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      // 释放 URL 对象
      window.URL.revokeObjectURL(url)
    })
        .catch(error => {
          console.error(error)
        })
  }
}
//数据导入之前的判定
const beforeUpload=(rawFile)=>{
  if (rawFile.type !== 'application/vnd.ms-excel' && rawFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    ElMessage({
      type: 'warning',
      message:"只允许excel文件导入!",
    })
    return false
  }
  if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage({
      type: 'warning',
      message:"文件大小不能超过10MB!",
    })
    return false
  }
  return true
}
//导入成功之后的效果
const handleImportSuccess=()=>{
  ElMessage({
    type: 'success',
    message:"数据导入成功,重复信息将不会导入",
  })
  getAll()
}

</script>

<style scoped>

</style>
