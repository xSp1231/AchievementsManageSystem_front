<!--专利软著--->
<template>

  <div class="userManage" style="width: 100%;height: 100%;background-color: #ffffff;position: relative;">


    <div style="margin-left: 2%">
      <div class="findarea" style="">
        <el-input clearable v-if="store.state.role==='admin'" class="filter-item" v-model="queryInfo.username" placeholder="学生用户名"
                  style="width: 150px;margin-right: 8px"></el-input>
        <el-input clearable class="filter-item" v-model="queryInfo.name" placeholder="专利/软著名字"
                  style="width: 150px;margin-right: 8px"></el-input>
        <el-select clearable v-model="queryInfo.status" placeholder="成果填报状态" style="margin-right:0.3%;width: 130px">
          <el-option label="审核" value="审核" />
          <el-option label="接收" value="接收" />
          <el-option label="拒绝" value="拒绝" />
        </el-select>
        <el-button @click="getAll()" :icon="Search" class="search">查询</el-button>

          <el-button @click="reback()" :icon="Refresh" class="renew">重置</el-button>

        <el-button @click="deleteBatch()" :icon="DeleteFilled" type="danger" class="dels">批量删除</el-button>

        <el-button v-if="store.state.role==='admin'" type="primary" plain :icon="Download" style="margin-left: 10px" @click="exportAll()">导出全部专利/软著成果数据
        </el-button>
        <el-button v-if="store.state.role==='admin'" type="" plain :icon="Download" @click="exportPart()">批量导出</el-button>
        <el-upload  v-if="store.state.role==='admin'"
            action="http://8.137.9.219:8080/PatentSoft/importData"
                   :show-file-list="false" accept="xlsx"
                   :on-success="handleImportSuccess"
                   :before-upload="beforeUpload"
                   style="display: inline-block;position: absolute;right: 1%"
        >
          <el-button type="success" :icon="UploadFilled" plain>Excel数据导入</el-button>
        </el-upload>

      </div>
      <div class="addInfo" style="margin-top: 10px">
        <el-button type="text" plain size="default" :icon="Plus"
                   @click="addInfo()">点击进行填报
        </el-button>
        <el-button @click="open()"  type="text" plain size="default" style="margin-left:2%;color: #d31010"  >
          成果填报被拒绝后怎么办？
        </el-button>
        <el-dialog
            draggable
            v-model="dialogVisible"
            :title="dialogTitle"
            width="70%"
            :before-close="handleClose"
        >
          <el-form :model="formData" style="width: 80%" ref="rulesForm" :rules="rules" :inline="true">
            <el-form-item label="用户名" label-width="150" prop="username">
              <el-input :disabled="isStudent||isAdd===false" v-model="formData.username" placeholder="用户名" clearable autocomplete="off"/>
            </el-form-item>
            <el-form-item label="专利/软著名称" label-width="150" prop="name">
              <el-input v-model="formData.name" placeholder="请填写名称" clearable autocomplete="off"/>
            </el-form-item>
            <el-form-item label="专利/软著号" label-width="150" prop="number">
              <el-input v-model="formData.number" placeholder="专利软著号填写" clearable autocomplete="off"/>
            </el-form-item>
            <el-form-item label="专利类别" label-width="150" prop="category">
              <el-input v-model="formData.category" placeholder="种类" clearable autocomplete="off"/>
            </el-form-item>
            <el-form-item label="专利/软著所有者" label-width="150" prop="owners">
              <el-input v-model="formData.owners" placeholder="所有者" clearable autocomplete="off"/>
            </el-form-item>

            <el-form-item label="授权国家" label-width="150" prop="country">
              <el-input v-model="formData.country" placeholder="授权国家名称" clearable autocomplete="off"/>
            </el-form-item>

            <el-form-item label="填报结果状态" label-width="150" prop="status">
              <el-select :disabled="isStudent" v-model="formData.status" placeholder="成果填报状态">
                <el-option label="审核" value="审核"/>
                <el-option label="接收" value="接收"/>
                <el-option label="拒绝" value="拒绝"/>
              </el-select>
            </el-form-item>
            <!--只有为管理员和编辑的时候 可见--->
            <el-form-item v-if="role==='admin'&&isAdd===false" label="拒绝详情(拒绝了再填)" label-width="150" prop="refuseInfo">
              <el-input v-model="formData.refuseInfo" placeholder="拒绝请给出理由,其他状态无需填写" clearable autocomplete="off"/>
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
        <el-table v-loading="loading" :data="dataList" style="width: 120%" height="480" size="large"
                  @selection-change="handleSelectionChange">
          <el-table-column
              fixed
              type="selection"
              width="60">
          </el-table-column>
          <el-table-column prop="username" label="用户名" width="130">
          </el-table-column>
          <el-table-column prop="name" label="专利/软著名称" width="230">
          </el-table-column>
          <el-table-column prop="number" label="专利/软著号" width="150">
          </el-table-column>
          <el-table-column prop="category" label="专利类别" width="150">
          </el-table-column>
          <el-table-column prop="owners" label="专利/软著所有者" width="230">
          </el-table-column>
          <el-table-column prop="country" label="授权国家" width="130">
          </el-table-column>
          <el-table-column prop="status" label="填报状态" width="120" sortable>
            <template #default="{ row }">
              <el-tag @click="showWrongInfo(row)" :type="row.status === '审核' ? 'primary' : row.status === '接收' ? 'success' : 'danger'">
                {{ row.status === '审核' ? '审核' : row.status === '接收' ? '接收' : '拒绝' }}
              </el-tag>
            </template>

          </el-table-column>

          <el-table-column fixed="right" label="Operations" width="160">
            <template #default="scope">
              <el-button link type="primary" :icon="EditPen" size="large" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button link type="danger" :icon="Delete" size="large"  @click="deleteOne(scope.row)"  >删除</el-button>
            </template>
          </el-table-column>
          <template v-slot:empty>
            <div class="no-data">
              <el-empty description="暂未填写,这里空空如也www" />
            </div>
          </template>
        </el-table>
        <!--错误消息提示对话框-->
        <el-dialog
            v-model="wrongInfoDialogVisible"
            title="成果被拒绝详情,请修改错误后再上传填报:"
            width="30%"
            :before-close="wrongInfoHandleClose"
        >
          <span>{{wrongInfo}}</span>
          <template #footer>
      <span class="dialog-footer">
        <el-button @click="wrongInfoDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="wrongInfoDialogVisible = false">
          Confirm
        </el-button>
      </span>
          </template>
        </el-dialog>
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
import {DeleteFilled, EditPen,Delete, Plus, Search, UploadFilled, Refresh, Download} from '@element-plus/icons-vue'
import api from "../../api/index.js"
import {ElMessage, ElMessageBox, ElNotification} from 'element-plus'
import {computed, h, onMounted, reactive, ref} from "vue";
import store from "../../store/index.js";
const loading=ref(true)
const open= () => {
  ElNotification({
    title: '解决方案',
    message: h('j', { style: 'color: teal' }, '成果填报被拒绝,可以点击被拒绝成果所属行的拒绝标签，点击后将会显示我们成果填写哪里有错误，请修改错误之后再提交，等待管理员审核。填写成果之前应先仔细阅读发布在公告栏中的填写要求，以免成果填报被拒绝。'),
    type: 'success',

  })
}

const dialogTitle = ref("test")
const isAdd = ref(true)//true 添加  false 关闭
const dataList = ref([])//当前页要展示的列表数据
const dialogVisible = ref(false)
const formData = reactive({ //对话框里面要填写的表单数据
  "id": 0,
  "username": "",
  "name": "",
  "number": "",
  "category": "",
  "owners": "",
  "country":"",
  "refuseInfo":"",
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
  name: [{required: true, message: '专利/软著名称为必填项', trigger: 'blur'}],
  number: [{required: true, message: '专利/软著号必填', trigger: 'blur'}],
  category: [{required: true, message: '专利类别', trigger: 'blur'}],
  owners: [{required: true, message: '专利/软著所有人', trigger: 'blur'}],
  country: [{required: true, message: '授权国家必填', trigger: 'blur'}],
  status: [{required: true, message: '必填项', trigger: 'blur'}]
})
//分页请求体params
const queryInfo = reactive({
  currentPage: 1,
  pageSize: 5,
  total: 0,
  username: "",
  name: "",
  status: "",
})
let ids = [];  //let定义变量 const定义常量
onMounted(() => {
  store.commit("getUsername")
  getAll()
})
const role=sessionStorage.getItem('role')
const resetFormData = () => {
  formData.id = 0;
  formData.username="";
  formData.name = "";
  formData.number = "";
  formData.category = "";
  formData.owners = "";
  formData.country = "";
  formData.refuseInfo = "";
  formData.status = "审核"; //在退出操作之后 将表格清空
}
//重置函数
const reback = () => {
  if (sessionStorage.getItem('role') === 'student') {
    queryInfo.currentPage = 1;
    queryInfo.pageSize = 5;
    queryInfo.name="";
    queryInfo.status=""
    getAll();
  }
  else{//admin
  api.get('/PatenSoft/1/5').then((res) => {
    dataList.value = res.data.data.records;
    queryInfo.currentPage = 1;
    queryInfo.pageSize = 5;
    queryInfo.total = res.data.data.total;
    queryInfo.username = ""
    queryInfo.name = ""
    queryInfo.status = ""
  })
  }
}
const username = ref("");
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
  param += "&name=" + queryInfo.name
  param += "&status=" + queryInfo.status
  console.log("param is ", param)
  loading.value=true
  api.get("/PatentSoft/" + queryInfo.currentPage + "/" + queryInfo.pageSize + param).then(res => {
    console.log("后端返回的数据是 ", res);
    dataList.value = res.data.data.records;
    console.log("datalist is ", dataList.value)
    queryInfo.currentPage = res.data.data.current;
    queryInfo.pageSize = res.data.data.size;
    queryInfo.total = res.data.data.total;
    loading.value=false
  })
}

//错误信息显示对话框
const wrongInfoHandleClose = (done) => {
  ElMessageBox.confirm('确定退出相应操作?')
      .then(() => {
        done();
      })
      .catch(() => {
      })
}
const wrongInfoDialogVisible=ref(false)
const wrongInfo=ref('')
//点击标签 查看错误详情
const showWrongInfo=(row)=>{
  console.log("点击标签的信息",row)
  if(row.status==="拒绝"){
    console.log("错误信息 is ",row.refuseInfo)
    wrongInfo.value=row.refuseInfo
    wrongInfoDialogVisible.value=true
  }

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
  if(role==="student"){ //如果是学生  那么就让dialog对话框的用户名  填报状态不能够编辑
    isStudent.value=true
  }
  //之后姓名赋值  让其不能编辑
  formData.username=store.state.username  //获取登陆者用户名  如
  console.log("刷新之后formdata is ", formData)
  dialogVisible.value=true;
  isAdd.value=true;
  dialogTitle.value="专利软著信息填报-请事先查看公告里面的填报要求"
}
//增加成果 + 表单校验
const confirmAdd = () => {
  console.log("上传的formData is ",formData)
  // 表单校验 上传
  rulesForm.value.validate((valid) => {
    if (valid) {
      console.log("通过");
      api.post("/PatentSoft/add/",formData).then(res=>{
        console.log(res);
        if(res.data.flag===true){
          if(role==='admin'){//管理员和用户添加成果时的消息显示不一样
            ElMessage({
              type: 'success',
              message: '成果信息添加成功',
            })
          }
          else{
            ElMessage({
              type: 'success',
              message: res.data.message,
            })
          }

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
        api.post("/PatentSoft/deleteOne/" + row.id).then(res => {
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
        api.post("/PatentSoft/deleteBatch" ,ids).then(res => {
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
  if(role==="student"){ //如果是学生  那么就让dialog对话框的用户名  填报状态不能够编辑
    isStudent.value=true
  }
  dialogTitle.value = "更改成果信息";
  dialogVisible.value = true; //弹出窗口
  isAdd.value = false//开始编辑 改变表格按键
  api.get("/PatentSoft/getPatentSoftById/" + row.id).then(res => {
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
  if(role==='student'){
    formData.status='审核'; //只要学生用户确定编辑了 那么成果的状态就变为审核
  }

  rulesForm.value.validate((valid) => {
    if(valid){
      api.post("/PatentSoft/update" , formData).then(res => {
        console.log("传递过来的formdata is ",formData)
        console.log("编辑之后的 res is ",res);
        if (res.data.flag === true) {
          if(role==='admin'){//管理员和用户添加成果时的消息显示不一样
            ElMessage({
              type: 'success',
              message: '成果信息修改成功',
            })
          }
          else{
            ElMessage({
              type: 'success',
              message: res.data.message,
            })
          }

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
  window.location.href = "http://8.137.9.219:8080/PatentSoft/exportAll";
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
    api.post('/PatentSoft/exportByIds', ids, {
      responseType: 'blob' // 指定响应数据的类型为 Blob 对象
    }).then(response => {
      // 获取响应头中的文件名
      const header = response.headers['content-disposition']
      console.log("响应的文件名",header)
      const filename = header ? header.split('=')[1] : '专利/软著成果数据.xlsx'
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
