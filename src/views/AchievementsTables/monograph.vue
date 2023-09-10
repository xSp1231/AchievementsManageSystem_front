<!--专著（monograph）是指一本完整的、系统性的、独立出版的书，通常由一个或多个作者撰写，涵盖某个特定主题、领域或学科的全部或大部分内容--->
<!--用户管理页面--->
<template>
  <div class="userManage" style="width: 100%;height: 100%;background-color: #ffffff;position: relative;">
    <div style="margin-left: 2%">
      <div class="findarea" style="">
        <el-tooltip content="用户名只可精确查询" placement="top">
          <el-input clearable v-if="store.state.role==='admin'" class="filter-item" v-model="queryInfo.username"
                    placeholder="用户名"
                    style="width: 150px;margin-right: 8px"></el-input>
        </el-tooltip>
        <el-input clearable class="filter-item" v-model="queryInfo.monoName" placeholder="专著名字"
                  style="width: 150px;margin-right: 8px"></el-input>
        <el-select clearable v-model="queryInfo.status" placeholder="成果填报状态" style="margin-right:0.3%;width: 130px">
          <el-option label="审核" value="审核"/>
          <el-option label="接收" value="接收"/>
          <el-option label="拒绝" value="拒绝"/>
        </el-select>
        <el-button @click="getAll()" :icon="Search" class="search">查询</el-button>
        <el-button @click="reback()" :icon="Refresh" class="renew">重置</el-button>
        <el-button @click="deleteBatch()" :icon="DeleteFilled" type="danger" class="dels">批量删除</el-button>

        <el-button v-if="store.state.role==='admin'" type="primary" plain :icon="Download" style="margin-left: 10px"
                   @click="exportAll()">导出全部专著成果数据
        </el-button>
        <el-button v-if="store.state.role==='admin'" type="" plain :icon="Download" @click="exportPart()">批量导出
        </el-button>


      </div>
      <div class="addInfo" style="margin-top: 10px">
        <el-button type="text" plain size="default" :icon="Plus"
                   @click="addInfo()">点击进行填报
        </el-button>
        <el-button @click="open()" type="text" plain size="default" style="margin-left:2%;color: #d31010">
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
              <el-input :disabled="isStudent||isAdd===false" v-model="formData.username" placeholder="用户名" clearable
                        autocomplete="off"/>
            </el-form-item>
            <el-form-item label="标题" label-width="150" prop="monoName">
              <el-input v-model="formData.monoName" placeholder="请填写标题" clearable autocomplete="off"/>
            </el-form-item>
            <el-form-item label="主编" label-width="150" prop="chiefEditor">
              <el-input v-model="formData.chiefEditor" placeholder="主编姓名" clearable autocomplete="off"/>
            </el-form-item>
            <el-form-item label="参编" label-width="150" prop="chiefEditor">
              <el-input v-model="formData.associateEditor" placeholder="参编姓名" clearable autocomplete="off"/>
            </el-form-item>
            <el-form-item label="出版社" label-width="150" prop="publication">
              <el-input v-model="formData.publication" placeholder="出版社" clearable autocomplete="off"/>
            </el-form-item>
            <el-form-item label="出版日期" label-width="150" prop="publicDate">
              <el-date-picker
                  v-model="formData.publicDate"
                  :value-format="'YYYY-MM-DD'"
                  type="date"
                  placeholder="出版日期"
                  clearable
              />
            </el-form-item>
            <el-form-item label="ISBN号码" label-width="150" prop="isbn">
              <el-input v-model="formData.isbn" placeholder="输入专著的isbn号" clearable autocomplete="off"/>
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

            <el-form-item label="证明文件上传" label-width="150">
              <!--添加成果的过程中 imageurls都为空- 只有当编辑的时候才会有值 -->
              <el-upload
                  accept=".jpg,.jpeg,.png,.JPG,.JPEG,.pdf"
                  :disabled="imageurls.length>0"
                  multiple
                  :limit="2"
                  class="file-box"
                  ref="upload"
                  action="#"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :on-change="handleChange"
                  :on-exceed="handleExceed"
                  :file-list="images"
                  list-type="picture"
                  :auto-upload="false"
               >

                <template v-if="isAdd"  #trigger>
                  <el-button slot="trigger" size="small" type="success">选取文件</el-button>
                </template>
                <!--编辑的时候出现  如果文件存在 那么就disabled   编辑框出现的时候 就得到了imageurls      -->
                <template v-if="!isAdd"  #trigger>
                  <el-button :disabled="imageurls.length>0" size="small" type="primary">选取文件</el-button>
                </template>

                <template #tip>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png,pdf文件，且数量不超过2</div>
                </template>
              </el-upload>

              <div v-for="it in  imageurls" @click="clickPicture(it) "
                   style="width: 106px;height: 90px;margin-left: 20px;border-radius: 8px;border: 1px dashed #a49f9f;">

                <!-------------------------------------pdf预览------------------------->
                <el-button class="pdf" v-if="isPdf(it.url)" :icon="Document" type="text" plain size="default"
                           style="width: 100%;height: 100%;color: #97979a;text-decoration-line:underline;" @click="scanPdf(it)" > pdf文件(查看)
                </el-button>
                <el-button v-if="isAdd===false&&isPdf(it.url)" :icon="CircleClose" type="danger" plain size="small" round
                           style="margin-left: 0%"   @click="deleteImg(it)"> 删除文件
                </el-button>

                <!-------------------------------------图片------------------------->
                <img class="picture" v-if="!isPdf(it.url)" :src=baseUrl+it.url style="width: 100%;height: 100%;border-radius: 8px" @click="enlargeImg(it)"/>
                <el-button v-if="isAdd===false&&!isPdf(it.url)" :icon="CircleClose" type="danger" plain size="small" round
                           style="margin-top: -20%" @click="deleteImg(it)"> 删除文件
                </el-button>


              </div>
            </el-form-item>
          </el-form>

          <p v-if="isAdd===false" style="font-size: 13px;color: red;margin-top: 20px;text-align: center">
            如果需要添加新的文件,一定要先将该成果对应的全部文件删除后，再上传!</p>
          <p v-if="isAdd===false" style="font-size: 15px;color: red;margin-top: 20px;text-align: center">
            如果需要修改标题,一定要先将该成果对应的全部文件删除后，再上传!否则会造成数据丢失</p>
          <template #footer>
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
        <!----放大显示图片的对话框---->
        <el-dialog
            v-model="imgVisible"
            title="图片预览"
            width="52%"
        >
          <div style="width: 100%;height: 500px;background-color: #5287bc">
            <img :src=baseUrl+targetImgUrl style="width: 100%;height: 100%;border-radius: 8px" >
          </div>
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
          <el-table-column prop="monoName" label="专著标题" width="230">
          </el-table-column>
          <el-table-column prop="chiefEditor" label="主编" width="150">
          </el-table-column>
          <el-table-column prop="associateEditor" label="参编" width="150">
          </el-table-column>
          <el-table-column prop="publication" label="出版社" width="180">
          </el-table-column>
          <el-table-column prop="publicDate" label="出版时间" width="130">
          </el-table-column>

          <el-table-column prop="isbn" label="isbn号码" width="180">
          </el-table-column>
          <el-table-column prop="status" label="填报状态" width="120" sortable>
            <template #default="{ row }">
              <el-tag @click="showWrongInfo(row)"
                      :type="row.status === '审核' ? 'primary' : row.status === '接收' ? 'success' : 'danger'">
                {{ row.status === '审核' ? '审核' : row.status === '接收' ? '接收' : '拒绝' }}
              </el-tag>
            </template>

          </el-table-column>

          <el-table-column fixed="right" label="Operations" width="160">
            <template #default="scope">
              <el-button link type="primary" :icon="EditPen" size="large" @click="handleUpdate(scope.row)">编辑
              </el-button>
              <el-button link type="danger" :icon="Delete" size="large" @click="deleteOne(scope.row)">删除</el-button>
            </template>
          </el-table-column>
          <template v-slot:empty>
            <div class="no-data">
              <el-empty description="暂未填写,这里空空如也www"/>
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
          <span>{{ wrongInfo }}</span>
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
import {
  DeleteFilled,
  EditPen,
  Delete,
  Plus,
  Search,
  UploadFilled,
  Refresh,
  Download,
  CircleClose
} from '@element-plus/icons-vue'
import api from "../../api/index.js"
import {ElMessage, ElMessageBox, ElNotification} from 'element-plus'
import {computed, h, onMounted, reactive, ref} from "vue";
import store from "../../store/index.js";

const loading = ref(true)
const open = () => {
  ElNotification({
    title: '解决方案',
    message: h('j', {style: 'color: teal'}, '成果填报被拒绝,可以点击被拒绝成果所属行的拒绝标签，点击后将会显示我们成果填写哪里有错误，请修改错误之后再提交，等待管理员审核。填写成果之前应先仔细阅读发布在公告栏中的填写要求，以免成果填报被拒绝。'),
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
  "monoName": "",
  "chiefEditor": "",
  "associateEditor": "",
  "publication": "",
  "publicDate": "",
  "isbn": "",
  "refuseInfo": "",
  "status": "审核", //状态只有三种  审核  拒绝 接收  //增加的时候全为审核  编辑的时候全为审核
})
const rulesForm = ref(null)
const rules = reactive({//校验规则
  username: [{required: true, message: 'username为学号', trigger: 'blur'}, {
    min: 3,
    max: 10,
    message: '用户名在 3 到 10 个字符之间',
    trigger: 'blur'
  }],
  monoName: [{required: true, message: '标题为必填项', trigger: 'blur'}],
  chiefEditor: [{required: true, message: '专注名称必填', trigger: 'blur'}],
  associateEditor: [{required: true, message: '主编姓名必填', trigger: 'blur'}],
  publication: [{required: true, message: '参编姓名必填项', trigger: 'blur'}],
  publicDate: [{required: true, message: '出版时间必填项', trigger: 'blur'}],
  isbn: [{required: true, message: '必填项', trigger: 'blur'}],
  status: [{required: true, message: '必填项', trigger: 'blur'}]
})
//分页请求体params
const queryInfo = reactive({
  currentPage: 1,
  pageSize: 5,
  total: 0,
  username: "",
  monoName: "",
  status: "",
})
let ids = [];  //let定义变量 const定义常量
onMounted(() => {
  store.commit("getUsername")
  getAll()
})
const role = sessionStorage.getItem('role')
const resetFormData = () => { //取消 关闭操作 使用
  formData.id = 0;
  formData.username = "";
  formData.monoName = "";
  formData.chiefEditor = "";
  formData.associateEditor = "";
  formData.publication = "";
  formData.publicDate = "";
  formData.isbn = "";
  formData.refuseInfo = "";
  formData.status = "审核"; //在退出操作之后 将表格清空
  //将想要上传的文件清空
  images.value=[]
  //同时将imageurls清空
  imageurls.value = []
}
//重置函数
const reback = () => {
  if (sessionStorage.getItem('role') === 'student') {
    queryInfo.currentPage = 1;
    queryInfo.pageSize = 5;
    queryInfo.monoName = "";
    queryInfo.status = "";
    getAll();
  } else {
    api.get('/Monograph/1/5').then((res) => {
      dataList.value = res.data.data.records;
      queryInfo.currentPage = 1;
      queryInfo.pageSize = 5;
      queryInfo.total = res.data.data.total;
      queryInfo.username = ""
      queryInfo.monoName = ""
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
const username = ref("")
const getAll = () => { //分页+条件查询
  if (sessionStorage.getItem('role') === "student") {//如果为学生  那么就发请求 获得他的username 之后再发送请求   //vuex
    api.get("/getUserInfo").then(res => {
      console.log("获取到的用户姓名", res.data.data.username);
      username.value = res.data.data.username
      queryInfo.username = username.value
    }).finally(get)
  } else {
    get()
  }

}
const get = () => {
  let param;
  param = "?username=" + queryInfo.username
  param += "&monoName=" + queryInfo.monoName
  param += "&status=" + queryInfo.status
  console.log("param is ", param)
  loading.value = true
  api.get("/Monograph/" + queryInfo.currentPage + "/" + queryInfo.pageSize + param).then(res => {
    console.log("后端返回的数据是 ", res);
    dataList.value = res.data.data.records;
    console.log("datalist is ", dataList.value)
    queryInfo.currentPage = res.data.data.current;
    queryInfo.pageSize = res.data.data.size;
    queryInfo.total = res.data.data.total;
    loading.value = false
  })
}

const wrongInfoHandleClose = (done) => {
  ElMessageBox.confirm('确定退出相应操作?')
      .then(() => {
        done();
      })
      .catch(() => {
      })
}
const wrongInfoDialogVisible = ref(false)
const wrongInfo = ref('')
//点击标签 查看错误详情
const showWrongInfo = (row) => {
  console.log("点击标签的信息", row)
  if (row.status === "拒绝") {
    console.log("错误信息 is ", row.refuseInfo)
    wrongInfo.value = row.refuseInfo
    wrongInfoDialogVisible.value = true
  }

}
//点击el-diaglog右上角的x按钮(叉叉)
const handleClose = (done) => {
  ElMessageBox.confirm('确定退出相应操作?')
      .then(() => {
        resetFormData()
        console.log("退出操作之后的formdata ", formData)
        done();
      })
      .catch(() => {
      })
}
//取消增加操作
const cancelOption = () => {
  dialogVisible.value = false;
  resetFormData()
}
const isStudent = ref(false)
//点击进行填报
const addInfo = () => {
  resetFormData()//清空表单数据
  if (sessionStorage.getItem("role") === "student") { //如果是学生  那么就让dialog对话框的用户名  填报状态不能够编辑
    isStudent.value = true
  }
  //之后姓名赋值  让其不能编辑
  formData.username = store.state.username  //获取登陆者用户名
  console.log("刷新之后formdata is ", formData)
  dialogVisible.value = true;
  isAdd.value = true;
  dialogTitle.value = "专著信息填报-请事先查看公告里面的填报要求(成果标题,图片上传时(建议一张)要多考虑,后续修改过程可能略微繁琐)"
}
//增加成果 + 表单校验

//删除单个成果 同时将对应的图片也要删除     ----------逻辑外键
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
        api.post("/Monograph/deleteOne/" + row.id).then(res => {
          console.log("删除单个返回的信息为 ", res);
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
const handleSelectionChange = (val) => {
  ids = val.map(row => row.id);
}
//批量删除
const deleteBatch = () => {
  if (ids.length === 0) {
    ElMessage({
      type: 'warning',
      message: "请勾选想要删除的数据!",
    })
    return;
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
        console.log("要删除的成果id是", ids);
        api.post("/Monograph/deleteBatch", ids).then(res => {
          console.log("删除单个返回的信息为 ", res);
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
  if (role === "student") { //如果是学生  那么就让dialog对话框的用户名  填报状态不能够编辑
    isStudent.value = true
  }
  dialogTitle.value = "更改成果信息(点击图片可以放大预览,第一次文件加载较慢,请耐心等待)";
  dialogVisible.value = true; //弹出窗口
  isAdd.value = false//开始编辑 改变表格按键
  api.get("/Monograph/getMonographById/" + row.id).then(res => {
    console.log("通过科技论文id搜索到的信息是", res.data.data);
    if (res.data.flag === true) {

      Object.assign(formData, res.data.data)

      getImages();//同时获得图片
    } else {
      ElMessage({
        type: 'warning',
        message: '数据同步失败,自动刷新',
      })
    }
  }).finally(getAll)
}
//点击
const confirmUpdate = () => {
//必须上传图片的充要条件
  if(imageurls.value.length===0&&images.value.length===0){ //如果没有图片   比如删除完没有上传 就需要提醒·1
     ElMessage({
      type: 'warning',
      message: '必须要上传证明图片',
    })
    return
  }

  //用户修改 变为审核
  //管理员自己定义
  //formData.status="审核"  //编辑后 状态变为 审核
  rulesForm.value.validate((valid) => {
    if (role === 'student') {
      formData.status = '审核'; //只要学生用户确定编辑了 那么成果的状态就变为审核
    }
    if (valid) {

      api.post("/Monograph/update", formData).then(res => {
        console.log("传递过来的formdata is ", formData)
        console.log("编辑之后的 res is ", res);
        if (res.data.flag === true) {
          submitFile();
          if (role === 'admin') {//管理员和用户添加成果时的消息显示不一样
            ElMessage({
              type: 'success',
              message: '成果信息修改成功',
            })
          } else {
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
        resetFormData()
      }).finally(getAll)
    } else {
      ElMessage({
        type: 'warning',
        message: '请检查所填表单字段是否有效',
      })
    }


  })


  dialogVisible.value = false; //关闭窗口
}
//导出全部
const exportAll = () => {
  window.location.href = "http://8.137.112.197:8080/Monograph/exportAll";
}
//批量导出
const exportPart = () => {
  console.log("选择的用户名为", ids)
  if (ids.length === 0) {
    ElMessage({
      type: 'warning',
      message: "请勾选想要导出的用户!",
    })
  } else {
    api.post('/Monograph/exportByIds', ids, {
      responseType: 'blob' // 指定响应数据的类型为 Blob 对象
    }).then(response => {
      // 获取响应头中的文件名
      const header = response.headers['content-disposition']
      console.log("响应的文件名", header)
      const filename = header ? header.split('=')[1] : '专著成果数据.xlsx'
      // 创建一个新的 Blob 对象，将响应体的数据保存到其中
      const blob = new Blob([response.data], {type: 'application/vnd.ms-excel'})
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
const beforeUpload = (rawFile) => {
  if (rawFile.type !== 'application/vnd.ms-excel' && rawFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    ElMessage({
      type: 'warning',
      message: "只允许excel文件导入!",
    })
    return false
  }
  if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage({
      type: 'warning',
      message: "文件大小不能超过10MB!",
    })
    return false
  }
  return true
}
//导入成功之后的效果
const handleImportSuccess = () => {
  ElMessage({
    type: 'success',
    message: "数据导入成功,重复信息将不会导入",
  })
  getAll()
}



//图片上传 显示功能开发------------------------------------------------------------------------------------------------------
// const baseUrl = "https://xsp-datastore.oss-cn-chengdu.aliyuncs.com/";
const baseUrl = "https://xspfile.yougi.top/";
const images = ref([])
const imageurls = ref([])
const upload = ref()
const submitFile = () => {
  let Data = new FormData() //创建一个表单
  //如果没有上传文件的话 就return
  if(images.value.length===0){
    return ;
  }
  images.value.forEach(file => {
    console.log("遍历file", file)
    Data.append("files", file.raw) //将文件传到表单中，files属性是后端接受的参数名
  })
  Data.append("achievementName", formData.monoName) //将标题也加进去
  Data.append("username", formData.username) //将成果的名字也加进去
  api.post('/MonographPicture/uploadPictures', Data).then(res => {
    console.log('res is ', res)
    ElMessage({
      message: '文件上传成功',
      type: 'success',
    })
    images.value = []//之后清空
    //填报成果成功之后无需显示
    //imageurls.value=res.data.data;//初始化图片链接数组
    console.log("得到的图片数据为", imageurls.value)
    console.log("上传后", images)
  }).catch(error => {
    ElMessage({
      message: error.message,
      type: 'error',
    })
  })
}
const confirmAdd = () => {
  console.log("上传的formData is ", formData)
  // 表单校验 上传
  rulesForm.value.validate((valid) => {
    if (valid) {
      if (images.value.length === 0) {
        ElMessage({
          message: '请选择要上传的图片文件以供证明',
          type: 'warning',
        })
        return
      }
      console.log("通过");
      api.post("/Monograph/add/", formData).then(res => {
        console.log(res);
        if (res.data.flag === true) {
          submitFile() //如果成功 就
          if (role === 'admin') {//管理员和用户添加成果时的消息显示不一样
            ElMessage({
              type: 'success',
              message: '成果信息添加成功',
            })
          } else {
            ElMessage({
              type: 'success',
              message: res.data.message,//用户  显示等待审核
            })
          }
          resetFormData()
          dialogVisible.value = false;
        } else {
          ElMessage({
            type: 'error',
            message: res.data.message,
          })
        }
      }).finally(
          getAll,
      )
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
//移除文件列表时的钩子
const handleRemove = (file, fileList) => {
  console.log("移除时候 file ", file)
  console.log("移除时候 filelist ", fileList)
  images.value = fileList
  console.log('images is ', images)
}
//点击某个文件时的钩子
const handlePreview = (file) => {
  console.log("点击某个文件", file);
}
//添加到上传列表时的钩子
const handleChange = (file, fileList) => {
  images.value = fileList
  console.log("添加到上传列表", file)
  console.log("上传时的images is ", images)
}
//文件超出个数限制时的钩子
const handleExceed = () => {
  ElMessage({
    message: '文件超出2个',
    type: 'warning',
  })
  console.log("文件超出个数限制时的钩子")
}
const clickPicture = (it) => {
  console.log("点击图片的内容", it)
}
//点击编辑的时候 获取 该用户 该成果 所对应的图片  同时imagesUrl数组不为空 ==》当还有图片的时候 就不能编辑 不可选择文件
const getImages = () => {

  api.get("/MonographPicture/picturesList/" + formData.username + "/" + formData.monoName) //根据用户名 成果名字 查询对应的图片
      .then(res => {
        console.log("图片的response ", res.data.data)
        imageurls.value = res.data.data
        console.log("获得的图片列表 is ", imageurls)
        console.log("获取图片列表成功")
      })
      .catch(error => {
        ElMessage({
          message: '获取图片列表失败',
          type: 'error',
        })
      })
}
//目标图片的url
const targetImgUrl = ref("")
//点击图片时候的函数
const imgVisible = ref(false) //图片预览 显示在对话框里面
//图片放大
const enlargeImg = (it) => {
  imgVisible.value = it.url
  targetImgUrl.value = it.url;
  console.log("点击图片时候的it is ", it.url)
}
//编辑的时候删除图片
const deleteImg=(it)=>{
  console.log("要删除的图片信息是 ",it)
  //username  成果名称  url
  let info={
    "username":it.username,
    "achievementName":it.achievementName,
    "url":it.url
  }
  api.post("/MonographPicture/deleteImg",info).then(res=>{
    console.log("删除图片的res is ",res)
    if(res.data.flag===true){
      ElMessage({
        message: '图片删除成功',
        type: 'success',
      })
    }
    else{
      ElMessage.error("图片删除失败")
    }
  }).finally(getImages)
}

//判断文件名是否以.pdf结尾
const isPdf = (filename) => {
  return filename.endsWith(".pdf");
}


//浏览pdf
const scanPdf=(it)=>{
  window.open(baseUrl+it.url)

}
</script>

<style scoped>

</style>
