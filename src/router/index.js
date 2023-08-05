import {createRouter, createWebHistory} from 'vue-router'
import { useRoute, useRouter } from "vue-router"
const routes = [
    // {
    //     path: "/login",
    //     name: "login",
    //     component: () => import('../views/test/login.vue'),
    // },
    {
        path: "/LoginAndRegister",
        name: "loginandregister",
        component: () => import('../views/System/LoginAndRegister.vue'),
    },
    {
        path: "/PasswordRecovery",
        name: "passwordandrecovery",
        component: () => import('../views/System/findPwd.vue'),
    },
    {
        path: "/",
        name: "layout",
        redirect:"/home",
        component: () => import('../layout/layout.vue'),
        children: [{
            path: "home",
            name: "Home",
            component:()=>import('../views/System/Home.vue'),
        },{
            path: "personalCenter", //个人中心
            name: "personalCenter",
            component:()=>import('../views/PersonalCenter/index.vue'),
        },
            {
                path: "userManage", //用户管理
                name: "userManage",
                component:()=>import('../views/UserManage/index.vue'),
            },
            {
                path: "notice", //公告管理
                name: "notice",
                component:()=>import('../views/Notice/index.vue'),
            },
            {
                path: "monograph", //专著表
                name: "monograph",
                component:()=>import('../views/AchievementsTables/monograph.vue'),
            },
            {
                path: "patentSoft", //专利软著
                name: "patentSoft",
                component:()=>import('../views/AchievementsTables/PatentSoft.vue'),
            },
            {
                path: "projects", //项目表
                name: "projects",
                component:()=>import('../views/AchievementsTables/Projects.vue'),
            },
            {
                path: "reward", //奖励表
                name: "reward",
                component:()=>import('../views/AchievementsTables/Reward.vue'),
            },
            {
                path: "scientificPapers", //科技论文
                name: "scientificPapers",
                component:()=>import('../views/AchievementsTables/ScientificPapers.vue'),
            }
        ]
    },
];
const router = createRouter({
    history: createWebHistory(), routes,
})
// 导航守卫
// router.beforeEach((to, from, next) => {
//
//
//     const token=sessionStorage.getItem("saToken")
//         if (token) {// 如果存在token，则允许访问路由
//             if(to.name!="loginandregister"){
//                 next();
//             }
//             else{
//                 next({name:"Home"})
//             }
//         }
//         else { // 如果不存在token，则跳转到登录页面或注册页面
//             if (to.name === 'loginandregister' ) {
//                 next()
//             }
//             else {
//                 next({name:"loginandregister"})
//             }
//         }
//
// })
export default router
