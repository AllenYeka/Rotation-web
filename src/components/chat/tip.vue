<template>
   <el-scrollbar class="tip_container">
      <router-link :to="{path:'/chat'}" style="position:fixed;top:70px">返回</router-link>
      <!-- 帖子信息 -->
      <div class="tipHeader">
         <p>{{tip.title}}</p>
         <p>{{tip.description}}</p>
         <img :src="tip.avatarUrl" />
         <p>{{tip.username}}</p>
         <img :src="tip.tipPicture" />
      </div>
      <!-- 暂无评论 -->
      <div class="noComment" v-show='elShow.noComment'>
         暂无评论
      </div>
      <!-- 评论 -->
      <div class="comment" v-for='comment of tip.comments' :key='comment.commentId'>
         <img :src="comment.avatarUrl" />
         <p>{{comment.username}}</p>
         <p>{{comment.createTime}}</p>
         <p>{{comment.content}}</p>
         <div v-show='louzhuShowIf(comment.uid)'>楼主</div>
      </div>
   </el-scrollbar>
   <el-input v-model="new_comment" placeholder="发布评论" @keyup.enter="sendComment()" />
   <el-button icon="Position" type="success" @click="sendComment()" :disabled="elShow.sendComment" />
</template>


<script setup>
import { ref, onMounted, reactive } from "vue"
import { useRoute, useRouter } from "vue-router"
import axios from 'axios'

/* data */
let tipId = useRoute().query.tipId
const baseURL = '/rotation/api/content'
let userMedia = reactive({
   id: 0,
   avatarUrl: '',
   username: '',
   email: '',
   bio: '',
   medias: [
      { id: 0, objectName: '杰洛.齐贝林', objectUrl: '/src/assets/image/j1.jpg' },
      { id: 1, objectName: '杰洛.齐贝林', objectUrl: '/src/assets/image/j2.jpg' }
   ],
   collection: [
      { id: 0, objectName: '杰洛.齐贝林', objectUrl: '/src/assets/image/j1.jpg' },
      { id: 1, objectName: '杰洛.齐贝林', objectUrl: '/src/assets/image/j2.jpg' }
   ],
   concern: [
      { id: 0, username: '杰洛.齐贝林', avatarUrl: 'https://avatars.githubusercontent.com/u/94109480?v=4', bio: '结果谁都无法知道,因触网而弹起的网球会落到哪一边,就是因为这样,人们才会希望『女神』真的存在。如果她真的存在的话,不管最后的结果如何,我都能坦然接受' }
   ],
   fans: [
      { id: 0, username: '乔尼.乔斯达', avatarUrl: 'https://foruda.gitee.com/avatar/1719841511744367127/11729822_wangriqing_1719841511.png', bio: '就只差一步了！我现在还只是『负数』！我只是想让自己从『负数』变为『零』而已啊' }
   ],
})
let elShow = reactive({
   louzhu: false,
   noComment: false,
   sendComment: false
})
let tip = reactive({
   tipId: 0, title: 'Madao观察日记', uid: 1, username: '杰洛齐贝林', avatarUrl: 'https://avatars.githubusercontent.com/u/94109480?v=4', description: '暑假做了关于Madao的观察日记,MADAO是公园的主人,长着胡子戴着墨镜的生物,基本一整天都不干活在公园里呆着...', tipPicture: '/src/assets/image/803.jpg',
   comments: [
      { commentId: 0, uid: 1, username: '杰洛.齐贝林', createTime: '2024-08-09', content: '从他那只顾凝视虚空的干枯双眸中，我什么都揣测不到，好比连神都无法理解堕落在地的堕天使路西法在想什么.我烦透了，我冲着地面吐了口唾沫，点了根马宝路。人必须顺应环境，不断变化才能活下去，那个男人停止了前进，拒绝了变化，已经如同行尸走肉一般', avatarUrl: 'https://avatars.githubusercontent.com/u/94109480?v=4' },
      { commentId: 1, uid: 1, username: '杰洛.齐贝林', createTime: '2024-08-09', content: '我把从老妈那偷来的威士忌随手丢给了他。MADAO,环境我给你换了,剩下就该你了。你为什么停滞不前?你到底有什么不满?MADAO对我的问题闭口不答,只是一脸苦涩地舔着威士忌.MADAO什么时候才会开花呢?康多兀鹫在上空盘旋，仿佛在嘲笑仰望天空的我……', avatarUrl: 'https://avatars.githubusercontent.com/u/94109480?v=4' },
      { commentId: 2, uid: 1, username: '杰洛.齐贝林', createTime: '2024-08-09', content: '到头来我还是没找到MADAO,感觉头好疼,没法像之前写那么好,我好像感冒了。不知道是为什么,我明明没喝酒,眼里却流出了酒,就像MADAO', avatarUrl: 'https://avatars.githubusercontent.com/u/94109480?v=4' },
      { commentId: 3, uid: 2, username: '乔尼.乔斯达', createTime: '2024-08-09', content: 'madao是真正的武士', avatarUrl: 'https://foruda.gitee.com/avatar/1719841511744367127/11729822_wangriqing_1719841511.png!avatar100' },
      { commentId: 4, uid: 2, username: '乔尼.乔斯达', createTime: '2024-08-09', content: '泪目', avatarUrl: 'https://foruda.gitee.com/avatar/1719841511744367127/11729822_wangriqing_1719841511.png!avatar100' },
   ],
})
let new_comment = ref('')
let myMedia = reactive(JSON.parse(localStorage.getItem('myMedia')))


/* method */
function louzhuShowIf(comment_uid) {
   if (tip.uid == comment_uid)
      return true
   else
      return false
}
async function getTipById() {//根据帖子id获取所有信息
   const response = await axios.get(baseURL + '/getTipById/' + tipId)
   Object.assign(tip, response.data)
}
async function sendComment() {//发送评论
   elShow.sendComment = true
   const response = await axios.post(baseURL + '/sendComment?tipId=' + tip.tipId, { content: new_comment.value, uid: myMedia.id, username: myMedia.username, avatarUrl: myMedia.avatarUrl })
   if (!Boolean(tip.comments) || !Boolean(tip.comments.length)) {
      tip.comments = []
      tip.comments[0] = response.data
   }
   else
      tip.comments.push(response.data)
   elShow.sendComment = false
   new_comment.value = ''
}


/* 钩子 */
onMounted(() => {
   getTipById()
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
   bottom: 5px;
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
   --el-input-focus-border-color: lightgreen;
}
.comment {
   width: 60%;
   height: auto;
   background-color: #f5f5f5;
   margin-left: 260px;
   border-bottom: 1px solid #e4e4e4;
   padding: 20px;
   box-sizing: border-box;
   position: relative;
   display: inline-block;
   cursor: pointer;
   transition: all 0.2s;
   animation: slide-in-left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
   &:hover {
      background-color: #e9e8e8;
   }
   img {
      width: 40px;
      height: 40px;
      border-radius: 100%;
   }
   p:nth-child(2) {
      color: black;
      font-size: 13px;
      position: absolute;
      left: 70px;
      top: 22px;
   }
   p:nth-child(3) {
      color: grey;
      font-size: 11px;
      position: absolute;
      left: 70px;
      top: 42px;
   }
   p:nth-child(4) {
      color: #565656;
      font-size: 14px;
      position: relative;
      width: 680px;
      left: 50px;
   }
   div:nth-child(5) {
      border-radius: 5px;
      color: #565656;
      width: 30px;
      height: 18px;
      padding-left: 3px;
      padding-top: 1px;
      box-sizing: border-box;
      background-color: #b8fded;
      font-size: 11px;
      position: absolute;
      top: 23px;
      left: 145px;
   }
}
.tipHeader {
   width: 80%;
   height: 220px;
   margin: 15px auto;
   background-color: #f5f5f5;
   position: relative;
   padding: 15px;
   box-sizing: border-box;
   border-radius: 10px;
   cursor: pointer;
   transition: all 0.4s;
   animation: slide-in-top 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
   &:hover {
      box-shadow: 5px 5px 15px #d3d3d3;
   }
   p:nth-child(1) {
      color: #10a37f;
      font-size: 30px;
      font-family: 仿宋;
      width: 65%;
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
      bottom: 15px;
      left: 27px;
      width: 40px;
      height: 40px;
      border-radius: 100%;
      cursor: pointer;
   }
   p:nth-child(4) {
      margin-left: 65px;
      color: grey;
      transform: translate(0, 40px);
   }
   img:nth-child(5) {
      position: absolute;
      top: 20px;
      right: 27px;
      width: 30%;
      height: 80%;
      border-radius: 5%;
      transition: all 0.6s;
      &:hover {
         transform: scale(1.05);
      }
   }
}
.router-link {
   position: absolute;
}
.noComment {
   width: 80%;
   height: 370px;
   margin: 0 auto;
   border-radius: 10px;
   background-color: #f5f5f5;
   text-align: center;
   line-height: 370px;
   color: grey;
}
.tip_container {
   width: 100%;
   height: 610px;
   margin: 0 auto;
}
</style>