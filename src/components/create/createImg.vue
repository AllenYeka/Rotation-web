<template>
   <div class="container">
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


/* method */
async function createImg() {
   let message = ElMessage.info({ message: '图片正在加载中', icon: 'Loading', duration: 0 })
   const response = await axios.post('/v1/images/generations', dall_e_3, { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + api_key } })
   picture.value = response.data.data[0].url
   setTimeout(function () {
      message.close()
   }, 23000)
}
function sendButton() {
   if (dall_e_3.prompt == '')
      return true
   else
      return false
}
</script>


<style lang='less' scoped>
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