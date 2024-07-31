<template>
   <!-- 用户表 -->
   <el-table :data="user" style="width: 90%">
      <el-table-column prop="id" label="UID" align="center" width="70px" />
      <el-table-column prop="username" label="用户" align="center" width="200px"/>
      <el-table-column prop="avatarUrl" label="头像" align="center" width="90px">
         <template #default="data">
            <img :src="user[data.$index].avatarUrl">
         </template>
      </el-table-column>
      <el-table-column prop="bio" label="用户座右铭" align="center" width="590px"/>
      <el-table-column prop="email" label="邮箱" align="center" width="250px"/>
   </el-table>
</template>


<script setup>
import { onMounted, reactive } from "vue"
import axios from 'axios'

/* data */
let user = reactive([
   { id: 0, username: 'admin', bio: '敬下一个遗体及终点', email: 'xdhvuexgd@icloud.com', avatarUrl: 'https://foruda.gitee.com/avatar/1719841511744367127/11729822_wangriqing_1719841511.png' }
])


/* method */
async function getAllUser() {
   const response = await axios.get("/gateway/getAllUser", { headers: { 'Authorization': localStorage.getItem('token') } })
   for (let i = 0; i < response.data.length; i++)
      user[i] = response.data[i]
}

/* 钩子 */
onMounted(() => {
   getAllUser()
})
</script>


<style lang='less' scoped>
.el-table {
   margin-left: 70px;
   img {
      width: 50px;
      border-radius: 100%;
   }
}
</style>