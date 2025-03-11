<script setup>
import { nextTick, ref } from "vue";
import { ElInput } from "element-plus";
// const emits = defineEmits(["update:modelValue"]);

const inputValue = ref("");
const dynamicTags = defineModel();

// console.log(dynamicTags.value);

const inputVisible = ref(false);
const InputRef = ref();

const handleClose = (tag) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value.input.focus();
  });
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value);
    // emits("update:modelValue", dynamicTags.value);
  }
  inputVisible.value = false;
  inputValue.value = "";
};
</script>

<template>
  <div class="tagSty gap-2">
    <el-tag
      v-for="tag in dynamicTags"
      :key="tag"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
    >
      {{ tag }}
    </el-tag>
    <el-input
      style="max-width: 100px"
      v-if="inputVisible"
      ref="InputRef"
      v-model="inputValue"
      size="small"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button v-else class="button-new-tag" size="small" @click="showInput">
      + 新规格
    </el-button>
  </div>
</template>
<style scoped>
.tagSty {
  display: flex;
  flex-wrap: wrap;
}
</style>
