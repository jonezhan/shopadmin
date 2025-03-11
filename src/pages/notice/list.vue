<script setup>
import { computed } from "vue";
import FormDrawer from "@/components/FormDrawer.vue";
import ListHeader from "@/components/ListHeader.vue";

import {
  deleteNotice,
  updateNotice,
  getNoticeList,
  createNotice,
} from "@/api/notice";

import {
  useInitTable,
  useInitForm,
  useInitForm2,
} from "@/composables/useCommon";

const titleType = computed(() => (subId.value ? "修改公告" : "新增公告"));
const { tableData, totalCount, currentPage, loading, getData, pageChange } =
  useInitTable({
    getList: getNoticeList,
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
    title: "",
    content: "",
  },
  TempRules: {
    title: [{ required: true, message: "请填写标题", trigger: "blur" }],
    content: [{ required: true, message: "请填写内容", trigger: "blur" }],
  },
  getData,
  update: updateNotice,
  create: createNotice,
});

const { handleDelete } = useInitForm2({
  getData,
  delete: deleteNotice,
});

// const handleDelete = (index, row) => {
//   // console.log(index, row);
//   deleteNotice(row.id)
//     .then((res) => getData())
//     .finally(() => {
//       toast("删除成功");
//     });
// };

// const formDrawerRef = ref(null);

// const handleEdit = (index, row) => {
//   // console.log(index, row);
//   // titleType.value = "修改公告";
//   subId.value = row.id;
//   ruleForm.title = row.title;
//   ruleForm.content = row.content;
//   formDrawerRef.value.openDrawer();
// };

// const handleCreate = () => {
//   // titleType.value = "新增公告";
//   subId.value = 0;
//   ruleForm.title = "";
//   ruleForm.content = "";
//   formDrawerRef.value.openDrawer();
// };
// const subId = ref(0);
// const ruleFormRef = ref(null);
// const ruleForm = reactive({
//   title: "",
//   content: "",
// });
// const rules = reactive({
//   title: [{ required: true, message: "请填写标题", trigger: "blur" }],
//   content: [{ required: true, message: "请填写内容", trigger: "blur" }],
// });

// function handleSubmit() {
//   ruleFormRef.value.validate((valid) => {
//     if (!valid) return;
//     formDrawerRef.value.loading = true;
//     let temp = subId.value
//       ? updateNotice(subId.value, ruleForm)
//       : createNotice(ruleForm);
//     temp
//       .then((res) => {
//         // console.log(res);
//         getData();
//       })
//       .catch(() => {})
//       .finally(() => {
//         formDrawerRef.value.loading = false;
//         formDrawerRef.value.closeDrawer();
//         subId.value ? toast("修改成功") : toast("新增成功");
//       });
//   });
// }
</script>
<template>
  <el-card shadow="never" class="border-0">
    <!-- 新增|刷新 按钮 -->
    <ListHeader
      class="justify-between mb-4"
      @create="handleCreate"
      @refresh="getData"
    ></ListHeader>

    <!-- 表格区域 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      style="width: 100%"
      class="flex justify-center"
    >
      <el-table-column prop="title" label="公告标题" />
      <el-table-column
        width="480"
        align="center"
        prop="create_time"
        label="发布时间"
      />

      <el-table-column width="180" align="center" label="操作">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-popconfirm
            title="是否删除该公告?"
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
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="ruleForm.title" placeholder="公告标题" />
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input
            v-model="ruleForm.content"
            placeholder="填写公告内容..."
            type="textarea"
            :rows="5"
          />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>
