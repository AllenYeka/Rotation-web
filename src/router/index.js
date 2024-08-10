import { createRouter, createWebHashHistory } from 'vue-router'
import { ElMessage } from "element-plus"
const router = createRouter({//创建路由器对象
    history: createWebHashHistory(),
    routes: [
        { path: '/', redirect: '/login' },//重定向
        { name: 'login', path: '/login', component: () => import("../components/login.vue") },
        {
            name: 'index', path: '/index', component: () => import("../components/index.vue"), redirect: "/home",
            children: [
                { name: 'home', path: '/home', component: () => import("../components/home/home.vue"), },
                { name: 'all_user', path: '/all_user', component: () => import("../components/home/all_user.vue"), },
                { name: 'all_media', path: '/all_media', component: () => import("../components/home/all_media.vue"), },
                { name: 'findImg', path: '/findImg', component: () => import("../components/find/findImg.vue"), },
                { name: 'usermsg', path: '/usermsg', component: () => import("../components/usermsg/usermsg.vue"), },
                { name: 'createImg', path: '/createImg', component: () => import("../components/create/createImg.vue"), },
                { name: 'chat', path: '/chat', component: () => import("../components/chat/chat.vue"), },
                { name: 'tip', path: '/tip', component: () => import("../components/chat/tip.vue"), }
            ]
        },
    ]
})
router.beforeEach((to, from, next) => {
    if (localStorage.getItem("token") != null || to.path == '/login' || to.path == '/')
        next()
    else {
        next('/login')
        ElMessage.warning({ message: '请先登录', duration: 1000 })
    }
})

export default router 