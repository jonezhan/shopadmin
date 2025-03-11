<script setup>
import { computed, ref, defineAsyncComponent } from "vue";
import ListHeader from "@/components/ListHeader.vue";

import Dialog from "./components/dialog.vue";
// import RecommendDrawer from "./components/recommendDrawer.vue";

const RecommendDrawer = defineAsyncComponent(() => {
  return import("./components/recommendDrawer.vue");
});

import {
  getCategoryList,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
} from "@/api/category";

import {
  useInitTable,
  useInitForm,
  useInitForm2,
} from "@/composables/useCommon";

const titleType = computed(() =>
  subId.value ? "修改菜单权限" : "新增菜单权限"
);

const { tableData, loading, getData } = useInitTable({
  getList: getCategoryList,
  onGetListSuccess: (res) => {
    // console.log(res);
    tableData.value = res.map((item) => {
      item.statusLoading = false;
      item.recommendLoading = false;
      // console.log(item);
      return item;
    });
  },
});
const {
  formDrawerRef,
  handleEdit,
  handleCreate,
  ruleFormRef,
  ruleForm,
  rules,
  subId,
  handleSubmit,
} = useInitForm({
  getData,
  update: updateCategory,
  create: createCategory,
});

const { handleStatusChange, handleDelete } = useInitForm2({
  getData,
  delete: deleteCategory,
  updateStatus: updateCategoryStatus,
});

function addChild(id) {
  handleCreate();
  ruleForm.rule_id = id;
}

// 新增 | 修改 分类
const dialogRef = ref(null);
function openDialog(type) {
  // console.log(type);
  dialogRef.value.openDialog(type);
}

// 推荐商品弹框
const recommendRef = ref(null);
function openDrawer(data) {
  // console.log(data);
  data.recommendLoading = true;
  recommendRef.value.open(data, () => {
    // console.log(233);
    data.recommendLoading = false;
  });
}
</script>

<template>
  <el-card shadow="never" class="">
    <ListHeader
      @create="openDialog"
      @refresh="getData"
      class="justify-between mb-4"
    >
    </ListHeader>
    <el-tree
      v-loading="loading"
      node-key="id"
      :data="tableData"
      :props="{ label: 'name', children: 'child' }"
    >
      <template #default="{ node, data }">
        <div class="custom-tree-node">
          <span>{{ data.name }}</span>
          <div class="ml-auto" @click.stop>
            <el-button
              :loading="data.recommendLoading"
              @click="openDrawer(data)"
              text
              type="primary"
              size="small"
              >推荐商品</el-button
            >
            <el-switch
              @change="handleStatusChange($event, data)"
              :loading="data.statusLoading"
              :modelValue="data.status"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
            <el-button
              @click="openDialog(data)"
              text
              type="primary"
              size="small"
              >修改</el-button
            >

            <el-popconfirm
              title="是否删除该分类?"
              confirm-button-text="确定"
              confirm-button
              :hide-after="0"
              cancel-button-text="取消"
              @confirm="handleDelete(data)"
            >
              <template #reference>
                <el-button text type="primary" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </template>
    </el-tree>
    <RecommendDrawer ref="recommendRef"></RecommendDrawer>
    <Dialog ref="dialogRef" @getData="getData"></Dialog>
  </el-card>
</template>
<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  /* margin: 10px 0; */
  padding-right: 10px;
  font-size: 14px;
}

:deep(.el-tree-node__content) {
  /* margin: 5px 0; */
  padding: 20px 0;
}
</style>
