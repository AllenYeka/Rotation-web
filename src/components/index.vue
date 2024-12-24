<template>
   <el-container>
      <!-- 左侧菜单 -->
      <el-aside>
         <el-menu active-text-color="lightgreen" unique-opened background-color="#10a37ee6" text-color="#fff" router>
            <img :src="user.avatar" @click="elShow.mask.avatar=true">
            <h5>{{user.nickname}}</h5>
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
            <el-button type="primary" @click="logout()">退出</el-button>
         </el-menu>
      </el-aside>
      <!-- 背景 -->
      <img class="backgroundImg" src="/src/assets/image/纳西妲 (5).jpg">
      <!-- 预览头像 -->
      <div class="mask" v-show="elShow.mask.avatar" @click.self="elShow.mask.avatar=false">
         <img :src="user.avatar" width="500px">
      </div>
      <!-- 路由占位符 -->
      <el-main>
         <router-view></router-view>
      </el-main>
   </el-container>
</template>


<script setup>
import { useRoute, useRouter } from "vue-router"
import { provide, inject, onMounted, reactive, onBeforeMount } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from "element-plus"

/* data */
const user = JSON.parse(sessionStorage.getItem('user'))
const route = useRoute()
const router = useRouter()
const baseURL = '/rotation/api/content/menu'
const menuItemList = reactive([
   { menuItem: { id: 1, menuItemName: '管 理', parentId: 0, isLeaf: 0, route: '', icon: 'Location' }, sonItem: [{ menuItem: { id: 5, menuItemName: '角 色', parentId: 1, isLeaf: 1, route: '/role', icon: '' } }, { menuItem: { id: 9, menuItemName: '用 户', parentId: 1, isLeaf: 1, route: '/user', icon: '' } }, { menuItem: { id: 10, menuItemName: '资 源', parentId: 1, isLeaf: 1, route: '/media', icon: '' } }] },
   { menuItem: { id: 2, menuItemName: '发 现', parentId: 0, isLeaf: 0, route: '', icon: 'Search' }, sonItem: [{ menuItem: { id: 4, menuItemName: '图 片', parentId: 2, isLeaf: 1, route: '/findImg', icon: '' } }] },
   { menuItem: { id: 3, menuItemName: '我 的', parentId: 0, isLeaf: 0, route: '', icon: 'User' }, sonItem: [{ menuItem: { id: 6, menuItemName: '信 息', parentId: 3, isLeaf: 1, route: '/userInfo', icon: '' } }] },
   { menuItem: { id: 7, menuItemName: '创 造', parentId: 0, isLeaf: 0, route: '', icon: 'MagicStick' }, sonItem: [{ menuItem: { id: 8, menuItemName: 'AI绘画', parentId: 7, isLeaf: 1, route: '/createImg', icon: '' } }] },
   { menuItem: { id: 11, menuItemName: '论 坛', parentId: 0, isLeaf: 0, route: '', icon: 'ChatLineSquare' }, sonItem: [{ menuItem: { id: 12, menuItemName: '交 流', parentId: 11, isLeaf: 1, route: '/tip', icon: '' } }] }
])
const elShow = reactive({
   mask: { avatar: false }
})


/* method */
function logout() {
   ElMessageBox.confirm('确定退出吗?', '退出登录',
      {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type: 'warning',
         showCancelButton: false,
         customStyle: { width: "550px", height: "135px" }
      }).then(() => {
         sessionStorage.removeItem("token")
         sessionStorage.removeItem("user")
         sessionStorage.removeItem("idList")
         location.href = 'http://localhost:5379/#/login'
      })
      .catch(() => {
         console.log('取消')
      })
}
async function menuList() {
   const response = await axios.get(baseURL + '/menuList')
   if (response.data.status != 200) {
      ElMessage.error({ message: response.data.msg })
      return
   }
   menuItemList.splice(0, menuItemList.length)
   Object.assign(menuItemList, response.data.dataList)
}


/* 钩子 */
onMounted(() => {
   menuList()
})
</script>


<style lang="less" scoped>
.el-menu {
   border-right: none;
   ::v-deep(.el-sub-menu__title) {
      padding-left: 20px;
      p {
         margin-left: 8px;
      }
   }
}
.el-aside {
   background-color: #10a37ee6;
   width: 10%;
   img {
      height: 80px;
      width: 84px;
      border-radius: 100%;
      margin-left: 34px;
      margin-top: 15px;
      margin-bottom: 10px;
      &:hover {
         cursor: pointer;
      }
   }
   h5 {
      color: rgba(0, 0, 0, 0.645);
      text-align: center;
      margin-bottom: 10px;
      &:hover {
         cursor: default;
      }
   }
}
.el-main {
   background-color: #e7f0e9;
   width: 90%;
   --el-main-padding: 0px;
}
.backgroundImg {
   position: absolute;
   left: 10%;
   width: 90%;
   height: 100%;
   opacity: 0.22;
   z-index: 0;
}
.el-button--primary {
   position: absolute;
   left: 40px;
   top: 700px;
   --el-button-bg-color: #10a37fed;
   --el-button-border-color: #10a37fed;
   --el-button-hover-bg-color: #1fa383;
   --el-button-hover-border-color: #1fa383;
   --el-button-active-bg-color: #10a37fed;
   --el-button-active-border-color: #10a37fed;
}
.el-container {
   width: 100%;
   height: 100%;
}
</style>