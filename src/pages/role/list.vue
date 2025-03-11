<script setup>
import { computed, ref } from "vue";
import FormDrawer from "@/components/FormDrawer.vue";
import ListHeader from "@/components/ListHeader.vue";
import { getRuleList } from "@/api/rule";

import {
  getRoleList,
  createRole,
  updateRole,
  deleteRole,
  updateRoleStatus,
  setRoleRules,
} from "@/api/role";

import {
  useInitTable,
  useInitForm,
  useInitForm2,
} from "@/composables/useCommon";
import { toast } from "@/composables/util";

const roles = ref(null);
const titleType = computed(() => (subId.value ? "修改角色" : "新增角色"));

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
  getList: getRoleList,
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
    desc: "",
  },
  TempRules: {
    name: [{ required: true, message: "请填写姓名", trigger: "blur" }],
  },
  getData,
  update: updateRole,
  create: createRole,
});

const { handleStatusChange, handleDelete } = useInitForm2({
  getData,
  updateStatus: updateRoleStatus,
  delete: deleteRole,
});

const ruleList = ref([]);
const setRoleformDrawerRef = ref(null);
const treeHight = ref(0);
const treeRef = ref(null);
const FirstRuleList = ref([]);

getRuleList(1).then((res) => {
  ruleList.value = res.list;
  FirstRuleList.value = res.list.map((item) => item.id);
});

const checkStrictly = ref(true); // 树形父子是否关联
async function handleSetRole(row) {
  let CheckedKeys = [];
  let ExpandedKeys = [];
  checkStrictly.value = true;
  subId.value = row.id;
  treeHight.value = window.innerHeight - 170;

  tableData.value.forEach((item) => {
    if (item.id == row.id) {
      CheckedKeys = item.rules.map((e) => e.id);
      item.rules.forEach((e) => {
        if (FirstRuleList.value.includes(e.id)) {
          ExpandedKeys.push(e.id);
        }
      });
    }
  });
  // console.log(CheckedKeys, ExpandedKeys);

  await setRoleformDrawerRef.value.openDrawer();

  // console.log(CheckedKeys.value);
  await treeRef.value.setExpandedKeys(ExpandedKeys);
  await treeRef.value.setCheckedKeys(CheckedKeys);

  checkStrictly.value = false;
}
function handleSetRoleSubmit() {
  // console.log(
  //   treeRef.value.getCheckedKeys(),
  //   treeRef.value.getHalfCheckedKeys()
  // );
  // const rule_ids = treeRef.value.getCheckedKeys();
  const rule_ids = [
    ...treeRef.value.getHalfCheckedKeys(),
    ...treeRef.value.getCheckedKeys(),
  ];
  // console.log(rule_ids);

  setRoleformDrawerRef.value.loading = true;
  setRoleRules({ id: subId.value, rule_ids })
    .then((res) => {
      toast("配置成功");
      getData();
    })
    .catch(() => toast("配置失败", error))
    .finally(() => {
      setRoleformDrawerRef.value.loading = false;
      setRoleformDrawerRef.value.closeDrawer();
    });
}
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
      <el-table-column prop="name" width="200" label="角色名称" />

      <el-table-column prop="desc" align="center" label="角色描述" />
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
            @click="handleSetRole(scope.row)"
            >配置权限</el-button
          >
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
    <FormDrawer
      @submit="handleSetRoleSubmit()"
      title="权限配置"
      size="30%"
      ref="setRoleformDrawerRef"
      destoryOnClose="true"
    >
      <el-tree-v2
        :check-strictly="checkStrictly"
        ref="treeRef"
        node-key="id"
        style="max-width: 600px"
        :data="ruleList"
        :props="{ label: 'name', children: 'child' }"
        show-checkbox
        :height="treeHight"
      >
        <template #default="{ node, data }">
          <div class="custom-tree-node">
            <el-tag size="small" :type="data.menu ? 'primary' : 'info'">
              {{ data.menu ? "菜单" : "权限" }}
            </el-tag>
            <span>{{ data.name }}</span>
          </div>
        </template>
      </el-tree-v2>
    </FormDrawer>
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
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="张三..." />
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input
            v-model="ruleForm.desc"
            placeholder="填写角色描述..."
            type="textarea"
            :rows="5"
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
