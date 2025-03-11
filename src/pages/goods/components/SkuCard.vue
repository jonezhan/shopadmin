<script setup>
import SkuCardItem from "./SkuCardItem.vue";
import ChooseSku from "@/components/ChooseSku.vue";
import { ref } from "vue";
import {
  btnLoading,
  addSkuCard,
  sku_card_list,
  updateSkuCard,
  deleteSkuCard,
  sortCard,
  bodyLoading,
  handleChooseSetGoodsSkusCard,
} from "@/composables/useSku";
// console.log(sku_card_list.value);
const ChooseSkuRef = ref(null);
function openSku(item) {
  ChooseSkuRef.value.open((e) => {
    handleChooseSetGoodsSkusCard(item, {
      name: e.name,
      value: e.list,
    });
  });
  // console.log(ChooseSkuRef.value.open);
}
</script>

<template>
  <el-form-item v-loading="bodyLoading" label="规格选项">
    <el-button
      :loading="btnLoading"
      class="my-1"
      type="success"
      size="small"
      @click="addSkuCard"
      >添加规格选项</el-button
    >

    <el-card
      v-loading="item.loading"
      class="my-1"
      v-for="(item, index) in sku_card_list"
      :key="item.id"
      style="width: 100%"
      shadow="never"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <el-input
            @change="updateSkuCard(item)"
            v-model="item.text"
            style="width: 160px"
            placeholder="规格名称"
          >
            <template #append>
              <el-icon class="cursor-pointer" @click="openSku(item)">
                <MoreFilled />
              </el-icon>
            </template>
          </el-input>
          <div>
            <el-button
              :disabled="index === 0"
              size="small"
              icon="Top"
              @click="sortCard('up', index)"
            ></el-button>
            <el-button
              :disabled="index === sku_card_list.length - 1"
              size="small"
              icon="Bottom"
              @click="sortCard('down', index)"
            ></el-button>
            <el-popconfirm
              title="是否删除该规格选项?"
              confirm-button-text="确定"
              confirm-button
              :hide-after="0"
              cancel-button-text="取消"
              @confirm="deleteSkuCard(item)"
            >
              <template #reference
                ><el-button size="small" icon="Delete"></el-button
              ></template>
            </el-popconfirm>
          </div>
        </div>
      </template>
      <!-- card body -->
      <SkuCardItem :skuCardId="item.id" />
    </el-card>
  </el-form-item>
  <!-- 必须必须必须要放在外面，坑逼 -->
  <ChooseSku ref="ChooseSkuRef" />
</template>

<style scoped>
:deep(.el-card__header) {
  @apply !p-2 bg-gray-50;
}
</style>
