<!--用户管理页面--->
<template>

  <div class="userManage" style="width: 100%;height: 100%;background-color: #ffffff;position: relative;">


    <div style="margin-left: 2%">
      <div class="findarea" style="">
        <el-input clearable class="filter-item" v-model="queryInfo.username" placeholder="学生用户名"
                  style="width: 150px;margin-right: 8px"></el-input>
        <el-input clearable class="filter-item" v-model="queryInfo.major" placeholder="专业班级"
                  style="width: 150px;margin-right: 8px"></el-input>
        <el-input clearable class="filter-item" v-model="queryInfo.name" placeholder="学生姓名"
                  style="width: 150px;margin-right: 8px"></el-input>
        <el-button @click="getAll()" :icon="Search"   class="search">查询</el-button>
        <el-tooltip
            class="box-item"
            effect="light"
            content="选择重置 请事先将搜索框里面的内容清除^-^"
            placement="top"
        >
          <el-button @click="reback()" :icon="Refresh" class="renew">重置</el-button>
        </el-tooltip>
        <el-button @click="deleteBatches()"   :icon="DeleteFilled" type="danger" class="dels">批量删除</el-button>

        <el-button type="primary" plain :icon="Download" style="margin-left: 10px" @click="exportAll()" >导出全部数据</el-button>
        <el-button type="" plain :icon="Download" @click="exportPart()">批量导出</el-button>
        <el-upload action="http://localhost:8080/importStudentInfo"
                   :show-file-list="false" accept="xlsx"
                   :on-success="handleImportSuccess"
                   :before-upload="beforeAvatarUpload"
                   style="display: inline-block;position: absolute;right: 1%"
        >
          <el-button type="success"  :icon="UploadFilled" plain  >Excel数据导入</el-button>
        </el-upload>

      </div>
      <div class="addInfo"  style="margin-top: 10px">
        <el-button type="text" plain size="default" :icon="Plus" @click="dialogVisible = true; isadd = true;dialogTitle='新增用户信息' ">点击增加</el-button>
        <el-dialog
            draggable
            v-model="dialogVisible"
            :title="dialogTitle"
            width="30%"
            :before-close="handleClose"
        >
          <el-form :model="formData" style="width: 80%"  ref="dataAddForm" :rules="rules">
            <el-form-item label="用户名" label-width="150" prop="username" >
              <el-input v-model="formData.username"   :disabled="!isadd"  placeholder="用户名" clearable autocomplete="off" />
            </el-form-item>
            <el-form-item label="密码"  label-width="150" prop="password">
              <el-input v-model="formData.password"  placeholder="密码" clearable autocomplete="off" />
            </el-form-item>
            <el-form-item label="学生姓名" label-width="150" prop="name">
              <el-input v-model="formData.name"   placeholder="姓名填写" clearable autocomplete="off" />
            </el-form-item>
            <el-form-item label="角色" label-width="150" prop="role">
              <el-input v-model="formData.role"  placeholder="学生(该字段不用填写)" disabled  clearable autocomplete="off" />
            </el-form-item>
            <el-form-item label="专业班级" label-width="150" prop="major">
              <el-input v-model="formData.major"  placeholder="xx专业xx班(如 计科2119班)" clearable autocomplete="off" />
            </el-form-item>

            <el-form-item label="用户qq号" label-width="150" prop="email">
              <el-input v-model="formData.email"  placeholder="输入账号即可,不加@qq.com" clearable autocomplete="off" />
            </el-form-item>

            <el-form-item label="帐号状态" label-width="150" >

              <el-switch
                  v-model="formData.status"
                  @change="test()"
                  inline-prompt
                  :active-value="1"
                  :inactive-value="0"
                  active-text="可用"
                  inactive-text="禁用"
                  style="--el-switch-on-color: #13ce66; --el-switch-off-color:  #ff4949"
              />
<!--              <el-select v-model="formData.status"  placeholder="学生账号状态">-->
<!--                <el-option label="可用" value=1 />-->
<!--                <el-option label="禁用" value=0 />-->
<!--              </el-select>-->
            </el-form-item>
          </el-form>

          <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelOption()">取消</el-button>
        <el-button v-if="isadd===true"  type="primary" @click="saveStudent()">
          确定添加
        </el-button>
        <el-button v-if="isadd===false"  type="success" @click="editStudent()">
          确定更改信息
        </el-button>
      </span>
          </template>
        </el-dialog>
      </div>
      <div class="table" style="width: 90%;margin-top: 0px " >
        <el-table :data="dataList" style="width: 100%" height="480"  size="large"  @selection-change="handleSelectionChange" >
          <el-table-column
              type="selection"
              width="70">
          </el-table-column>
          <el-table-column prop="username" label="用户名" width="130" sortable>
          </el-table-column>
          <el-table-column prop="password" label="密码" width="120" >
          </el-table-column>
          <el-table-column prop="name" label="学生姓名" width="120" sortable>
          </el-table-column>
          <el-table-column prop="major" label="专业班级" width="160">
          </el-table-column>
          <el-table-column prop="email" label="用户qq号" width="150">
          </el-table-column>
          <el-table-column prop="role" label="角色" width="100">
          </el-table-column>

          <el-table-column prop="status" label="帐号状态" width="140"  sortable>
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                {{ row.status === 1 ? '可用' : '禁用' }}
              </el-tag>
            </template>

          </el-table-column>

          <el-table-column label="操作">
            <template #default="scope">
              <el-button round size="small" :icon="Edit" @click="handleUpdate(scope.row)"
              >编辑</el-button
              >
              <el-button
                  size="small"
                  round
                  type="danger"
                  :icon="DeleteFilled"
                  @click="DeleteByUsername(scope.row)"
              >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page" style="width: 40%;margin-top:1%;margin-left: 30px" >
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

<script>
import {DeleteFilled, Edit, Plus, Search,UploadFilled,Refresh,Download} from '@element-plus/icons-vue'
import api from "../../api/index.js"
import {ElMessageBox} from 'element-plus'
export default {
  name: "index",
  data() {
    return {
      //返回组件
      Search,Plus, Edit,DeleteFilled,UploadFilled,Refresh,Download,
      dialogTitle:"test",
      isadd: true,//true 添加  false 关闭
      dataList: [
        {"username":"test","password":"123","name":"徐书鹏","major":"计算机科学与技术","role":"角色","status":0,"email":"2789347466"},
        {"username":"test","password":"123","name":"徐书鹏","major":"计算机科学与技术","role":"角色","status":1,"email":"2789347466"},
        {"username":"test","password":"123","name":"徐书鹏","major":"计算机科学与技术","role":"角色","status":1,"email":"2789347466"},
      ],//当前页要展示的列表数据
      dialogVisible: false,
      formData: { //表单数据
        "username": "",
        "password": "",
        "name": "",
        "role": "学生",
        "major": "",
        "email":"",
        "status":1,
      },
      rules: {//校验规则
        username: [{required: true, message: 'username为学号', trigger: 'blur'},{min: 3, max: 10, message: '密码应在 3 到 10 个字符之间', trigger: 'blur'}],
        password: [{required: true, message: '密码为必填项', trigger: 'blur'},{min: 3, max: 10, message: '密码应在 3 到 10 个字符之间', trigger: 'blur'}],
        name:     [{required: true, message: '姓名为必填项', trigger: 'blur'}],
        major:    [{required: true, message: '按照格式填写专业班级', trigger: 'blur'}],
        email:    [{required: true, message: '请填写自己正确的qq号', trigger: 'blur'}],
      },
      //分页请求体params
      queryInfo: {
        currentPage: 1,
        pageSize: 5,
        total: 0,
        username:"",
        name:"",
        major:"",
      },
      usernames: []
    }
  },
  mounted() {
    this.getAll()
  },
  methods:{
    test(){
      console.log("开关值",this.formData.status)
    },
    reback() {
      api.get('/student/1/5').then((res) => {

        this.dataList = res.data.data.records;
        this.queryInfo.currentPage = 1;
        this.queryInfo.pageSize = 5;
        this.queryInfo.total = res.data.data.total;
        this.queryInfo.username = ""
        this.queryInfo.name = ""
        this.queryInfo.major = ""
      })
    },
    handleSizeChange(newsize) {
      console.log(`每页 ${newsize} 条`);
      this.queryInfo.currentPage = 1 //每次点击切换数据条数 就默认回到第一页
      this.queryInfo.pageSize = newsize
      this.getAll()
    },
    handleCurrentChange(newpage) {//显示跳转到多少页
      console.log(`当前跳转到的页码为: ${newpage}`);
      this.queryInfo.currentPage = newpage
      this.getAll()//得到数据
    },
    getAll(){ //分页+条件查询
      let param;
      param = "?username=" + this.queryInfo.username
      param += "&name=" + this.queryInfo.name
      param += "&major=" + this.queryInfo.major
      api.get("/student/"+this.queryInfo.currentPage+"/"+this.queryInfo.pageSize+param).then(res=>{
        console.log("getall 后端返回的数据是 ",res);
        this.dataList=res.data.data.records;
        this.queryInfo.currentPage = res.data.data.current;
        this.queryInfo.pageSize = res.data.data.size;
        this.queryInfo.total = res.data.data.total;
      })
    },
    //点击el-diaglog右上角的x按钮(叉叉)
    handleClose(done) {
      ElMessageBox.confirm('确定退出相应操作?')
          .then(() => {
            this.formData={}  //在退出操作之后 将表格清空
            done();
          })
          .catch(() => {
            // catch error
          })
    },
    //取消增加操作
    cancelOption() {
      this.dialogVisible = false;
      this.formData = {};
    },
    //增加学生
    saveStudent(){
      this.formData.status=parseInt(this.formData.status); //string=>int
      this.formData.role="学生"
      console.log("表单数据是",this.formData) //双向绑定
      this.$refs.dataAddForm.validate(valid => {
        console.log("校验结果为", valid);
        if (valid) {
          api.post('/student', this.formData).then(res => {
            console.log("后端返回的结果为", res)
            if (res.data.flag) {
              this.$message.success(res.data.message)
              this.dialogVisible = false;
              this.formData = {}//清空操作
              this.getAll()
            } else {
              this.$message.warning(res.data.message)
            }
          })
        } else {
          this.$message.warning("用户添加失败!请确定字段是否填写完全")
        }

      })


    },

    DeleteByUsername(row){
      console.log("要删除信息的用户名是",row.username);
      this.$confirm("确认是否删除?删除后，该用户的所有成果信息也将删除，后续无法找回,请慎重考虑", "提示", {type: "warning"}).then(() => {
        api.delete('/student/' + row.username).then((res) => {
          console.log("删除的res is ",res)
          this.$message.success("删除成功");
          if(res.data.message==="学生注销成功!"){
            sessionStorage.removeItem('saToken'); //会话存储里面
            sessionStorage.removeItem('tokenName');
            sessionStorage.removeItem('role');
            this.$router.push("/login") //删除之后跳转到登录页面
          }
          // console.log("总的数量", this.queryInfo.total);
          // if (((this.queryInfo.total - 1) % (this.queryInfo.pageSize) === 0) && this.queryInfo.pageSize !== 1) {//当删除掉某页最后一行数据的时候 我们需要跳转到前面的页面
          //   this.queryInfo.currentPage -= 1;//页数减1
          // }
        }).finally(() => {
          this.getAll();
        });
      }).catch(() => {
        this.$message.info("取消操作")
      })
    },
    handleUpdate(row) {
      this.dialogTitle="更改用户信息(用户名,角色不可改动)",
          this.dialogVisible = true; //弹出窗口
      this.isadd = false//开始编辑 改变表格按键
      api.get("/selectStudentByUsername/" + row.username).then(res => {
        console.log("通过用户名搜索的信息是",res.data.data);
        if(res.data.flag===true&&res.data.data!=null){
          this.formData=res.data.data
        }
        else {
          this.$message.error("数据同步失败，自动刷新")
        }
      }).finally(this.getAll)
    },
    editStudent(){
      console.log("修改后的表单信息是",this.formData)
      this.formData.status=parseInt(this.formData.status)
      api.put("/student",this.formData).then(res=>{
            console.log("编辑成功 res is ",res);
            this.$message.success("学生信息修改成功")
          }
      ).finally(this.getAll)
      this.dialogVisible=false
      this.formData={}
    },
    handleSelectionChange(val) {
      this.usernames = val.map(row => row.username);
    },
    deleteBatches() {
      console.log("选择的要删除的用户",this.usernames)
      if (this.usernames.length===0) {
        this.$message.warning("请选择数据！")
      }
      else {
        this.$confirm('确认是否删除?删除后，该用户的所有成果信息也将删除，后续无法找回,请慎重考虑', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.post("/deleteUsersByUsernames", this.usernames).then(res => {
            if (res) {
              this.$message.success("批量删除成功！");
              if (((this.queryInfo.total - this.usernames.length) % (this.queryInfo.pageSize) === 0)) {//当删除掉某页最后一行数据的时候 我们需要跳转到前面的页面
                this.queryInfo.currentPage -= 1;//页数减1
              }
              this.getAll()
            } else {
              this.$message.error('删除失败');
            }
          });
        })
      }
    } ,
    handleImportSuccess(){
      this.$message.success("导入成功");
      this.getAll()
    },
    beforeAvatarUpload(rawFile) {
      if (rawFile.type !== 'application/vnd.ms-excel' && rawFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        this.$message.error('只允许excel文件导入!')
        return false
      }
      if (rawFile.size / 1024 / 1024 > 8) {
        this.$message.error('Avatar picture size can not exceed 8MB!')
        return false
      }
      return true
    },
    exportAll(){
      window.location.href = "http://localhost:8080/exportAll";
    },
    exportPart() {
      console.log("选择的用户名为", this.usernames)
      if (this.usernames.length === 0) {
        this.$message.warning("请勾选想要导出的用户！")
      } else {
        api.post('/exportByUsername', this.usernames, {
          responseType: 'blob' // 指定响应数据的类型为 Blob 对象
        }).then(response => {
          // 获取响应头中的文件名
          const header = response.headers['content-disposition']
          console.log("响应的文件名",header)
          const filename = header ? header.split('=')[1] : 'StudentInfo.xlsx'
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
  }

}
</script>

<style scoped>

</style>
