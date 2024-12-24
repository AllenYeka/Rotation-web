import { createRouter, createWebHashHistory } from 'vue-router'
import { ElMessage } from "element-plus"
const router = createRouter({//创建路由器对象
    history: createWebHashHistory(),
    routes: [
        { path: '/', redirect: '/login' },//重定向
        { name: 'login', path: '/login', component: () => import("../components/login.vue") },
        {
            name: 'index', path: '/index', component: () => import("../components/index.vue"), redirect: "/role",
            children: [
                { name: 'role', path: '/role', component: () => import("../components/manage/role.vue"), },
                { name: 'user', path: '/user', component: () => import("../components/manage/user.vue"), },
                { name: 'media', path: '/media', component: () => import("../components/manage/media.vue"), },
                { name: 'findImg', path: '/findImg', component: () => import("../components/find/findImg.vue"), },
                { name: 'userInfo', path: '/userInfo', component: () => import("../components/userInfo/userInfo.vue"), },
                { name: 'createImg', path: '/createImg', component: () => import("../components/create/createImg.vue"), },
                { name: 'tip', path: '/tip', component: () => import("../components/tip/tip.vue"), },
                { name: 'comment', path: '/comment', component: () => import("../components/tip/comment.vue"), }
            ]
        },
    ]
})
router.beforeEach((to, from, next) => {
    if (sessionStorage.getItem("token") != null || to.path == '/login' || to.path == '/')
        next()
    else {
        next('/login')
        ElMessage.warning({ message: '请先登录', duration: 1000 })
    }
})

export default router 