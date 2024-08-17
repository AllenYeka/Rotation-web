<template>
   <!-- 用户信息 -->
   <div class="mask" v-show='elShow.userMedia'>
      <div class="userMedia">
         <el-icon @click="elShow.userMedia=false">
            <Close />
         </el-icon>
         <!-- 用户头部信息 -->
         <div class='user_header'>
            <img :src="userMedia.avatarUrl" />
            <div>
               <span>{{userMedia.username}}</span>
               <span>| {{userMedia.email}}</span>
               <p>{{userMedia.bio}}</p>
            </div>
         </div>
         <hr />
         <!-- 用户资源信息 -->
         <el-skeleton :loading="loading.imgLoading" animated :count="2">
            <!-- 骨架屏 -->
            <template #template>
               <el-skeleton-item variant="image" style="width: 360px; height: 250px; margin-left:30px; margin-bottom:10px;" />
               <el-skeleton-item variant="image" style="width: 360px; height: 250px; margin-left:30px; margin-bottom:10px;" />
            </template>
            <!-- 真实DOM -->
            <template #default>
               <el-scrollbar max-height="420px">
                  <img :src="media.objectUrl" v-for='media of userMedia.medias' :key="media.id" :alt='media.objectName'>
               </el-scrollbar>
            </template>
         </el-skeleton>
      </div>
   </div>
   <!-- 用户表 -->
   <el-table :data="user" style="width: 90%" @row-click="getMediaByUser">
      <el-table-column prop="id" label="UID" align="center" width="70px" />
      <el-table-column prop="username" label="用户" align="center" width="200px" />
      <el-table-column prop="avatarUrl" label="头像" align="center" width="90px">
         <template #default="data">
            <img :src="user[data.$index].avatarUrl">
         </template>
      </el-table-column>
      <el-table-column prop="bio" label="用户座右铭" align="center" width="590px" />
      <el-table-column prop="email" label="邮箱" align="center" width="250px" />
   </el-table>
</template>


<script setup>
import { onMounted, reactive } from "vue"
import axios from 'axios'

/* data */
const baseURL = '/rotation/api/media'
let user = reactive([
   { id: 0, username: 'admin', bio: '敬下一个遗体及终点', email: 'xdhvuexgd@icloud.com', avatarUrl: 'https://foruda.gitee.com/avatar/1719841511744367127/11729822_wangriqing_1719841511.png' }
])
let userMedia = reactive({
   avatarUrl: '',
   username: '',
   email: '',
   bio: '',
   medias: [
      { id: 0, objectName: '杰洛.齐贝林', objectUrl: '/src/assets/image/j1.jpg' },
      { id: 0, objectName: '杰洛.齐贝林', objectUrl: '/src/assets/image/j2.jpg' }
   ]
})
let elShow = reactive({
   userMedia: false
})
let loading = reactive({
   imgLoading: true
})


/* method */
async function getAllUser() {
   const response = await axios.get("/gateway/getAllUser", { headers: { 'Authorization': localStorage.getItem('token') } })
   Object.assign(user, response.data)
}
async function getMediaByUser(row) {
   elShow.userMedia = true
   Object.assign(userMedia, row)
   userMedia.medias.splice(0, userMedia.medias.length)
   const response = await axios.get(baseURL + '/getMediaByUser?username=' + row.username, { headers: { Authorization: localStorage.getItem('token') } })
   Object.assign(userMedia.medias, response.data)
   loading.imgLoading = false
}


/* 钩子 */
onMounted(() => {
   getAllUser()
})
</script>


<style lang='less' scoped>
@-webkit-keyframes slide-in-top {
   0% {
      -webkit-transform: translateY(-1000px);
      transform: translateY(-1000px);
      opacity: 0;
   }
   100% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
      opacity: 1;
   }
}
@keyframes slide-in-top {
   0% {
      -webkit-transform: translateY(-1000px);
      transform: translateY(-1000px);
      opacity: 0;
   }
   100% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
      opacity: 1;
   }
}
.userMedia {
   padding: 20px;
   position: absolute;
   border-radius: 0.8%;
   z-index: 5;
   left: 430px;
   top: 70px;
   width: 800px;
   height: 580px;
   background-color: whitesmoke;
   overflow: hidden;
   -webkit-animation: slide-in-top 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)
      both;
   animation: slide-in-top 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
   .el-scrollbar {
      padding-top: 10px;
      img {
         width: 370px;
         height: 240px;
         margin-left: 10px;
         margin-right: 10px;
         margin-bottom: 10px;
         border-radius: 2%;
         transition: all 0.3s;
         &:hover {
            transform: translate(0, -8px);
         }
      }
   }
   .user_header {
      width: 100%;
      height: 130px;
      display: flex;
      span:nth-child(1) {
         margin-left: 18px;
         font-size: 22px;
         color: rgba(0, 0, 0, 0.68);
         position: relative;
         top: 35px;
      }
      span:nth-child(2) {
         margin-left: 12px;
         color: gray;
         position: relative;
         top: 35px;
      }
      p:nth-child(3) {
         margin-left: 18px;
         color: rgba(0, 0, 0, 0.68);
         position: absolute;
         top: 100px;
      }
      img {
         border-radius: 100%;
         width: 120px;
         height: 120px;
      }
   }
   .el-icon {
      position: absolute;
      font-size: 25px;
      padding: 4px;
      color: grey;
      transition: all 0.3s;
      transform: translate(785px, -17px);
      &:hover {
         background-color: red;
         color: white;
      }
   }
}
.el-table {
   margin-left: 70px;
   img {
      width: 50px;
      border-radius: 100%;
   }
}
</style>