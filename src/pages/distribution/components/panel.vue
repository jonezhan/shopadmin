<template>
  <el-row class="mb-5" :gutter="20">
    <!-- 骨架屏 -->
    <template v-if="loading">
      <el-col :span="6" v-for="i in 4" :key="i">
        <el-skeleton animated loading style="width: 100%">
          <template #template>
            <el-card shadow="never">
              <el-skeleton-item variant="h3" style="width: 60%; height: 50px" />

              <!-- <template #footer>Footer content</template> -->
            </el-card>
          </template>
        </el-skeleton>
      </el-col>
    </template>
    <!-- 数据 -->
    <el-col v-for="(panel, index) in panels" :key="index" :span="6" :offset="0">
      <el-card shadow="never" class="box-card p-2">
        <div class="flex items-center">
          <div class="mr-3 text-white w-10 h-10 rounded-full border">
            <el-icon :class="panel.color" :size="20">
              <User v-if="index == 0" />
              <ShoppingCart v-if="index == 1" />
              <PriceTag v-if="index == 2" />
              <Timer v-if="index == 3" />
            </el-icon>
          </div>
          <div class="text item">
            <p class="text-xg font-bold">{{ panel.value }}</p>
            <p class="text-gray-500 text-xs">{{ panel.label }}</p>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { getAgentStatistics } from "@/api/distribution";
import { ref } from "vue";

const panels = ref([]);
const loading = ref(true);

getAgentStatistics().then((res) => {
  // console.log(res);
  panels.value = res.panels;
  loading.value = false;
});
</script>

<style scoped></style>
