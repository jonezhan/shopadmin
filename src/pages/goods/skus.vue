<script setup>
import { reactive, ref } from "vue";
import { readGoods, updateGoodsSkus } from "@/api/goods";
import { toast } from "@/composables/util";
import FormDrawer from "@/components/FormDrawer.vue";
import SkuCard from "./components/SkuCard.vue";
import SkuTable from "./components/SkuTable.vue";

import { sku_list, goodsId, initSkuCardList } from "@/composables/useSku";

const emit = defineEmits(["reloadData"]);

const formDrawerRef = ref(null);
const form = reactive({
  sku_type: 0,
  sku_value: {
    oprice: 0,
    pprice: 0,
    cprice: 0,
    weight: 0,
    volume: 0,
  },
});

// const goodsId = ref(0);
function open(row) {
  row.skusLoading = true;
  goodsId.value = row.id;
  readGoods(goodsId.value)
    .then((res) => {
      form.sku_type = res.sku_type;
      form.sku_value = res.sku_value || {
        oprice: 0,
        pprice: 0,
        cprice: 0,
        weight: 0,
        volume: 0,
      };
      initSkuCardList(res);
      //   console.log(form);
      formDrawerRef.value.openDrawer();
    })
    .finally(() => {
      row.skusLoading = false;
    });
}

function onSubmit() {
  formDrawerRef.value.loading = true;
  let data = {
    sku_type: form.sku_type,
    sku_value: form.sku_value,
  };
  if (form.sku_type == 1) {
    data.goodsSkus = sku_list.value;
  }
  updateGoodsSkus(goodsId.value, data)
    .then((res) => {
      formDrawerRef.value.closeDrawer();
      toast("设置规格成功");
      emit("reloadData");
    })
    .catch((err) => {
      // console.log(err);
      toast("设置规格失败", "error");
    })
    .finally(() => {
      formDrawerRef.value.loading = false;
    });
}

defineExpose({
  open,
});
</script>

<template>
  <FormDrawer
    size="60%"
    ref="formDrawerRef"
    @submit="onSubmit"
    title="设置商品规格"
    :destroy-on-close="true"
  >
    <el-form :model="form" label-width="auto">
      <el-form-item label="规格类型">
        <el-radio-group v-model="form.sku_type">
          <el-radio :value="0">单规格</el-radio>
          <el-radio :value="1">多规格</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="!form.sku_type">
        <el-form-item label="市场价格">
          <el-input
            type="number"
            style="width: 160px"
            :min="0"
            v-model="form.sku_value.oprice"
          >
            <template #append> 元 </template>
          </el-input>
        </el-form-item>
        <el-form-item label="销售价格">
          <el-input
            type="number"
            style="width: 160px"
            :min="0"
            v-model="form.sku_value.pprice"
          >
            <template #append> 元 </template>
          </el-input>
        </el-form-item>
        <el-form-item label="成本价格">
          <el-input
            type="number"
            style="width: 160px"
            :min="0"
            v-model="form.sku_value.cprice"
          >
            <template #append> 元 </template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input
            type="number"
            style="width: 160px"
            :min="0"
            v-model="form.sku_value.weight"
          >
            <template #append> kg </template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品体积">
          <el-input
            type="number"
            style="width: 160px"
            :min="0"
            v-model="form.sku_value.volume"
          >
            <template #append> m³ </template>
          </el-input>
        </el-form-item>
      </template>
      <template v-else>
        <SkuCard> </SkuCard>
        <SkuTable></SkuTable>
      </template>
    </el-form>
  </FormDrawer>
  <!--  -->
</template>
