<template>
   <div class="container">
      <div class="mask" v-show="elShow.mask.loading">
         <div class="createLoading" v-show='elShow.mask.loading'>
            <svg t="1722763284471" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5656">
               <path d="M176.74494898 706.33511834a134.30784 134.30784 0 0 1 189.99789505 0.05792619A134.3488 134.3488 0 0 1 176.84631981 896.40542112c-52.43768125-52.55353362-52.53905208-137.63262154-0.10137083-190.07030278z m62.58924561-275.43902163a120.6272 120.6272 0 0 0-85.48457122-35.46530831 120.89344 120.89344 0 0 0-120.8485087 120.8485087 120.44288 120.44288 0 0 0 35.4653083 85.48457123 120.4224 120.4224 0 0 0 85.39768195 35.37841902 120.89344 120.89344 0 0 0 120.8485087-120.8485087 120.66816 120.66816 0 0 0-35.37841903-85.39768194z m-43.50256682-123.4407056c41.95304131 41.86615203 110.11768247 41.96752285 152.04176068 0.04344464a107.6224 107.6224 0 0 0 0.01448155-152.09968686 107.45856 107.45856 0 0 0-152.05624223 0.05792618 107.47904 107.47904 0 0 0 0 151.99831604z m294.30847722-127.56794645a93.5936 93.5936 0 0 0 66.571671 27.47149443 93.83936 93.83936 0 0 0 93.92731305-93.92731306 93.42976 93.42976 0 0 0-27.57286525-66.47030017c-16.91444675-16.91444675-40.47592353-27.5873468-66.57167101-27.47149443a93.96224 93.96224 0 0 0-93.9417946 93.9417946 94.53568 94.53568 0 0 0 27.58734681 66.45581863z m294.46777423 108.52471231a80.6912 80.6912 0 0 0 113.8973662-0.04344464A80.42496 80.42496 0 0 0 898.50524542 174.42790148a80.4864 80.4864 0 0 0-113.82495847 0 80.67072 80.67072 0 0 0-0.08688928 113.99873703z m127.69828037 275.41005854c12.16449938 12.16449938 29.09342768 19.59353293 47.61532614 19.63697756a67.1744 67.1744 0 0 0 47.52843686-114.66488818c-12.12105474-12.12105474-28.96309376-19.69490376-47.52843686-19.69490376-37.1306862 0.08688928-67.29574835 30.16506215-67.19437752 67.19437752a66.39616 66.39616 0 0 0 19.59353293 47.51395531zM803.79592883 839.30468178a53.6576 53.6576 0 1 0 75.89778719-75.89778719 53.57568 53.57568 0 0 0-75.89778719-0.10137083 53.6576 53.6576 0 0 0 0 75.99915802z m-218.46861621 51.61223307c-1.81019336-1.81019336-4.28653788-2.83838319-6.37188063-4.34446406-6.45876991-4.25757478-13.78643263-7.47247819-22.12780363-7.47247819a40.30464 40.30464 0 1 0 28.49968426 11.81694225z" p-id="5657"></path>
            </svg>
            <p>图片正在加载中...</p>
         </div>
      </div>
      <!-- 绘画历史 -->
      <el-scrollbar class="el-scrollbar-imgList">
         <div class="imgInfo" v-for="imgInfo in imgList" :key="imgInfo.id" @click.self="changeImg(imgInfo,$event.target)">
            <p @click.self="changeImg(imgInfo,$event.target.parentNode)">{{imgInfo.prompt}}</p>
         </div>
      </el-scrollbar>
      <!-- 展示的图片 -->
      <img :src='picture'>
      <a :href="picture" download="rotation.jpg">下载</a>
      <!-- 提示词 -->
      <div class="operation">
         <el-input v-model='dall_e_3.prompt'></el-input>
         <el-button icon="Position" type="success" @click='createImg()' :disabled="dall_e_3.prompt == ''?true:false"></el-button>
      </div>
   </div>
</template>


<script setup>
import { ref, reactive, onMounted, nextTick } from "vue"
import axios from 'axios'
import { ElMessage } from "element-plus"
/* data */
const api_key = 'hk-s6vh29100003214872b98abc265f09731c8640024ce9907a'
let picture = ref('/src/assets/image/jojo.jpg')
const dall_e_3 = reactive({
   model: 'dall-e-3',
   prompt: '一个二次元美少女',
   n: 1,
   size: '1024x1024'
})
const elShow = reactive({
   mask: { loading: false }
})
const imgList = reactive([
   { id: 1, prompt: '二次元短裙美少女', url: '/src/assets/dall3/2024-12-14.jpg' },
   { id: 2, prompt: 'hsy', url: '/src/assets/image/hsy.jpg' },
   { id: 3, prompt: '花田 少女 简笔', url: '/src/assets/dall3/2024-12-14 (2).jpg' },
   { id: 4, prompt: '白丝', url: '/src/assets/dall3/2024-12-14 (3).jpg' },
   { id: 5, prompt: '美腿', url: '/src/assets/dall3/2024-12-15.jpg' }
])


/* method */
async function createImg() {
   const el = document.getElementsByClassName('container')[0].getElementsByTagName('img')[0]
   elShow.mask.loading = true
   try {
      const response = await axios.post('/api/v1/images/generations', dall_e_3, { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + api_key } })
      picture.value = response.data.data[0].url
      imgList.push({ id: Math.floor(100000 + Math.random() * 900000), prompt: dall_e_3.prompt, url: response.data.data[0].url })
      sessionStorage.setItem('imgList', JSON.stringify(imgList))
      setTimeout(() => { elShow.mask.loading = false }, 3000)
   } catch (e) {
      ElMessage.error({ message: e })
      elShow.mask.loading = false
      return
   }
}
function changeImg(imgInfo, el) {
   picture.value = imgInfo.url
   const elList = document.getElementsByClassName('imgInfo')
   for (let i = 0; i < elList.length; i++)
      elList[i].getElementsByTagName('p')[0].style.color = 'rgba(0, 0, 0, 0.645)'
   el.getElementsByTagName('p')[0].style.color = '#10a37f'
}

/* 钩子 */
onMounted(() => {
   if (sessionStorage.getItem('imgList') != null) {
      imgList.splice(0, imgList.length)
      imgList.push(...JSON.parse(sessionStorage.getItem('imgList')))
   }
})
</script>


<style lang='less' scoped>
@keyframes turn {
   0% {
      transform: rotate(0deg);
   }
   100% {
      transform: rotate(-360deg);
   }
}
.el-scrollbar-imgList {
   border-radius: 5px;
   border: 1px solid #10a37e9a;
   margin-top: 40px;
   margin-left: 40px;
   width: 23%;
   height: 78%;
   display: inline-block;
   box-sizing: border-box;
   background: url('/src/assets/image/AI绘画.jpg') 0px 0px / cover;
   opacity: 0.7;
   .imgInfo {
      width: 280px;
      height: 55px;
      box-sizing: border-box;
      margin: 14px auto;
      border-radius: 5px;
      border: solid #10a37e9a 1px;
      transition: all 0.4s;
      &:hover {
         transform: translate(0, -3px);
         box-shadow: 3px 3px 8px #10a37e54;
         cursor: pointer;
      }
      p {
         margin-top: 15px;
         font-size: 15px;
         text-align: center;
         color: rgba(0, 0, 0, 0.925);
         font-family: 仿宋;
         text-overflow: ellipsis;
         overflow: hidden;
         white-space: nowrap;
         padding: 0 15px;
         &:hover {
            cursor: pointer;
         }
      }
   }
   ::v-deep(.el-scrollbar__thumb) {
      background-color: #e7f0e9;
   }
}
img {
   border-radius: 5px;
   width: 570px;
   height: 580px;
   border: rgba(128, 128, 128, 0.464) solid 1px;
   position: absolute;
   left: 560px;
   top: 40px;
}
.operation {
   transform: translate(408px);
   display: flex;
   align-items: center;
   justify-content: center;
   width: 570px;
   height: 70px;
}
.el-input {
   width: 500px;
   height: 60%;
   margin-right: 10px;
   --el-input-focus-border-color: #10a37e;
}
.el-button {
   color: white;
   background-color: #10a37f;
   border: none;
   height: 55%;
   width: 13%;
   &:hover {
      box-shadow: inset 0 0 0 150px #0000001a;
   }
}
a {
   position: absolute;
   left: 1090px;
   bottom: 135px;
   font-size: 14px;
}
.createLoading {
   position: absolute;
   z-index: 2;
   opacity: 0.6;
   left: 740px;
   top: 300px;
   width: 200px;
   height: 60px;
   background-color: #aaada8;
   display: flex;
   justify-content: center;
   border-radius: 5%;
   p {
      margin-left: 15px;
      margin-top: 20px;
   }
   .icon {
      width: 30px;
      animation: turn 2s linear infinite;
   }
}
.container {
   width: 100%;
   height: 100%;
}
</style>