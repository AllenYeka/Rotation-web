import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIcon from '@element-plus/icons-vue'
import router from './router/index.js'
import axios from 'axios'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
axios.interceptors.request.use((request) => {//ajax请求拦截器
    //nProgress.start()
    if (request.headers.Authorization == null || request.headers.Authorization == '')
        request.headers.Authorization = sessionStorage.getItem('token')
    return request
})
axios.interceptors.response.use((response) => {//响应拦截器
    //nProgress.done()
    return response
})
const app = createApp(App)
app.use(ElementPlus).use(router)
Object.keys(ElIcon).forEach((key) => {
    app.component(key, ElIcon[key])
})
app.mount('#app')
