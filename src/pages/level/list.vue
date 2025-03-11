<script setup>
import { computed } from "vue";
import FormDrawer from "@/components/FormDrawer.vue";
import ListHeader from "@/components/ListHeader.vue";

import {
  getUserLevelList,
  createUserLevel,
  updateUserLevel,
  deleteUserLevel,
  updateUserLevelStatus,
} from "@/api/level";

import {
  useInitTable,
  useInitForm,
  useInitForm2,
} from "@/composables/useCommon";

const titleType = computed(() =>
  subId.value ? "修改会员等级" : "新增会员等级"
);

const {
  tableData,
  totalCount,
  currentPage,
  loading,

  getData,
  pageChange,
} = useInitTable({
  getList: getUserLevelList,
  onGetListSuccess: (res) => {
    console.log(res);
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
    level: 100,
    status: 1,
    discount: 0,
    max_price: 0,
    max_times: 0,
  },
  TempRules: {
    name: [{ required: true, message: "等级名称不能为空", trigger: "blur" }],
  },
  getData,
  update: updateUserLevel,
  create: createUserLevel,
});

const { handleStatusChange, handleDelete } = useInitForm2({
  getData,
  updateStatus: updateUserLevelStatus,
  delete: deleteUserLevel,
});
</script>
<template>
  <el-card shadow="never" class="border-0">
    <!-- 新增|刷新 按钮 -->
    <ListHeader
      @create="handleCreate"
      @refresh="getData"
      class="justify-between mb-4"
    ></ListHeader>

    <!-- 表格区域 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      style="width: 100%"
      class="tableSty"
    >
      <el-table-column prop="name" label="会员等级" />
      <el-table-column
        prop="discount"
        width="200"
        label="折扣率"
        align="center"
      />

      <el-table-column
        prop="level"
        width="200"
        label="等级序号"
        align="center"
      />

      <el-table-column width="120" label="状态" align="center">
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
            @click="handleEdit(scope.row)"
            >修改</el-button
          >
          <el-popconfirm
            title="是否删除该管理员?"
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
      destoryOnClose="true"
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
        <el-form-item label="等级名称" prop="name">
          <el-input
            style="width: 160px"
            v-model="ruleForm.name"
            placeholder="等级名称"
          />
        </el-form-item>
        <el-form-item label="等级权重" prop="desc">
          <el-input
            style="width: 160px"
            v-model="ruleForm.level"
            type="number"
            :min="0"
            :max="100"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            @change="
              (e) => {
                ruleForm.status = e;
              }
            "
            :modelValue="ruleForm.status"
            :activeValue="1"
            :inactiveValue="0"
          />
        </el-form-item>
        <el-form-item label="升级条件">
          <span>
            <text class="text-xs mr-2">累计消费满</text>
            <el-input
              style="width: 160px"
              v-model="ruleForm.max_price"
              type="number"
              :min="0"
            >
              <template #append>元</template>
            </el-input>
          </span>
          <h4 class="my-2 text-xs text-gray-400">
            设置会员等级所需要的累计消费必须大于等于0, 单位: 元
          </h4>
          <span>
            <text class="text-xs mr-2">累计消费满</text>
            <el-input
              style="width: 160px"
              v-model="ruleForm.max_times"
              type="number"
              :min="0"
            >
              <template #append>笔</template>
            </el-input>
          </span>
          <h4 class="my-2 text-xs text-gray-400">
            设置会员等级所需要的购买量必须大于等于0, 单位: 笔
          </h4>
        </el-form-item>
        <el-form-item label="折扣率" prop="desc">
          <el-input
            style="width: 160px"
            v-model="ruleForm.discount"
            type="number"
            :min="0"
            :max="100"
          >
            <template #append>%</template>
          </el-input>
          <h4 class="my-2 text-xs text-gray-400">
            折扣率单位为百分比, 如输入90,
            表示该会员等级的用户可用商品原价的90%购买
          </h4>
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
