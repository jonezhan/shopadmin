<script setup>
import { reactive, ref } from "vue";
import ChooseImage from "@/components/ChooseImage.vue";
import { readGoods, setGoodsBanner } from "@/api/goods";
import { toast } from "@/composables/util";
const emit = defineEmits(["reloadData"]);

const dialogVisible = ref(false);
const form = reactive({
  banners: [],
});
const loading = ref(false);
function onSubmit() {
  loading.value = true;
  setGoodsBanner(goodsId.value, form.banners)
    .then((res) => {
      dialogVisible.value = false;
      toast("设置成功");
      emit("reloadData");
    })
    .catch((err) => {
      // console.log(err);
      toast("设置失败", "error");
    })
    .finally(() => {
      loading.value = false;
    });
}

const goodsId = ref(0);
function open(row) {
  row.bannersLoading = true;
  goodsId.value = row.id;
  readGoods(goodsId.value)
    .then((res) => {
      form.banners = res.goodsBanner.map((item) => item.url);
      // console.log(form.banners);
      dialogVisible.value = true;
    })
    .finally(() => {
      row.bannersLoading = false;
    });
}
defineExpose({
  open,
});
</script>

<template>
  <el-drawer
    title="设置轮播图"
    v-model="dialogVisible"
    size="30%"
    :destroy-on-close="true"
    :show-close="true"
    :wrapperClosable="true"
  >
    <el-form :model="form" label-width="80px">
      <el-form-item label="轮播图" prop="banners">
        <!-- <el-input v-model="ruleForm.avatar" placeholder="张三..." /> -->
        <ChooseImage v-model="form.banners"></ChooseImage>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click="onSubmit"
          >提交</el-button
        >
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
