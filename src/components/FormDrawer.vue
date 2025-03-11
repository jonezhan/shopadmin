<script setup>
import { ref } from "vue";
const props = defineProps({
  title: String,
  size: {
    type: String,
    default: "30%",
  },
  destroyOnClose: {
    type: Boolean,
    default: false,
  },
  confirmText: {
    type: String,
    default: "提交",
  },
});

const emit = defineEmits(["submit"]);

// loading状态
const loading = ref(false);

// 是否显示弹出框
const showDrawer = ref(false);
const openDrawer = () => {
  try {
    showDrawer.value = true;
  } catch (error) {}
};
const closeDrawer = () => {
  showDrawer.value = false;
};

// expose
defineExpose({
  loading,
  openDrawer,
  closeDrawer,
});
</script>

<template>
  <!-- 弹出框 -->
  <el-drawer
    v-model="showDrawer"
    :title="title"
    :close-on-click-modal="false"
    :size="size"
    :destroy-on-close="destroyOnClose"
  >
    <div class="formDrawer">
      <div class="formBody">
        <!-- 主体内容的插槽 -->
        <slot></slot>
      </div>
      <div class="actions">
        <el-button :loading="loading" @click="$emit('submit')" type="primary">
          {{ confirmText }}
        </el-button>
        <el-button @click="closeDrawer" type="default">取消</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<style scoped>
.formDrawer {
  width: 100%;
  height: 100%;

  @apply flex flex-col;
}
.formBody {
  /* height: calc(100% - 50px); */
  /* @apply flex flex-col justify-center items-center; */
  flex: 1;
  overflow-y: auto;
}
.actions {
  height: 50px;
  @apply mt-auto flex items-center;
}
</style>
