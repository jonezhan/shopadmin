<script setup>
import { showModal, toast } from "@/composables/util";
import store from "@/store";
import { getStatistics1 } from "@/api/index";
import { onBeforeMount, onMounted, ref } from "vue";
import CountTo from "@/components/CountTo.vue";
import IndexNavs from "@/components/IndexNavs.vue";
import IndexChart from "@/components/IndexChart.vue";
import IndexCard from "@/components/IndexCard.vue";

const panels = ref([]);
onBeforeMount(() => {
  getStatistics1().then((res) => {
    panels.value = res.panels;
    // console.log(panels.value);
  });
});
</script>

<template>
  <div>
    <el-row v-permission="['getStatistics1,GET']" :gutter="20">
      <!-- 骨架屏 -->
      <template v-if="panels.length == 0">
        <el-col :span="6" v-for="i in 4" :key="i">
          <el-skeleton animated loading style="width: 100%">
            <template #template>
              <el-card style="border: none" shadow="never">
                <template #header>
                  <div class="flex justify-between">
                    <el-skeleton-item variant="text" style="width: 50%" />
                    <el-skeleton-item variant="text" style="width: 10%" />
                  </div>
                </template>
                <el-skeleton-item
                  variant="h3"
                  style="width: 60%; height: 30px"
                />

                <el-divider />
                <!-- <template #footer>Footer content</template> -->
                <div class="flex justify-between text-sm text-gray-500">
                  <el-skeleton-item variant="text" style="width: 60%" />
                  <el-skeleton-item variant="text" style="width: 20%" />
                </div>
              </el-card>
            </template>
          </el-skeleton>
        </el-col>
      </template>

      <template v-else>
        <el-col :span="6" v-for="(panel, index) in panels" :key="index">
          <el-card style="border: none" shadow="hover">
            <template #header>
              <div class="flex justify-between">
                <span>{{ panel.title }}</span>
                <el-tag :type="panel.unitColor || 'primary'" effect="plain">
                  {{ panel.unit }}
                  <!-- {{ panel.unitColor }} -->
                </el-tag>
              </div>
            </template>
            <span class="text-3xl font-bold text-gray-500">
              <!-- {{ panel.value }} -->
              <CountTo :value="panel.value"></CountTo>
            </span>
            <el-divider />
            <!-- <template #footer>Footer content</template> -->
            <div class="flex justify-between text-sm text-gray-500">
              <span>{{ panel.subTitle }}</span>
              <span>{{ panel.subValue }}</span>
            </div>
          </el-card>
        </el-col>
      </template>
    </el-row>
    <IndexNavs></IndexNavs>
    <el-row class="mt-5" :gutter="20">
      <el-col :span="12">
        <IndexChart v-permission="['getStatistics3,GET']"></IndexChart>
      </el-col>
      <el-col :span="12">
        <IndexCard v-permission="['getStatistics2,GET']"></IndexCard>
      </el-col>
    </el-row>
  </div>
</template>
