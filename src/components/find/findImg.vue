<template>
   <!-- 预览图片 -->
   <div class="mask" v-show="elShow.mask" @click="exitPrepicture()">
      <img class="prepicture" :src="prepicture" />
   </div>
   <!-- 用户信息 -->
   <div class="mask" v-show='elShow.userMediaMask'>
      <div class="userMedia">
         <el-icon @click="elShow.userMediaMask=false">
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
         <el-skeleton :loading="loading.imgLoading_user" animated :count="2">
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
   <!-- 所有图片 -->
   <div class="container">
      <el-skeleton :loading="loading.imgLoading_all" animated :count="3">
         <!-- 骨架屏 -->
         <template #template>
            <el-skeleton-item variant="image" style="width: 32%; height: 33.3%; margin-right:10px; margin-bottom:10px;" />
            <el-skeleton-item variant="image" style="width: 32%; height: 33.3%; margin-right:10px; margin-bottom:10px;" />
            <el-skeleton-item variant="image" style="width: 32%; height: 33.3%; margin-right:10px; margin-bottom:10px;" />
         </template>
         <!-- 真实DOM -->
         <template #default>
            <el-scrollbar height="640px">
               <div class="image_container">
                  <div class="image" v-for='picture of pictures' :key='picture.id' @click="prePicture(picture.url)">
                     <img :src="picture.url">
                     <p>{{picture.name}}</p>
                     <img :src="picture.avatar" @click.stop='queryUser(picture.author)'>
                  </div>
               </div>
               <el-pagination layout="prev, pager, next" :page-size="9" :total="pictureCount" v-model:current-page="currentPage" @current-change="getPictureByPageNo(currentPage)" />
            </el-scrollbar>
         </template>
      </el-skeleton>
   </div>
</template>


<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import emitter from '../../utils/bus'
import { ElMessage } from 'element-plus'

/* data */
let currentPage = ref(1)
let prepicture = ref('')
let user = reactive(JSON.parse(localStorage.getItem('user')))
let pictureCount = ref()
const baseURL = '/rotation/api/media'
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
let pictures = reactive([
   { id: 0, name: '和泉纱雾', url: '/src/assets/image/和泉纱雾 (2).jpg', author: '乔尼', avatar: user.avatar_url },
   { id: 1, name: '和泉纱雾', url: '/src/assets/image/和泉纱雾 (3).jpg', author: '杰洛', avatar: user.avatar_url },
   { id: 2, name: '和泉纱雾', url: '/src/assets/image/和泉纱雾 (4).jpg', author: '乔尼', avatar: user.avatar_url },
   { id: 3, name: '和泉纱雾', url: '/src/assets/image/和泉纱雾 (5).jpg', author: '杰洛', avatar: user.avatar_url },
   { id: 4, name: '和泉纱雾', url: '/src/assets/image/和泉纱雾 (6).jpg', author: '乔尼', avatar: user.avatar_url },
   { id: 5, name: '和泉纱雾', url: '/src/assets/image/和泉纱雾.jpg', author: '杰洛', avatar: user.avatar_url },
   { id: 6, name: '白色', url: '/src/assets/image/白色 (2).jpg', author: '乔尼', avatar: user.avatar_url },
   { id: 7, name: '白色', url: '/src/assets/image/白色 (3).jpg', author: '杰洛', avatar: user.avatar_url },
   { id: 8, name: '白色', url: '/src/assets/image/白色 (4).jpg', author: '乔尼', avatar: user.avatar_url },
])
let elShow = reactive({
   mask: false,
   userMediaMask: false
})
let loading = reactive({
   imgLoading_all: true,
   imgLoading_user: true
})


/* method */
function deletePicture(pictureId) {
   location.reload()
   axios.get(baseURL + "/deletePicture?pictureId=" + pictureId + '&pageNo=' + currentPage.value, { headers: { 'Authorization': localStorage.getItem('token') } }).then(
      response => {
         if (response.data == true)
            ElMessage.success({ message: '删除成功', duration: 1000 })
         else
            ElMessage.success({ message: '删除失败', duration: 1000 })
      }
   )
}
function getPictureByPageNo(pageNo) {
   loading.imgLoading_all = true
   axios.get(baseURL + '/getPictureByPageNo/' + pageNo, { headers: { 'Authorization': localStorage.getItem('token') } }).then(
      response => {
         pictures.splice(0, pictures.length)
         for (let i = 0; i < response.data.length; i++)
            pictures[i] = { id: response.data[i].id, url: response.data[i].objectUrl, name: response.data[i].objectName.split('.')[0], avatar: response.data[i].userAvatarUrl, author: response.data[i].username }
         setTimeout(() => {
            loading.imgLoading_all = false
         }, 500)
      }
   ).catch((error) => {
      setTimeout(() => {
         loading.imgLoading_all = false
      }, 500)
      console.log(error)
   })
}
function prePicture(url) {
   elShow.mask = true
   prepicture.value = url
}
function exitPrepicture() {
   elShow.mask = false
   prepicture.value = ''
}
function getPictureCount() {
   axios.get(baseURL + "/getPictureCount", { headers: { 'Authorization': localStorage.getItem('token') } }).then(
      response => {
         pictureCount.value = response.data
         emitter.emit('pageNo', Math.ceil(pictureCount.value / 9))
      },
      error => {
         pictureCount.value = 27
      }
   ).catch((error) => { console.log(error) })
}
async function getMediaByUser(username) {
   const response = await axios.get(baseURL + '/getMediaByUser?username=' + encodeURIComponent(username), { headers: { 'Authorization': localStorage.getItem('token') } })
   for (let i = 0; i < (await response).data.length; i++) {
      userMedia[i] = { id: response.data[i].id, url: response.data[i].objectUrl, name: response.data[i].objectName.split('.')[0], avatar: response.data[i].userAvatarUrl, author: response.data[i].username }
   }
   console.log(userMedia)
}
function queryUser(username) {
   elShow.userMediaMask = true
   axios.get(baseURL + "/getUserMediaById?username=" + username, { headers: { Authorization: localStorage.getItem('token') } }).then(
      response => {
         userMedia.medias.splice(0, userMedia.medias.length)
         userMedia.avatarUrl = response.data.user.avatarUrl
         userMedia.username = response.data.user.username
         userMedia.email = response.data.user.email
         userMedia.bio = response.data.user.bio
         userMedia.medias = response.data.media
         loading.imgLoading_user = false
      })
}


/* 钩子 */
onMounted(() => {
   getPictureCount()
   getPictureByPageNo(1)
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
@keyframes rotate-in-2-bck-ccw {
   0% {
      transform: translateZ(200px) rotate(45deg);
      opacity: 0;
   }
   100% {
      transform: translateZ(0) rotate(0);
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
.el-skeleton {
   width: 1000px;
   height: 640px;
   margin: 0 auto;
   display: flex;
   flex-wrap: wrap;
}
.el-pagination {
   --el-pagination-bg-color: #e7f0e9;
   --el-pagination-button-disabled-bg-color: #e7f0e9;
   --el-pagination-hover-color: rgba(0, 128, 0, 0.456);
   position: relative;
   top: 150px;
   left: 600px;
   width: 400px;
}
.prepicture {
   position: absolute;
   width: 1000px;
   height: 600px;
   background-color: rgba(144, 238, 144, 0.251);
   left: 18%;
   top: 10%;
   border-radius: 4%;
   animation: rotate-in-2-bck-ccw 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
.image_container {
   margin: 0 auto;
   padding-top: 1%;
   width: 85%;
   height: 650px;
   display: flex;
   flex-wrap: wrap;
   justify-content: center;
   .image {
      margin-left: 10px;
      margin-right: 10px;
      margin-bottom: 10px;
      box-sizing: border-box;
      background-color: rgba(144, 238, 144, 0.251);
      width: 350px;
      height: 250px;
      transition: all 0.4s;
      cursor: pointer;
      position: relative;
      img:nth-child(1) {
         width: 350px;
         height: 200px;
         transition: all 0.4s;
         &:hover {
            border-radius: 4%;
         }
      }
      img:nth-child(3) {
         border-radius: 100%;
         position: absolute;
         right: 10px;
         bottom: 10px;
         width: 8%;
         &:hover {
            color: #10a37ea0;
         }
      }
      p {
         text-align: center;
         color: #10a37ea0;
         margin-top: 10px;
         font-family: 华文行楷;
         font-size: 20px;
      }
      &:hover {
         transform: translate(0, -10px);
         border-radius: 4%;
         box-shadow: 5px 5px 10px rgba(128, 128, 128, 0.582);
      }
   }
}
.container {
   width: 100%;
   height: 100%;
}
</style>