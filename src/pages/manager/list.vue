<script setup>
import { computed, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import ChooseImage from "@/components/ChooseImage.vue";
import FormDrawer from "@/components/FormDrawer.vue";
import ListHeader from "@/components/ListHeader.vue";
import SearchFather from "@/components/SearchFather.vue";
import SearchItem from "@/components/SearchItem.vue";

import {
  createMannger,
  updateMannger,
  deleteMannger,
  getManngerList,
  updateManngerStatus,
} from "@/api/manager";

import {
  useInitTable,
  useInitForm,
  useInitForm2,
} from "@/composables/useCommon";

const roles = ref(null);
const titleType = computed(() => (subId.value ? "修改管理员" : "新增管理员"));

const {
  tableData,
  totalCount,
  currentPage,
  loading,
  searchForm,
  resetSearchForm,
  getData,
  pageChange,
} = useInitTable({
  getList: getManngerList,
  TempSearchForm: {
    keyword: "",
  },
  onGetListSuccess: (res) => {
    roles.value = res.roles;
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
    username: "",
    password: "",
    role_id: null,
    status: 1,
    avatar: "",
  },
  getData,
  update: updateMannger,
  create: createMannger,
});

const { handleStatusChange, handleDelete } = useInitForm2({
  getData,
  updateStatus: updateManngerStatus,
  delete: deleteMannger,
});
</script>
<template>
  <el-card shadow="never" style="border-width: 0">
    <div class="flex justify-between items-center mb-5">
      <!-- 新增|刷新 按钮 -->
      <ListHeader @create="handleCreate" @refresh="getData"></ListHeader>

      <!-- 搜索模块 -->
      <SearchFather
        :searchForm="searchForm"
        @search="getData"
        @reset="resetSearchForm"
      >
        <template #default>
          <SearchItem>
            <el-input
              style="width: 160px; margin-right: 10px"
              v-model="searchForm.keyword"
              clearable
              :prefix-icon="Search"
              @keyup.enter="getData"
              size="small"
              placeholder="筛选关键词..."
            />
          </SearchItem>
        </template>
      </SearchFather>
    </div>
    <!-- 表格区域 -->
    <!-- <div style="width: 800px; overflow-x: scroll"> -->
    <!-- <el-card shadow="never" style="border: none; overflow-x: scroll"> -->
    <el-scrollbar>
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        style="min-width: 700px"
        class="flex justify-center"
      >
        <el-table-column width="200" label="管理员">
          <template #default="{ row }">
            <div class="flex items-center">
              <el-avatar :size="40" :src="row.avatar">
                <img
                  src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                />
              </el-avatar>
              <div class="ml-3">
                <p>{{ row.username }}</p>
                <small>ID: {{ row.id }}</small>
              </div>
            </div>
          </template>
        </el-table-column>
        <!-- prop="role.name" 等价于  prop="scope.row.role.name" -->
        <el-table-column align="center" prop="role.name" label="所属角色" />
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

        <el-table-column width="180" align="center" label="操作">
          <template #default="scope">
            <small v-if="scope.row.super == 1" class="text-sm text-gray-500"
              >暂无操作</small
            >
            <template v-else>
              <el-button size="small" @click="handleEdit(scope.row)"
                >编辑</el-button
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
                  <el-button size="small" type="danger">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <!-- </el-card> -->
    <!-- </div> -->
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
    <FormDrawer
      @submit="handleSubmit"
      :title="titleType"
      size="30%"
      ref="formDrawerRef"
      :destoryOnClose="true"
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username" placeholder="张三..." />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" placeholder="张三..." />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <!-- <el-input v-model="ruleForm.avatar" placeholder="张三..." /> -->
          <ChooseImage v-model="ruleForm.avatar"></ChooseImage>
        </el-form-item>
        <el-form-item label="所属角色" prop="role_id">
          <el-select
            v-model="ruleForm.role_id"
            placeholder="选择所属角色"
            style="width: 240px"
          >
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
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
      </el-form>
    </FormDrawer>
  </el-card>
  <!-- <div style="width: 200px; background-color: red">233</div> -->
</template>
<style scoped>
.elStyle .el-form-item {
  margin-bottom: 0;
}
</style>
