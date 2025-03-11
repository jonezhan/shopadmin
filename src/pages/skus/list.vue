<script setup>
import {
  computed,
  reactive,
  ref,
  shallowReactive,
  shallowRef,
  watch,
} from "vue";
import FormDrawer from "@/components/FormDrawer.vue";
import ListHeader from "@/components/ListHeader.vue";
import { getRuleList } from "@/api/rule";

import {
  getSkusList,
  createSkus,
  updateSkus,
  deleteSkus,
  updateSkusStatus,
} from "@/api/skus";

import {
  useInitTable,
  useInitForm,
  useInitForm2,
} from "@/composables/useCommon";
import TagInput from "../../components/TagInput.vue";
import { toast } from "@/composables/util";

const roles = ref(null);
const titleType = computed(() => (subId.value ? "修改角色" : "新增角色"));

const {
  tableData,
  totalCount,
  currentPage,
  loading,

  getData,
  pageChange,
} = useInitTable({
  getList: getSkusList,
  onGetListSuccess: (res) => {
    totalCount.value = res.totalCount;
    tableData.value = res.list.map((item) => {
      item.statusLoading = false;
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
  TempRuleForm: {
    name: "",
    status: 1,
    default: "",
    order: 50,
  },
  TempRules: {
    name: [{ required: true, message: "规格名称不能为空", trigger: "blur" }],
    default: [{ required: true, message: "规格值不能为空", trigger: "blur" }],
  },
  getData,
  update: updateSkus,
  create: createSkus,
});

const {
  handleStatusChange,
  handleDelete,
  multipleTableRef,
  handleSelectionChange,
  handleMultiDelete,
} = useInitForm2({
  getData,
  updateStatus: updateSkusStatus,
  delete: deleteSkus,
});

// let tempDefault = ref(null);
const tempDefault = reactive([]);
// const tempDefault = shallowReactive([]);

function TemphandleEdit(row) {
  handleEdit(row);
  // console.log(ruleForm.default);
  const arrTemp = ruleForm.default.split(",");
  tempDefault.length = 0;
  tempDefault.push(...arrTemp);
  // console.log(arrTemp, tempDefault);
}
function TemphandleCreate() {
  handleCreate();
  tempDefault.length = 0;
}

watch(tempDefault, (val) => {
  // console.log(val);
  // console.log(typeof val);
  // ruleForm.default = val.reduce((str, item) => str + "," + item, "").slice(1);
  ruleForm.default = val.join(",");

  // console.log(ruleForm.default);
});

// const dynamicTags = ref(["Tag 1", "Tag 2", "Tag 3"]);
// console.log(dynamicTags.value);
// 注意这里，直接给ref对象赋值一个数组会自动变成对象，要用shallowRef避免深层转化
// const res = shallowRef([2, 2, 3]);
// res.value = [1, 2, 3];
// console.log(res.value); // [1, 2, 3]

// const res2 = ref([1, 2, 3]);
// // res2.value = [1, 2, 3];
// console.log(res2.value); // {0: 1, 1: 2, 2: 3}

// const arr2 = shallowReactive({ arr: [1, 2, 3] });
// arr2.arr = [4, 5, 6];
// console.log(arr2.arr);
// let kk = { 0: 20, 1: 30, 2: 40 };
// let kk = [1, 2, 3, 4];

// let zz = kk.join(",");
// console.log(zz);
</script>
<template>
  <el-card shadow="never" class="border-0">
    <!-- 新增|刷新 按钮 -->
    <ListHeader
      layout="create,refresh,delete"
      @delete="handleMultiDelete"
      @create="TemphandleCreate"
      @refresh="getData"
      class="justify-between mb-4"
    ></ListHeader>

    <!-- 表格区域 -->
    <el-table
      ref="multipleTableRef"
      v-loading="loading"
      :data="tableData"
      stripe
      class="tableSty"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" width="200" label="规格名称" />
      <el-table-column prop="default" align="center" label="规格值" />
      <el-table-column prop="order" align="center" label="排序" />
      <el-table-column width="120" label="状态">
        <template #default="{ row }">
          <el-switch
            :disabled="row.super == 1"
            :loading="row.statusLoading"
            @change="handleStatusChange($event, row)"
            :modelValue="row.status"
            :activeValue="1"
            :inactiveValue="0"
          />
        </template>
      </el-table-column>

      <el-table-column width="260" align="center" label="操作">
        <template #default="scope">
          <el-button
            text
            type="primary"
            size="small"
            @click="TemphandleEdit(scope.row)"
            >修改</el-button
          >
          <el-popconfirm
            title="是否删除该规格?"
            confirm-button-text="确定"
            confirm-button
            :hide-after="0"
            cancel-button-text="取消"
            @confirm="handleDelete(scope.row)"
          >
            <template #reference>
              <el-button size="small" text type="primary">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex justify-center items-center mt-5">
      <el-pagination
        background
        layout="prev, pager,next"
        :total="totalCount"
        :current-page="currentPage"
        :page-size="10"
        @current-change="pageChange"
      />
    </div>

    <!-- 新增和修改弹框 -->
    <FormDrawer
      @submit="handleSubmit"
      :title="titleType"
      size="30%"
      ref="formDrawerRef"
      destoryOnClose
    >
      <el-form
        ref="ruleFormRef"
        style="max-width: 600px"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="张三..." />
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="ruleForm.order" :min="0" :max="1000" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-switch
            @change="(e) => (ruleForm.status = e)"
            :modelValue="ruleForm.status"
            :activeValue="1"
            :inactiveValue="0"
          />
        </el-form-item>
        <el-form-item label="规格值" prop="default">
          <TagInput v-model="tempDefault"></TagInput>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>
<style scoped>
.elStyle .el-form-item {
  margin-bottom: 0;
}
.custom-tree-node {
  display: flex;
  align-items: center;
}
.el-tree-node {
  padding-top: 10px;
}
</style>
