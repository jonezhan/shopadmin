<script setup>
import { computed, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import ChooseImage from "@/components/ChooseImage.vue";
import FormDrawer from "@/components/FormDrawer.vue";
import ListHeader from "@/components/ListHeader.vue";
import SearchFather from "@/components/SearchFather.vue";
import SearchItem from "@/components/SearchItem.vue";

import {
  getUserList,
  updateUserStatus,
  createUser,
  updateUser,
  deleteUser,
} from "@/api/user";

import {
  useInitTable,
  useInitForm,
  useInitForm2,
} from "@/composables/useCommon";

const levelList = ref(null);
const titleType = computed(() => (subId.value ? "修改会员" : "新增会员"));

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
  getList: getUserList,
  TempSearchForm: {
    keyword: "",
    user_level_id: null,
  },
  onGetListSuccess: (res) => {
    console.log(res);
    levelList.value = res.user_level;
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
    password: null,
    status: 1,
    nickname: "",
    phone: "",
    email: "",
    avatar: "",
    user_level_id: null,
  },
  getData,
  update: updateUser,
  create: createUser,
});

const { handleStatusChange, handleDelete } = useInitForm2({
  getData,
  updateStatus: updateUserStatus,
  delete: deleteUser,
});
</script>
<template>
  <el-card shadow="never" class="border-0">
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
        <template #selectItem>
          <SearchItem>
            <el-select
              v-model="searchForm.user_level_id"
              style="width: 140px; margin-right: 10px"
              size="small"
              placeholder="请选择会员类型"
              clearable
              filterable
            >
              <el-option
                v-for="item in levelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </SearchItem>
        </template>
      </SearchFather>
    </div>
    <!-- 表格区域 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      style="width: 100%"
      class="flex justify-center"
    >
      <el-table-column width="200" label="会员">
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
      <el-table-column align="center" label="会员等级">
        <template #default="{ row }">
          {{ row.user_level?.name || "-" }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="create_time" label="登录注册" />

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
            <el-button
              type="primary"
              text
              size="small"
              @click="handleEdit(scope.row)"
              >修改</el-button
            >
            <el-popconfirm
              title="是否删除该会员?"
              confirm-button-text="确定"
              confirm-button
              :hide-after="0"
              cancel-button-text="取消"
              @confirm="handleDelete(scope.row)"
            >
              <template #reference>
                <el-button size="small" type="primary" text>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
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
          <el-input v-model="ruleForm.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" placeholder="密码" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="ruleForm.nickname" placeholder="昵称" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <!-- <el-input v-model="ruleForm.avatar" placeholder="张三..." /> -->
          <ChooseImage v-model="ruleForm.avatar"></ChooseImage>
        </el-form-item>
        <el-form-item label="会员等级" prop="user_level_id">
          <el-select
            v-model="ruleForm.user_level_id"
            placeholder="选择会员等级"
            style="width: 240px"
          >
            <el-option
              v-for="item in levelList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="ruleForm.phone" placeholder="手机" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" placeholder="邮箱" />
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
</template>
<style scoped>
.elStyle .el-form-item {
  margin-bottom: 0;
}
</style>
