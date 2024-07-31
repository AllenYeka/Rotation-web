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
            <el-menu active-text-color="lightgreen" unique-opened background-color="#10a37ed8" text-color="#fff" router>
               <el-sub-menu :index="item.menuItem.id" v-for="item of menuItemList" :key='item.menuItem.id'>
                  <template #title>
                     <el-icon>
                        <component :is="item.menuItem.icon"></component>
                     </el-icon>
                     <p>{{item.menuItem.menuItemName}}</p>
                  </template>
                  <el-menu-item :index="son.menuItem.route" v-for="son of item.sonItem" :key='son.menuItem.id'>
                     <template #title>
                        <el-icon>
                           <Menu />
                        </el-icon>
                        <p>{{son.menuItem.menuItemName}}</p>
                     </template>
                  </el-menu-item>
               </el-sub-menu>
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
import { provide, inject, onMounted, reactive, onBeforeMount } from 'vue'
import axios from 'axios'
/* data */
const route = useRoute()
const router = useRouter()
const baseURL = '/rotation/api/content/menu'
let menuItemList = reactive([
   { menuItem: { id: 1, menuItemName: '首页', parentId: 0, isLeaf: 0, route: '', icon: 'Location' }, sonItem: [{ menuItem: { id: 5, menuItemName: '角色', parentId: 1, isLeaf: 1, route: '/home', icon: '' } }, { menuItem: { id: 9, menuItemName: '用户', parentId: 1, isLeaf: 1, route: '/all_user', icon: '' } }, { menuItem: { id: 10, menuItemName: '资源', parentId: 1, isLeaf: 1, route: '/all_media', icon: '' } }] },
   { menuItem: { id: 2, menuItemName: '发现', parentId: 0, isLeaf: 0, route: '', icon: 'Search' }, sonItem: [{ menuItem: { id: 4, menuItemName: '图片', parentId: 2, isLeaf: 1, route: '/findImg', icon: '' } }] },
   { menuItem: { id: 3, menuItemName: '我的', parentId: 0, isLeaf: 0, route: '', icon: 'User' }, sonItem: [{ menuItem: { id: 6, menuItemName: '信息', parentId: 3, isLeaf: 1, route: '/usermsg', icon: '' } }] },
   { menuItem: { id: 7, menuItemName: '创造', parentId: 0, isLeaf: 0, route: '', icon: 'MagicStick' }, sonItem: [{ menuItem: { id: 8, menuItemName: 'AI绘画', parentId: 7, isLeaf: 1, route: '/createImg', icon: '' } }] },
   { menuItem: { id: 10, menuItemName: '本地菜单', parentId: 0, isLeaf: 0, route: '', icon: 'SwitchButton' }, sonItem: [] },
])
let user = reactive(JSON.parse(localStorage.getItem('user')))


/* method */
function logout() {
   localStorage.removeItem("token")
   provide('removeToken', 'remove')
   location.href = 'http://localhost:5379/#/login'
}
async function menuList() {
   menuItemList.splice(0, menuItemList.length)
   const response = await axios.get(baseURL + '/menuList', { headers: { 'Authorization': localStorage.getItem('token') } })
   for (let i = 0; i < response.data.length; i++)
      menuItemList[i] = response.data[i]
   //menuItemList = response.data无法渲染到界面
}


/* 钩子 */
menuList()
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
   width: 10%;
}
.el-main {
   background-color: #e7f0e9;
}
</style>