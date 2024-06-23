<template>
   <el-container>
      <el-header>
         <img src="/favicon.ico">
         <p>{{user.name}} :</p>
         <p>敬下一个『遗体』及『终点』</p>
         <el-button @click="logout()">退出</el-button>
      </el-header>
      <el-container>
         <!-- 左侧菜单 -->
         <el-aside>
            <el-menu active-text-color="lightgreen" background-color="#10a37ed8" text-color="#fff" router>
               <!-- 首页 -->
               <el-menu-item index="/home">
                  <el-icon>
                     <location />
                  </el-icon>
                  <p>首页</p>
               </el-menu-item>
               <!-- 发现 -->
               <el-sub-menu>
                  <template #title>
                     <el-icon>
                        <Search />
                     </el-icon>
                     <p>发现</p>
                  </template>
                  <el-menu-item index="/findImg">图片</el-menu-item>
                  <el-menu-item index="/findVideo">视频</el-menu-item>
               </el-sub-menu>
               <!-- 我的 -->
               <el-menu-item index="/usermsg">
                  <el-icon>
                     <User />
                  </el-icon>
                  <p>我的</p>
               </el-menu-item>
            </el-menu>
         </el-aside>
         <!-- 路由占位符 -->
         <el-main>
            <router-view></router-view>
         </el-main>
      </el-container>
   </el-container>
</template>


<script setup>
import { useRoute, useRouter } from "vue-router"
import { provide, inject, onMounted, reactive } from 'vue'
/* data */
const route = useRoute()
const router = useRouter()
let user = reactive(JSON.parse(localStorage.getItem('user')))

/* method */
function logout() {
   localStorage.removeItem("token")
   provide('removeToken', 'remove')
   location.href = 'http://localhost:5379/#/login'
}
</script>


<style lang="less" scoped>
.el-menu {
   border-right: none;
}
.el-header {
   background-color: #10a37ed8;
   display: flex;
   align-items: center;
   .el-button {
      position: fixed;
      right: 2%;
      background-color: #10a37f;
      border: none;
      color: white;
      &:hover {
         color: red;
      }
   }
   img {
      width: 4%;
      margin-right: 1%;
      transform: scale(0.8);
      border-radius: 100%;
   }
   p {
      color: white;
      font-family: 华文行楷;
      font-size: 190%;
      margin-right: 1%;
   }
}
.el-aside {
   background-color: #10a37ee6;
   width: 11%;
}
.el-main {
   background-color: #e7f0e9;
}
</style>