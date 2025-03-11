<script setup>
import { computed, ref, defineAsyncComponent } from "vue";
import ListHeader from "@/components/ListHeader.vue";
// import FormDrawer from "@/components/FormDrawer.vue";
// import IconSelect from "@/components/IconSelect.vue";

const FormDrawer = defineAsyncComponent(() => {
  return import("@/components/FormDrawer.vue");
});
const IconSelect = defineAsyncComponent(() => {
  return import("@/components/IconSelect.vue");
});

import {
  getRuleList,
  createRule,
  updateRule,
  deleteRule,
  updateRuleStatus,
} from "@/api/rule";
import {
  useInitTable,
  useInitForm,
  useInitForm2,
} from "@/composables/useCommon";

const defaulExpandedKeys = ref([]);
const options = ref([]);
const titleType = computed(() =>
  subId.value ? "修改菜单权限" : "新增菜单权限"
);

const { tableData, loading, getData } = useInitTable({
  getList: getRuleList,
  onGetListSuccess: (res) => {
    options.value = res.rules;
    tableData.value = res.list.map((item) => {
      item.statusLoading = false;
      return item;
    });
    defaulExpandedKeys.value = res.list.map((item) => {
      return item.id;
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
    rule_id: 0,
    menu: 1,
    name: "",
    condition: "",
    method: "GET",
    status: 1,
    order: 0,
    icon: "",
    frontpath: "",
  },
  TempRules: {},
  getData,
  update: updateRule,
  create: createRule,
});

const { handleStatusChange, handleDelete } = useInitForm2({
  delete: deleteRule,
  updateStatus: updateRuleStatus,
});

function addChild(id) {
  handleCreate();
  ruleForm.rule_id = id;
}
</script>

<template>
  <el-card shadow="never" class="">
    <ListHeader
      @create="handleCreate"
      @refresh="getData"
      class="justify-between mb-4"
    >
    </ListHeader>
    <el-tree
      v-loading="loading"
      node-key="id"
      :data="tableData"
      :props="{ label: 'name', children: 'child' }"
      :default-expanded-keys="defaulExpandedKeys"
      @node-click=""
    >
      <template #default="{ node, data }">
        <div class="custom-tree-node">
          <el-tag size="small" :type="data.menu ? 'primary' : 'info'">
            {{ data.menu ? "菜单" : "权限" }}
          </el-tag>
          <el-icon v-if="data.icon" :size="16" class="ml-2">
            <component :is="data.icon"></component>
          </el-icon>
          <span>{{ data.name }}</span>
          <div class="ml-auto" @click.stop>
            <el-switch
              @change="handleStatusChange($event, data)"
              :loading="data.statusLoading"
              :modelValue="data.status"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
            <el-button
              @click="handleEdit(data)"
              text
              type="primary"
              size="small"
              >修改</el-button
            >
            <el-button
              @click="addChild(data.id)"
              text
              type="primary"
              size="small"
              >增加</el-button
            >
            <el-popconfirm
              title="是否删除该菜单/权限?"
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
        <el-form-item label="上级菜单" prop="rule_id">
          <el-cascader
            v-model="ruleForm.rule_id"
            placeholder="请选择上级菜单"
            :options="options"
            :props="{
              label: 'name',
              value: 'id',
              children: 'child',
              checkStrictly: true,
              emitPath: false,
            }"
          />
        </el-form-item>
        <el-form-item label="菜单/规则" prop="menu">
          <el-radio-group v-model="ruleForm.menu" class="ml-4">
            <el-radio :value="1" border>菜单</el-radio>
            <el-radio :value="0" border>规则</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="名称" />
        </el-form-item>
        <el-form-item v-if="ruleForm.menu == 1" label="菜单图标" prop="icon">
          <!-- <el-input v-model="ruleForm.icon" placeholder="菜单图标" /> -->
          <IconSelect v-model="ruleForm.icon"></IconSelect>
        </el-form-item>
        <el-form-item
          v-if="ruleForm.menu == 1 && ruleForm.rule_id > 0"
          label="前端路由"
          prop="frontpath"
        >
          <el-input v-model="ruleForm.frontpath" placeholder="前端路由" />
        </el-form-item>
        <el-form-item
          v-if="ruleForm.menu == 0"
          label="后端规则"
          prop="condition"
        >
          <el-input v-model="ruleForm.condition" placeholder="后端规则" />
        </el-form-item>
        <el-form-item v-if="ruleForm.menu == 0" label="请求方式" prop="method">
          <el-select
            v-model="ruleForm.method"
            placeholder="选择请求方式"
            style="width: 240px"
          >
            <el-option
              :key="index"
              :label="item"
              :value="item"
              v-for="(item, index) in ['GET', 'POST', 'PUT', 'DELETE']"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="ruleForm.order" :min="0" :max="1000" />
        </el-form-item>
      </el-form>
    </FormDrawer>
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
