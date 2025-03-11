<template>
  <!-- <div v-for="item in tempList.goodsSkusCardValue" :key="item.id">
    {{ item.text }}
  </div> -->
  <!-- {{ item.goodsSkusCardValue.text }} -->
  <div v-loading="loading">
    <el-tag
      v-for="tag in tempList.goodsSkusCardValue"
      :key="tag"
      closable
      class="mr-2"
      :disable-transitions="false"
      @close="handleClose(tag)"
      effect="plain"
    >
      <el-input
        style="width: 80px"
        class="ml-[-10px]"
        v-model="tag.text"
        placeholder=""
        size="small"
        @change="handleChange($event, tag)"
      ></el-input>
    </el-tag>
    <el-input
      v-if="inputVisible"
      ref="InputRef"
      v-model="inputValue"
      class="w-20"
      size="small"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button v-else class="button-new-tag" size="small" @click="showInput">
      + 选项值
    </el-button>
  </div>
</template>

<script setup>
import { initSkuCardItem } from "@/composables/useSku";
import { ElInput } from "element-plus";

const props = defineProps({
  skuCardId: {
    type: [Number, String],
    default: 0,
  },
});

const {
  loading,
  tempList,
  inputValue,
  dynamicTags,
  inputVisible,
  InputRef,
  handleClose,
  showInput,
  handleInputConfirm,
  handleChange,
} = initSkuCardItem(props.skuCardId);
// console.log(tempList);
</script>

<style scoped></style>
