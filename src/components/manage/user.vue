<template>
   <div class="user-container">
      <!-- 用户表 -->
      <el-table :data="userList">
         <el-table-column prop="id" label="UID" align="center" width="100px" />
         <el-table-column prop="username" label="帐号" align="center" width="200px" />
         <el-table-column prop="nickname" label="昵称" align="center" width="200px" />
         <el-table-column prop="avatar_url" label="头像" align="center" width="90px">
            <template #default="data">
               <img :src="userList[data.$index].avatar">
            </template>
         </el-table-column>
         <el-table-column prop="bio" label="墓志铭" align="center" width="428px" />
         <el-table-column prop="email" label="邮箱" align="center" width="250px" />
      </el-table>
   </div>
</template>


<script setup>
import { onMounted, reactive } from "vue"
import axios from 'axios'
import { ElMessage } from "element-plus"
/* data */
const userList = reactive([
   { id: 1, username: 'admin', nickname: '乔尼', avatar: '/src/assets/image/hsy.jpg', bio: '吾心吾行澄如明镜,所作所为皆属正义', email: 'xdhvuexgd@outlook.com' }
])

/* method */
async function getAlluser() {
   const response = await axios.get("/gateway/getAllUser")
   if (response.data.status != 200) {
      ElMessage.error({ message: response.data.msg })
      return
   }
   userList.splice(0, userList.length)
   userList.push(...response.data.dataList)
}

/* 钩子 */
onMounted(() => {
   getAlluser()
})

</script>


<style lang='less' scoped>
.el-table {
   margin: 0 auto;
   width: 95%;
   transform: translate(0, 30px);
   opacity: 0.8;
   img {
      width: 50px;
      border-radius: 100%;
   }
}
.user-container {
   width: 100%;
   height: 100%;
}
</style>