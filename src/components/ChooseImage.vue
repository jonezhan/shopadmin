<script setup>
import { ref, computed, onMounted, watch } from "vue";

import ImageAside from "@/components/ImageAside.vue";
import ImageMain from "@/components/ImageMain.vue";

const windowHeight = window.innerHeight || document.body.clientHeight;
const h = windowHeight - 64 - 44 - 40 - 40;

const ImageAsideRef = ref(null);
const ImageMainRef = ref(null);

function handleCreate() {
  ImageAsideRef.value.handleCreate();
}
function openUploadFile() {
  ImageMainRef.value.openUploadFile();
}
function changeActiveId(id) {
  // console.log(id);
  ImageMainRef.value.loadData(id);
}

const dialogVisible = ref(false);
const callFunc = ref(null);
function open(callFunctmp = null) {
  // ImageMainRef.value.checkListValue.length = 0;
  // console.log(checkListValue.value);

  // ImageMainRef.value.resetCheckList();

  // 为Editor组件提供的方法参数
  callFunc.value = callFunctmp;
  dialogVisible.value = true;
}
function close() {
  // console.log(ImageMainRef.value.checkList);
  dialogVisible.value = false;
}
const imgSrc = defineModel();
// Array.isArray(imgSrc.value);
const imgType = Array.isArray(imgSrc.value) ? 0 : 1;
// console.log(imgType);

async function setImage() {
  //   if (imgSrc.value) {
  //   }
  if (imgType) {
    // console.log(ImageMainRef.value.checkValue);
    imgSrc.value = ImageMainRef.value.checkValue;
  } else {
    // console.log(ImageMainRef.value.checkList);
    // console.log(imgSrc.value);

    // imgSrc.value = ref([]);
    // if (imgSrc.value) {
    imgSrc.value.push(...ImageMainRef.value.checkList);
    // } else {
    //   console.log(555);
    //   // 有问题。。。。。。。。。。。。。。。。。。。。
    //   imgSrc.value = [...new Set(imgSrc.value)];
    //   imgSrc.value = [...ImageMainRef.value.checkList];
    // }
    // imgSrc.value = await [...new Set(imgSrc.value)];
    // console.log(imgSrc.value);

    // imgSrc.value = ImageMainRef.value.checkListValue;
  }
  // console.log(callFunc.value);
  if (!props.preview && typeof callFunc.value == "function") {
    // console.log(555);
    callFunc.value(imgSrc.value);
  }

  //   console.log(ImageMainRef.value.checkValue);
  close();
  ImageMainRef.value.resetCheckList();
}

function removeImage(url) {
  imgSrc.value = imgSrc.value.filter((item) => item != url);
}

defineExpose({
  open,
});

const props = defineProps({
  preview: {
    type: Boolean,
    default: true,
  },
});
</script>
<template>
  <div v-if="preview && imgSrc">
    <el-image
      class="chooseImage"
      v-if="imgType"
      style="width: 100px; height: 100px"
      :src="imgSrc"
      fit="cover"
    />
    <div v-else class="flex flex-wrap">
      <div
        v-for="(url, index) in imgSrc"
        :key="index"
        class="relative mr-2 mb-2 border rounded overflow-hidden"
        style="width: 100px; height: 100px"
      >
        <el-image style="width: 100px; height: 100px" :src="url" fit="cover" />
        <el-icon
          @click="removeImage(url)"
          class="!absolute right-1 top-1 cursor-pointer"
          ><Close
        /></el-icon>
      </div>
    </div>
  </div>
  <div v-if="preview" @click="open" class="chooseImage">
    <el-icon :size="25" class="iconColor"><Plus /></el-icon>
  </div>
  <div class="flex items-center">
    <el-dialog
      title="选择图片"
      v-model="dialogVisible"
      width="70%"
      align-center
      @close=""
    >
      <el-container :style="{ height: h + 'px' }" class="bg-white rounded">
        <!-- <el-header class="image-header">
        <el-button type="primary" size="small" @click="handleCreate">
          新增分类
        </el-button>
        <el-button type="warning" size="small" @click="openUploadFile">
          上传图片
        </el-button>
      </el-header> -->
        <el-container>
          <ImageAside
            :iconShow="false"
            @changeActiveId="changeActiveId"
            ref="ImageAsideRef"
          ></ImageAside>
          <ImageMain
            :iconShow="false"
            ref="ImageMainRef"
            :imgType="imgType"
          ></ImageMain>
        </el-container>
      </el-container>
      <span class="diaFooter" slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="setImage">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style scoped>
.chooseImage {
  display: flex;
  justify-content: center;
  align-items: center;
  @apply cursor-pointer hover:bg-gray-100 w-100px h-100px border rounded mr-2;
}
.iconColor {
  @apply text-gray-500;
}
.diaFooter {
  @apply flex justify-end;
}
/* .image-header {
  border-bottom: 1px solid #ebeef5;
  @apply flex items-center;
} */
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
:deep(.el-overlay-dialog) {
  /* overflow: hidden; */
}
</style>
