<script setup>
import ImageAside from "@/components/ImageAside.vue";
import ImageMain from "@/components/ImageMain.vue";
import { ref, computed, onMounted, watch } from "vue";

const windowHeight = window.innerHeight || document.body.clientHeight;
const h = windowHeight - 64 - 44 - 40;

const ImageAsideRef = ref(null);
const ImageMainRef = ref(null);

function handleCreate() {
  ImageAsideRef.value.handleCreate();
}
function openUploadFile() {
  ImageMainRef.value.openUploadFile();
}

const activeId = ref(0);
// onMounted(() => {
//   // activeId.value = ImageAsideRef.value.activeId;
//   console.log(ImageAsideRef.value.activeId);
// });
// activeId.value = computed(() => {
//   return ref(ImageAsideRef.value.activeId);
// });
// watch(
//   () => activeId.value,
//   (newVal, oldVal) => {
//     console.log("activeId", newVal, oldVal);
//   }
// );
function changeActiveId(id) {
  // console.log(id);
  ImageMainRef.value.loadData(id);
}
</script>

<template>
  <el-container :style="{ height: h + 'px' }" class="bg-white rounded">
    <el-header class="image-header">
      <el-button type="primary" size="small" @click="handleCreate">
        新增分类
      </el-button>
      <el-button type="warning" size="small" @click="openUploadFile">
        上传图片
      </el-button>
    </el-header>
    <el-container>
      <ImageAside
        @changeActiveId="changeActiveId"
        ref="ImageAsideRef"
      ></ImageAside>
      <ImageMain ref="ImageMainRef" :id="0"></ImageMain>
    </el-container>
  </el-container>
</template>
<style>
.image-header {
  border-bottom: 1px solid #ebeef5;
  @apply flex items-center;
}
.image-aside,
.image-main {
  border-right: 1px solid #ebeef5;
  position: relative;
  & .top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
    overflow-y: auto;
  }
  & .bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    @apply flex items-center justify-center;
  }
}
.image-main {
  border-right: none;
}
</style>
