<template>
  <el-form-item label="规格设置">
    <table class="border">
      <thead>
        <tr>
          <th
            class="border"
            :width="item.width"
            v-for="(item, index) in tableThs"
            :key="index"
            :rowspan="item.rowspan"
            :colspan="item.colspan"
          >
            {{ item.name }}
          </th>
        </tr>
        <tr>
          <th
            class="border"
            :width="item.width"
            v-for="(item, index) in skuLabels"
            :key="index"
          >
            {{ item.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in sku_list" :key="item.id">
          <td
            width="100"
            class="border text-center"
            v-for="e in item.skus"
            :key="e.id"
          >
            {{ e.value }}
          </td>
          <td
            class="border"
            v-for="i in [
              'pprice',
              'oprice',
              'cprice',
              'stock',
              'volume',
              'weight',
            ]"
            :key="i"
          >
            <el-input type="number" size="small" v-model="item[i]"></el-input>
          </td>
          <td class="border">
            <el-input size="small" v-model="item.code"></el-input>
          </td>
        </tr>
      </tbody>
    </table>
  </el-form-item>
</template>

<script setup>
import {
  sku_list,
  sku_card_list,
  initSkuTable,
  getTableData,
} from "@/composables/useSku";
import { watch } from "vue";
import { throttle, debounce } from "lodash";
const { skuLabels, tableThs } = initSkuTable();
// console.log(sku_card_list.value);
watch(
  () => sku_card_list.value,
  // 这里调用了一下防抖，虽然还是会执行两次
  debounce(() => {
    // console.log(2333);
    getTableData();
  }, 500),
  { deep: true }
);
// console.log(sku_list.value);
</script>

<style scoped></style>
