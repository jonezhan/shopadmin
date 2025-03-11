<script setup>
import { onMounted, reactive, ref } from "vue";
import { getSkusList } from "@/api/skus";
import { useInitTable, useInitForm } from "@/composables/useCommon";

const windowHeight = window.innerHeight || document.body.clientHeight;
const h = windowHeight - 64 - 44 - 40 - 40;

const dialogVisible = ref(false);
const { loading, currentPage, totalCount, tableData, getData, pageChange } =
  useInitTable({
    getList: getSkusList,
    onGetListSuccess: (res) => {
      tableData.value = res.list;
      totalCount.value = res.totalCount;
      if (tableData.value.length > 0) {
        // activeId.value = tableData.value[0].id;
        // skuItemList.value = tableData.value[0].default.split(",");
        handleChange(tableData.value[0]);
      }
    },
  });

const callFunc = ref(null);
function open(callFunctmp) {
  callFunc.value = callFunctmp;
  getData();
  dialogVisible.value = true;
}
function close() {
  dialogVisible.value = false;
}
const imgSrc = defineModel();
// Array.isArray(imgSrc.value);
const imgType = Array.isArray(imgSrc.value) ? 0 : 1;
// console.log(imgType);

async function onSubmit() {
  //   if (imgSrc.value) {
  //   }
  callFunc.value(form);
  //   console.log(ImageMainRef.value.checkValue);
  close();
}

function removeImage(url) {
  imgSrc.value = imgSrc.value.filter((item) => item != url);
}

defineExpose({
  open,
});

const props = defineProps({
  preview: {
    type: Boolean,
    default: true,
  },
});

const activeId = ref(0);

// const kk = async () => {
//   // if (tableData) {
//   let a = await tableData.value;
//   console.log(a);
//   //   activeId.value = tableData[0]?.id;
//   // }
// };
// kk();
// console.log(tableData.value);

const skuItemList = ref([]);
function handleChange(item) {
  form.list = [];

  activeId.value = item.id;
  skuItemList.value = item.default.split(",");
  form.name = item.name;

  //   console.log(skuItemList.value);
}

const checkboxGroup1 = ref([]);
const form = reactive({
  name: "",
  list: [],
});
</script>
<template>
  <div class="flex items-center">
    <el-dialog
      title="选择规格"
      v-model="dialogVisible"
      width="70%"
      align-center
      @close=""
    >
      <el-container :style="{ height: h + 'px' }" class="bg-white rounded">
        <el-container>
          <el-aside
            v-loading="loading"
            class="image-aside"
            :style="{ width: '140px' }"
          >
            <div class="top">
              <!-- {{ tableData }} -->
              {{ form }}
              <div
                class="sku-list"
                v-for="(item, index) in tableData"
                :key="index"
                :class="{ activeItem: activeId == item.id }"
                @click="handleChange(item)"
              >
                <span>{{ item.name }}</span>
              </div>
            </div>
            <div class="bottom">
              <el-pagination
                small
                background
                layout="prev, next"
                :total="totalCount"
                :current-page="currentPage"
                :page-size="10"
                @current-change="(e) => pageChange(e)"
              />
            </div>
          </el-aside>
          <el-main v-loading="loading" class="image-main">
            <div class="mt-4">
              <el-checkbox-group v-model="form.list" size="small">
                <el-checkbox
                  v-for="(item, index) in skuItemList"
                  :key="index"
                  :label="item"
                  :value="item"
                  border
                />
                <!-- <el-checkbox label="Option2" value="Value2" border /> -->
              </el-checkbox-group>
            </div>
          </el-main>
        </el-container>
      </el-container>
      <span class="diaFooter" slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style scoped>
.chooseImage {
  display: flex;
  justify-content: center;
  align-items: center;
  @apply cursor-pointer hover:bg-gray-100 w-100px h-100px border rounded mr-2;
}
.iconColor {
  @apply text-gray-500;
}
.diaFooter {
  @apply flex justify-end;
}
/* .image-header {
  border-bottom: 1px solid #ebeef5;
  @apply flex items-center;
} */
.image-aside,
.image-main {
  border-right: 1px solid #ebeef5;
  position: relative;
  & .top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
    overflow-y: auto;
    & .sku-list {
      @apply p-3 text-sm text-gray-600 flex items-center cursor-pointer;
      border-bottom: 1px solid #f4f4f4;
      &:hover {
        @apply bg-blue-50;
      }
    }
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
.activeItem {
  @apply bg-blue-50;
}
.image-main {
  border-right: none;
}
:deep(.el-overlay-dialog) {
  /* overflow: hidden; */
}
</style>
