<template>
   <!-- 预览图片 -->
   <div class="mask" v-show="elShow.mask" @click="exitPrepicture()">
      <img class="prepicture" :src="prepicture" />
   </div>
   <!-- 资源管理 -->
   <el-table :data="media" style="width: 70%" @row-click='prePicture'>
      <template #empty>
         暂无数据
      </template>
      <el-table-column prop="id" label="ID" align="center" width="100px" />
      <el-table-column prop="objectName" label="资源名称" align="center" />
      <el-table-column prop="username" label="用户" align="center" />
      <el-table-column prop="userAvatarUrl" label="头像" align="center" width="90px">
         <template #default="data">
            <img :src="media[data.$index].userAvatarUrl">
         </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" width="260px" />
      <el-table-column label="操作" align="center" width="150px">
         <template #default=data>
            <el-button type="danger" @click.stop='deleteMedia(data.row.id,data.row.objectName)'>删除</el-button>
         </template>
      </el-table-column>
   </el-table>
   <!-- 分页 -->
   <el-pagination layout="prev, pager, next" :total="mediaCount" :page-size="9" v-model:current-page="currentPage" @current-change="getPictureByPageNo(currentPage)" />
</template>


<script setup>
import { onMounted, reactive, ref } from "vue";
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

/* data */
let mediaCount = ref()
let currentPage = ref()
let prepicture = ref('')
const baseURL = '/rotation/api/media'
let media = reactive([
   //{ id: 0, objectName: '', username: '', createTime: '', userAvatarUrl: '', objectUrl: '' }
])
let elShow = reactive({
   mask: false
})


/* method */
async function getPictureByPageNo(pageNo) {
   const response = await axios.get(baseURL + "/getPictureByPageNo/" + pageNo, { headers: { 'Authorization': localStorage.getItem('token') } })
   media.splice(0, media.length)
   for (let i = 0; i < response.data.length; i++) {
      media[i] = response.data[i]
   }
}
async function getMediaCount() {
   const response = await axios.get(baseURL + "/getPictureCount", { headers: { 'Authorization': localStorage.getItem('token') } })
   mediaCount.value = response.data
}
function deleteMedia(pictureId, objectName) {
   ElMessageBox.confirm('确定删除  ' + objectName + '  吗?', '删除角色',
      {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type: 'warning',
         customStyle: { width: "550px", height: "135px" },
         confirmButtonClass: 'messageBox_confirm',
         cancelButtonClass: 'messageBox_cancel'
      }).then(() => {
         axios.get(baseURL + "/deletePicture?pictureId=" + pictureId + '&pageNo=' + currentPage.value, { headers: { 'Authorization': localStorage.getItem('token') } }).then(
            response => {
               if (response.data == true) {
                  ElMessage.success({ message: '删除成功', duration: 1000 })
                  setTimeout(function () {
                     location.reload()
                  }, 1100)
               }
               else
                  ElMessage.success({ message: '删除失败', duration: 1000 })
            }
         )
      })
      .catch(() => {
         console.log('取消')
      })
}
function exitPrepicture() {
   elShow.mask = false
   prepicture.value = ''
}
function prePicture(row, col, event) {
   elShow.mask = true
   prepicture.value = row.objectUrl
}


/* 钩子 */
onMounted(() => {
   getMediaCount()
   getPictureByPageNo(1)
})
</script>


<style lang='less'>
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
.el-table {
   margin-top: 20px;
   margin-left: 200px;
   img {
      width: 30px;
      border-radius: 100%;
   }
}
.el-pagination {
   --el-pagination-bg-color: #e7f0e9;
   --el-pagination-button-disabled-bg-color: #e7f0e9;
   --el-pagination-hover-color: rgba(0, 128, 0, 0.456);
   margin-top: 50px;
   margin-left: 550px;
   width: 400px;
   position: absolute;
   bottom: 70px;
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
.messageBox_cancel {
   &:hover {
      color: white;
      background-color: rgba(128, 128, 128, 0.138);
   }
}
.messageBox_confirm {
   background-color: #10a37ecf;
   &:hover {
      background-color: #10a37eea;
   }
}
</style>