<template>
   <!-- 预览图片 -->
   <div class="mask" v-show="elShow.mask" @click="elShow.mask = false">
      <img class="prepicture" :src="prepicture" />
   </div>
   <!-- 资源管理 -->
   <el-table :data="mediaList" @row-click='prePicture'>
      <template #empty>
         暂无数据
      </template>
      <el-table-column prop="id" label="ID" align="center" width="100px" />
      <el-table-column prop="objectName" label="资源名称" align="center" />
      <el-table-column prop="stockingType" label="丝袜类型" align="center" />
      <el-table-column prop="nickname" label="用户" align="center" />
      <el-table-column prop="avatar" label="头像" align="center" width="90px">
         <template #default="data">
            <img :src="mediaList[data.$index].avatar">
         </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" width="260px" />
      <el-table-column label="操作" align="center" width="150px">
         <template #default=data>
            <el-button :type="data.row.status==false?'primary':'danger'" :loading="elLoading.status[data.$index]" @click.stop='mediaStatus(data.row,data.$index)'>{{data.row.status==false?'启用':'禁用'}}</el-button>
         </template>
      </el-table-column>
   </el-table>
   <!-- 分页 -->
   <el-pagination layout="prev, pager, next" :total="mediaTotal" :page-size="9" v-model:current-page="currentPage" @current-change="allMedia(currentPage)" />
</template>


<script setup>
import { onMounted, reactive, ref } from "vue";
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

/* data */
let mediaTotal = ref()
let currentPage = ref()
let prepicture = ref('')
const baseURL = '/rotation/api/media'
const mediaList = reactive([
   { id: 1, objectName: '白色 (2).jpg', objectUrl: '/src/assets/image/白色 (2).jpg', createTime: '2024-12-14 16:50:45', stockingType: '白丝', creator: 1, nickname: '胡桃', avatar: '/src/assets/image/hsy.jpg' }
])
const elShow = reactive({
   mask: false
})
const elLoading = reactive({
   status: []
})
const stockingTypeMap = new Map([
   [1, '白丝'], [2, '黑丝'], [3, '光腿'], [4, '其他']
])



/* method */
async function allMedia(pageNo) {
   const response = await axios.get(baseURL + "/allMedia", { params: { pageNo } })
   if (response.data.status != 200) {
      ElMessage.error({ message: response.data.msg })
      return
   }
   mediaList.splice(0, mediaList.length)
   mediaList.push(...response.data.dataList.list)
   mediaList.forEach((item) => { item.stockingType = stockingTypeMap.get(item.stockingType) })
   mediaTotal.value = response.data.dataList.total
}
function mediaStatus(media, index) {
   const operation = media.status == false ? '启用' : '禁用'
   ElMessageBox.confirm('确定' + operation + media.objectName + '吗', '资源状态',
      {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type: 'warning',
         customStyle: { width: "550px", height: "135px" },
         confirmButtonClass: 'messageBox_confirm',
         cancelButtonClass: 'messageBox_cancel'
      }).then(async () => {
         elLoading.status[index] = true
         const response = await axios.post(baseURL + "/mediaStatus", { mediaId: media.id, status: !media.status })
         if (response.data.status != 200) {
            ElMessage.error({ message: response.data.msg })
            elLoading.status[index] = false
            return
         }
         mediaList[index].status = !media.status
         elLoading.status[index] = false
      }).catch(() => {
         console.log('取消')
      })
}
function prePicture(row, col, event) {
   elShow.mask = true
   prepicture.value = row.objectUrl
}


/* 钩子 */
onMounted(() => {
   allMedia(1)
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
.el-table {
   transform: translate(0, 50px);
   width: 80%;
   margin: 0 auto;
   opacity: 0.8;
   img {
      width: 30px;
      border-radius: 100%;
   }
}
.el-pagination {
   --el-pagination-bg-color: transparent;
   --el-pagination-button-disabled-bg-color: transparent;
   --el-pagination-hover-color: rgba(0, 128, 0, 0.456);
   width: 400px;
   position: absolute;
   bottom: 100px;
   left: 750px;
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