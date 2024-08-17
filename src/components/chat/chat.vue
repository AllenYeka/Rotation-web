<template>
   <div class="chat_container">
      <!-- 新增帖子 -->
      <div class="mask" v-show='elShow.createTip'>
         <div class="createTip">
            <el-icon @click="elShow.createTip=false">
               <Close />
            </el-icon>
            <el-form :model="newTip" label-suffix=" :" label-width="80px" :rules="newTip_rules" inline-message='true'>
               <el-form-item label="标题" prop="title">
                  <el-input v-model="newTip.title" />
               </el-form-item>
               <el-form-item label="描述" prop="description">
                  <el-input type="textarea" rows="4" v-model="newTip.description" />
               </el-form-item>
               <el-form-item label="封面" prop="file">
                  <el-upload :auto-upload='false' :limit="1" list-type="picture-card" :on-change="getFile">
                     <Plus class="plus" />
                  </el-upload>
               </el-form-item>
               <el-button @click="insertTip()">提交</el-button>
            </el-form>
         </div>
      </div>
      <el-button @click='elShow.createTip=true'>发布帖子</el-button>
      <!-- 帖子 -->
      <el-scrollbar height="640px">
         <div class="tip" v-for='tip of tips' :key='tip.tipId' @click='enterTip(tip.tipId)'>
            <p>{{tip.title}}</p>
            <p>{{tip.description}}</p>
            <img :src="tip.tipPicture" />
            <img :src="tip.avatarUrl" />
            <p>{{tip.username}}</p>
         </div>
      </el-scrollbar>
   </div>
</template>


<script setup>
import { onMounted, reactive } from "vue"
import { useRoute, useRouter } from "vue-router"
import axios from 'axios'


/* data */
const router = useRouter()
const baseURL = '/rotation/api/content'
let myMedia = JSON.parse(localStorage.getItem('myMedia'))
let elShow = reactive({
   createTip: false
})
let newTip = reactive({
   title: '',
   description: '',
   file: ''
})
let newTip_rules = reactive({
   title: [
      { required: true, message: "请输入标题", trigger: 'blur' },
      { min: 1, max: 24, message: '长度在3到24之间', trigger: 'blur' }
   ],
   description: [
      { required: true, message: "请输入描述信息", trigger: 'blur' },
      { min: 5, max: 120, message: '长度在5到120之间', trigger: 'blur' }
   ],
   file: [
      { required: true, message: "请选取封面", trigger: 'blur' },
   ],
})
let tips = reactive([
   { tipId: 1, title: '回旋是怎么练成的', username: '杰洛.齐贝林', avatarUrl: 'https://avatars.githubusercontent.com/u/94109480?v=4', description: '这是一则重生的故事...而今回想起来,在这趟旅程中我总是一直祈祷...祈祷明天的天气、祈祷有安枕之地以及有粮食可以果腹...一边重复着这些理所当然的事,一边祈祷好友及坐骑平安无事,渡过一条又一条河流...如今终于跨越最后一条河流', tipPicture: '/src/assets/image/j5.jpg' },
   { tipId: 2, title: 'chatgpt现在允许免费用户每天最多生成两张由dall-e-3制作的图片', username: 'jojo', avatarUrl: 'http://127.0.0.1:9000/wrq/hsy.jpg', description: 'OpenAI 表示,使用《DALL-E 3》创建图像的功能正在"推出",但您可能已经可以使用了:在撰写本文时,在尝试使用 ChatGPT Mac 应用程序创建了两张图像后收到通知,说已经达到了当天的图像创建上限', tipPicture: 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1ouckW.img?w=673&h=1119&m=6' },
   { tipId: 3, title: 'Madao观察日记', username: '乔尼.乔斯达', avatarUrl: 'https://foruda.gitee.com/avatar/1719841511744367127/11729822_wangriqing_1719841511.png!avatar100', description: '暑假做了关于Madao的观察日记,MADAO是公园的主人,长着胡子戴着墨镜的生物,基本一整天都不干活在公园里呆着...', tipPicture: '/src/assets/image/803.jpg' },
   { tipId: 4, title: '广西一景区突发事故,1人遇难60人受伤', username: '乔尼.乔斯达', avatarUrl: 'https://foruda.gitee.com/avatar/1719841511744367127/11729822_wangriqing_1719841511.png!avatar100', description: '2024年8月10日13时56分，广西德天瀑布景区登高观瀑魔毯项目发生故障.经初步核实,截至18时30分,事故造成1名游客死亡,60名游客受伤(其中,重伤1名,轻伤59名),受伤游客已送往医院治疗.', tipPicture: '/src/assets/image/j6.jpg' }
])

/* method */
function enterTip(tipId) {
   router.push({ name: 'tip', query: { tipId: tipId } })
}
function getAllSimpleTip() {//获取帖子列表
   tips.splice(0, tips.length)
   axios.get(baseURL + '/getAllSimpleTip').then(
      response => {
         Object.assign(tips,response.data)
      }).catch(() => {
         tips.push({ tipId: 1, title: '回旋是怎么练成的', username: '杰洛.齐贝林', avatarUrl: 'https://avatars.githubusercontent.com/u/94109480?v=4', description: '这是一则重生的故事...而今回想起来,在这趟旅程中我总是一直祈祷...祈祷明天的天气、祈祷有安枕之地以及有粮食可以果腹...一边重复着这些理所当然的事,一边祈祷好友及坐骑平安无事,渡过一条又一条河流...如今终于跨越最后一条河流', tipPicture: '/src/assets/image/j5.jpg' })
         tips.push({ tipId: 2, title: 'chatgpt现在允许免费用户每天最多生成两张由dall-e-3制作的图片', username: 'jojo', avatarUrl: 'http://127.0.0.1:9000/wrq/hsy.jpg', description: 'OpenAI 表示,使用《DALL-E 3》创建图像的功能正在"推出",但您可能已经可以使用了:在撰写本文时,在尝试使用 ChatGPT Mac 应用程序创建了两张图像后收到通知,说已经达到了当天的图像创建上限', tipPicture: 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1ouckW.img?w=673&h=1119&m=6' })
         tips.push({ tipId: 3, title: 'Madao观察日记', username: '乔尼.乔斯达', avatarUrl: 'https://foruda.gitee.com/avatar/1719841511744367127/11729822_wangriqing_1719841511.png!avatar100', description: '暑假做了关于Madao的观察日记,MADAO是公园的主人,长着胡子戴着墨镜的生物,基本一整天都不干活在公园里呆着...', tipPicture: '/src/assets/image/803.jpg' })
         tips.push({ tipId: 4, title: '广西一景区突发事故,1人遇难60人受伤', username: '乔尼.乔斯达', avatarUrl: 'https://foruda.gitee.com/avatar/1719841511744367127/11729822_wangriqing_1719841511.png!avatar100', description: '2024年8月10日13时56分，广西德天瀑布景区登高观瀑魔毯项目发生故障.经初步核实,截至18时30分,事故造成1名游客死亡,60名游客受伤(其中,重伤1名,轻伤59名),受伤游客已送往医院治疗.', tipPicture: '/src/assets/image/j6.jpg' })
      })
}
function getFile(file) {//通过el-upload组件的on-change属性获取要上传的文件
   newTip.file = file.raw
   console.log(newTip.file)
}
async function insertTip() {
   const response = await axios.post(baseURL + '/insertTip', { title: newTip.title, uid: myMedia.id, username: myMedia.username, avatarUrl: myMedia.avatarUrl, description: newTip.description, file: newTip.file }, { headers: { "Content-Type": 'multipart/form-data' } })
   location.reload()
   elShow.createTip = false
}


/* 钩子 */
onMounted(() => {
   getAllSimpleTip()
})

</script>


<style lang='less' scoped>
@keyframes slide-in-elliptic-top-fwd {
   0% {
      -webkit-transform: translateY(-600px) rotateX(-30deg) scale(0);
      transform: translateY(-600px) rotateX(-30deg) scale(0);
      -webkit-transform-origin: 50% 100%;
      transform-origin: 50% 100%;
      opacity: 0;
   }
   100% {
      -webkit-transform: translateY(0) rotateX(0) scale(1);
      transform: translateY(0) rotateX(0) scale(1);
      -webkit-transform-origin: 50% 1400px;
      transform-origin: 50% 1400px;
      opacity: 1;
   }
}
.createTip {
   padding: 30px;
   position: absolute;
   border-radius: 0.8%;
   z-index: 5;
   top: 100px;
   width: 600px;
   height: 400px;
   background-color: whitesmoke;
   overflow: hidden;
   animation: slide-in-elliptic-top-fwd 0.3s
      cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
   .el-button {
      --el-button-hover-text-color: #33af90;
      transform: translate(200px, 10px);
   }
   .el-form {
      width: 80%;
      height: 80%;
      margin: 20px auto;
      .el-upload--picture-card {
         &:hover {
            border: 1px dashed #33af90;
         }
      }
      .el-input {
         --el-input-focus-border-color: #33af90;
      }
      .el-textarea {
         --el-input-focus-border-color: #33af90;
      }
   }
   .el-icon:nth-child(1) {
      position: absolute;
      font-size: 25px;
      padding: 4px;
      color: grey;
      transition: all 0.3s;
      transform: translate(595px, -30px);
      &:hover {
         background-color: red;
         color: white;
      }
   }
   .plus {
      color: grey;
      width: 50px;
      height: 50px;
   }
}
.el-button {
   position: fixed;
   z-index: 3;
   color: #33af90;
   --el-button-hover-text-color: #33af90;
   &:hover {
      box-shadow: 5px 5px 50px #dad7d7 inset;
   }
}
.tip {
   width: 83%;
   height: 180px;
   margin: 20px auto;
   padding: 15px;
   box-sizing: border-box;
   background-color: #f6f6f6;
   border-radius: 10px;
   transition: all 0.3s;
   position: relative;
   &:hover {
      cursor: pointer;
      transform: translate(0, -5px);
      box-shadow: 10px 10px 10px rgba(128, 128, 128, 0.26);
   }
   p:nth-child(1) {
      color: #10a37f;
      font-size: 28px;
      font-family: 仿宋;
      width: 63%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
   }
   p:nth-child(2) {
      margin-top: 15px;
      color: grey;
      font-family: 楷体;
      font-size: 17px;
      width: 57%;
      height: 60px;
      overflow: hidden;
   }
   img:nth-child(3) {
      position: absolute;
      top: 13px;
      right: 13px;
      width: 20%;
      height: 80%;
   }
   img:nth-child(4) {
      position: absolute;
      bottom: 5px;
      left: 13px;
      width: 35px;
      height: 35px;
      border-radius: 100%;
   }
   p:nth-child(5) {
      margin-top: 25px;
      margin-left: 40px;
      color: grey;
      font-size: 12px;
      width: 57%;
      height: 60px;
      overflow: hidden;
   }
}
.chat_container {
   width: 100%;
   margin: 0 auto;
   height: 100%;
}
</style>