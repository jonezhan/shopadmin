<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false,
  },
  iconShow: {
    type: Boolean,
    default: true,
  },
});
defineEmits(["edit", "delete"]);
</script>
<template>
  <div class="aside-list" :class="{ active: active }">
    <span><slot></slot></span>
    <span v-show="iconShow" class="ml-auto kk">
      <el-button
        @click.stop="$emit('edit')"
        class="mr-0"
        text
        type="primary"
        size="small"
      >
        <el-icon :size="12"><Edit /></el-icon>
      </el-button>

      <el-popconfirm
        title="是否删除该分类?"
        confirm-button-text="确定"
        cancel-button-text="取消"
        @confirm.stop="$emit('delete')"
      >
        <template #reference>
          <el-button @click.stop class="mr-2" text type="primary" size="small">
            <el-icon :size="12"><Close /></el-icon>
          </el-button>
        </template>
      </el-popconfirm>
    </span>
  </div>
</template>

<style scoped>
.aside-list {
  border-bottom: 1px solid #f4f4f4;
  cursor: pointer;
  @apply flex items-center p-3 text-sm text-gray-600;
  &:hover {
    @apply bg-blue-50;
  }
}
.active {
  @apply bg-blue-50;
}
.kk button {
  margin-left: 0px;
  padding: 4px;
  /* margin-right: 5px; */
}
</style>
