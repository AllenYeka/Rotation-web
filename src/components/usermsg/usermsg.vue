<template>
   <div class="user_container">
      <el-scrollbar max-height="600px">
         <!-- 用户头 -->
         <div class="userHeader">
            <img :src="user.avatar_url">
            <div>
               <span>{{user.name}} | </span>
               <span>{{user.email}}</span>
               <p>{{user.bio}}</p>
            </div>
         </div>
         <!-- 用户主页 -->
         <div class="userMsg">
            <!-- 导航 -->
            <el-menu mode="horizontal" default-active="1" @select="handleSelect" background-color='#f0eee' active-text-color="#10a37f" :ellipsis=false>
               <el-menu-item index="1">作品</el-menu-item>
               <el-menu-item index="2">收藏</el-menu-item>
               <el-menu-item index="3">上传</el-menu-item>
               <el-menu-item index="4">关注</el-menu-item>
               <el-menu-item index="5">粉丝</el-menu-item>
            </el-menu>
            <!-- 作品 -->
            <el-scrollbar max-height="600px" v-show='elShow.media'>
               <img class='media_img' :src="media.objectUrl" v-for='media of myMedia.medias' :key="media.id">
               <p class="noMessage" v-show='elShow.noMedia'>暂无作品</p>
            </el-scrollbar>

            <!-- 收藏 -->
            <el-scrollbar max-height="600px" v-show='elShow.collection'>
               <img class='media_img' :src="collectItem.objectUrl" v-for='collectItem of myMedia.collection' :key="collectItem.id">
               <p class="noMessage" v-show='elShow.noCollection'>暂无收藏</p>
            </el-scrollbar>

            <!-- 上传 -->
            <el-scrollbar max-height="420px" v-show='elShow.upload'>
               <el-upload ref='uploadRef' action="/rotation/api/media/uploadPicture" :headers="header" list-type="picture-card" :auto-upload="false" :limit='5' multiple>
                  <el-icon>
                     <Plus />
                  </el-icon>
               </el-upload>
               <el-button @click="uploadPicture()">上传</el-button>
            </el-scrollbar>

            <!-- 关注 -->
            <el-scrollbar max-height="600px" v-show='elShow.concern'>
               <div class="user_caf" v-for='concernItem of myMedia.concern' :key="concernItem.id">
                  <img :src="concernItem.avatarUrl" />
                  <div>
                     <span>{{concernItem.username}}</span>
                     <p>{{concernItem.bio}}</p>
                  </div>
               </div>
               <p class="noMessage" v-show='elShow.noConcern'>暂无关注</p>
            </el-scrollbar>

            <!-- 粉丝 -->
            <el-scrollbar max-height="600px" v-show='elShow.fans'>
               <div class="user_caf" v-for='fan of myMedia.fans' :key="fan.id">
                  <img :src="fan.avatarUrl" />
                  <div>
                     <span>{{fan.username}}</span>
                     <p>{{fan.bio}}</p>
                  </div>
               </div>
               <p class="noMessage" v-show='elShow.noFans'>暂无粉丝</p>
            </el-scrollbar>
         </div>
         <!-- 用户其他信息 -->
         <div class="userOther">
            <p>其他模块</p>
         </div>
      </el-scrollbar>
   </div>
</template>


<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from "element-plus"
import emitter from '../../utils/bus'
import axios from 'axios'

/* data */
let user = reactive(JSON.parse(localStorage.getItem('user')))
let myMedia = reactive(JSON.parse(localStorage.getItem('myMedia')))
let uploadRef = ref()
const baseURL = '/rotation/api/media'
let header = reactive({
   'Authorization': localStorage.getItem('token'),
   'RUser': encodeURIComponent(user.name),
   'RAvatar': user.avatar_url,
   'RPageNo': 0
})
let elShow = reactive({
   media: true,
   noMedia: false,
   collection: false,
   noCollection: false,
   concern: false,
   noConcern: false,
   fans: false,
   noFans: false,
   upload: false
})



/* method */
function uploadPicture() {
   uploadRef.value.submit()
}
function getPageNo() {
   axios.get(baseURL + "/getPictureCount", { headers: { 'Authorization': localStorage.getItem('token') } }).then(
      response => {
         header.RPageNo = Math.ceil(response.data / 9)
      },
      error => {
         header.RPageNo = 0
      }
   ).catch((error) => { console.log(error) })
}
function handleSelect(index) {
   if (index == 1) {
      elShow.collection = false
      elShow.fans = false
      elShow.concern = false
      elShow.upload = false
      elShow.media = true
   }
   else if (index == 2) {
      elShow.fans = false
      elShow.concern = false
      elShow.media = false
      elShow.upload = false
      elShow.collection = true
   }
   else if (index == 3) {
      elShow.fans = false
      elShow.media = false
      elShow.collection = false
      elShow.concern = false
      elShow.upload = true
   }
   else if (index == 4) {
      elShow.media = false
      elShow.collection = false
      elShow.fans = false
      elShow.upload = false
      elShow.concern = true
   }
   else if (index == 5) {
      elShow.media = false
      elShow.collection = false
      elShow.concern = false
      elShow.upload = false
      elShow.fans = true
   }
}



/* 钩子 */
onMounted(() => {
   getPageNo()
})
</script>


<style lang='less'>
.userMsg {
   width: 1100px;
   height: 600px;
   background-color: #f6f6f6;
   margin: 20px auto;
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
   .media_img {
      width: 330px;
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
   .el-scrollbar {
      .noMessage {
         color: grey;
         font-size: 20px;
         transform: translate(350px, 170px);
      }
   }
}
.userHeader {
   width: 1100px;
   height: 150px;
   background-color: #f6f6f6;
   margin: 0 auto;
   display: flex;
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
      }
      span:nth-child(2) {
         color: grey;
         position: relative;
         top: 45px;
      }
      p:nth-child(3) {
         color: #2f2d2d;
         position: relative;
         top: 55px;
         font-size: 14px;
      }
   }
}
.user_container .el-upload--picture-card {
   margin-left: 450px;
   margin-top: 50px;
   &:hover {
      border: 1px dashed #33af90;
   }
}
.user_container .el-button {
   margin-left: 450px;
   margin-top: 5px;
   width: 147.5px;
   height: 40px;
   color: #33af90;
   &:hover {
      box-shadow: 5px 5px 50px #dad7d7 inset;
   }
}
.user_container {
   width: 100%;
   height: 100%;
}
.userOther {
   width: 1100px;
   height: 400px;
   background-color: #f6f6f6;
   margin: 0 auto;
   display: flex;
   p {
      line-height: 400px;
      color: grey;
      font-size: 20px;
      margin-left: 480px;
   }
}
</style>