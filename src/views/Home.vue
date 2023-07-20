<template>
  <div class="home" style="width: 100%;height: 100%;">
    <div class="homeArea" style="width: 100%;height:100%;background-color: #f1f1f1;border-radius: 15px">

      <div id="box-one" style="width: 100%;height:49%;display: flex">
        <div class="one">
          <div class="intro" style="width:100%;height: 8%;background-color: #eeecec;border-radius: 10px">
            <h3 style="text-align: center;color: grey;">公告栏</h3>
          </div>

          <div class="notice" style="width: 100%;height: 92%;background-color:#f6f4f4;border-radius: 10px">

            <el-table :data="tableData" stripe height="96%" style="width: 100%" >
              <el-table-column sortable prop="date" label="发布时间" width="180" />
              <el-table-column prop="title" label="标题" width="180" />
              <el-table-column sortable prop="status" label="状态" width="180" >
                <template #default="{ row }">
                  <el-tag :type="row.status === '紧急' ? 'danger' : 'info'">
                    {{ row.status}}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="Operations">
                <template #default="scope">
                  <el-button :icon="ZoomIn" size="small" @click="read(scope.row)">点击查看详细内容</el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-dialog v-model="dialogVisible" style="width: 500px;height: 500px;" draggable title="详细信息">
              <span>{{dialogData.date}}</span>
              <span>{{dialogData.status}}</span>
              <span>{{dialogData.title}}</span>
              <span>{{dialogData.comment}}</span>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关闭</el-button>
              </div>
            </el-dialog>

          </div>

        </div>


        <div class="two" >

          <div class="top" style="width: 100%;height: 30%;display: flex;">
          <el-card shadow="hover" style="width:30%;height: 70%;margin-top: 1%;margin-left: 1%;border-radius: 10px;background-color: rgba(222,227,227,0.4);" v-for="item in countData" :key="item.name">
            <div class="item" style="display: flex;">
              <div   style="width:40px;height: 40px; background:rgba(9,141,189,0.66);border-radius: 5px;margin-right: 5%"><el-icon style="font-size: 30px;color: #eae9e9;margin-left: 12%;margin-top: 10%"><component :is="item.icon"/></el-icon></div>
              <div class="detail">
                <h4 class="describe" >{{ item.name }}</h4>
              <h4 class="price" :style="{ color: item.color}">{{ item.value }}</h4>
            </div>

            </div>
          </el-card>

          </div>
          <el-card shadow="hover" style="width: 90%;margin-left:1%;height: 65%;border-radius: 10px;background-color: rgba(236,236,236,0.83)">

           <h3>系统介绍</h3>

          </el-card>
        </div>
      </div>

      <div id="box-two" style="width: 100%;height:49%;margin-top:0.5% ;display: flex">
        <div class="three" >
           <line-chart></line-chart>
        </div>

        <div class="four">
            <pie-chart></pie-chart> <!---别用el-card了-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pieChart from "./GraphsOfHome/PieChart.vue";
import lineChart from "./GraphsOfHome/NumberOfDailySystemUsers.vue"
import {
  ZoomIn,
  DocumentAdd,
  Management,
  UserFilled,
  Avatar,
} from '@element-plus/icons-vue';
export default {
  name: "Home",
  components:{
    pieChart,
    lineChart,
    UserFilled,Avatar,DocumentAdd,Management
  },
  data(){
    return{
      ZoomIn,
      UserFilled,
      countData: [
        {
          name: "学生使用人数:",
          value: 1234,
          icon: "UserFilled",
          color: "#02638a",
        },
        {
          name: "管理员人数:",
          value: 3,
          icon: "Avatar",
          color: "#d55503",
        },
        {
          name: "成果信息总数:",
          value: 1234,
          icon: "Management",
          color: "#67676c",
        },
      ],
      tableData:[
        {
          date: '2016-05-03',
          title: 'Tom',
          status:"紧急",
          content: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-02',
          title: 'Tom',
          status:"一般",
          content: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-04',
          title: 'Tom',
          status:"一般",
          content: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-01',
          title: 'Tom',
          status:"一般",
          content: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-03',
          title: 'Tom',
          status:"紧急",
          content: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-02',
          title: 'Tom',
          status:"紧急",
          content: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-04',
          title: 'Tom',
          status:"紧急",
          content: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-01',
          title: 'Tom',
          status:"一般",
          content: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-03',
          title: 'Tom',
          status:"紧急",
          content: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-02',
          title: 'Tom',
          status:"紧急",
          content: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-04',
          title: 'Tom',
          status:"一般",
          content: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-01',
          title: 'Tom',
          status:"一般",
          content: 'No. 189, Grove St, Los Angeles',
        },
      ],
      dialogVisible: false,
      dialogData: {
        "date":"",
        "title":"",
        "status":"",
        "comment":"" //内容
      },
    };
    },
  methods: {
    read(row) {
      console.log("点击")
      this.dialogData = row;
      this.dialogVisible = true;
    },
  },

}

</script>

<style lang="less"  scoped>
.one{
  width: 50%;
  height: 100%;
  border-radius: 15px;
  background-color: #f6f4f4;
  margin-left: 0.5%;
}
.two{
  //display: flex;
  //flex-wrap: wrap;
  width: 50%;
  height: 100%;
  border-radius: 15px;
  background-color: #f6f4f4;
  margin-left: 0.5%;
}
.three{
   width: 50%;
   height: 100%;
   border-radius: 15px;
   background-color: #f6f4f4;
   margin-left:0.5%;
 }
.four{
    width: 50%;
    height: 100%;
    border-radius: 15px;
    background-color: #f6f4f4;
    margin-left: 0.5%;
  }
</style>
