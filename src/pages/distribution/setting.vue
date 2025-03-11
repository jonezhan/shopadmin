<script setup>
import { ref, reactive } from "vue";
import { getConfig, setConfig } from "@/api/distribution";
import { toast } from "@/composables/util";
import ChooseImage from "@/components/ChooseImage.vue";

const loading = ref(false);
const activeName = ref("first");

const form = reactive({
  distribution_open: 1,
  store_first_rebate: 10,
  store_second_rebate: 20,
  spread_banners: [
    "http://...png",
    // ...
  ],
  is_self_brokerage: 1,
  settlement_days: 7,
  brokerage_method: "hand",
});

function getData() {
  loading.value = true;
  getConfig()
    .then((res) => {
      // console.log(res);
      for (const key in form) {
        form[key] = res[key];
      }
    })
    .finally(() => {
      loading.value = false;
    });
}
getData();
function onSubmit() {
  loading.value = true;
  setConfig(form)
    .then((res) => {
      // console.log(res);
      toast("保存成功");
    })
    .catch((err) => {})
    .finally(() => {
      loading.value = false;
    });
}
</script>

<template>
  <el-card shadow="never" :style="{ border: 'none' }">
    <!-- card body -->
    <el-form :model="form" label-width="auto" :inline="false">
      <h2 class="bg-gray-100 px-2 py-3 mb-4 rounded">基础设置</h2>
      <el-form-item label="分销启用">
        <el-radio-group v-model="form.distribution_open">
          <el-radio label="禁用" :value="0" />
          <el-radio label="开启" :value="1" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="分销海报图">
        <ChooseImage v-model="form.spread_banners"></ChooseImage>

        <!-- <el-radio-group v-model="form.open_reg">
          <el-radio label="关闭" :value="0" />
          <el-radio label="开启" :value="1" />
        </el-radio-group> -->
      </el-form-item>

      <h2 class="bg-gray-100 px-2 py-3 mb-4 rounded">返佣设置</h2>
      <el-form-item label="一级返佣比例">
        <div class="flex flex-col">
          <el-input
            type="number"
            style="width: 300px"
            v-model="form.store_first_rebate"
          >
            <template #append>%</template>
          </el-input>
          <small class="text-gray-500">
            *订单交易成功后给上级返佣的比例0 - 100,例:5 = 返订单金额的5%
          </small>
        </div>
      </el-form-item>
      <el-form-item label="二级返佣比例">
        <div class="flex flex-col">
          <el-input
            type="number"
            style="width: 300px"
            v-model="form.store_second_rebate"
          >
            <template #append>%</template>
          </el-input>
          <small class="text-gray-500">
            *订单交易成功后给上级返佣的比例0 - 100,例:5 = 返订单金额的5%
          </small>
        </div>
      </el-form-item>
      <el-form-item label="自购返佣">
        <div class="flex flex-col">
          <el-radio-group v-model="form.is_self_brokerage">
            <el-radio label="否" :value="0" />
            <el-radio label="是" :value="1" />
          </el-radio-group>
          <small class="text-gray-500">
            *是否开启自购返佣（开启：分销员自己购买商品，享受一级返佣，上级享受二级返佣；
            关闭：分销员自己购买商品没有返佣）
          </small>
        </div>
      </el-form-item>

      <h2 class="bg-gray-100 px-2 py-3 mb-4 rounded">结算设置</h2>
      <el-form-item label="结算时间">
        <div class="flex flex-col">
          <el-input
            type="number"
            style="width: 300px"
            v-model="form.settlement_days"
          >
            <template #prepend>订单完成后</template>
            <template #append>天</template>
          </el-input>
          <small class="text-gray-500">
            *预估佣金结算后无法进行回收，请谨慎设置结算天数
          </small>
        </div>
      </el-form-item>
      <el-form-item label="佣金到账方式">
        <div class="flex flex-col">
          <el-radio-group v-model="form.brokerage_method">
            <el-radio label="手动到账" value="hand" />
            <el-radio label="微信零钱自动到账" value="wx" />
          </el-radio-group>
          <small class="text-gray-500">
            *佣金到账方式支持线下转账和微信零钱自动转账，手动转账更安全，自动转账更方便
          </small>
        </div>
      </el-form-item>

      <el-form-item label="">
        <el-button :loading="loading" type="primary" @click="onSubmit">
          保存
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
