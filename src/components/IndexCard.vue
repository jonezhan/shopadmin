<script setup>
import { showModal, toast } from "@/composables/util";
import store from "@/store";
import { getStatistics2 } from "@/api/index";
import { onBeforeMount, onMounted, ref } from "vue";
import CountTo from "@/components/CountTo.vue";
import IndexNavs from "@/components/IndexNavs.vue";
import IndexChart from "@/components/IndexChart.vue";

const goods = ref([]);
const order = ref([]);

onBeforeMount(() => {
  getStatistics2().then((res) => {
    // panels.value = res.panels;
    // console.log(res);
    goods.value = res.goods;
    order.value = res.order;
  });
});
</script>

<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <div class="flex justify-between">
          店铺及商品提示
          <el-tag :type="'danger'" effect="plain">
            店铺及商品提示

            <!-- {{ panel.unitColor }} -->
          </el-tag>
        </div>
      </template>
      <!-- <span class="text-3xl font-bold text-gray-500">
        <CountTo :value="panel.value"></CountTo>
      </span> -->
      <el-row :gutter="20">
        <el-col
          v-for="(item, index) in goods"
          :key="index"
          :span="6"
          :offset="0"
        >
          <el-card
            style="
              border: none;
              --tw-bg-opacity: 1;
              background-color: rgba(246, 246, 246, var(--tw-bg-opacity));
            "
            shadow="hover"
          >
            <div class="flex flex-col justify-center items-center">
              <span class="text-xl mb-2">{{ item.value }}</span>
              <span class="text-xs text-gray-500">{{ item.label }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <!-- <template #footer>Footer content</template> -->
    </el-card>
    <el-card class="mt-4" shadow="never">
      <template #header>
        <div class="flex justify-between">
          交易提示
          <el-tag :type="'danger'" effect="plain">
            需要立即处理的交易订单

            <!-- {{ panel.unitColor }} -->
          </el-tag>
        </div>
      </template>
      <!-- <span class="text-3xl font-bold text-gray-500">
        <CountTo :value="panel.value"></CountTo>
      </span> -->

      <el-row :gutter="20">
        <el-col
          v-for="(item, index) in order"
          :key="index"
          :span="6"
          :offset="0"
        >
          <el-card
            style="
              border: none;
              --tw-bg-opacity: 1;
              background-color: rgba(246, 246, 246, var(--tw-bg-opacity));
            "
            shadow="hover"
          >
            <div class="flex flex-col justify-center items-center">
              <span class="text-xl mb-2">{{ item.value }}</span>
              <span class="text-xs text-gray-500">{{ item.label }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <!-- <template #footer>Footer content</template> -->
    </el-card>
  </div>
</template>
