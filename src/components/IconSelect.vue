<script setup>
import { ref } from "vue";
import * as iconList from "@element-plus/icons-vue";

const selectValue = defineModel();
// const selectValue = ref();

const icons = ref(Object.keys(iconList));
</script>

<template>
  <div class="flex items-center">
    <el-select
      filterable
      v-model="selectValue"
      placeholder="选择图标"
      style="width: 140px"
    >
      <el-option
        :key="index"
        :label="item"
        :value="item"
        v-for="(item, index) in icons"
      >
        <div class="flex items-center justify-between">
          <el-icon>
            <component :is="item"></component>
          </el-icon>
          {{ item }}
        </div>
      </el-option>
      <!-- <template #tag>
        <el-tag color="red" />
      </template> -->
    </el-select>
    <el-icon class="ml-2" v-if="selectValue" :size="30">
      <component :is="selectValue"></component>
    </el-icon>
    <!-- <template>
      <el-tag type="primary" color="red" />
    </template> -->
    <!-- <el-tag color="red" />

    <el-tag type="primary" color="#6222C9">Tag 1</el-tag> -->
  </div>
</template>
<style scoped>
.el-tag {
  border: none;
  aspect-ratio: 1;
}
</style>

<!-- const value = ref([]);
const colors = [
  {
    value: "#E63415",
    label: "red",
  },
  {
    value: "#FF6600",
    label: "orange",
  },
  {
    value: "#FFDE0A",
    label: "yellow",
  },
  {
    value: "#1EC79D",
    label: "green",
  },
  {
    value: "#14CCCC",
    label: "cyan",
  },
  {
    value: "#4167F0",
    label: "blue",
  },
  {
    value: "#6222C9",
    label: "purple",
  },
];
colors.forEach((color) => {
  value.value.push(color.value);
}); -->
