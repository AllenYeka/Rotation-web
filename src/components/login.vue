<template>
   <div class="login_container" v-loading.fullscreen.lock="loginLoading">
      <div class="introduce">
         <img class="bounce-in-top" v-for="item of jojo" :src="item.path" :key="item.id" />
      </div>
      <!-- 登录界面 -->
      <div class="login_box">
         <img class="logo" src="/favicon.ico" width="20%">
         <h1>相信回旋吧!</h1>
         <input v-model="user.name" class="username" @focus="clickStyle($event.target)" />
         <div class="name">用户名</div>
         <input v-model="user.password" type="password" class="password" @focus="clickStyle($event.target)" @keyup.enter="login()" />
         <div class="word">密码</div>
         <el-button @click="login()">Login In</el-button>
         <h5>还没有帐号? <a href="">注册</a></h5>
         <div class="divider">
            <hr>
            <h4>或</h4>
         </div>
         <a class="oauthLogin" :href="github_oauth.getGithubCode">
            <img src="../assets/oauth/github.ico">
            <p>使用Github登录</p>
         </a>
         <a class="oauthLogin" :href="gitee_oauth.getGiteeCode">
            <img src="../assets/oauth/gitee.ico">
            <p>使用Gitee登录</p>
         </a>
      </div>
   </div>
</template>


<script setup>
import { reactive, ref, onMounted, onBeforeMount, inject, provide } from "vue";
import axios from 'axios'
import { ElMessage } from "element-plus"
import { useRouter, useRoute } from "vue-router"
/* data */
const router = useRouter()
const baseImageUri = "/src/assets/image"
const loginLoading = ref(false)
let user = reactive({
   name: '',
   password: '',
   token: '',
   bio: '',
   email: '',
   avatar_url: ''
})
let elClass = reactive({
   nameClass: 'name',
   wordClass: 'word'
})
let jojo = reactive([
   { id: 1, path: baseImageUri + '/j1.jpg' },
   { id: 2, path: baseImageUri + '/j2.jpg' },
   { id: 3, path: baseImageUri + '/j3.jpg' },
   { id: 4, path: baseImageUri + '/j4.jpg' },
   { id: 5, path: baseImageUri + '/j5.jpg' },
   { id: 6, path: baseImageUri + '/j6.jpg' },
])
let gitee_oauth = reactive({
   client_id: '13f223ff6430370d8c1c72f205d012f48683573db683e7b1de977dd9a83743f6',
   client_secret: '3b37caff1a9ba15e9b9cb733570397a84df13c78912b3db31e1da156a3b46c6c',
   redirect_uri: 'http://localhost:5379/',
   grant_type: 'authorization_code',
   code: '',
   getGiteeCode: '/gitee_oauth/oauth/authorize?client_id=13f223ff6430370d8c1c72f205d012f48683573db683e7b1de977dd9a83743f6&redirect_uri=http://localhost:5379/&response_type=code'
})
let github_oauth = reactive({
   client_id: 'Ov23lipUEoYvRhFlGKo0',
   client_secret: '0b0b741c4556c2105d3479ff94e0dae0ae7e9b24',
   redirect_uri: 'http://localhost:5379/',
   grant_type: 'authorization_code',
   code: '',
   getGithubCode: '/github_oauth/login/oauth/authorize?client_id=Ov23lipUEoYvRhFlGKo0&redirect_uri=http://localhost:5379/'
})


/* method */
function oauthLogin() {
   let params = window.location.href.split('?')[1]
   if (params) {
      let param = params.split(/[#&]/)
      for (let i in param) {
         let key_val = param[i].split("=")
         if ('code' == key_val[0]) {
            console.log("授权码-->" + key_val[1])//授权码
            if (key_val[1].length <= 25) {
               github_oauth.code = key_val[1]
               getGithubToken()
            }
            else {
               gitee_oauth.code = key_val[1]
               getGiteeToken()
            }
         }
      }
   }
}
async function getGiteeToken() {
   loginLoading.value = true
   const response = await axios.post("/gitee_oauth/oauth/token", gitee_oauth)
   console.log('gitee的token-->' + response.data.access_token)
   getGiteeUser(response.data.access_token)
}
async function getGiteeUser(token) {
   const response = await axios.get("/gitee_oauth/api/v5/user?access_token=" + token)
   loginLoading.value = false
   console.log("gitee用户-->" + response.data)
   user.name = response.data.name
   user.bio = response.data.bio
   user.email = response.data.email
   user.avatar_url = response.data.avatar_url
   getAccessToken()
}
async function login() {
   if (user.name == '' || user.password == '')
      ElMessage.warning({ message: '用户名或密码不能为空!', duration: 1000 })
   else {
      try {
         const response = await axios.post("/gateway/login", { 'username': user.name, 'password': user.password }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
         if (response.data.status == 'OK') {
            user.token = response.data.token
            localStorage.setItem("token", user.token)
            router.push({ path: "/index", query: user })
            ElMessage.success({ message: '登录成功', duration: 1000 })
         }
         else
            ElMessage.error({ message: '用户不存在或密码错误', duration: 1000 })
      } catch (error) {
         console.log(error)
      }
   }
}
function clickStyle(el) {
   if (el.className == 'username') {
      let elStyle = document.getElementsByClassName('name')[0].style
      elStyle.top = '30.5%'
      elStyle.left = '18%'
      elStyle.color = 'grey'
   }
   else {
      let elStyle = document.getElementsByClassName('word')[0].style
      elStyle.top = '40%'
      elStyle.left = '18%'
      elStyle.color = 'grey'
   }
}
function getGithubToken() {
   loginLoading.value = true
   axios.post("/github_oauth/login/oauth/access_token", github_oauth,).then(
      response => {
         const str = response.data
         const startIndex = str.indexOf("access_token=") + "access_token=".length
         const endIndex = str.indexOf("&", startIndex)
         const accessToken = str.substring(startIndex, endIndex)
         console.log('github的token-->' + accessToken)
         getGithubUser(accessToken)
      },
      error => { console.log(error.message) }
   )
}
function getGithubUser(token) {
   axios.get("/api/github_oauth/user", { headers: { 'Authorization': 'Bearer ' + token } }).then(
      response => {
         loginLoading.value = false
         console.log("github用户-->" + response.data)
         user.name = response.data.name
         user.bio = response.data.bio
         user.email = response.data.email
         user.avatar_url = response.data.avatar_url
         getAccessToken()
      }).catch((error) => { console.log(error); })
}
async function getAccessToken() {//第三方登录时调用
   const response = await axios.get("/gateway/getAccessToken?username=" + user.name)
   user.token = response.data
   localStorage.setItem('token', user.token)
   localStorage.setItem('user', JSON.stringify(user))
   router.push({ path: '/index', query: user })
   ElMessage.success({ message: '登录成功', duration: 1000 })
}



/* 钩子 */
onMounted(() => {
   if (inject('removeToken') == 'remove')
      user.token = ''
   oauthLogin()
})
</script>


<style scoped lang='less'>
/* 变量 */
@name_hover: {
   top: 30.5%;
   left: 18%;
   color: grey;
};
@word_hover: {
   top: 40%;
   left: 18%;
   color: grey;
};
/* 动画 */
@keyframes move {
   0% {
      transform: translate(0, -80%);
   }
   100% {
      transform: translate(0, 0);
   }
}
@keyframes bounce-in-top {
   0% {
      transform: translateY(-500px);
      animation-timing-function: ease-in;
      opacity: 0;
   }
   38% {
      transform: translateY(0);
      animation-timing-function: ease-out;
      opacity: 1;
   }
   55% {
      transform: translateY(-65px);
      animation-timing-function: ease-in;
   }
   72% {
      transform: translateY(0);
      animation-timing-function: ease-out;
   }
   81% {
      transform: translateY(-28px);
      animation-timing-function: ease-in;
   }
   90% {
      transform: translateY(0);
      animation-timing-function: ease-out;
   }
   95% {
      transform: translateY(-8px);
      animation-timing-function: ease-in;
   }
   100% {
      transform: translateY(0);
      animation-timing-function: ease-out;
   }
}
@keyframes rotate-in-center {
   0% {
      transform: rotate(-360deg);
      opacity: 0;
   }
   100% {
      transform: rotate(0);
      opacity: 1;
   }
}
@keyframes roll-in-top {
   0% {
      transform: translateY(-800px) rotate(-540deg);
      opacity: 0;
   }
   100% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
   }
}
@keyframes slide-in-bottom {
   0% {
      transform: translateY(1000px);
      opacity: 0;
   }
   100% {
      transform: translateY(0);
      opacity: 1;
   }
}

/* 样式 */
.username {
   width: 70%;
   height: 7%;
   font-size: 20px;
   padding-left: 10px;
   border: 1px rgba(128, 128, 128, 0.407) solid;
   border-radius: 6px;
   color: grey;
   margin-top: 4%;
   box-sizing: border-box;
   &:hover {
      border: 1px grey solid;
   }
   &:hover + div {
      @name_hover();
   }
}
.password {
   .username;
   &:hover {
      border: 1px grey solid;
   }
   &:hover + div {
      @word_hover();
   }
}
.divider {
   position: relative;
   width: 72%;
   height: 3%;
   margin-top: 3%;
   h4 {
      position: absolute;
      width: 15%;
      height: 100%;
      font-size: 90%;
      background-color: white;
      top: 0%;
      left: 43%;
      padding-left: 4.5%;
      box-sizing: border-box;
   }
}
.oauthLogin {
   width: 70%;
   height: 6%;
   border: 1px rgba(128, 128, 128, 0.407) solid;
   border-radius: 6px;
   cursor: pointer;
   display: flex;
   align-items: center;
   padding-left: 20%;
   box-sizing: border-box;
   margin-top: 3%;
   &:nth-child(10) {
      animation: slide-in-bottom 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
   }
   &:nth-child(11) {
      animation: slide-in-bottom 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
   }
   &:hover {
      box-shadow: inset 0 0 0 150px #0000001a;
   }
   img {
      margin-right: 5%;
      width: 7.5%;
   }
   p {
      color: rgba(0, 0, 0, 0.766);
   }
}
.login_box {
   width: 30%;
   height: 100%;
   position: relative;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-content: center;
   flex-wrap: wrap;
   overflow: hidden;
   .logo {
      position: absolute;
      left: 40%;
      top: 5%;
      animation: roll-in-top 0.6s ease-out both;
   }
   h1 {
      cursor: default;
      text-align: center;
      font-family: 华文行楷;
      font-size: 240%;
      color: rgba(0, 0, 0, 0.642);
      margin-top: 10%;
      transform: translate(0, -0%);
      animation: rotate-in-center 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
   }
   h5 {
      font-size: 14px;
      text-align: center;
      margin-top: 3%;
   }
   .el-button {
      color: white;
      background-color: #10a37f;
      cursor: pointer;
      border: none;
      border-radius: 6px;
      font-size: 100%;
      width: 71.5%;
      height: 6.8%;
      margin-top: 3%;
      &:hover {
         box-shadow: inset 0 0 0 150px #0000001a;
      }
   }
   .name {
      color: rgba(128, 128, 128, 0.407);
      position: absolute;
      top: 34%;
      left: 17%;
      background-color: white;
      font-size: 17px;
      z-index: 1;
      transition: all 0.3s;
      &:hover {
         @name_hover();
      }
   }
   .word {
      color: rgba(128, 128, 128, 0.407);
      position: absolute;
      top: 43.5%;
      left: 17%;
      background-color: white;
      font-size: 17px;
      z-index: 1;
      transition: all 0.3s;
      &:hover {
         @word_hover();
      }
   }
}
.introduce {
   background-color: white;
   width: 70%;
   height: 100%;
   display: flex;
   flex-wrap: wrap;
   .bounce-in-top {
      animation: bounce-in-top 1.1s;
   }
   img {
      height: 50%;
      width: 25%;
      transition: all 0.5s;
      &:hover {
         box-shadow: 5px 5px 10px grey;
         transform: translate(0, -4%);
      }
   }
   img:nth-child(1) {
      animation: move 1 0.6s;
   }
   img:nth-child(2) {
      animation: move 1 0.8s;
   }
   img:nth-child(3) {
      animation: move 1 1s;
   }
   img:nth-child(4) {
      animation: move 1 1.2s;
   }
   img:nth-child(5) {
      width: 50%;
      animation: bounce-in-top 1.4s;
   }
   img:nth-child(6) {
      width: 50%;
      animation: bounce-in-top 1.7s;
   }
}
.login_container {
   display: flex;
   background-color: white;
   width: 100%;
   height: 100%;
}
</style>