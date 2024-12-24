<template>
   <!-- 资源集合 -->
   <div class="container">
      <el-skeleton :loading="elShow.loading.mediaList" animated :count="3">
         <!-- 骨架屏 -->
         <template #template>
            <el-skeleton-item variant="image" style="width: 22%; height: 220px; margin-right:2%; margin-top:1%;" />
            <el-skeleton-item variant="image" style="width: 22%; height: 220px; margin-right:2%; margin-top:1%;" />
            <el-skeleton-item variant="image" style="width: 22%; height: 220px; margin-right:2%; margin-top:1%;" />
            <el-skeleton-item variant="image" style="width: 22%; height: 220px; margin-right:2%; margin-top:1%;" />
         </template>
         <!-- 真实DOM -->
         <template #default>
            <el-scrollbar class="el-scrollbar-image" ref="scrollbarRef">
               <!-- 占位 -->
               <div style="position:absolute;width:70px;height:50px;background-color:rgba(223, 243, 224, 0.5);left:0px;"></div>
               <!-- 搜索栏 -->
               <div class="searchMedia">
                  <el-input v-model="searchInfo" placeholder="资源名/创作者" @focus="focusSearch()" />
                  <el-button type="primary" @click="getMedia(1)">搜 索</el-button>
               </div>
               <!-- 资源盒 -->
               <div class="image" v-for='media of mediaList' :key='media.id' @click="elShow.mask.prePicture = true;prepicture= media.objectUrl">
                  <img :src="media.objectUrl">
                  <p>{{media.objectName}}</p>
                  <img :src="media.avatar" @click.stop='getCreatorInfo(media.creator)'>
                  <!-- 未收藏图标 -->
                  <svg @click.stop="collect(media)" v-show="idList.myCollect.indexOf(media.id)==-1" class="icon" t="1722751987478" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1490">
                     <path d="M512 901.747c-13.584 0-26.122-4.18-37.094-13.061-8.882-7.315-225.698-175.02-312.424-311.38-28.735-44.93-68.441-106.057-68.441-192.784 0-144.718 108.147-262.269 240.326-262.269 67.396 0 131.657 30.825 177.633 84.637 45.453-54.335 109.192-84.637 177.11-84.637 132.702 0 240.327 117.551 240.327 262.27 0 85.159-37.094 143.673-67.396 191.216l-1.045 1.567c-86.727 136.36-303.543 304.588-312.425 311.38-10.449 8.359-22.987 13.06-36.571 13.06zM334.367 164.049c-109.714 0-198.53 98.743-198.53 220.473 0 74.188 33.959 127.478 61.649 170.319 83.07 130.09 294.138 294.139 303.02 300.93 3.657 2.613 7.314 4.18 11.494 4.18s7.837-1.567 11.494-4.18c8.882-6.791 219.95-170.84 303.02-300.93l1.045-1.568c28.212-44.93 60.604-95.608 60.604-168.75 0-121.209-89.339-220.474-198.53-220.474-60.082 0-115.984 29.257-153.6 80.98l-6.27 8.881c-4.18 5.225-10.449 8.36-16.718 8.36s-13.061-3.135-16.718-8.36l-6.27-8.881c-39.706-51.2-96.13-80.98-155.69-80.98z" p-id="1491"></path>
                  </svg>
                  <!-- 已收藏图标 -->
                  <svg @click.stop="cancelCollect(media)" v-show='idList.myCollect.indexOf(media.id)!=-1' class="icon" t="1722750585572" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1490">
                     <path d="M512 901.746939c-13.583673 0-26.122449-4.179592-37.093878-13.061225-8.881633-7.314286-225.697959-175.020408-312.424489-311.379592C133.746939 532.37551 94.040816 471.24898 94.040816 384.522449c0-144.718367 108.146939-262.269388 240.326531-262.269388 67.395918 0 131.657143 30.82449 177.632653 84.636735 45.453061-54.334694 109.191837-84.636735 177.110204-84.636735 132.702041 0 240.326531 117.55102 240.326531 262.269388 0 85.159184-37.093878 143.673469-67.395919 191.216327l-1.044898 1.567346c-86.726531 136.359184-303.542857 304.587755-312.424489 311.379592-10.44898 8.359184-22.987755 13.061224-36.571429 13.061225z" fill="#E5404F" p-id="1491"></path>
                  </svg>
               </div>
            </el-scrollbar>
         </template>
      </el-skeleton>
   </div>
   <!-- 分页 -->
   <el-pagination layout="prev, pager, next" :page-size="12" :total="mediaTotal" v-model:current-page="currentPage" @current-change="getMedia(currentPage)" />
   <!-- 预览图片 -->
   <div class="mask" v-show="elShow.mask.prePicture" @click.self="elShow.mask.prePicture = false; prepicture = ''">
      <img class="prepicture" :src="prepicture" />
   </div>
   <!-- 创作者信息 -->
   <div class="mask" v-show='elShow.mask.creatorInfo' @click.self="elShow.mask.creatorInfo=false">
      <div class="creatorInfo">
         <!-- 用户头部信息 -->
         <div class='user_header'>
            <img :src="creatorInfo.baseInfo.avatar" />
            <div>
               <span>{{creatorInfo.baseInfo.nickname}}</span>
               <span>| {{creatorInfo.baseInfo.email}}</span>
               <p>{{creatorInfo.baseInfo.bio}}</p>
            </div>
            <el-button class="concern" @click="updateConcern($event.target)" v-show="creatorInfo.baseInfo.id!=user.id">关注</el-button>
         </div>
         <hr />
         <!-- 导航 -->
         <el-menu mode="horizontal" default-active="1" @select="handleSelect" background-color='whitesmoke' active-text-color="#10a37f" :ellipsis=false>
            <el-menu-item index="1">作品</el-menu-item>
            <el-menu-item index="2">关注</el-menu-item>
         </el-menu>
         <!-- 作品 -->
         <el-scrollbar max-height="420px" v-show='elShow.creatorInfo.media'>
            <img class='media_img' :src="media.objectUrl" v-for='media of creatorInfo.mediaList' :key="media.id">
            <p class="noMessage" v-show='creatorInfo.mediaList.length==0'>暂无作品</p>
         </el-scrollbar>
         <!-- 关注 -->
         <el-scrollbar max-height="420px" v-show='elShow.creatorInfo.concern'>
            <div class="user_caf" v-for='concern of creatorInfo.concernList' :key="concern.id">
               <img :src="concern.avatar" />
               <div>
                  <span>{{concern.nickname}}</span>
                  <p>{{concern.bio}}</p>
               </div>
            </div>
            <p class="noMessage" v-show='creatorInfo.concernList.length==0'>暂无关注</p>
         </el-scrollbar>
      </div>
   </div>
</template>


<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import axios from 'axios'
import emitter from '../../utils/bus'
import { ElMessage } from 'element-plus'

/* data */
let searchInfo = ref('')
let currentPage = ref(1)
let mediaTotal = ref()
let prepicture = ref('')
const scrollbarRef = ref('')
const user = JSON.parse(sessionStorage.getItem('user'))
const baseURL = '/rotation/api/media'
const idList = reactive({//我收藏的资源Id、我关注的用户Id
   myCollect: [],//资源Id
   myConcern: []//用户Id
})
const mediaList = reactive([
   { id: 1, objectName: '白色', objectUrl: '/src/assets/image/白色.jpg', creator: 1, avatar: '/src/assets/image/芷若.jpg' },
   { id: 2, objectName: '白色', objectUrl: '/src/assets/image/白色 (2).jpg', creator: 2, avatar: '/src/assets/image/芷若.jpg' },
   { id: 3, objectName: '黑色', objectUrl: '/src/assets/image/黑色.jpg', creator: 3, avatar: '/src/assets/image/芷若.jpg' },
   { id: 4, objectName: '纳西妲', objectUrl: '/src/assets/image/纳西妲.jpg', creator: 4, avatar: '/src/assets/image/芷若.jpg' },
   { id: 5, objectName: '妮露', objectUrl: '/src/assets/image/妮露.jpg', creator: 5, avatar: '/src/assets/image/芷若.jpg' },
   { id: 6, objectName: '清一色', objectUrl: '/src/assets/image/清一色.jpg', creator: 6, avatar: '/src/assets/image/芷若.jpg' },
   { id: 7, objectName: '清一色', objectUrl: '/src/assets/image/清一色 (2).jpg', creator: 7, avatar: '/src/assets/image/芷若.jpg' },
   { id: 8, objectName: '神里绫华', objectUrl: '/src/assets/image/神里绫华.jpg', creator: 8, avatar: '/src/assets/image/芷若.jpg' },
   { id: 9, objectName: '神里绫华', objectUrl: '/src/assets/image/神里绫华 (2).jpg', creator: 9, avatar: '/src/assets/image/芷若.jpg' },
   { id: 10, objectName: '雷神', objectUrl: '/src/assets/image/雷神.jpg', creator: 1, avatar: '/src/assets/image/芷若.jpg' },
   { id: 11, objectName: '神里绫华', objectUrl: '/src/assets/image/神里绫华 (3).jpg', creator: 1, avatar: '/src/assets/image/芷若.jpg' },
   { id: 12, objectName: '神里绫华', objectUrl: '/src/assets/image/神里绫华 (4).jpg', creator: 1, avatar: '/src/assets/image/芷若.jpg' },
   { id: 13, objectName: '白色', objectUrl: '/src/assets/image/白色 (3).jpg', creator: 8, avatar: '/src/assets/image/芷若.jpg' }
])
const localMediaList = []
const elShow = reactive({
   mask: { prePicture: false, creatorInfo: false },
   creatorInfo: { media: true, concern: false },
   loading: { mediaList: true }
})
const creatorInfo = reactive({
   baseInfo: {
      id: 0,
      nickname: '芷若',
      avatar: '/src/assets/image/芷若.jpg',
      email: 'htao58704@gmail.com',
      bio: 'ShinyShinyDay82',
   },
   mediaList: [],
   concernList: []
})


/* method */
async function getMedia(pageNo) {//获取资源
   try {
      const response = await axios.get(baseURL + '/mediaList', { params: { pageNo, searchInfo: searchInfo.value } })
      if (response.data.status != 200) {
         ElMessage.error({ message: response.data.msg })
         reutrn
      }
      mediaList.splice(0, mediaList.length)
      mediaList.push(...response.data.dataList.list)
      mediaTotal.value = response.data.dataList.total
   } catch (e) {
      ElMessage.error({ message: e, duration: 400 })
      mediaList.splice(0, mediaList.length)
      mediaList.push(...localMediaList.filter((item) => { return item.id > (pageNo - 1) * 12 && item.id <= pageNo * 12 }))
      mediaTotal.value = localMediaList.length
      return
   }
   finally {
      elShow.loading.mediaList = false
   }
}
async function getCreatorInfo(creator) {//获取当前用户的所有信息(作品,收藏,关注,粉丝)
   elShow.mask.creatorInfo = true
   if (creatorInfo.baseInfo.id == creator)
      return
   creatorInfo.baseInfo.id = creator
   const response = await axios.get(baseURL + "/getCreatorInfo", { params: { creatorId: creator } })
   if (response.data.status != 200) {
      ElMessage.error({ message: response.data.msg })
      return
   }
   Object.assign(creatorInfo.baseInfo, response.data.dataList.baseInfo)
   creatorInfo.mediaList.splice(0, creatorInfo.mediaList.length)
   creatorInfo.concernList.splice(0, creatorInfo.concernList.length)
   creatorInfo.mediaList.push(...response.data.dataList.mediaList)
   creatorInfo.concernList.push(...response.data.dataList.concernList)
   hasConcern(creator)//判断我是否关注了当前用户
}
async function getIdList() {
   if (sessionStorage.getItem('idList') != null) {
      Object.assign(idList, JSON.parse(sessionStorage.getItem('idList')))
      return
   }
   const response = await axios.get('/gateway/getIdList', { params: { uid: user.id } })
   idList.myCollect.push(...response.data.dataList.myCollect)
   idList.myConcern.push(...response.data.dataList.myConcern)
   sessionStorage.setItem('idList', JSON.stringify(idList))
}
function handleSelect(index) {
   if (index == 1) {
      elShow.creatorInfo.concern = false
      elShow.creatorInfo.media = true
   }
   else if (index == 2) {
      elShow.creatorInfo.media = false
      elShow.creatorInfo.concern = true
   }
}
function hasConcern(creator) {//判断是否关注了当前用户
   nextTick(() => {
      document.getElementsByClassName('concern')[0].getElementsByTagName('span')[0].innerText = '关注'
      if (idList.myConcern.indexOf(creator) != -1)
         document.getElementsByClassName('concern')[0].getElementsByTagName('span')[0].innerText = '已关注'
   })
}
async function updateConcern(el) {//关注或取关
   if (el.innerText == '关注') {//关注
      el.innerText = '已关注'
      const response = await axios.post('/gateway/updateConcern', {}, { params: { uid: user.id, concernId: creatorInfo.baseInfo.id, deleted: false } })
      if (response.data.status != 200) {
         ElMessage.error({ message: response.data.msg })
         return
      }
      idList.myConcern.push(creatorInfo.baseInfo.id)
      sessionStorage.setItem('idList', JSON.stringify(idList))
   }
   else if (el.innerText == '已关注') {//取关
      el.innerText = '关注'
      const response = await axios.post('/gateway/updateConcern', {}, { params: { uid: user.id, concernId: creatorInfo.baseInfo.id, deleted: true } })
      if (response.data.status != 200) {
         ElMessage.error({ message: response.data.msg })
         return
      }
      idList.myConcern.splice(idList.myConcern.indexOf(creatorInfo.baseInfo.id), 1)
      sessionStorage.setItem('idList', JSON.stringify(idList))
   }
}
function focusSearch() {
   nextTick(() => { scrollbarRef.value.setScrollTop(0) })
}
async function collect(picture) {//收藏
   const response = await axios.post('/gateway/updateCollect', {}, { params: { uid: user.id, mediaId: picture.id, deleted: false } })
   if (response.data.status != 200) {
      ElMessage.error({ message: response.data.msg })
      return
   }
   idList.myCollect.push(picture.id)
   sessionStorage.setItem('idList', JSON.stringify(idList))
}
async function cancelCollect(picture) {//取消收藏
   const response = await axios.post('/gateway/updateCollect', {}, { params: { uid: user.id, mediaId: picture.id, deleted: true } })
   if (response.data.status != 200) {
      ElMessage.error({ message: response.data.msg })
      return
   }
   idList.myCollect.splice(idList.myCollect.indexOf(picture.id), 1)
   sessionStorage.setItem('idList', JSON.stringify(idList))
}


/* 钩子 */
onMounted(() => {
   Object.assign(localMediaList, mediaList)
   getIdList()
   getMedia(1)
})
</script>


<style lang='less' scoped>
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
      width: 50%;
      --el-menu-hover-bg-color: rgba(221, 221, 221, 0.5);
      &:hover {
         color: #10a37f;
      }
   }
}
.creatorInfo {
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
}
.el-skeleton {
   height: 640px;
   padding-left: 5%;
   box-sizing: border-box;
   display: flex;
   flex-wrap: wrap;
   --el-skeleton-color: #c2dbd1;
}
.el-pagination {
   --el-pagination-bg-color: transparent;
   --el-pagination-button-disabled-bg-color: transparent;
   --el-pagination-hover-color: rgba(0, 128, 0, 0.456);
   position: absolute;
   bottom: 10px;
   left: 720px;
   width: 400px;
}
.prepicture {
   width: 800px;
   border-radius: 4%;
   animation: rotate-in-2-bck-ccw 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
.searchMedia {
   width: 100%;
   height: 50px;
   padding-top: 5px;
   box-sizing: border-box;
   background-color: rgba(223, 243, 224, 0.4);
   z-index: 2;
   position: sticky;
   top: 0px;
   .el-input {
      width: 50%;
      height: 40px;
      margin-right: 10px;
      --el-input-focus-border-color: #10a37fed;
      --el-input-bg-color: rgba(255, 255, 255, 0.349);
   }
   .el-button {
      width: 70px;
      height: 37px;
      --el-button-bg-color: #10a37fed;
      --el-button-border-color: #10a37fed;
      --el-button-hover-bg-color: #1d9d7e;
      --el-button-hover-border-color: #1d9d7e;
      --el-button-active-bg-color: #10a37fed;
      --el-button-active-border-color: #10a37fed;
   }
}
.el-scrollbar-image {
   height: 690px;
   box-sizing: border-box;
   padding-left: 5%;
   .image {
      display: inline-block;
      box-sizing: border-box;
      background-color: rgba(144, 238, 144, 0.144);
      width: 22%;
      overflow: hidden;
      margin-right: 2%;
      margin-top: 1%;
      height: 250px;
      transition: all 0.4s;
      cursor: pointer;
      position: relative;
      border-radius: 5px;
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
      }
      img:nth-child(3) {
         border-radius: 100%;
         position: absolute;
         right: 10px;
         bottom: 14px;
         width: 8%;
      }
      p {
         text-align: center;
         color: #10a37ea0;
         transform: translate(0, 10px);
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
::v-deep(.el-scrollbar__thumb) {
   background-color: transparent;
}
.container {
   width: 100%;
   height: 100%;
}
</style>