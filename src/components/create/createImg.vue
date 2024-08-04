<template>
   <div class="container">
      <div class="createLoading" v-show='elShow.createLoading'>
         <svg t="1722763284471" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5656">
            <path d="M176.74494898 706.33511834a134.30784 134.30784 0 0 1 189.99789505 0.05792619A134.3488 134.3488 0 0 1 176.84631981 896.40542112c-52.43768125-52.55353362-52.53905208-137.63262154-0.10137083-190.07030278z m62.58924561-275.43902163a120.6272 120.6272 0 0 0-85.48457122-35.46530831 120.89344 120.89344 0 0 0-120.8485087 120.8485087 120.44288 120.44288 0 0 0 35.4653083 85.48457123 120.4224 120.4224 0 0 0 85.39768195 35.37841902 120.89344 120.89344 0 0 0 120.8485087-120.8485087 120.66816 120.66816 0 0 0-35.37841903-85.39768194z m-43.50256682-123.4407056c41.95304131 41.86615203 110.11768247 41.96752285 152.04176068 0.04344464a107.6224 107.6224 0 0 0 0.01448155-152.09968686 107.45856 107.45856 0 0 0-152.05624223 0.05792618 107.47904 107.47904 0 0 0 0 151.99831604z m294.30847722-127.56794645a93.5936 93.5936 0 0 0 66.571671 27.47149443 93.83936 93.83936 0 0 0 93.92731305-93.92731306 93.42976 93.42976 0 0 0-27.57286525-66.47030017c-16.91444675-16.91444675-40.47592353-27.5873468-66.57167101-27.47149443a93.96224 93.96224 0 0 0-93.9417946 93.9417946 94.53568 94.53568 0 0 0 27.58734681 66.45581863z m294.46777423 108.52471231a80.6912 80.6912 0 0 0 113.8973662-0.04344464A80.42496 80.42496 0 0 0 898.50524542 174.42790148a80.4864 80.4864 0 0 0-113.82495847 0 80.67072 80.67072 0 0 0-0.08688928 113.99873703z m127.69828037 275.41005854c12.16449938 12.16449938 29.09342768 19.59353293 47.61532614 19.63697756a67.1744 67.1744 0 0 0 47.52843686-114.66488818c-12.12105474-12.12105474-28.96309376-19.69490376-47.52843686-19.69490376-37.1306862 0.08688928-67.29574835 30.16506215-67.19437752 67.19437752a66.39616 66.39616 0 0 0 19.59353293 47.51395531zM803.79592883 839.30468178a53.6576 53.6576 0 1 0 75.89778719-75.89778719 53.57568 53.57568 0 0 0-75.89778719-0.10137083 53.6576 53.6576 0 0 0 0 75.99915802z m-218.46861621 51.61223307c-1.81019336-1.81019336-4.28653788-2.83838319-6.37188063-4.34446406-6.45876991-4.25757478-13.78643263-7.47247819-22.12780363-7.47247819a40.30464 40.30464 0 1 0 28.49968426 11.81694225z" p-id="5657"></path>
         </svg>
         <p>图片正在加载中...</p>
      </div>
      <img :src='picture'>
      <div class="operation">
         <el-input v-model='dall_e_3.prompt'></el-input>
         <el-button icon="Position" type="success" @click='createImg()' :disabled='sendButton()'></el-button>
      </div>
   </div>
</template>


<script setup>
import { ref, reactive } from "vue"
import axios from 'axios'
import { ElMessage } from "element-plus"


/* data */
let api_key = 'hk-s6vh29100003214872b98abc265f09731c8640024ce9907a'
let dall_e_3 = reactive({
   model: 'dall-e-3',
   prompt: '画一个二次元美少女',
   n: 1,
   size: '1024x1024'
})
let picture = ref('/src/assets/image/j7.jpg')
let elShow = reactive({
   createLoading: false
})


/* method */
async function createImg() {
   let el = document.getElementsByClassName('container')[0].getElementsByTagName('img')[0]
   elShow.createLoading = true
   const response = await axios.post('/v1/images/generations', dall_e_3, { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + api_key } })
   el.style.opacity = '1'
   picture.value = response.data.data[0].url
   elShow.createLoading = false
}
function sendButton() {
   if (dall_e_3.prompt == '')
      return true
   else
      return false
}
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
.createLoading {
   position: absolute;
   top: 300px;
   width: 200px;
   height: 60px;
   background-color: grey;
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
img {
   width: 570px;
   height: 570px;
   opacity: 0.3;
   border: grey solid 1px;
}
.el-input {
   width: 500px;
   height: 60%;
   margin-right: 10px;
}
.el-button {
   color: white;
   background-color: #10a37f;
   border: none;
   height: 56%;
   width: 11%;
   &:hover {
      box-shadow: inset 0 0 0 150px #0000001a;
   }
}
.container {
   width: 96%;
   height: 100%;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: space-between;
   .operation {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 570px;
      height: 70px;
   }
}
</style>