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
            <el-button class="concern" @click="concernOrcanel($event.target)" v-show="elShow.concernButton">关注</el-button>
         </div>
         <hr />
         <!-- 导航 -->
         <el-menu mode="horizontal" default-active="1" @select="handleSelect" background-color='whitesmoke' active-text-color="#10a37f" :ellipsis=false>
            <el-menu-item index="1">作品</el-menu-item>
            <el-menu-item index="2">收藏</el-menu-item>
            <el-menu-item index="3">关注</el-menu-item>
            <el-menu-item index="4">粉丝</el-menu-item>
         </el-menu>

         <!-- 作品 -->
         <el-scrollbar max-height="420px" v-show='elShow.media'>
            <img class='media_img' :src="media.objectUrl" v-for='media of userMedia.medias' :key="media.id">
            <p class="noMessage" v-show='elShow.noMedia'>暂无作品</p>
         </el-scrollbar>

         <!-- 收藏 -->
         <el-scrollbar max-height="420px" v-show='elShow.collection'>
            <img class='media_img' :src="collectItem.objectUrl" v-for='collectItem of userMedia.collection' :key="collectItem.id">
            <p class="noMessage" v-show='elShow.noCollection'>暂无收藏</p>
         </el-scrollbar>

         <!-- 关注 -->
         <el-scrollbar max-height="420px" v-show='elShow.concern'>
            <div class="user_caf" v-for='concernItem of userMedia.concern' :key="concernItem.id">
               <img :src="concernItem.avatarUrl" />
               <div>
                  <span>{{concernItem.username}}</span>
                  <p>{{concernItem.bio}}</p>
               </div>
            </div>
            <p class="noMessage" v-show='elShow.noConcern'>暂无关注</p>
         </el-scrollbar>

         <!-- 粉丝 -->
         <el-scrollbar max-height="420px" v-show='elShow.fans'>
            <div class="user_caf" v-for='fan of userMedia.fans' :key="fan.id">
               <img :src="fan.avatarUrl" />
               <div>
                  <span>{{fan.username}}</span>
                  <p>{{fan.bio}}</p>
               </div>
            </div>
            <p class="noMessage" v-show='elShow.noFans'>暂无粉丝</p>
         </el-scrollbar>
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
                     <img :src="picture.avatar" @click.stop='getUserMedia(picture.author)'>
                     <!-- 未收藏图标 -->
                     <svg @click.stop="collect(picture)" v-show="collectShowIf(picture.id)" class="icon" t="1722751987478" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1490">
                        <path d="M512 901.747c-13.584 0-26.122-4.18-37.094-13.061-8.882-7.315-225.698-175.02-312.424-311.38-28.735-44.93-68.441-106.057-68.441-192.784 0-144.718 108.147-262.269 240.326-262.269 67.396 0 131.657 30.825 177.633 84.637 45.453-54.335 109.192-84.637 177.11-84.637 132.702 0 240.327 117.551 240.327 262.27 0 85.159-37.094 143.673-67.396 191.216l-1.045 1.567c-86.727 136.36-303.543 304.588-312.425 311.38-10.449 8.359-22.987 13.06-36.571 13.06zM334.367 164.049c-109.714 0-198.53 98.743-198.53 220.473 0 74.188 33.959 127.478 61.649 170.319 83.07 130.09 294.138 294.139 303.02 300.93 3.657 2.613 7.314 4.18 11.494 4.18s7.837-1.567 11.494-4.18c8.882-6.791 219.95-170.84 303.02-300.93l1.045-1.568c28.212-44.93 60.604-95.608 60.604-168.75 0-121.209-89.339-220.474-198.53-220.474-60.082 0-115.984 29.257-153.6 80.98l-6.27 8.881c-4.18 5.225-10.449 8.36-16.718 8.36s-13.061-3.135-16.718-8.36l-6.27-8.881c-39.706-51.2-96.13-80.98-155.69-80.98z" p-id="1491"></path>
                     </svg>
                     <!-- 已收藏图标 -->
                     <svg @click.stop="cancelCollect(picture)" v-show='!collectShowIf(picture.id)' class="icon" t="1722750585572" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1490">
                        <path d="M512 901.746939c-13.583673 0-26.122449-4.179592-37.093878-13.061225-8.881633-7.314286-225.697959-175.020408-312.424489-311.379592C133.746939 532.37551 94.040816 471.24898 94.040816 384.522449c0-144.718367 108.146939-262.269388 240.326531-262.269388 67.395918 0 131.657143 30.82449 177.632653 84.636735 45.453061-54.334694 109.191837-84.636735 177.110204-84.636735 132.702041 0 240.326531 117.55102 240.326531 262.269388 0 85.159184-37.093878 143.673469-67.395919 191.216327l-1.044898 1.567346c-86.726531 136.359184-303.542857 304.587755-312.424489 311.379592-10.44898 8.359184-22.987755 13.061224-36.571429 13.061225z" fill="#E5404F" p-id="1491"></path>
                     </svg>
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
let myMedia = reactive(JSON.parse(localStorage.getItem('myMedia')))
let userMedia = reactive({
   id: 0,
   avatarUrl: '',
   username: '',
   email: '',
   bio: '',
   medias: [
      { id: 0, objectName: '杰洛.齐贝林', objectUrl: '/src/assets/image/j1.jpg' },
      { id: 1, objectName: '杰洛.齐贝林', objectUrl: '/src/assets/image/j2.jpg' }
   ],
   collection: [
      { id: 0, objectName: '杰洛.齐贝林', objectUrl: '/src/assets/image/j1.jpg' },
      { id: 1, objectName: '杰洛.齐贝林', objectUrl: '/src/assets/image/j2.jpg' }
   ],
   concern: [
      { id: 0, username: '杰洛.齐贝林', avatarUrl: 'https://avatars.githubusercontent.com/u/94109480?v=4', bio: '结果谁都无法知道,因触网而弹起的网球会落到哪一边,就是因为这样,人们才会希望『女神』真的存在。如果她真的存在的话,不管最后的结果如何,我都能坦然接受' }
   ],
   fans: [
      { id: 0, username: '乔尼.乔斯达', avatarUrl: 'https://foruda.gitee.com/avatar/1719841511744367127/11729822_wangriqing_1719841511.png', bio: '就只差一步了！我现在还只是『负数』！我只是想让自己从『负数』变为『零』而已啊' }
   ],
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
   userMediaMask: false,
   media: true,
   noMedia: false,
   collection: false,
   noCollection: false,
   concern: false,
   noConcern: false,
   fans: false,
   noFans: false,
   concernButton: true
})
let loading = reactive({
   imgLoading_all: true,
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
function getPictureByPageNo(pageNo) {//根据页号获取插画
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
function prePicture(url) {//预览插画
   elShow.mask = true
   prepicture.value = url
}
function exitPrepicture() {
   elShow.mask = false
   prepicture.value = ''
}
function getPictureCount() {//获取插画总数
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
function getUserMedia(username) {//获取当前用户的所有信息(作品,收藏,关注,粉丝)
   elShow.userMediaMask = true
   axios.get(baseURL + "/getUserMediaByName?username=" + username, { headers: { Authorization: localStorage.getItem('token') } }).then(
      response => {
         elShow.noMedia = false
         elShow.noCollection = false
         elShow.noConcern = false
         elShow.noFans = false
         /* 接受响应数据 */
         userMedia.id = response.data.user.id
         userMedia.avatarUrl = response.data.user.avatarUrl
         userMedia.username = response.data.user.username
         userMedia.email = response.data.user.email
         userMedia.bio = response.data.user.bio
         userMedia.medias = response.data.media
         userMedia.collection = response.data.collection
         userMedia.concern = response.data.concern
         userMedia.fans = response.data.fans
         hasConcern()//判断我是否关注了当前用户
         if (userMedia.medias == null)
            elShow.noMedia = true
         if (userMedia.collection == null)
            elShow.noCollection = true
         if (userMedia.concern == null)
            elShow.noConcern = true
         if (userMedia.fans == null)
            elShow.noFans = true
      })
}
function handleSelect(index) {
   if (index == 1) {
      elShow.collection = false
      elShow.fans = false
      elShow.concern = false
      elShow.media = true
   }
   else if (index == 2) {
      elShow.fans = false
      elShow.concern = false
      elShow.media = false
      elShow.collection = true
   }
   else if (index == 3) {
      elShow.fans = false
      elShow.media = false
      elShow.collection = false
      elShow.concern = true
   }
   else if (index == 4) {
      elShow.media = false
      elShow.collection = false
      elShow.concern = false
      elShow.fans = true
   }
}
function hasConcern() {//判断我是否关注了当前用户
   elShow.concernButton = true
   if (myMedia.concern == null || myMedia.concern == '' || myMedia.concern.length == 0)
      return;
   if (myMedia.id == userMedia.id) {
      elShow.concernButton = false
      return;
   }
   else {
      const concern = myMedia.concern
      for (let i = 0; i < concern.length; i++) {
         if (concern[i].id == userMedia.id) {
            document.getElementsByClassName('concern')[0].getElementsByTagName('span')[0].innerText = '已关注'
            return;
         }
      }
      document.getElementsByClassName('concern')[0].getElementsByTagName('span')[0].innerText = '关注'
   }
}
function concernOrcanel(el) {//关注或取关
   if (el.innerText == '关注') {//关注
      el.innerText = '已关注'
      axios.post('/gateway/updateConcernAndFans?UID=' + myMedia.id + '&targetUID=' + userMedia.id, { headers: { Authorization: localStorage.getItem('token') } }).then(
         response => {
            if (myMedia.concern == null || myMedia.concern == '' || myMedia.concern.length == 0) {
               myMedia.concern = []
               myMedia.concern[0] = { id: userMedia.id, username: userMedia.username, avatarUrl: userMedia.avatarUrl, bio: userMedia.bio }
            }
            else
               myMedia.concern.push({ id: userMedia.id, username: userMedia.username, avatarUrl: userMedia.avatarUrl, bio: userMedia.bio })
            if (userMedia.fans == null || userMedia.fans == '' || userMedia.fans.length == 0) {
               userMedia.fans = []
               userMedia.fans[0] = { id: myMedia.id, username: myMedia.username, avatarUrl: myMedia.avatarUrl, bio: myMedia.bio }
            }
            else
               userMedia.fans.push({ id: myMedia.id, username: myMedia.username, avatarUrl: myMedia.avatarUrl, bio: myMedia.bio })
            localStorage.setItem('myMedia', JSON.stringify(myMedia))
         })
   }
   else if (el.innerText == '已关注') {//取关
      el.innerText = '关注'
      axios.post('/gateway/deleteConcernAndFans?UID=' + myMedia.id + '&targetUID=' + userMedia.id, { headers: { Authorization: localStorage.getItem('token') } }).then(
         response => {
            for (let i = 0; i < myMedia.concern.length; i++) {
               if (myMedia.concern[i].id == userMedia.id) {
                  myMedia.concern.splice(i, 1)
                  localStorage.setItem('myMedia', JSON.stringify(myMedia))
                  break
               }
            }
            for (let i = 0; i < userMedia.fans.length; i++) {
               if (userMedia.fans[i].id == myMedia.id) {
                  userMedia.fans.splice(i, 1)
                  break
               }
            }
         })
   }
}
async function collect(picture) {//收藏
   const response = await axios.post('/gateway/updateCollection?UID=' + myMedia.id + '&mediaID=' + picture.id, { headers: { Authorization: localStorage.getItem('token') } })
   if (myMedia.collection.length == 0 || myMedia.collection == '' || myMedia.collection == null) {
      myMedia.collection = []
      myMedia.collection.push({ id: picture.id, objectName: picture.name, objectUrl: picture.url })
   }
   else
      myMedia.collection.push({ id: picture.id, objectName: picture.name, objectUrl: picture.url })
   localStorage.setItem('myMedia', JSON.stringify(myMedia))
}
async function cancelCollect(picture) {//取消收藏
   const response = await axios.post('/gateway/cancelCollection?UID=' + myMedia.id + '&mediaID=' + picture.id, { headers: { Authorization: localStorage.getItem('token') } })
   for (let i = 0; i < myMedia.collection.length; i++) {
      if (myMedia.collection[i].id == picture.id) {
         myMedia.collection.splice(i, 1)
         localStorage.setItem('myMedia', JSON.stringify(myMedia))
         return
      }
   }
}
function collectShowIf(pictureId) {//未收藏图标显示与否
   if (myMedia.collection == null || myMedia.collection == '' || myMedia.collection.length == 0)
      return true
   else {
      for (let i = 0; i < myMedia.collection.length; i++) {
         if (myMedia.collection[i].id == pictureId) {
            return false
         }
      }
      return true
   }
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
.concern {
   position: absolute;
   left: 720px;
   --el-button-hover-text-color: #72e4c8;
   --el-button-hover-border-color: #e6ebea;
}
.user_caf {
   margin-left: 50px;
   width: 85%;
   display: flex;
   height: 60px;
   padding: 5px;
   border-bottom: solid grey 0.5px;
   img {
      width: 55px;
      height: 55px;
      border-radius: 100%;
   }
   span {
      margin-left: 19px;
      font-size: 14px;
      color: #10a37f;
      position: relative;
      top: 8px;
   }
   p {
      width: 600px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      margin-left: 18px;
      font-size: 14px;
      color: grey;
      position: relative;
      top: 10px;
   }
}
.el-menu {
   justify-content: space-between;
   border-bottom: none;
   margin-bottom: 5px;
   .el-menu-item {
      font-size: 15px;
      color: grey;
      width: 25%;
      --el-menu-hover-bg-color: rgba(221, 221, 221, 0.5);
      &:hover {
         color: #10a37f;
      }
   }
}
.userMedia {
   padding: 30px;
   position: absolute;
   border-radius: 0.8%;
   z-index: 5;
   left: 350px;
   top: 40px;
   width: 800px;
   height: 600px;
   background-color: whitesmoke;
   overflow: hidden;
   -webkit-animation: slide-in-top 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)
      both;
   animation: slide-in-top 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
   .el-scrollbar {
      .noMessage {
         color: grey;
         font-size: 20px;
         transform: translate(350px, 170px);
      }
   }
   .media_img {
      width: 370px;
      height: 220px;
      margin-left: 10px;
      margin-right: 10px;
      margin-bottom: 10px;
      border-radius: 2%;
      transition: all 0.3s;
      &:hover {
         transform: translate(0, -8px);
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
      transform: translate(795px, -30px);
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
      .icon {
         font-size: 25px;
         position: absolute;
         right: 50px;
         bottom: 12px;
         width: 25px;
         transition: all 0.3s;
         animation: turn 2s linear infinite;
         &:hover {
            transform: scale(1.2);
         }
      }
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