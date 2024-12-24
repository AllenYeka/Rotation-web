<template>
   <div class="tipContainer">
      <router-link :to="{path:'/tip'}" style="position:fixed;top:15px;right:1320px;font-family:仿宋">返回</router-link>
      <!-- 帖子信息 -->
      <div class="tipHeader">
         <p>{{tipInfo.title}}</p>
         <p>{{tipInfo.description}}</p>
         <img :src="tipInfo.avatar" />
         <p>{{tipInfo.nickname}}</p>
         <img :src="tipInfo.cover" />
      </div>
      <!-- 评论区 -->
      <el-scrollbar ref="scrollbarRef">
         <!-- 暂无评论 -->
         <div class="noComment" v-show='commentList.length==0'> 暂无评论 </div>
         <div class="comment" v-for='comment of commentList' :key='comment.id'>
            <img :src="comment.avatar" />
            <p>{{comment.nickname}}</p>
            <div v-show='tipInfo.creator==comment.creator'>楼主</div>
            <p>{{comment.createTime}}</p>
            <p>{{comment.content}}</p>
         </div>
      </el-scrollbar>
      <el-input v-model="content" placeholder="发布评论" @keyup.enter="sendComment()" />
      <el-button icon="Position" type="success" @click="sendComment()" :loading="elLoading.sendComment" />
   </div>
</template>


<script setup>
import { ref, onMounted, reactive, nextTick } from "vue"
import { useRoute, useRouter } from "vue-router"
import axios from 'axios'
import { ElMessage } from "element-plus"

/* data */
const user = JSON.parse(sessionStorage.getItem('user'))
const baseURL = '/rotation/api/content'
const elLoading = reactive({
   sendComment: false
})
const tipInfo = JSON.parse(decodeURI(useRoute().query.tip))
const commentList = reactive([
   { id: 0, creator: 1, nickname: '杰洛.齐贝林', createTime: timeFormat(new Date()), content: '从他那只顾凝视虚空的干枯双眸中，我什么都揣测不到，好比连神都无法理解堕落在地的堕天使路西法在想什么.我烦透了，我冲着地面吐了口唾沫，点了根马宝路。人必须顺应环境，不断变化才能活下去，那个男人停止了前进，拒绝了变化，已经如同行尸走肉一般', avatar: 'https://avatars.githubusercontent.com/u/94109480?v=4' },
   { id: 1, creator: 1, nickname: '杰洛.齐贝林', createTime: timeFormat(new Date()), content: '我把从老妈那偷来的威士忌随手丢给了他。MADAO,环境我给你换了,剩下就该你了。你为什么停滞不前?你到底有什么不满?MADAO对我的问题闭口不答,只是一脸苦涩地舔着威士忌.MADAO什么时候才会开花呢?康多兀鹫在上空盘旋，仿佛在嘲笑仰望天空的我……', avatar: 'https://avatars.githubusercontent.com/u/94109480?v=4' },
   { id: 2, creator: 1, nickname: '杰洛.齐贝林', createTime: timeFormat(new Date()), content: '到头来我还是没找到MADAO,感觉头好疼,没法像之前写那么好,我好像感冒了。不知道是为什么,我明明没喝酒,眼里却流出了酒,就像MADAO', avatar: 'https://avatars.githubusercontent.com/u/94109480?v=4' },
   { id: 3, creator: 2, nickname: '乔尼.乔斯达', createTime: timeFormat(new Date()), content: 'madao是真正的武士', avatar: 'https://foruda.gitee.com/avatar/1719841511744367127/11729822_wangriqing_1719841511.png!avatar100' },
   { id: 4, creator: 2, nickname: '乔尼.乔斯达', createTime: timeFormat(new Date()), content: '泪目', avatar: 'https://foruda.gitee.com/avatar/1719841511744367127/11729822_wangriqing_1719841511.png!avatar100' },
])
let content = ref('')
const scrollbarRef = ref()


/* method */
async function getComment() {//根据帖子id获取评论
   const response = await axios.get(baseURL + '/getComment', { params: { tipId: tipInfo.id } })
   if (response.data.status != 200) {
      ElMessage.error({ message: response.data.msg })
      return
   }
   commentList.splice(0, commentList.length)
   commentList.push(...response.data.dataList)
}
async function sendComment() {//发送评论
   try {
      elLoading.sendComment = true
      commentList.push({ id: commentList[commentList.length - 1].id + 1, creator: user.id, nickname: user.nickname, createTime: timeFormat(new Date()), content: content.value, avatar: user.avatar })
      nextTick(() => { scrollbarRef.value.setScrollTop(document.getElementsByClassName('el-scrollbar__view')[0].clientHeight) })
      const response = await axios.post(baseURL + '/sendComment', { tipId: tipInfo.id, content: content.value, creator: user.id })
      if (response.data.status != 200) {
         ElMessage.error({ message: response.data.msg })
         return
      }
   } catch (e) {
      ElMessage.error({ message: response.data.msg })
      return
   }
   finally {
      content.value = ''
      elLoading.sendComment = false
   }
}
function timeFormat(date) {
   const year = date.getFullYear()
   const month = (date.getMonth() + 1).toString().padStart(2, '0')
   const day = date.getDate().toString().padStart(2, '0')
   const hours = date.getHours().toString().padStart(2, '0')
   const minutes = date.getMinutes().toString().padStart(2, '0')
   const seconds = date.getSeconds().toString().padStart(2, '0')
   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}


/* 钩子 */
onMounted(() => {
   getComment()
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
@keyframes slide-in-left {
   0% {
      -webkit-transform: translateX(-1000px);
      transform: translateX(-1000px);
      opacity: 0;
   }
   100% {
      -webkit-transform: translateX(0);
      transform: translateX(0);
      opacity: 1;
   }
}
.el-button {
   color: white;
   width: 5%;
   height: 5.2%;
   bottom: 6px;
   right: 290px;
   position: fixed;
   --el-button-bg-color: #10a37f;
   --el-button-hover-bg-color: #10a37f;
}
.el-input {
   width: 47%;
   height: 5.5%;
   bottom: 5px;
   left: 430px;
   position: fixed;
   --el-input-bg-color: rgba(255, 255, 255, 0.664);
   --el-input-focus-border-color: #10a37fed;
}
.tipHeader {
   width: 75%;
   height: 26%;
   margin: 10px auto;
   background-color: rgba(144, 238, 144, 0.127);
   position: relative;
   padding: 15px;
   border-radius: 5px;
   transition: all 0.4s;
   animation: slide-in-top 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
   &:hover {
      box-shadow: 5px 5px 15px #d3d3d3;
   }
   p:nth-child(1) {
      color: #10a37f;
      font-size: 30px;
      font-family: 仿宋;
      width: 64%;
      margin-top: 10px;
      margin-left: 15px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
   }
   p:nth-child(2) {
      margin-top: 15px;
      margin-left: 15px;
      font-family: 楷体;
      color: grey;
      font-size: 17px;
      width: 60%;
      height: 60px;
      overflow: hidden;
   }
   img:nth-child(3) {
      position: absolute;
      bottom: 10px;
      left: 27px;
      width: 40px;
      height: 40px;
      border-radius: 100%;
      cursor: pointer;
   }
   p:nth-child(4) {
      margin-left: 65px;
      color: grey;
      font-size: 15px;
      transform: translate(0, 50px);
   }
   img:nth-child(5) {
      position: absolute;
      top: 10px;
      right: 20px;
      width: 33%;
      height: 90%;
      border-radius: 5px;
   }
}
.el-scrollbar {
   width: 77%;
   height: 60%;
   margin: 0 auto;
   border-radius: 5px;
   .comment {
      width: 100%;
      height: auto;
      background-color: rgba(144, 238, 144, 0.127);
      border-bottom: 1px solid #10a37e27;
      padding: 20px;
      padding-left: 160px;
      box-sizing: border-box;
      position: relative;
      display: inline-block;
      cursor: default;
      transition: all 0.2s;
      animation: slide-in-left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
      &:hover {
         background-color: rgba(144, 238, 144, 0.305);
      }
      img {
         width: 40px;
         height: 40px;
         border-radius: 100%;
      }
      p:nth-child(2) {
         color: black;
         font-size: 13px;
         display: inline-block;
         transform: translate(10px, -25px);
      }
      div:nth-child(3) {
         border-radius: 5px;
         color: #565656;
         width: 30px;
         height: 18px;
         padding-left: 3px;
         padding-top: 1px;
         box-sizing: border-box;
         background-color: #b8fded;
         font-size: 11px;
         display: inline-block;
         transform: translate(20px, -26px);
      }
      p:nth-child(4) {
         color: grey;
         font-size: 11px;
         position: absolute;
         left: 210px;
         top: 42px;
      }
      p:nth-child(5) {
         color: #565656;
         font-size: 14px;
         position: relative;
         width: 680px;
         left: 50px;
      }
   }
}
::v-deep(.el-scrollbar__thumb) {
   background-color: transparent;
}
.noComment {
   height: 440px;
   margin: 0 auto;
   border-radius: 5px;
   background-color: rgba(144, 238, 144, 0.127);
   text-align: center;
   line-height: 370px;
   color: grey;
   animation: slide-in-left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
.tipContainer {
   width: 100%;
   height: 100%;
   box-sizing: border-box;
   border: 1px solid transparent;
}
</style>