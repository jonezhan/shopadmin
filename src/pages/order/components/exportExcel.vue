<script setup>
import { reactive, ref } from "vue";
import { exportOrder } from "@/api/order";
import { toast } from "@/composables/util";
import FormDrawer from "@/components/FormDrawer.vue";
// const FormDrawer = defineAsyncComponent(() => {
//   return import("@/components/FormDrawer.vue");
// });

const emit = defineEmits(["exportExcel"]);

const formDrawerRef = ref(null);
const form = reactive({
  tab: "",
});
const chooseTime = ref([]);
const options = [
  { value: "all", label: "全部" },
  { value: "nopay", label: "待支付" },
  { value: "noship", label: "待发货" },
  { value: "shiped", label: "待收货" },
  { value: "received", label: "已收货" },
  { value: "finish", label: "已完成" },
  { value: "closed", label: "已关闭" },
  { value: "refunding", label: "退款中" },
];

function onSubmit() {
  //   console.log(chooseTime.value);
  if (!form.tab) {
    toast("请选择订单类型", "error");
    return;
  }
  if (chooseTime.value.length > 0) {
    form.starttime = chooseTime.value[0];
    form.endtime = chooseTime.value[1];
  }
  formDrawerRef.value.loading = true;
  exportOrder(form)
    .then((res) => {
      let url = window.URL.createObjectURL(new Blob([res]));
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", "订单列表.xlsx");
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(url);
      toast("导出成功");
    })
    .catch((err) => {
      toast("导出失败", "error");
      //   console.log(err);
    })
    .finally(() => {
      formDrawerRef.value.loading = false;
      formDrawerRef.value.closeDrawer();
    });
}

function open() {
  formDrawerRef.value.openDrawer();
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
    title="导出订单"
    :destroy-on-close="true"
  >
    <el-form :model="form">
      <el-form-item label="订单类型">
        <el-select
          v-model="form.tab"
          placeholder="选择订单类型"
          style="width: 200px"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="width: 400px" label="时间范围">
        <el-date-picker
          style="width: 400px"
          v-model="chooseTime"
          type="daterange"
          range-separator="到"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
    </el-form>
  </FormDrawer>
  <!--  -->
</template>
