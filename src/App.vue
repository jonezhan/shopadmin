<script setup>
// console.log(import.meta.env);
</script>

<template>
  <!-- <button class="btn">Button</button> -->
  <router-view></router-view>
</template>

<style>
/* #nprogress .bar{

} */
body {
  @apply bg-gray-100;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 4px;
  height: 6px;
}
::-webkit-scrollbar-corner {
  display: block;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 8px;
}
::-webkit-scrollbar-thumb {
  border: none;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.5);
}

/* 避免 loading mask 遮住 header */
.el-loading-mask {
  z-index: 1 !important;
}
</style>
