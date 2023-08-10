import {createRouter, createWebHistory} from 'vue-router'
import {useRoute, useRouter} from "vue-router"

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
        name: "passwordRecovery",
        component: () => import('../views/System/findPwd.vue'),
    },
    {
        path: "/noAuth", //科技论文
        name: "403",
        component: () => import('../views/System/403.vue'),
    },
    {
        path: "/",
        name: "layout",
        redirect: "/home",
        component: () => import('../layout/layout.vue'),
        children: [{
            path: "home",
            name: "Home",
            component: () => import('../views/System/Home.vue'),
        }, {
            path: "personalCenter", //个人中心
            name: "personalCenter",
            component: () => import('../views/PersonalCenter/index.vue'),
        },
            {
                //只有管理员可以访问
                path: "userManage", //用户管理
                name: "userManage",
                component: () => import('../views/UserManage/index.vue'),
                meta: {
                    requireAdmin: true
                }
            },
            {
                //只有管理员可以访问
                path: "notice", //公告管理
                name: "notice",
                component: () => import('../views/Notice/index.vue'),
                meta: {
                    requireAdmin: true
                }
            },
            {
                path: "monograph", //专著表
                name: "monograph",
                component: () => import('../views/AchievementsTables/monograph.vue'),
            },
            {
                path: "patentSoft", //专利软著
                name: "patentSoft",
                component: () => import('../views/AchievementsTables/PatentSoft.vue'),
            },
            {
                path: "projects", //项目表
                name: "projects",
                component: () => import('../views/AchievementsTables/Projects.vue'),
            },
            {
                path: "reward", //奖励表
                name: "reward",
                component: () => import('../views/AchievementsTables/Reward.vue'),
            },
            {
                path: "scientificPapers", //科技论文
                name: "scientificPapers",
                component: () => import('../views/AchievementsTables/ScientificPapers.vue'),
            },

        ]
    },
];
const router = createRouter({
    history: createWebHistory(), routes,
})
// 导航守卫
router.beforeEach((to, from, next) => {

    const token = sessionStorage.getItem("saToken")
    const role = sessionStorage.getItem('role')
    const requireAdmin = to.meta.requireAdmin;//要访问的页面是否需要admin角色
    console.log("requireAdmin is ",requireAdmin)
    if (token) {// 如果存在token，则允许访问路由
        if (to.name != "loginandregister" && to.name != 'passwordRecovery') {//访问的是除了登录页面和找回密码页面的其他页面
            //管理员才能访问的页面
            if (requireAdmin===true && role != 'admin') {
                next({name: "403"}); // 重定向到权限不足的页面
            } else {
                next();
            }

        } else {//访问的是登录页面 或者找回密码页面 但是token存在 那么就回到home
            next({name: "Home"})
        }
    } else { // 如果不存在token，则跳转到登录页面或注册页面
        if (to.name === 'loginandregister' || to.name === 'passwordRecovery') {
            next()
        } else {
            next({name: "loginandregister"})
        }
    }

})
export default router
