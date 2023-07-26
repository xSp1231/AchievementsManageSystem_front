<!--专著（monograph）是指一本完整的、系统性的、独立出版的书，通常由一个或多个作者撰写，涵盖某个特定主题、领域或学科的全部或大部分内容--->
<!--用户管理页面--->
<template>

  <div class="userManage" style="width: 100%;height: 100%;background-color: #ffffff;position: relative;">


    <div style="margin-left: 2%">
      <div class="findarea" style="">
        <el-input class="filter-item" v-model="queryInfo.username" placeholder="学生用户名"
                  style="width: 150px;margin-right: 8px"></el-input>
        <el-input class="filter-item" v-model="queryInfo.rewardName" placeholder="证书名称(奖项名称)"
                  style="width: 150px;margin-right: 8px"></el-input>
        <el-input class="filter-item" v-model="queryInfo.status" placeholder="填报结果状态"
                  style="width: 150px;margin-right: 8px"></el-input>
        <el-button @click="getAll()" :icon="Search" class="search">查询</el-button>
        <el-button @click="reback()" :icon="Refresh" class="renew">重置</el-button>
        <el-button @click="deleteBatch()" :icon="DeleteFilled" type="danger" class="dels">批量删除</el-button>

        <el-button type="primary" plain :icon="Download" style="margin-left: 10px" @click="exportAll()">导出全部专著成果数据
        </el-button>
        <el-button type="" plain :icon="Download" @click="exportPart()">批量导出</el-button>
        <el-upload action="http://localhost:8080/Reward/importData"
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
        <el-dialog
            draggable
            v-model="dialogVisible"
            :title="dialogTitle"
            width="70%"
            :before-close="handleClose"
        >
          <el-form :model="formData" style="width: 80%" ref="rulesForm" :rules="rules" :inline="true">
            <el-form-item label="用户名" label-width="150" prop="username">
              <el-input v-model="formData.username" placeholder="用户名" clearable autocomplete="off"/>
            </el-form-item>
            <el-form-item label="奖项名称" label-width="150" prop="rewardName">
              <el-input v-model="formData.rewardName" placeholder="请填写奖项名称" clearable autocomplete="off"/>
            </el-form-item>
            <el-form-item label="证书编号" label-width="150" prop="rewardNumber">
              <el-input v-model="formData.rewardNumber" placeholder="证书编号" clearable autocomplete="off"/>
            </el-form-item>
            <el-form-item label="获奖区域" label-width="150" prop="rewardArea">

              <el-select v-model="formData.rewardArea" placeholder="获奖区域">
                <el-option label="院级" value="院级"/>
                <el-option label="校级" value="校级"/>
                <el-option label="市级" value="市级"/>
                <el-option label="省级" value="省级"/>
                <el-option label="国家级" value="国家级"/>
              </el-select>

            </el-form-item>
            <el-form-item label="等级" label-width="150" prop="rewardGrade">
              <el-select v-model="formData.rewardGrade" placeholder="奖项等级">
                <el-option label="1" value="1"/>
                <el-option label="2" value="2"/>
                <el-option label="3" value="3"/>
                <el-option label="4" value="4"/>
                <el-option label="5" value="5"/>
              </el-select>
            </el-form-item>
            <el-form-item label="授予单位" label-width="150" prop="grantingUnit">
              <el-input v-model="formData.grantingUnit" placeholder="授予单位" clearable autocomplete="off"/>
            </el-form-item>
            <el-form-item label="获得日期" label-width="150" prop="dateTime">
              <el-date-picker
                  v-model="formData.dateTime"
                  :value-format="'YYYY-MM-DD'"
                  type="date"
                  placeholder="出版日期"
                  clearable
              />
            </el-form-item>
            <el-form-item label="成员" label-width="150" prop="members">
              <el-input v-model="formData.members" placeholder="成员" clearable autocomplete="off"/>
            </el-form-item>
            <el-form-item label="本人位次" label-width="150" prop="place">
              <el-select v-model="formData.place" placeholder="本人位次">
                <el-option label="1" value="5"/>
                <el-option label="2" value="4"/>
                <el-option label="3" value="3"/>
                <el-option label="4" value="2"/>
                <el-option label="5" value="1"/>
              </el-select>
            </el-form-item>
            <el-form-item label="填报结果状态" label-width="150" prop="status">
              <el-select v-model="formData.status" placeholder="成果填报状态状态">
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
          <el-table-column prop="username" label="用户名" width="120">
          </el-table-column>
          <el-table-column prop="rewardName" label="奖项名称" width="180">
          </el-table-column>
          <el-table-column prop="rewardNumber" label="证书编号" width="150">
          </el-table-column>
          <el-table-column prop="rewardArea" label="获奖区域" width="100">
          </el-table-column>
          <el-table-column prop="rewardGrade" label="等级(x等奖)" width="130">
          </el-table-column>
          <el-table-column prop="grantingUnit" label="授予单位" width="180">
          </el-table-column>
          <el-table-column prop="dateTime" label="获得日期" width="130">
          </el-table-column>

          <el-table-column prop="members" label="成员" width="180">
          </el-table-column>
          <el-table-column prop="place" label="本人位次" width="100">
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
import {onMounted, reactive, ref} from "vue";
const dialogTitle = ref("test")
const isAdd = ref(true)//true 添加  false 关闭
const dataList = ref([
  {
    "id": 1,
    "username": "5120214558",
    "title": "测试理论",
    "jcName": "sci1区",
    "publicDate": "2023-07-24",
    "issueNumber": "666期",
    "volumeNumber": "666卷",
    "pageRange": "12-19",
    "place": 1,
    "allAuthors": "徐书鹏",
    "searchType": "关键字检索",
    "accessionNumber": "1008610086",
    "status": "审核"
  },
  {
    "id": 1,
    "username": "xsp",
    "title": "测试理论",
    "jcName": "sci1区",
    "publicDate": "2023-07-24",
    "issueNumber": "666期",
    "volumeNumber": "666卷",
    "pageRange": "12-19",
    "place": 1,
    "allAuthors": "徐书鹏",
    "searchType": "关键字检索",
    "accessionNumber": "10086",
    "status": "审核"
  },
  {
    "id": 1,
    "username": "xsp",
    "title": "测试理论",
    "jcName": "sci1区",
    "publicDate": "2023-07-24",
    "issueNumber": "666期",
    "volumeNumber": "666卷",
    "pageRange": "12-19",
    "place": 1,
    "allAuthors": "徐书鹏",
    "searchType": "关键字检索",
    "accessionNumber": "10086",
    "status": "审核"
  },
  {
    "id": 1,
    "username": "xsp",
    "title": "测试理论",
    "jcName": "sci1区",
    "publicDate": "2023-07-24",
    "issueNumber": "666期",
    "volumeNumber": "666卷",
    "pageRange": "12-19",
    "place": 1,
    "allAuthors": "徐书鹏",
    "searchType": "关键字检索",
    "accessionNumber": "10086",
    "status": "审核"
  },
  {
    "id": 1,
    "username": "xsp",
    "title": "测试理论",
    "jcName": "sci1区",
    "publicDate": "2023-07-24",
    "issueNumber": "666期",
    "volumeNumber": "666卷",
    "pageRange": "12-19",
    "place": 1,
    "allAuthors": "徐书鹏",
    "searchType": "关键字检索",
    "accessionNumber": "10086",
    "status": "审核"
  },
  {
    "id": 1,
    "username": "xsp",
    "title": "测试理论",
    "jcName": "sci1区",
    "publicDate": "2023-07-24",
    "issueNumber": "666期",
    "volumeNumber": "666卷",
    "pageRange": "12-19",
    "place": 1,
    "allAuthors": "徐书鹏",
    "searchType": "关键字检索",
    "accessionNumber": "10086",
    "status": "审核"
  },
])//当前页要展示的列表数据
const dialogVisible = ref(false)
const formData = reactive({ //对话框里面要填写的表单数据
  "id": 0,
  "username": "",
  "rewardName": "",
  "rewardNumber": "",//证书编号
  "rewardArea": "", //院级 市级
  "rewardGrade": "", //1 2 3
  "grantingUnit":"",
  "dateTime": "",
  "members": "",
  "place": "", //本人位次
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
  rewardName: [{required: true, message: '奖项名称为必填项', trigger: 'blur'}],
  rewardNumber: [{required: true, message: '证书编号必填', trigger: 'blur'}],
  rewardArea: [{required: true, message: '获奖区域必填', trigger: 'blur'}],
  rewardGrade: [{required: true, message: '奖项等级必填项', trigger: 'blur'}],
  grantingUnit: [{required: true, message: '授予单位必填项', trigger: 'blur'}],
  dateTime: [{required: true, message: '获得时间必填项', trigger: 'blur'}],
  members: [{required: true, message: '必填项', trigger: 'blur'}],
  place: [{required: true, message: '必填项', trigger: 'blur'}],
  status: [{required: true, message: '必填项', trigger: 'blur'}]
})
//分页请求体params
const queryInfo = reactive({
  currentPage: 1,
  pageSize: 5,
  total: 0,
  username: "",
  rewardName: "",
  status: "",
})
let ids = [];  //let定义变量 const定义常量
onMounted(() => {
  getAll()
})
const resetFormData = () => {
  formData.id = 0;
  formData.username="";
  formData.rewardName = "";
  formData.rewardNumber = "";
  formData.rewardArea = "";
  formData.rewardGrade = "";
  formData.grantingUnit= "";
  formData.dateTime = "";
  formData.members = "";
  formData.place = "";
  formData.status = "审核"; //在退出操作之后 将表格清空
}
//重置函数
const reback = () => {
  api.get('/Reward/1/5').then((res) => {
    dataList.value = res.data.data.records;
    queryInfo.currentPage = 1;
    queryInfo.pageSize = 5;
    queryInfo.total = res.data.data.total;
    queryInfo.username = ""
    queryInfo.rewardName = ""
    queryInfo.status = ""
  })
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
const getAll = () => { //分页+条件查询
  let param;
  param = "?username=" + queryInfo.username
  param += "&rewardName=" + queryInfo.rewardName
  param += "&status=" + queryInfo.status
  console.log("param is ", param)
  api.get("/Reward/" + queryInfo.currentPage + "/" + queryInfo.pageSize + param).then(res => {
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
//点击进行填报
const addInfo = () => {
  resetFormData()//清空表单数据
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
      api.post("/Reward/add/",formData).then(res=>{
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
        api.post("/Reward/deleteOne/" + row.id).then(res => {
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
        api.post("/Reward/deleteBatch" ,ids).then(res => {
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
  dialogTitle.value = "更改成果信息";
  dialogVisible.value = true; //弹出窗口
  isAdd.value = false//开始编辑 改变表格按键
  api.get("/Reward/getRewardById/" + row.id).then(res => {
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
      api.post("/Reward/update" , formData).then(res => {
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
  window.location.href = "http://localhost:8080/Reward/exportAll";
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
    api.post('/Reward/exportByIds', ids, {
      responseType: 'blob' // 指定响应数据的类型为 Blob 对象
    }).then(response => {
      // 获取响应头中的文件名
      const header = response.headers['content-disposition']
      console.log("响应的文件名",header)
      const filename = header ? header.split('=')[1] : '奖励成果数据.xlsx'
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

