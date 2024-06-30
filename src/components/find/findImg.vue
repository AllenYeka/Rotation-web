<template>
   <!-- 预览图片 -->
   <div class="mask" v-show="elShow.mask" @click="exitPrepicture()">
      <img class="prepicture" :src="prepicture" />
   </div>
   <div class="container">
      <el-skeleton :loading="imgLoading" animated :count="3">
         <!-- 骨架屏 -->
         <template #template>
            <el-skeleton-item variant="image" style="width: 32%; height: 33.3%; margin-right:10px; margin-bottom:10px;" />
            <el-skeleton-item variant="image" style="width: 32%; height: 33.3%; margin-right:10px; margin-bottom:10px;" />
            <el-skeleton-item variant="image" style="width: 32%; height: 33.3%; margin-right:10px; margin-bottom:10px;" />
         </template>
         <!-- 真实DOM -->
         <template #default>
            <el-scrollbar height="650px">
               <div class="image_container">
                  <div class="image" v-for='picture of pictures' :key='picture.id' @click="prePicture(picture.url)">
                     <img :src="picture.url">
                     <p>{{picture.name}}</p>
                     <el-icon @click="deletePicture(picture.id)">
                        <Delete />
                     </el-icon>
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
let imgLoading = ref()
let pictureCount = ref()
const baseURL = '/rotation/api/media'
let pictures = reactive([
   { id: 0, name: '和泉纱雾', url: '/src/assets/image/和泉纱雾 (2).jpg' },
   { id: 1, name: '和泉纱雾', url: '/src/assets/image/和泉纱雾 (3).jpg' },
   { id: 2, name: '和泉纱雾', url: '/src/assets/image/和泉纱雾 (4).jpg' },
   { id: 3, name: '和泉纱雾', url: '/src/assets/image/和泉纱雾 (5).jpg' },
   { id: 4, name: '和泉纱雾', url: '/src/assets/image/和泉纱雾 (6).jpg' },
   { id: 5, name: '和泉纱雾', url: '/src/assets/image/和泉纱雾.jpg' },
   { id: 6, name: '白色', url: '/src/assets/image/白色 (2).jpg' },
   { id: 7, name: '白色', url: '/src/assets/image/白色 (3).jpg' },
   { id: 8, name: '白色', url: '/src/assets/image/白色 (4).jpg' },
])
let elShow = reactive({
   mask: false
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
   imgLoading.value = true
   axios.get(baseURL + '/getPictureByPageNo/' + pageNo, { headers: { 'Authorization': localStorage.getItem('token') } }).then(
      response => {
         pictures.splice(0, pictures.length)
         for (let i = 0; i < response.data.length; i++)
            pictures[i] = { id: response.data[i].id, url: response.data[i].objectUrl, name: response.data[i].objectName.split('.')[0] }
         setTimeout(() => {
            imgLoading.value = false
         }, 500)
      }
   ).catch((error) => {
      setTimeout(() => {
         imgLoading.value = false
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


/* 钩子 */
onMounted(() => {
   getPictureCount()
   getPictureByPageNo(1)
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
   transform: translate(100px);
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
      img {
         width: 350px;
         height: 200px;
         transition: all 0.4s;
         &:hover {
            border-radius: 4%;
         }
      }
      .el-icon {
         color: grey;
         position: absolute;
         right: 10px;
         bottom: 15px;
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