<template>
  <FormDrawer
    @submit="openDialog"
    title="推荐商品"
    size="40%"
    ref="formDrawerRef"
    destoryOnClose="true"
    confirmText="关联"
  >
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      stripe
      border
    >
      <el-table-column prop="goods_id" label="ID" width="80" />
      <el-table-column
        class="flex items-center justify-center"
        align="center"
        label="商品封面"
        width="100"
      >
        <template #default="scope">
          <el-image
            :src="scope.row.cover"
            class="!inline"
            :lazy="true"
            style="width: 40px; height: 40px"
            fit="fill"
          />
        </template>
      </el-table-column>

      <el-table-column prop="name" label="商品名称" />
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-popconfirm
            title="是否删除该推荐商品?"
            confirm-button-text="确定"
            confirm-button
            :hide-after="0"
            cancel-button-text="取消"
            @confirm="handleDelete(scope.row.id)"
          >
            <template #reference>
              <el-button type="primary" text size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </FormDrawer>
  <ChooseGoods @setChoose="setChoose" ref="dialogRef"></ChooseGoods>
</template>

<script setup>
import { ref } from "vue";
import FormDrawer from "@/components/FormDrawer.vue";
import {
  getRecommendGoodsList,
  deleteRecommendGoods,
  connectRecommendGoods,
} from "@/api/category";
import { toast } from "@/composables/util";
import ChooseGoods from "@/components/ChooseGoods.vue";

// 关联按钮
const dialogRef = ref(null);
function openDialog() {
  dialogRef.value.openDialog();
}
function setChoose(goods_ids) {
  //   console.log(goods_ids);
  loading.value = true;
  connectRecommendGoods({
    category_id: currentCategoryID.value,
    goods_ids,
  })
    .then((res) => {
      getData();
      toast("关联成功");
    })
    .finally(() => {
      loading.value = false;
    });
}

const tableData = ref([]);
const formDrawerRef = ref(null);
const currentCategoryID = ref(0);
const loading = ref(false);

async function getData() {
  loading.value = true;
  await getRecommendGoodsList(currentCategoryID.value)
    .then((res) => {
      //   console.log(res);
      tableData.value = res;
    })
    .finally(() => {
      formDrawerRef.value.openDrawer();
      loading.value = false;
    });
}

async function open(data, callFunc) {
  currentCategoryID.value = data.id;
  //   console.log(data);
  await getData();
  callFunc();
}

function handleDelete(id) {
  //   console.log(id);
  deleteRecommendGoods(id).then(() => {
    getData();
    toast("删除成功");
  });
}

defineExpose({
  open,
});
</script>

<style scoped></style>
