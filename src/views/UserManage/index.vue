<template>
<div class="userManage" style="width: 100%;height: 100%;background-color: #ffffff;position: relative">
  <div class="findarea" style="position: absolute;top:1%;left: 3%">
    <el-input class="filter-item" v-model="queryInfo.type" placeholder="学生用户名"
              style="width: 150px;margin-right: 8px"></el-input>
    <el-input class="filter-item" v-model="queryInfo.name" placeholder="专业班级"
              style="width: 150px;margin-right: 8px"></el-input>
    <el-input class="filter-item" v-model="queryInfo.description" placeholder="学生姓名"
              style="width: 150px;margin-right: 8px"></el-input>
    <el-input class="filter-item" v-model="queryInfo.description" placeholder="账号状态"
              style="width: 150px;margin-right: 8px"></el-input>
    <el-button @click="getAll()" class="search">查询</el-button>
    <el-button @click="reback()" class="renew">重置</el-button>
    <el-button @click="deleteBatches()" type="danger" class="dels">批量删除</el-button>
  </div>
  <div class="addInfo"  style="position: absolute;top:6%;left: 3%">
    <el-button type="text" plain size="default" :icon="Plus" @click="dialogVisible = true;isadd = true">点击增加</el-button>
    <el-dialog
        draggable
        v-model="dialogVisible"
        title="新建学生用户"
        width="30%"
        :before-close="handleClose"
    >
      <el-form :model="formData" style="width: 80%"  ref="dataAddForm" :rules="rules">
        <el-form-item label="用户名" label-width="150px" prop="username" >
          <el-input v-model="formData.username" placeholder="用户名" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码"  label-width="150" prop="password">
          <el-input v-model="formData.password"  placeholder="密码" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item label="学生姓名" label-width="150" prop="name">
          <el-input v-model="formData.name"   placeholder="姓名填写" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item label="专业班级" label-width="150" prop="major">
          <el-input v-model="formData.major"  placeholder="xx专业xx班(如 计科2119班)" clearable autocomplete="off" />
        </el-form-item>

        <el-form-item label="帐号状态" label-width="150" >
          <el-select v-model="formData.status"  placeholder="学生账号状态">
            <el-option label="可用" value=1 />
            <el-option label="禁用" value=0 />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
      <span class="dialog-footer">
        <el-button @click="this.dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="saveOption()">
          确定添加
        </el-button>
      </span>
      </template>
    </el-dialog>

  </div>

  <div class="table" style="width: 80%; position: absolute;top:11%;left: 3%;" >
    <el-table :data="dataList" style="width: 100%" height="480"  size="large"  >
      <el-table-column
          type="selection"
          width="70">
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="150" sortable>
      </el-table-column>
      <el-table-column prop="password" label="密码" width="150" >
      </el-table-column>
      <el-table-column prop="name" label="学生姓名" width="150" sortable>
      </el-table-column>
      <el-table-column prop="major" label="专业班级" width="180">
      </el-table-column>
      <el-table-column prop="role" label="角色" width="140">
      </el-table-column>

      <el-table-column prop="status" label="帐号状态" width="140" >
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '可用' : '禁用' }}
          </el-tag>
        </template>

      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" :icon="Edit" @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button
          >
          <el-button
              size="small"
              type="danger"
              :icon="DeleteFilled"
              @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>


</div>

</template>

<script>
import {
  Edit,
  Plus,
  DeleteFilled,
} from '@element-plus/icons-vue'
import api from "../../api/index.js"
import { ElMessageBox } from 'element-plus'
export default {
  name: "index",
  data(){
    return {
      Plus, Edit,DeleteFilled,//返回组件
      bookid: "",
      isadd: true,//true 添加  false 关闭
      dataList: [
        {"username":"test","password":"123","name":"徐书鹏","major":"计算机科学与技术","role":"角色","status":0},
        {"username":"test","password":"123","name":"徐书鹏","major":"计算机科学与技术","role":"角色","status":1},
        {"username":"test","password":"123","name":"徐书鹏","major":"计算机科学与技术","role":"角色","status":1},
      ],//当前页要展示的列表数据
      dialogVisible: false,
      formData: { //表单数据
        "username": "",
        "password": "",
        "name": "",
        "role": "学生",
        "major": "",
        "status":1,
      },
      rules: {//校验规则
        username: [{required: true, message: 'username为学号', trigger: 'blur'}],
        password: [{required: true, message: '密码为必填项', trigger: 'blur'},{min: 3, max: 10, message: '密码应在 3 到 10 个字符之间', trigger: 'blur'}],
        name:     [{required: true, message: '姓名为必填项', trigger: 'blur'}],
        major:    [{required: true, message: '按照格式填写专业班级', trigger: 'blur'}],
      },
      //分页请求体params
      queryInfo: {
        currentPage: 1,
        pageSize: 5,
        total: 0,
        type: "",
        name: "",
        description: ""
      },
      ids: []
    }
    },
  mounted() {
    this.findAll()
  },
  methods:{
    findAll(){
      api.get("/getAll").then(res=>{
        console.log("后端返回的数据是 ",res);
        this.dataList=res.data.data;
      })
    },

    //点击el-diaglog右上角的x按钮(叉叉)
    handleClose(done) {
      ElMessageBox.confirm('Are you sure to close this dialog?')
          .then(() => {
            done()
          })
          .catch(() => {
            // catch error
          })
    },






  }

}
</script>

<style scoped>

</style>
