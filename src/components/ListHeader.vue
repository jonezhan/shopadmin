<script setup>
import { computed, ref } from "vue";

defineEmits(["create", "refresh", "delete", "download"]);

const props = defineProps({
  layout: {
    type: String,
    default: "create,refresh",
  },
});

// const loading = ref(false);
// defineExpose({
//   loading,
// });
const btns = computed(() => props.layout.split(","));
</script>

<template>
  <div class="flex items-center">
    <div>
      <el-button
        v-if="btns.includes('create')"
        @click="$emit('create')"
        type="primary"
        size="small"
      >
        新增
      </el-button>

      <el-popconfirm
        v-if="btns.includes('delete')"
        title="是否删除选中记录?"
        confirm-button-text="确定"
        confirm-button
        :hide-after="0"
        cancel-button-text="取消"
        @confirm="$emit('delete')"
      >
        <template #reference>
          <el-button type="danger" size="small"> 批量删除 </el-button>
        </template>
      </el-popconfirm>

      <!-- 上架 下架 按钮的插槽 -->
      <slot></slot>
    </div>
    <el-tooltip
      v-if="btns.includes('refresh')"
      effect="dark"
      content="刷新数据"
      placement="top"
    >
      <el-button @click="$emit('refresh')" text>
        <el-icon :size="16"><Refresh /></el-icon>
      </el-button>
    </el-tooltip>
    <el-tooltip
      v-if="btns.includes('download')"
      effect="dark"
      content="导出数据"
      placement="top"
    >
      <el-button style="margin-left: 0" @click="$emit('download')" text>
        <el-icon :size="16"><Download /></el-icon>
      </el-button>
    </el-tooltip>
  </div>
</template>
