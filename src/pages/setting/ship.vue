<script setup>
import { ref, reactive } from "vue";
import { getSysconfig, setSysconfig, uploadAction } from "@/api/sysconfig";
import { toast } from "@/composables/util";
import FormDrawer from "@/components/FormDrawer.vue";
import { getToken } from "@/composables/auth";
const token = getToken();

const loading = ref(false);

const form = reactive({
  ship: "",
});

function getData() {
  loading.value = true;
  getSysconfig()
    .then((res) => {
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

  setSysconfig(form)
    .then((res) => {
      // console.log(res);
      getData();
      toast("保存成功");
    })
    .catch((err) => {})
    .finally(() => {
      //   getData();
      loading.value = false;
    });
}
</script>

<template>
  <el-card shadow="never" :style="{ border: 'none' }">
    <!-- card body -->
    <el-form :model="form" label-width="auto" :inline="false">
      <el-form-item label="物流查询key">
        <div class="flex flex-col">
          <el-input style="width: 300px" v-model="form.ship" />
          <small class="text-gray-500">
            *用于查询物流信息，接口申请（仅供参考）
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
