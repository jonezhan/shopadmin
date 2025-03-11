<script setup>
import { ref, useSlots } from "vue";

const showSelect = ref(false);

defineEmits(["search", "reset"]);

const props = defineProps({
  searchForm: Object,
  showBtn: { type: Boolean, default: false },
});

const slots = useSlots();
const showBtnSec = !!slots.selectItem;
</script>

<template>
  <div class="flex">
    <el-form :model="searchForm" status-icon>
      <div class="elStyle flex flex-wrap">
        <!-- 具名插槽 选择框或其他的组件 -->
        <template v-if="showSelect">
          <slot name="selectItem"></slot>
        </template>
        <!-- 默认插槽 搜索框的组件 -->
        <slot></slot>

        <!-- 公共按钮 -->
        <el-form-item>
          <el-button @click="$emit('search')" type="primary" size="small">
            搜索
          </el-button>
          <el-button @click="$emit('reset')" size="small"> 重置 </el-button>
          <el-button
            v-if="showBtnSec"
            style="margin-left: 2px"
            type="primary"
            text
            @click="() => (showSelect = !showSelect)"
            size="small"
          >
            {{ showSelect ? "收起" : "展开" }}
            <el-icon v-if="showSelect"><ArrowUp /></el-icon>
            <el-icon v-else><ArrowDown /></el-icon>
          </el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<style scoped>
.elStyle .el-form-item {
  margin-bottom: 0;
}
</style>
