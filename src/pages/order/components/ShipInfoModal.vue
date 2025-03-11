<script setup>
import { reactive, ref } from "vue";
// import { useDateFormat } from "@vueuse/core";
import { toast } from "@/composables/util";
// import FormDrawer from "@/components/FormDrawer.vue";
// import { toNumber } from "lodash";
import { getExpressCompanyList, getShipInfoList } from "@/api/order";

function getShipInfo() {}

const emit = defineEmits(["reloadData"]);

const drawer = ref(null);
const form = reactive({});

const info = ref({});
function open(orderId) {
  return getShipInfoList(orderId).then((res) => {
    if (res.status != 0) {
      return toast(res.msg, "error");
    }
    info.value = res.result;
    console.log(info.value);
    drawer.value = true;
  });
}
defineExpose({
  open,
});
</script>

<template>
  <el-drawer
    v-model="drawer"
    title="物流信息"
    size="40%"
    :destroy-on-close="true"
  >
    <el-card shadow="never" :style="{ border: 'none' }">
      <template #header>
        <div class="flex items-center">
          <el-image
            class="border rounded"
            style="width: 60px; height: 60px"
            :src="info.logo"
            fit="fill"
            :lazy="true"
          />
          <div class="flex flex-col ml-2">
            <p>物流公司: {{ info.typename }}</p>
            <p>物流单号: {{ info.number }}</p>
          </div>
        </div>
      </template>
      <el-timeline style="margin-left: -40px">
        <el-timeline-item
          v-for="(item, index) in info.list"
          :key="index"
          :timestamp="item.time"
          placement="top"
        >
          <p>{{ item.status }}</p>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </el-drawer>
  <!--  -->
</template>
<style scoped>
/* .card-header {
  @apply font-bold text-sm mx-1 flex items-center justify-between;
}
:deep(.el-card__header) {
  @apply py-2 px-1 bg-gray-50;
} */
</style>
