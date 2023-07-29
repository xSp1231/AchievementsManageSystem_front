import {createStore} from 'vuex'
import api from "../api/index.js";
const store = createStore({
    state:{
      isCollapse:false, //控制侧边栏折叠
      isManager:false,  //是否为管理员
      tabsList: [//面包屑数据  //点击菜单时 向面包屑里面添加新数据；
            {
                path: "/home",
                name: "home",
                label: "主页",
                icon: "HomeFilled",
            },
        ],
      role:"",
      username:"" //学生的用户名
    },
    mutations: {
        getUsername(state){
            if(sessionStorage.getItem('role')==='student'){//学生
            api.get("/getUserInfo").then(res=>{
                console.log("获取到的用户信息",res.data.data.username );
                if(res.data.flag===true){
                    state.username=res.data.data.username;
                    console.log("vuex得到的用户名是 ",state.username)
                }
            })
            }
            else{//admin
                state.username=""
            }
        },
        getRole(state){
            state.role=sessionStorage.getItem("role");
            console.log("vuex得到的用户角色:",state.role)
        },
        inittabList(state){
            state.tabsList=[//面包屑数据  //点击菜单时 向面包屑里面添加新数据；
                {
                    path: "/home",
                    name: "home",
                    label: "主页",
                    icon: "HomeFilled",
                },
            ]
        },
        collapseMenu(state) {
            state.isCollapse =!state.isCollapse;//折叠；
            console.log("vuex!!====",state.isCollapse)
        },
        // confirmManager(state){ //确定为管理员 调用这个函数
        //
        //     state.isManager=true;
        //     console.log("isManager值改变为",state.isManager)
        // },
        // confirmStudent(state){ //
        //     state.isManager=false;
        //     console.log("isManager值改变为",state.isManager)
        // },
        //更新面包屑
        updateBread(state, val) {//state为state里面的state对象，val为点击菜单时 获取到的数据
            console.log("点击导航栏传进来的val is", val);//val为点击页面菜单时的对象
            //首先要不是home页面  //home页面默认出现
            if (val.name !== 'home') {//之后再判断点击的页面还没有出现过.///////// 因为home原来就存在与tablelist里面
                //fnidIndex() 遍历数组 里面的参数为数组里面的元素
                const index = state.tabsList.findIndex(item => item.name === val.name);
                //如果没有找到 就返回-1  那么就可以向里面添加元素；
                if (index === -1) {
                    console.log("not found this element")
                    state.tabsList.push(val);
                }
            }
        },
        //删除tag
        closetag(state,item){
            console.log("closetag's item is ",item);//拿到所点击删除的标签的信息。
            for(let i=0; i<=state.tabsList.length; i++){//遍历寻找 然后删除。
                if(state.tabsList[i]===item){
                    state.tabsList.splice(i,1)
                    break;
                }
            }//遍历删除
            console.log("tablist的长度是",state.tabsList.length)
        }
    },
})
export default store
