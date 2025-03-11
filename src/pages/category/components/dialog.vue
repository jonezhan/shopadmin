<template>
  <el-dialog
    destroy-on-close
    v-model="dialogVisible"
    :title="dialogTitle"
    width="500"
    align-center
  >
    <el-form
      ref="dialogFormRef"
      :model="dialogForm"
      :rules="dialogrules"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="dialogForm.name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogSubmit"> 提交 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from "vue";
import { toast } from "@/composables/util";
import { createCategory, updateCategory } from "@/api/category";

const dialogTitle = ref("新增分类");
const dialogVisible = ref(false);
function openDialog(type = 1) {
  // console.log(type);
  if (type != 1) {
    dialogTitle.value = "修改分类";
    dialogForm.id = type.id;
    dialogForm.name = type.name;
  } else {
    dialogTitle.value = "新增分类";
    dialogForm.id = null;
    dialogForm.name = "";
  }
  dialogVisible.value = true;
}

function dialogSubmit() {
  dialogFormRef.value.validate(async (valid) => {
    if (!valid) return false;
    try {
      if (dialogTitle.value == "新增分类") {
        await createCategory(dialogForm.name);
      } else {
        await updateCategory(dialogForm.id, dialogForm.name);
      }
      throw new Error();
    } catch (error) {
    } finally {
      emit("getData");
      dialogVisible.value = false;
      toast(`${dialogTitle.value}成功`);
    }
  });
}

const dialogFormRef = ref(null);
const dialogForm = reactive({
  name: "",
  id: null,
});

const dialogrules = reactive({
  name: [{ required: true, message: "分类名称不能为空", trigger: "blur" }],
});

defineExpose({
  openDialog,
});

const emit = defineEmits(["getData"]);
</script>

<style scoped></style>
