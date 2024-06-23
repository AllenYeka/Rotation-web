<template>
   <el-button class="bounce-in-top" type="danger">findVideo</el-button>
</template>


<script setup>
import { reactive } from 'vue'

</script>


<style lang='less' scoped>
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

.bounce-in-top {
   animation: bounce-in-top 1.1s;
}
</style>