<script setup>
import AsideList from "~/components/AsideList.vue";
import {
  createImageClass,
  updateImageClass,
  getImageClassList,
  deleteImageClass,
} from "@/api/image_class";
import { computed, reactive, ref, watch } from "vue";
import FormDrawer from "./FormDrawer.vue";
import { toast } from "@/composables/util";

// 加载动画
const loading = ref(false);
const list = ref([]);
const totalCount = ref(0);
const currentPage = ref(1);
const limit = ref(10);

const activeId = ref(0);
const emit = defineEmits(["changeActiveId"]);
function handleChangeActiveId(id) {
  if (id === activeId.value) return;
  activeId.value = id;
  emit("changeActiveId", id);
}
// console.log(activeId.value, currentPage.value);

function getData() {
  loading.value = true;
  getImageClassList(currentPage.value)
    .then((res) => {
      // console.log(res);
      list.value = res.list;
      totalCount.value = res.totalCount;
      let keyActive = list.value[0];
      keyActive && handleChangeActiveId(keyActive.id);
    })
    .finally(() => {
      loading.value = false;
    });
}
getData();
function pageChange(e) {
  // console.log(e);
  currentPage.value = e;
  getData();
}

const formDrawerRef = ref(null);

const editId = ref(0);
const drawerTitle = computed(() => {
  return editId.value ? "修改" : "新增";
});
const formRef = ref(null);
const form = reactive({
  name: "",
  order: 50,
});

const rules = reactive({
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
});
function handleCreate() {
  editId.value = 0;
  form.name = "";
  form.order = 0;
  formDrawerRef.value.openDrawer();
}
function handleEdit(e) {
  editId.value = e.id;
  form.name = e.name;
  form.order = e.order;
  formDrawerRef.value.openDrawer();
}
function handleDelete(id) {
  loading.value = true;
  // console.log(id);
  deleteImageClass(id)
    .then((res) => {
      // console.log(res);
      pageChange(currentPage.value);
      toast("删除成功");
    })
    .catch((err) => {
      // console.log(err);
    })
    .finally(() => {
      loading.value = false;
    });
}
const handleSubmit = () => {
  // formDrawerRef.value.open();
  formRef.value.validate((valid) => {
    if (!valid) return false;
    formDrawerRef.value.loading = true;
    const fun = editId.value
      ? updateImageClass(editId.value, form)
      : createImageClass(form);
    fun
      .then((res) => {
        editId.value ? pageChange(currentPage.value) : pageChange(1);
        formDrawerRef.value.closeDrawer();
        toast(`${drawerTitle.value}成功`);
        throw new Error("error submit!");
      })
      .catch((err) => {
        // console.log(err);
      })
      .finally(() => {
        formDrawerRef.value.loading = false;
      });
  });
};
// watch(activeId, (newVal, oldVal) => {
//   console.log("activeId", newVal, oldVal);
// });
defineExpose({
  handleChangeActiveId,
  handleCreate,
});
defineProps({
  iconShow: {
    type: Boolean,
    default: true,
  },
});
</script>
<template>
  <el-aside
    v-loading="loading"
    class="image-aside"
    :style="{ width: iconShow ? '220px' : '140px' }"
  >
    <div class="top">
      <AsideList
        :iconShow="iconShow"
        @edit="handleEdit(item)"
        @delete="handleDelete(item.id)"
        @click="handleChangeActiveId(item.id)"
        :active="activeId == item.id"
        v-for="(item, index) in list"
        :key="index"
        >{{ item.name }}</AsideList
      >
    </div>
    <div class="bottom">
      <el-pagination
        small
        background
        layout="prev, next"
        :total="totalCount"
        :current-page="currentPage"
        :page-size="limit"
        @current-change="(e) => pageChange(e)"
      />
    </div>
  </el-aside>
  <FormDrawer
    @submit="handleSubmit"
    :title="drawerTitle"
    size="30%"
    ref="formDrawerRef"
    destoryOnClose="true"
  >
    <el-form
      ref="formRef"
      style="max-width: 600px"
      :model="form"
      status-icon
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" type="text" autocomplete="off" />
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input-number v-model="form.order" :min="0" :max="100" />
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<style scoped>
.image-aside {
  border-right: 1px solid #ebeef5;
  position: relative;
  & .top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
    overflow-y: auto;
  }
  & .bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    @apply flex items-center justify-center;
  }
}
.aside-list {
  border-bottom: 1px solid #f4f4f4;
  cursor: pointer;
  @apply flex items-center p-3 text-sm text-gray-600;
  &:hover {
    @apply bg-blue-50;
  }
}
.kk button {
  margin-left: 0px;
  padding: 4px;
  /* margin-right: 5px; */
}
</style>
