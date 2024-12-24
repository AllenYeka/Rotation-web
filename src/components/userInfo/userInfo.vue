<template>
   <div class="user_container">
      <el-scrollbar max-height="700px">
         <!-- 用户头 -->
         <div class="userHeader">
            <img :src="user.avatar">
            <div>
               <span>{{user.nickname}} | </span>
               <span>{{user.email}}</span>
               <p>{{user.bio}}</p>
            </div>
         </div>
         <!-- 用户主页 -->
         <div class="userMsg">
            <!-- 导航 -->
            <el-menu mode="horizontal" default-active="1" @select="handleSelect" background-color='#f0eee' active-text-color="#10a37f" :ellipsis=false>
               <el-menu-item index="1">作 品</el-menu-item>
               <el-menu-item index="2">收 藏</el-menu-item>
               <el-menu-item index="3">上 传</el-menu-item>
               <el-menu-item index="4">关 注</el-menu-item>
               <el-menu-item index="5">粉 丝</el-menu-item>
            </el-menu>
            <!-- 作品 -->
            <el-scrollbar max-height="89%" v-show='elShow.userMsg.media'>
               <el-skeleton :loading="elShow.loading.media" animated :count="3">
                  <!-- 骨架屏 -->
                  <template #template>
                     <el-skeleton-item variant="image" style="width: 32%; height: 33.3%; margin-right:10px; margin-bottom:10px;" />
                     <el-skeleton-item variant="image" style="width: 32%; height: 33.3%; margin-right:10px; margin-bottom:10px;" />
                     <el-skeleton-item variant="image" style="width: 32%; height: 33.3%; margin-right:10px; margin-bottom:10px;" />
                  </template>
                  <!-- 真实DOM -->
                  <template #default>
                     <div class="myMedia" v-for="media in mediaList" :key='media.id'>
                        <img :src="media.objectUrl" @click="elShow.mask.picture=true;picture=media.objectUrl">
                        <p>{{media.objectName}}</p>
                     </div>
                     <p class="noData" v-show="mediaList.length==0">暂无作品</p>
                  </template>
               </el-skeleton>
            </el-scrollbar>
            <!-- 收藏 -->
            <el-scrollbar max-height="89%" v-show='elShow.userMsg.collection'>
               <el-skeleton :loading="elShow.loading.collection" animated :count="3">
                  <!-- 骨架屏 -->
                  <template #template>
                     <el-skeleton-item variant="image" style="width: 32%; height: 33.3%; margin-right:10px; margin-bottom:10px;" />
                     <el-skeleton-item variant="image" style="width: 32%; height: 33.3%; margin-right:10px; margin-bottom:10px;" />
                     <el-skeleton-item variant="image" style="width: 32%; height: 33.3%; margin-right:10px; margin-bottom:10px;" />
                  </template>
                  <!-- 真实DOM -->
                  <template #default>
                     <div class="collection" v-for="collection in collectList" :key='collection.id'>
                        <img :src="collection.objectUrl" @click="elShow.mask.picture=true;picture=collection.objectUrl">
                        <p>{{collection.objectName}}</p>
                        <img :src="collection.avatar" @click.stop="preCreator(collection)">
                     </div>
                     <p class="noData" v-show="collectList.length==0">暂无收藏</p>
                  </template>
               </el-skeleton>
            </el-scrollbar>
            <!-- 上传 -->
            <el-scrollbar max-height="420px" v-show='elShow.userMsg.upload'>
               <el-upload ref='uploadRef' action="/rotation/api/media/uploadPicture" :headers="header" list-type="picture-card" :auto-upload="false" :limit='3' multiple>
                  <el-icon>
                     <Plus />
                  </el-icon>
               </el-upload>
               <el-button @click="uploadPicture()" :loading="elLoading.uploadMedia">上传</el-button>
            </el-scrollbar>
            <!-- 关注 -->
            <el-scrollbar max-height="89%" v-show='elShow.userMsg.concern'>
               <div class="caf" v-for='concern of concernList' :key="concern.id">
                  <img :src="concern.avatar" />
                  <div>
                     <span>{{concern.nickname}}</span>
                     <p>{{concern.bio}}</p>
                  </div>
               </div>
               <p class="noData" v-show="concernList.length==0">暂无关注</p>
            </el-scrollbar>
            <!-- 粉丝 -->
            <el-scrollbar max-height="89%" v-show='elShow.userMsg.fans'>
               <div class="caf" v-for='fan of fanList' :key="fan.id">
                  <img :src="fan.avatar" />
                  <div>
                     <span>{{fan.nickname}}</span>
                     <p>{{fan.bio}}</p>
                  </div>
               </div>
               <p class="noData" v-show='fanList.length==0'>暂无粉丝</p>
            </el-scrollbar>
         </div>

         <!-- 用户其他信息 -->
         <div class="userOther">
            <p>其他模块</p>
         </div>
         <!-- 预览图片 -->
         <div class="mask" v-show="elShow.mask.picture" @click.self='elShow.mask.picture=false'>
            <img class="prePicture" :src="picture">
         </div>
         <!-- 预览创建者 -->
         <div class="preCreator" v-show="elShow.preCreator">
            <img :src="preCreatorInfo.avatar">
            <h5>UID : {{preCreatorInfo.creator}}</h5>
            <h5>邮箱 : {{preCreatorInfo.email}}</h5>
         </div>
      </el-scrollbar>
   </div>
</template>


<script setup>
import { onMounted, reactive, ref, inject } from 'vue'
import { ElMessage } from "element-plus"
import emitter from '../../utils/bus'
import axios from 'axios'
/* data */
let uploadRef = ref()
let picture = ref('')
const user = JSON.parse(sessionStorage.getItem('user'))
const baseURL = '/rotation/api/media'
const elShow = reactive({
   userMsg: { media: true, collection: false, upload: false, concern: false, fans: false },
   loading: { media: true, collection: true },
   mask: { picture: false },
   preCreator: false
})
const elLoading = reactive({
   uploadMedia: false
})
const mediaList = reactive([//作品
   //{ id: 1, objectName: '纳西妲.jpg', objectUrl: '/src/assets/image/纳西妲.jpg' }
])
const collectList = reactive([//收藏
   //{ id: 1, objectName: '和泉纱雾.jpg', objectUrl: '/src/assets/image/和泉纱雾.jpg', creator: 2, avatar: '/src/assets/image/hsy.jpg', email: 'xdhvuexgd@outlook.com' }
])
const concernList = reactive([//关注
   /*{ id: 1, nickname: '胡思羽', avatar: '/src/assets/image/hsy.jpg', bio: '啊啊啊！' },
   { id: 1, nickname: '胡思羽', avatar: '/src/assets/image/hsy.jpg', bio: '啊啊啊！' }*/
])
const fanList = reactive([//粉丝
   /*{ id: 1, nickname: '胡思羽', avatar: '/src/assets/image/hsy.jpg', bio: '啊啊啊！' },
   { id: 1, nickname: '胡思羽', avatar: '/src/assets/image/hsy.jpg', bio: '啊啊啊！' }*/
])
const header = reactive({
   Authorization: sessionStorage.getItem('token')
})
const preCreatorInfo = reactive({})


/* method */
function uploadPicture() {
   elLoading.uploadMedia = true
   uploadRef.value.submit()
}
async function getUserMedia() {//获取用户发布的资源
   if (mediaList.length != 0)
      return
   try {
      const response = await axios.get(baseURL + '/getUserMedia')
      if (response.data.status != 200) {
         ElMessage.error({ message: response.data.msg })
         elShow.loading.media = false
         return
      }
      mediaList.splice(0, mediaList.length)
      mediaList.push(...response.data.dataList)
   } catch (e) {
      ElMessage.error({ message: e })
      return
   } finally {
      elShow.loading.media = false
   }
}
async function getUserCollection() {//获取用户的收藏
   if (collectList.length != 0)
      return
   try {
      const response = await axios.get(baseURL + '/getUserCollection')
      if (response.data.status != 200) {
         ElMessage.error({ message: response.data.msg })
         elShow.loading.collection = false
         return
      }
      collectList.splice(0, collectList.length)
      collectList.push(...response.data.dataList)
   } catch (e) {
      ElMessage.error({ message: e })
      return
   } finally {
      elShow.loading.collection = false
   }
}
async function getUserConcern() {//获取用户的关注
   if (concernList.length != 0)
      return
   try {
      const response = await axios.get('/gateway/getUserConcern', { params: { uid: user.id } })
      if (response.data.status != 200) {
         ElMessage.error({ message: response.data.msg })
         return
      }
      concernList.splice(0, concernList.length)
      concernList.push(...response.data.dataList)
   } catch (e) {
      ElMessage.error({ message: e })
      return
   }
}
async function getUserFans() {//获取用户的粉丝
   if (fanList.length != 0)
      return
   try {
      const response = await axios.get('/gateway/getUserFans', { params: { uid: user.id } })
      if (response.data.status != 200) {
         ElMessage.error({ message: response.data.msg })
         return
      }
      fanList.splice(0, fanList.length)
      fanList.push(...response.data.dataList)
   } catch (e) {
      ElMessage.error({ message: e })
      return
   }
}
function handleSelect(index) {
   if (index == 1) {
      elShow.userMsg.collection = elShow.userMsg.upload = elShow.userMsg.fans = elShow.userMsg.concern = false
      elShow.userMsg.media = true
      getUserMedia()
   }
   else if (index == 2) {
      elShow.userMsg.fans = elShow.userMsg.concern = elShow.userMsg.media = elShow.userMsg.upload = false
      elShow.userMsg.collection = true
      getUserCollection()
   }
   else if (index == 3) {
      elShow.userMsg.fans = elShow.userMsg.media = elShow.userMsg.collection = elShow.userMsg.concern = false
      elShow.userMsg.upload = true
      elLoading.uploadMedia = false
   }
   else if (index == 4) {
      elShow.userMsg.media = elShow.userMsg.collection = elShow.userMsg.fans = elShow.userMsg.upload = false
      elShow.userMsg.concern = true
      getUserConcern()
   }
   else if (index == 5) {
      elShow.userMsg.media = elShow.userMsg.collection = elShow.userMsg.concern = elShow.userMsg.upload = false
      elShow.userMsg.fans = true
      getUserFans()
   }
}
function preCreator(member) {//在收藏资源界面预览创建者的信息
   const x = window.event.screenX
   const y = window.event.screenY - 90
   document.getElementsByClassName("preCreator")[0].style.right = 1535 - x + "px"
   document.getElementsByClassName("preCreator")[0].style.top = y + "px"
   elShow.preCreator = true
   Object.assign(preCreatorInfo, member)
}
function windowEvent() {
   window.onclick = (() => {
      elShow.preCreator = false
   })
}


/* 钩子 */
onMounted(() => {
   windowEvent()
   getUserMedia()
})
</script>


<style lang='less' scoped>
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
.userMsg {
   width: 1100px;
   height: 600px;
   border-radius: 7px;
   background-color: #26ab8a1e;
   margin: 20px auto;
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
   .myMedia {
      width: 340px;
      height: 240px;
      box-sizing: border-box;
      display: inline-block;
      border-radius: 10px;
      margin-top: 20px;
      margin-left: 20px;
      img {
         width: 340px;
         height: 200px;
         border-radius: 10px;
         transition: all 0.4s;
         &:hover {
            cursor: pointer;
            transform: translate(0, -5px);
            box-shadow: 5px 5px 8px 2px rgba(128, 128, 128, 0.466);
         }
      }
      p {
         font-size: 14px;
         color: #10a37f;
         text-align: center;
         font-family: 仿宋;
         &:hover {
            cursor: default;
         }
      }
   }
   .collection {
      width: 340px;
      height: 240px;
      box-sizing: border-box;
      display: inline-block;
      border-radius: 10px;
      margin-top: 20px;
      margin-left: 20px;
      img:nth-child(1) {
         width: 340px;
         height: 200px;
         border-radius: 10px;
         transition: all 0.4s;
         &:hover {
            cursor: pointer;
            transform: translate(0, -5px);
            box-shadow: 5px 5px 8px 2px rgba(128, 128, 128, 0.466);
         }
      }
      p {
         font-size: 15px;
         color: #10a37f;
         text-align: center;
         font-family: 仿宋;
         transform: translate(0, 10px);
         &:hover {
            cursor: default;
         }
      }
      img:nth-child(3) {
         width: 30px;
         height: 30px;
         border-radius: 100%;
         transform: translate(300px, -12px);
         &:hover {
            cursor: pointer;
         }
      }
   }
   ::v-deep(.el-upload--picture-card) {
      background-color: #d0e8de;
      border-color: grey;
      position: absolute;
      left: 470px;
   }
   ::v-deep(.el-upload--picture-card:hover) {
      color: #10a37f;
      border-color: #10a37f;
   }
   .el-button {
      margin-left: 470px;
      margin-top: 170px;
      width: 147.5px;
      height: 40px;
      color: white;
      --el-button-bg-color: #10a37fed;
      --el-button-border-color: #10a37fed;
      --el-button-hover-bg-color: #1d9d7e;
      --el-button-hover-border-color: #1d9d7e;
      --el-button-active-bg-color: #10a37fed;
      --el-button-active-border-color: #10a37fed;
   }
   .caf {
      margin: 0 auto;
      padding-left: 10px;
      width: 70%;
      height: 100px;
      display: flex;
      box-sizing: border-box;
      border-bottom: solid rgba(128, 128, 128, 0.23) 0.5px;
      transition: all 0.3s;
      &:hover {
         cursor: pointer;
         background-color: #c2dcd1;
      }
      img {
         width: 60px;
         height: 60px;
         border-radius: 100%;
         transform: translate(0, 20px);
      }
      span {
         margin-left: 20px;
         font-size: 13px;
         color: #10a37f;
         position: relative;
         top: 20px;
         &:hover {
            cursor: default;
         }
      }
      p {
         width: 600px;
         transform: translate(20px, 35px);
         text-overflow: ellipsis;
         white-space: nowrap;
         overflow: hidden;
         font-size: 13px;
         color: grey;
         &:hover {
            cursor: default;
         }
      }
   }
   .noData {
      color: grey;
      font-size: 20px;
      transform: translate(470px, 190px);
   }
}
.el-skeleton {
   width: 1000px;
   height: 640px;
   margin: 20px auto;
   display: flex;
   flex-wrap: wrap;
   --el-skeleton-color: #c2dbd1;
}
.userHeader {
   width: 1100px;
   height: 150px;
   background-color: #26ab8a1e;
   margin: 0 auto;
   border-radius: 7px;
   display: flex;
   padding-left: 30px;
   box-sizing: border-box;
   img {
      width: 110px;
      height: 100px;
      border-radius: 100%;
      margin-left: 10px;
      margin-top: 25px;
      margin-right: 15px;
   }
   div {
      span:nth-child(1) {
         color: #434141;
         position: relative;
         top: 45px;
         font-size: 15px;
         &:hover {
            cursor: default;
         }
      }
      span:nth-child(2) {
         color: grey;
         position: relative;
         top: 45px;
         &:hover {
            cursor: default;
         }
      }
      p:nth-child(3) {
         color: #2f2d2d;
         position: relative;
         top: 55px;
         font-size: 14px;
         &:hover {
            cursor: default;
         }
      }
   }
}
.user_container {
   width: 100%;
   height: 100%;
   padding-top: 20px;
   box-sizing: border-box;
}
.userOther {
   width: 1100px;
   height: 400px;
   background-color: #26ab8a1e;
   border-radius: 7px;
   margin: 0 auto;
   display: flex;
   p {
      line-height: 400px;
      color: grey;
      font-size: 20px;
      margin-left: 480px;
   }
}
.prePicture {
   width: 700px;
   border-radius: 7px;
   animation: rotate-in-2-bck-ccw 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
.preCreator {
   position: absolute;
   width: 280px;
   height: 57px;
   background-color: #fff;
   border-radius: 5px;
   box-shadow: 5px 5px 10px #dbdbdb;
   padding: 10px;
   img {
      width: 55px;
      height: 55px;
      border-radius: 8px;
   }
   h5:nth-child(2) {
      color: grey;
      font-size: 14px;
      transform: translate(70px, -58px);
   }
   h5:nth-child(3) {
      color: grey;
      font-size: 14px;
      transform: translate(70px, -45px);
   }
}
::v-deep(.el-scrollbar__thumb) {
   background-color: transparent;
}
</style>