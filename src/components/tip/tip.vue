<template>
   <div class="tipContainer">
      <!-- 新增帖子 -->
      <div class="mask" v-show='elShow.mask.createTip' @click.self="elShow.mask.createTip=false">
         <el-form ref='newTipRef' :model="newTip" label-suffix=" :" label-width="80px" :rules="newTipRules" inline-message='true'>
            <el-form-item label="标题" prop="title">
               <el-input v-model="newTip.title" />
            </el-form-item>
            <el-form-item label="描述" prop="description">
               <el-input type="textarea" rows="4" resize='none' v-model="newTip.description" />
            </el-form-item>
            <el-form-item label="封面" prop="file">
               <el-upload :auto-upload='false' :limit="1" list-type="picture-card" :on-change="getFile">
                  <Plus class="plus" />
               </el-upload>
            </el-form-item>
            <el-button @click="addTip()" type="primary" :loading="elLoading.addTip">提交</el-button>
         </el-form>
      </div>
      <el-button type="primary" @click='elShow.mask.createTip=true'>发布帖子</el-button>
      <!-- 帖子 -->
      <el-scrollbar>
         <div class="tip" v-for='(tip,index) of tipList' :key='tip.id' @click='enterTip(index)'>
            <p>{{tip.title}}</p>
            <p>{{tip.description}}</p>
            <img :src="tip.cover" />
            <img :src="tip.avatar" />
            <p>{{tip.nickname}}</p>
         </div>
      </el-scrollbar>
      <!-- 分页 -->
      <el-pagination layout="prev, pager, next" :page-size="5" :total="tipTotal" v-model:current-page="currentPage" @current-change="getTipList(currentPage)" />
   </div>
</template>


<script setup>
import { onMounted, reactive, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import axios from 'axios'
import { ElMessage } from "element-plus"

/* data */
const router = useRouter()
const baseURL = '/rotation/api/content'
let currentPage = ref(1)
let tipTotal = ref()
const user = JSON.parse(sessionStorage.getItem('user'))
const elShow = reactive({
   mask: { createTip: false }
})
const elLoading = reactive({
   addTip: false
})
const newTipRef = ref()
const newTip = reactive({
   title: '',
   description: '',
   cover: '',
   file: ''
})
const newTipRules = reactive({
   title: [
      { required: true, message: "请输入标题", trigger: 'blur' },
      { min: 3, max: 24, message: '长度在3到24之间', trigger: 'blur' }
   ],
   description: [
      { required: true, message: "请输入描述信息", trigger: 'blur' },
      { min: 5, max: 120, message: '长度在5到120之间', trigger: 'blur' }
   ],
   file: [
      { required: true, message: "请选取封面", trigger: 'blur' },
   ],
})
const tipList = reactive([
   { id: 1, title: '回旋是怎么练成的', creator: 1, nickname: '杰洛.齐贝林', avatar: 'https://avatars.githubusercontent.com/u/94109480?v=4', description: '这是一则重生的故事...而今回想起来,在这趟旅程中我总是一直祈祷...祈祷明天的天气、祈祷有安枕之地以及有粮食可以果腹...一边重复着这些理所当然的事,一边祈祷好友平安无事,渡过一条又一条河流...如今终于跨越最后一条河流', cover: '/src/assets/image/j5.jpg' },
   { id: 2, title: 'chatgpt现在允许免费用户每天最多生成两张由dall-e-3制作的图片', creator: 1, nickname: '胡桃', avatar: '/src/assets/image/hsy.jpg', description: 'OpenAI 表示,使用《DALL-E 3》创建图像的功能正在"推出",但您可能已经可以使用了:在撰写本文时,在尝试使用 ChatGPT Mac 应用程序创建了两张图像后收到通知,说已经达到了当天的图像创建上限', cover: 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1ouckW.img?w=673&h=1119&m=6' },
   { id: 3, title: 'Madao观察日记', creator: 1, nickname: '乔尼.乔斯达', avatar: 'https://foruda.gitee.com/avatar/1719841511744367127/11729822_wangriqing_1719841511.png!avatar100', description: '暑假做了关于Madao的观察日记,MADAO是公园的主人,长着胡子戴着墨镜的生物,基本一整天都不干活在公园里呆着...', cover: '/src/assets/image/803.jpg' },
   { id: 4, title: '广西一景区突发事故,1人遇难60人受伤', creator: 2, nickname: '乔尼.乔斯达', avatar: 'https://foruda.gitee.com/avatar/1719841511744367127/11729822_wangriqing_1719841511.png!avatar100', description: '2024年8月10日13时56分，广西德天瀑布景区登高观瀑魔毯项目发生故障.经初步核实,截至18时30分,事故造成1名游客死亡,60名游客受伤(其中,重伤1名,轻伤59名),受伤游客已送往医院治疗.', cover: '/src/assets/image/jojo.jpg' },
   { id: 5, title: '回旋是怎么练成的', creator: 6, nickname: '杰洛.齐贝林', avatar: 'https://avatars.githubusercontent.com/u/94109480?v=4', description: '这是一则重生的故事...而今回想起来,在这趟旅程中我总是一直祈祷...祈祷明天的天气、祈祷有安枕之地以及有粮食可以果腹...一边重复着这些理所当然的事,一边祈祷好友平安无事,渡过一条又一条河流...如今终于跨越最后一条河流', cover: '/src/assets/image/j5.jpg' },
   { id: 6, title: 'chatgpt现在允许免费用户每天最多生成两张由dall-e-3制作的图片', creator: 6, nickname: '胡桃', avatar: '/src/assets/image/hsy.jpg', description: 'OpenAI 表示,使用《DALL-E 3》创建图像的功能正在"推出",但您可能已经可以使用了:在撰写本文时,在尝试使用 ChatGPT Mac 应用程序创建了两张图像后收到通知,说已经达到了当天的图像创建上限', cover: 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1ouckW.img?w=673&h=1119&m=6' }
])
const localTipList = []


/* method */
function enterTip(index) {
   const tip = tipList[index]
   router.push({ path: '/comment', query: { tip: encodeURI(JSON.stringify(tip)) } })
}
async function getTipList(pageNo) {//获取帖子列表
   try {
      const response = await axios.get(baseURL + '/tipList', { params: { pageNo } })
      if (response.data.status != 200) {
         ElMessage.error({ message: response.data.msg })
         return
      }
      tipList.splice(0, tipList.length)
      tipList.push(...response.data.dataList.list)
      tipTotal.value = response.data.dataList.total
   } catch (e) {
      ElMessage.error({ message: e, duration: 400 })
      tipList.splice(0, tipList.length)
      tipList.push(...localTipList.filter((item) => { return item.id > (pageNo - 1) * 5 && item.id <= pageNo * 5 }))
      tipTotal.value = localTipList.length
      return
   }
}
function getFile(file) {//通过el-upload组件的on-change属性获取要上传的文件
   newTip.file = file.raw
   newTip.cover = "http://127.0.0.1:9000/tip/" + file.name
   console.log(newTip.file)
}
function addTip() {
   newTipRef.value.validate(async (valid) => {
      if (valid) {
         try {
            elLoading.addTip = true
            const response = await axios.post(baseURL + '/addTip', { creator: user.id, ...newTip }, { headers: { "Content-Type": 'multipart/form-data' } })
            if (response.data.status != 200) {
               ElMessage.error({ message: response.data.msg })
               elLoading.addTip = false
               elShow.mask.createTip = false
               return
            }
            tipList.push({ id: response.data.dataList, title: newTip.title, creator: user.id, nickname: user.nickname, avatar: user.avatar, cover: newTip.cover })
            ElMessage.success({ message: '上传成功' })
         } catch (e) {
            ElMessage.error({ message: e })
         }
         finally {
            elLoading.addTip = false
            elShow.mask.createTip = false
         }
      }
   })
}


/* 钩子 */
onMounted(() => {
   Object.assign(localTipList, tipList)
   getTipList(1)
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
.el-form {
   padding: 50px;
   border-radius: 1%;
   z-index: 5;
   width: 500px;
   height: 400px;
   background-color: whitesmoke;
   overflow: hidden;
   animation: slide-in-elliptic-top-fwd 0.3s
      cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
   .el-button {
      --el-button-bg-color: #10a37fed;
      --el-button-border-color: #10a37fed;
      --el-button-hover-bg-color: #1d9d7e;
      --el-button-hover-border-color: #1d9d7e;
      --el-button-active-bg-color: #10a37fed;
      --el-button-active-border-color: #10a37fed;
      transform: translate(80px, 30px);
   }
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
   .plus {
      color: grey;
      width: 50px;
      height: 50px;
   }
}
.el-button {
   position: fixed;
   left: 170px;
   z-index: 3;
   height: 35px;
   --el-button-bg-color: #10a37fed;
   --el-button-border-color: #10a37fed;
   --el-button-hover-bg-color: #1d9d7e;
   --el-button-hover-border-color: #1d9d7e;
   --el-button-active-bg-color: #10a37fed;
   --el-button-active-border-color: #10a37fed;
}
.el-scrollbar {
   height: 650px;
   margin-top: 30px;
   .tip {
      width: 80%;
      height: 200px;
      margin: 20px auto;
      padding: 15px;
      box-sizing: border-box;
      background-color: rgba(144, 238, 144, 0.271);
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
         font-size: 27px;
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
         width: 27%;
         height: 86%;
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
         margin-top: 48px;
         margin-left: 40px;
         color: grey;
         font-size: 12px;
         width: 57%;
         height: 60px;
         overflow: hidden;
      }
   }
}
::v-deep(.el-scrollbar__thumb) {
   background-color: transparent;
}
.el-pagination {
   --el-pagination-bg-color: transparent;
   --el-pagination-button-disabled-bg-color: transparent;
   --el-pagination-hover-color: rgba(0, 128, 0, 0.456);
   position: absolute;
   bottom: 10px;
   left: 720px;
   width: 400px;
}
.tipContainer {
   width: 100%;
   height: 100%;
   padding: 10px;
   box-sizing: border-box;
}
</style>