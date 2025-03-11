<script setup>
import { reactive, ref } from "vue";
// import Editor from "@/components/Editor.vue";
import { readGoods, updateGoods } from "@/api/goods";
import { toast } from "@/composables/util";
import FormDrawer from "@/components/FormDrawer.vue";

const emit = defineEmits(["reloadData"]);

const formDrawerRef = ref(null);
const form = reactive({
  content: "",
});

function onSubmit() {
  formDrawerRef.value.loading = true;
  updateGoods(goodsId.value, form)
    .then((res) => {
      formDrawerRef.value.closeDrawer();
      toast("设置成功");
      emit("reloadData");
    })
    .catch((err) => {
      // console.log(err);
      toast("设置失败", "error");
    })
    .finally(() => {
      formDrawerRef.value.loading = false;
    });
}

const goodsId = ref(0);
function open(row) {
  row.contentLoading = true;
  goodsId.value = row.id;
  readGoods(goodsId.value)
    .then((res) => {
      form.content = res.content;
      // console.log(form.banners);
      formDrawerRef.value.openDrawer();
    })
    .finally(() => {
      row.contentLoading = false;
    });
}
defineExpose({
  open,
});
</script>

<template>
  <FormDrawer
    size="40%"
    ref="formDrawerRef"
    @submit="onSubmit"
    title="设置商品详情"
    :destroy-on-close="true"
    ><el-form :model="form">
      <el-form-item>
        <!-- <el-input v-model="ruleForm.avatar" placeholder="张三..." /> -->
        <!-- <Editor v-model="form.content"></Editor> -->
        <p>暂时无法设置商品详情~</p>
      </el-form-item>
    </el-form>
  </FormDrawer>
  <!--  -->
</template>
