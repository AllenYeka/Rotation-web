<template>
   <div class="user_container">
      <img :src="user.avatar_url">
      <p>{{user.name}}</p>
      <p>{{user.email}}</p>
      <p>{{user.bio}}</p>
      <el-upload ref='uploadRef' action="/rotation/api/media/uploadPicture" :headers="header" list-type="picture-card" :auto-upload="false" :limit='5' multiple>
         <el-icon>
            <Plus />
         </el-icon>
      </el-upload>
      <el-button @click="uploadPicture()">上传</el-button>
   </div>
</template>


<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from "element-plus"
import emitter from '../../utils/bus'
import axios from 'axios'

/* data */
let user = reactive(JSON.parse(localStorage.getItem('user')))
let uploadRef = ref()
const baseURL = '/rotation/api/media'
let header = reactive({
   'Authorization': localStorage.getItem('token'),
   'RUser': encodeURIComponent(user.name),
   'RAvatar': user.avatar_url,
   'RPageNo': 0
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


/* 钩子 */
onMounted(() => {
   getPageNo()
})
</script>


<style lang='less'>
.user_container .el-upload--picture-card {
   &:hover {
      border: 1px dashed #33af90;
   }
}
.user_container .el-button {
   margin-top: 5px;
   color: #33af90;
   &:hover {
      box-shadow: 5px 5px 50px #33af9077 inset;
   }
}
.user_container {
   width: 100%;
   height: 100%;
   img {
      width: 5%;
      border-radius: 100%;
   }
   p {
      margin: 5px auto;
   }
}
</style>