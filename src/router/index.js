import {createRouter, createWebHistory} from 'vue-router'
const routes = [
    {
        path: "/login",
        name: "login",
        component: () => import('../views/login.vue'),
    },
    {
        path: "/register",
        name: "register",
        component: () => import('../views/register.vue'),
    },
    {
        path: "/",
        name: "layout",
        component: () => import('../layout/layout.vue'),
        children: [{
            path: "home",
            name: "Home",
            component:()=>import('../views/Home.vue'),
        },{
            path: "test",
            name: "Test",
            component:()=>import('../views/test.vue'),
        }
        ]
    },
];
const router = createRouter({
    history: createWebHistory(), routes,
})
export default router
